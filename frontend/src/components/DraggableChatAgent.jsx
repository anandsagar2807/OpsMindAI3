import { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, Minus, GripVertical, Maximize2, Minimize2, Lock, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useAuthContext';

/**
 * Relevance AI chat URL — embedded as a transparent, draggable widget
 * in the corner of the dashboard.
 */
const RELEVANCE_CHAT_URL =
    'https://app.relevanceai.com/agents/f1db6c/0b7a4882-502d-43b3-a4c7-a188ae52e4ca/9671bbca-9c52-422d-8dd5-e2a7618eff4a/embed-chat?hide_tool_steps=false&hide_file_uploads=false&hide_conversation_list=false&bubble_style=agent&primary_color=%23685FFF&bubble_icon=pd%2Fchat&input_placeholder_text=Type+your+message...&hide_logo=false&hide_description=false';

const STORAGE_KEY = 'relevance_chat_widget_state';

const WIDGET_WIDTH = 420;
const WIDGET_HEIGHT = 640;
const COLLAPSED_SIZE = 56;
const HEADER_HEIGHT = 36;
const EDGE_MARGIN = 16;

const getInitialState = () => {
    if (typeof window === 'undefined') {
        return { x: 0, y: 0, isOpen: true, isMaximized: false };
    }
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            const visibleW = parsed.isOpen ? WIDGET_WIDTH : COLLAPSED_SIZE;
            const visibleH = parsed.isOpen ? WIDGET_HEIGHT : COLLAPSED_SIZE;
            const maxX = Math.max(EDGE_MARGIN, window.innerWidth - visibleW - EDGE_MARGIN);
            const maxY = Math.max(EDGE_MARGIN, window.innerHeight - visibleH - EDGE_MARGIN);
            return {
                x: Math.max(EDGE_MARGIN, Math.min(parsed.x ?? maxX, maxX)),
                y: Math.max(EDGE_MARGIN, Math.min(parsed.y ?? maxY, maxY)),
                isOpen: parsed.isOpen ?? true,
                isMaximized: parsed.isMaximized ?? false,
            };
        }
    } catch (e) {
        // ignore
    }
    return {
        x: window.innerWidth - WIDGET_WIDTH - EDGE_MARGIN,
        y: window.innerHeight - WIDGET_HEIGHT - EDGE_MARGIN,
        isOpen: true,
        isMaximized: false,
    };
};

/**
 * Draggable, transparent, resizable Relevance AI chat agent widget.
 * - Renders as a floating window in the corner of the dashboard.
 * - Can be dragged anywhere on the screen (constrained to the viewport).
 * - Can be minimized to a small floating bubble.
 * - Can be maximized to fill most of the viewport.
 * - Position and state persist across page reloads via localStorage.
 */
export default function DraggableChatAgent({ locked = false }) {
    const navigate = useNavigate();
    const { isSignedIn } = useUser();
    // If locked is explicitly passed, use it; otherwise derive from auth state
    const isLocked = locked || !isSignedIn;

    const [state, setState] = useState(getInitialState);
    const [isDragging, setIsDragging] = useState(false);
    const widgetRef = useRef(null);
    const dragOriginRef = useRef({ mouseX: 0, mouseY: 0, widgetX: 0, widgetY: 0 });

    // Persist state on every change
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            // localStorage may be disabled — silently ignore
        }
    }, [state]);

    // Keep the widget on-screen if the viewport is resized
    useEffect(() => {
        const handleResize = () => {
            setState((prev) => {
                const visibleW = prev.isOpen ? WIDGET_WIDTH : COLLAPSED_SIZE;
                const visibleH = prev.isOpen ? WIDGET_HEIGHT : COLLAPSED_SIZE;
                const maxX = Math.max(EDGE_MARGIN, window.innerWidth - visibleW - EDGE_MARGIN);
                const maxY = Math.max(EDGE_MARGIN, window.innerHeight - visibleH - EDGE_MARGIN);
                return {
                    ...prev,
                    x: Math.max(EDGE_MARGIN, Math.min(prev.x, maxX)),
                    y: Math.max(EDGE_MARGIN, Math.min(prev.y, maxY)),
                };
            });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleDragStart = useCallback(
        (e) => {
            // Only allow drag from the header area; ignore clicks on buttons/links
            if (e.target.closest('[data-no-drag]')) return;
            e.preventDefault();
            setIsDragging(true);
            dragOriginRef.current = {
                mouseX: e.clientX,
                mouseY: e.clientY,
                widgetX: state.x,
                widgetY: state.y,
            };
        },
        [state.x, state.y]
    );

    useEffect(() => {
        if (!isDragging) return;
        const handleMouseMove = (e) => {
            const dx = e.clientX - dragOriginRef.current.mouseX;
            const dy = e.clientY - dragOriginRef.current.mouseY;
            const visibleW = state.isOpen ? WIDGET_WIDTH : COLLAPSED_SIZE;
            const visibleH = state.isOpen ? WIDGET_HEIGHT : COLLAPSED_SIZE;
            const maxX = Math.max(EDGE_MARGIN, window.innerWidth - visibleW - EDGE_MARGIN);
            const maxY = Math.max(EDGE_MARGIN, window.innerHeight - visibleH - EDGE_MARGIN);
            setState((prev) => ({
                ...prev,
                x: Math.max(EDGE_MARGIN, Math.min(dragOriginRef.current.widgetX + dx, maxX)),
                y: Math.max(EDGE_MARGIN, Math.min(dragOriginRef.current.widgetY + dy, maxY)),
            }));
        };
        const handleMouseUp = () => setIsDragging(false);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, state.isOpen]);

    const toggleMinimize = () => setState((prev) => ({ ...prev, isOpen: !prev.isOpen }));
    const toggleMaximize = () =>
        setState((prev) => ({
            ...prev,
            isMaximized: !prev.isMaximized,
            x: !prev.isMaximized ? EDGE_MARGIN : prev.x,
            y: !prev.isMaximized ? EDGE_MARGIN : prev.y,
        }));

    // ─── Minimized state: floating circular launcher ───
    if (!state.isOpen) {
        return (
            <button
                onClick={toggleMinimize}
                onMouseDown={handleDragStart}
                className="fixed z-50 rounded-full bg-gradient-to-br from-violet-500 via-indigo-500 to-purple-600 text-white shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center group"
                style={{
                    left: `${state.x}px`,
                    top: `${state.y}px`,
                    width: `${COLLAPSED_SIZE}px`,
                    height: `${COLLAPSED_SIZE}px`,
                    cursor: isDragging ? 'grabbing' : 'grab',
                }}
                title="Open AI Chat Agent"
                aria-label="Open AI Chat Agent"
            >
                <Sparkles className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#06080d] animate-pulse" />
            </button>
        );
    }

    // ─── Open state: full draggable widget ───
    const width = state.isMaximized ? 'calc(100vw - 32px)' : `${WIDGET_WIDTH}px`;
    const height = state.isMaximized ? 'calc(100vh - 32px)' : `${WIDGET_HEIGHT}px`;

    return (
        <div
            ref={widgetRef}
            onMouseDown={handleDragStart}
            className={`fixed z-50 rounded-2xl overflow-hidden border border-white/15 shadow-2xl shadow-black/40 transition-shadow duration-200 ${isDragging ? 'cursor-grabbing shadow-violet-500/20' : 'cursor-grab'
                }`}
            style={{
                left: `${state.x}px`,
                top: `${state.y}px`,
                width,
                height,
                // White transparent shade (frosted-glass effect) — semi-transparent so the page beneath is subtly visible
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(16px) saturate(180%)',
                WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                userSelect: isDragging ? 'none' : 'auto',
            }}
        >
            {/* Header (drag handle) */}
            <div
                className="flex items-center justify-between px-3 select-none"
                style={{
                    height: `${HEADER_HEIGHT}px`,
                    background:
                        'linear-gradient(90deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.18) 100%)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(255,255,255,0.15)',
                    cursor: isDragging ? 'grabbing' : 'grab',
                }}
            >
                <div className="flex items-center gap-2 text-white">
                    <GripVertical className="w-3.5 h-3.5 opacity-70" />
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="text-xs font-semibold tracking-wide">OpsMind AI Chat Agent</span>
                    <span className="ml-1 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="flex items-center gap-0.5" data-no-drag>
                    <button
                        onClick={toggleMaximize}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="w-6 h-6 rounded hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                        title={state.isMaximized ? 'Restore' : 'Maximize'}
                        aria-label={state.isMaximized ? 'Restore' : 'Maximize'}
                    >
                        {state.isMaximized ? (
                            <Minimize2 className="w-3.5 h-3.5" />
                        ) : (
                            <Maximize2 className="w-3.5 h-3.5" />
                        )}
                    </button>
                    <button
                        onClick={toggleMinimize}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="w-6 h-6 rounded hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                        title="Minimize"
                        aria-label="Minimize"
                    >
                        <Minus className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* White transparent shade backing the iframe so the chat is clearly readable on any page */}
            <div
                aria-hidden="true"
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: `${HEADER_HEIGHT}px`,
                    bottom: 0,
                    background: 'rgba(255, 255, 255, 0.04)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    pointerEvents: 'none',
                    zIndex: 0,
                }}
            />

            {/*
              When the widget is locked (user is not signed in), show a sign-up CTA overlay
              instead of the iframe. The widget remains draggable / minimizable in this state.
            */}
            {isLocked ? (
                <div
                    data-no-drag
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center px-8 text-center"
                    style={{
                        top: `${HEADER_HEIGHT}px`,
                        background:
                            'linear-gradient(180deg, rgba(15, 23, 42, 0.55) 0%, rgba(15, 23, 42, 0.85) 100%)',
                        backdropFilter: 'blur(14px) saturate(160%)',
                        WebkitBackdropFilter: 'blur(14px) saturate(160%)',
                    }}
                >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-violet-500/30 mb-5">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
                        Chat is locked
                    </h3>
                    <p className="text-sm text-white/70 leading-relaxed mb-6 max-w-[280px]">
                        Sign up for a free OpsMind AI account to unlock the chat agent and start
                        getting instant, citation-backed answers from your documents.
                    </p>
                    <div className="flex flex-col gap-2.5 w-full max-w-[260px]">
                        <button
                            onClick={() => navigate('/sign-up')}
                            className="group flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-500 hover:via-violet-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <UserPlus className="w-4 h-4" />
                            <span>Sign up — it's free</span>
                            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </button>
                        <button
                            onClick={() => navigate('/sign-in')}
                            className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.10] hover:border-white/[0.20] text-white/90 hover:text-white font-medium text-sm transition-all duration-200"
                        >
                            <LogIn className="w-4 h-4" />
                            <span>Already have an account? Sign in</span>
                        </button>
                    </div>
                    <p className="mt-5 text-[11px] text-white/40 uppercase tracking-[0.15em] font-semibold">
                        14-day free trial · No credit card
                    </p>
                </div>
            ) : (
                /*
                 * Relevance AI chat iframe. We apply `filter: invert(1) hue-rotate(180deg)` to force
                 * the chat UI into a dark theme — this flips black text to white (so it's readable
                 * on the dashboard) while `hue-rotate` keeps the brand colors recognizable. The
                 * `color-scheme: dark` hint also nudges the embedded page to use dark colors.
                 */
                <iframe
                    src={RELEVANCE_CHAT_URL}
                    title="OpsMind AI Chat Agent"
                    allow="microphone; camera"
                    allowTransparency={true}
                    frameBorder={0}
                    scrolling="no"
                    style={{
                        position: 'relative',
                        zIndex: 1,
                        width: '100%',
                        height: `calc(100% - ${HEADER_HEIGHT}px)`,
                        border: 'none',
                        background: 'rgba(10, 15, 30, 0.55)',
                        colorScheme: 'dark',
                        filter: 'invert(1) hue-rotate(180deg)',
                        WebkitFilter: 'invert(1) hue-rotate(180deg)',
                        pointerEvents: isDragging ? 'none' : 'auto',
                        display: 'block',
                    }}
                />
            )}
        </div>
    );
}
