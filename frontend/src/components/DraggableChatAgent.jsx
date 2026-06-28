import { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, Minus, GripVertical, Maximize2, Minimize2, Lock, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useAuthContext';
import ChatPanel from './ChatPanel';

/**
 * Relevance AI chat URL — embedded as a transparent, draggable widget
 * in the corner of the dashboard.
 */
const RELEVANCE_CHAT_URL =
    'https://app.relevanceai.com/agents/f1db6c/0b7a4882-502d-43b3-a4c7-a188ae52e4ca/9671bbca-9c52-422d-8dd5-e2a7618eff4a/embed-chat?hide_tool_steps=false&hide_file_uploads=false&hide_conversation_list=false&bubble_style=agent&primary_color=%23685FFF&bubble_icon=pd%2Fchat&input_placeholder_text=Type+your+message...&hide_logo=false&hide_description=false';

const STORAGE_KEY = 'relevance_chat_widget_state';

// ─── Size constants ────────────────────────────────────────────────
const DEFAULT_WIDGET_WIDTH = 420;
const DEFAULT_WIDGET_HEIGHT = 640;
const MIN_WIDGET_WIDTH = 320;
const MAX_WIDGET_WIDTH = 800;
const MIN_WIDGET_HEIGHT = 400;
// maxHeight computed dynamically as 90 % of viewport height
const COLLAPSED_SIZE = 56;
const HEADER_HEIGHT = 36;
const EDGE_MARGIN = 16;
const RESIZE_HANDLE = 6; // thickness (px) of the invisible resize grab‑zone

/**
 * Read persisted state from localStorage, clamping values to the viewport.
 */
const getInitialState = () => {
    if (typeof window === 'undefined') {
        return {
            x: 0, y: 0,
            isOpen: true,
            isMaximized: false,
            customW: DEFAULT_WIDGET_WIDTH,
            customH: DEFAULT_WIDGET_HEIGHT,
        };
    }
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            // Clamp dimensions so they never exceed the viewport
            const maxH = Math.floor(window.innerHeight * 0.9);
            const cw = Math.max(MIN_WIDGET_WIDTH, Math.min(parsed.customW ?? DEFAULT_WIDGET_WIDTH, MAX_WIDGET_WIDTH));
            const ch = Math.max(MIN_WIDGET_HEIGHT, Math.min(parsed.customH ?? DEFAULT_WIDGET_HEIGHT, maxH));
            const visibleW = parsed.isOpen ? cw : COLLAPSED_SIZE;
            const visibleH = parsed.isOpen ? ch : COLLAPSED_SIZE;
            const maxX = Math.max(EDGE_MARGIN, window.innerWidth - visibleW - EDGE_MARGIN);
            const maxY = Math.max(EDGE_MARGIN, window.innerHeight - visibleH - EDGE_MARGIN);
            return {
                x: Math.max(EDGE_MARGIN, Math.min(parsed.x ?? maxX, maxX)),
                y: Math.max(EDGE_MARGIN, Math.min(parsed.y ?? maxY, maxY)),
                isOpen: parsed.isOpen ?? true,
                isMaximized: parsed.isMaximized ?? false,
                customW: cw,
                customH: ch,
            };
        }
    } catch (_) { /* ignore */ }
    return {
        x: window.innerWidth - DEFAULT_WIDGET_WIDTH - EDGE_MARGIN,
        y: window.innerHeight - DEFAULT_WIDGET_HEIGHT - EDGE_MARGIN,
        isOpen: true,
        isMaximized: false,
        customW: DEFAULT_WIDGET_WIDTH,
        customH: DEFAULT_WIDGET_HEIGHT,
    };
};

/**
 * Resize direction → CSS cursor mapping (8 cardinal + corner points).
 */
const CURSOR_MAP = {
    n: 'ns-resize',
    s: 'ns-resize',
    e: 'ew-resize',
    w: 'ew-resize',
    ne: 'nesw-resize',
    sw: 'nesw-resize',
    nw: 'nwse-resize',
    se: 'nwse-resize',
};

/**
 * Draggable, transparent, **resizable** Relevance AI chat agent widget.
 *
 * - Resize from any edge or corner (8 handles).
 * - Drag anywhere on screen (constrained to viewport).
 * - Minimise / maximise toggles.
 * - Position, open state, maximise flag and **custom dimensions** persist
 *   across page reloads via localStorage.
 * - Pointer‑events on the embedded iframe are disabled during drag /
 *   resize so that focus is never lost.
 */
export default function DraggableChatAgent({ locked = false }) {
    const navigate = useNavigate();
    const { isSignedIn } = useUser();
    const isLocked = locked || !isSignedIn;

    const [state, setState] = useState(getInitialState);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeDir, setResizeDir] = useState(null);   // e.g. 'se', 'e', 'n'

    const widgetRef = useRef(null);
    const dragOriginRef = useRef({ mouseX: 0, mouseY: 0, widgetX: 0, widgetY: 0 });
    const resizeOriginRef = useRef({
        mouseX: 0, mouseY: 0,
        widgetX: 0, widgetY: 0,
        width: 0, height: 0,
    });

    // ── Persist entire state on every change ─────────────────────────
    useEffect(() => {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) { }
    }, [state]);

    // ── Keep on‑screen when viewport resizes ─────────────────────────
    useEffect(() => {
        const handleResize = () => {
            setState((prev) => {
                const maxH = Math.floor(window.innerHeight * 0.9);
                const cw = Math.max(MIN_WIDGET_WIDTH, Math.min(prev.customW, MAX_WIDGET_WIDTH));
                const ch = Math.max(MIN_WIDGET_HEIGHT, Math.min(prev.customH, maxH));
                const visibleW = prev.isOpen ? cw : COLLAPSED_SIZE;
                const visibleH = prev.isOpen ? ch : COLLAPSED_SIZE;
                const maxX = Math.max(EDGE_MARGIN, window.innerWidth - visibleW - EDGE_MARGIN);
                const maxY = Math.max(EDGE_MARGIN, window.innerHeight - visibleH - EDGE_MARGIN);
                return {
                    ...prev,
                    x: Math.max(EDGE_MARGIN, Math.min(prev.x, maxX)),
                    y: Math.max(EDGE_MARGIN, Math.min(prev.y, maxY)),
                    customW: cw,
                    customH: ch,
                };
            });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    /* ------------------------------------------------------------------ */
    /*  Drag logic                                                         */
    /* ------------------------------------------------------------------ */
    const handleDragStart = useCallback(
        (e) => {
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
            const visibleW = state.isOpen ? state.customW : COLLAPSED_SIZE;
            const visibleH = state.isOpen ? state.customH : COLLAPSED_SIZE;
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
    }, [isDragging, state.isOpen, state.customW, state.customH]);

    /* ------------------------------------------------------------------ */
    /*  Resize logic                                                       */
    /* ------------------------------------------------------------------ */
    const handleResizeStart = useCallback(
        (e, direction) => {
            e.preventDefault();
            e.stopPropagation();
            setIsResizing(true);
            setResizeDir(direction);
            resizeOriginRef.current = {
                mouseX: e.clientX,
                mouseY: e.clientY,
                widgetX: state.x,
                widgetY: state.y,
                width: state.customW,
                height: state.customH,
            };
        },
        [state.x, state.y, state.customW, state.customH]
    );

    useEffect(() => {
        if (!isResizing) return;

        const handleMouseMove = (e) => {
            const o = resizeOriginRef.current;
            const dx = e.clientX - o.mouseX;
            const dy = e.clientY - o.mouseY;
            const maxH = Math.floor(window.innerHeight * 0.9);

            setState((prev) => {
                let newW = o.width;
                let newH = o.height;
                let newX = o.widgetX;
                let newY = o.widgetY;

                // Horizontal adjustments
                if (resizeDir.includes('e')) {
                    newW = Math.min(MAX_WIDGET_WIDTH, Math.max(MIN_WIDGET_WIDTH, o.width + dx));
                }
                if (resizeDir.includes('w')) {
                    const desiredW = Math.min(MAX_WIDGET_WIDTH, Math.max(MIN_WIDGET_WIDTH, o.width - dx));
                    const delta = desiredW - o.width;
                    newW = desiredW;
                    newX = o.widgetX - delta;
                }

                // Vertical adjustments
                if (resizeDir.includes('s')) {
                    newH = Math.min(maxH, Math.max(MIN_WIDGET_HEIGHT, o.height + dy));
                }
                if (resizeDir.includes('n')) {
                    const desiredH = Math.min(maxH, Math.max(MIN_WIDGET_HEIGHT, o.height - dy));
                    const delta = desiredH - o.height;
                    newH = desiredH;
                    newY = o.widgetY - delta;
                }

                // Clamp position so widget never leaves viewport
                const maxX = Math.max(EDGE_MARGIN, window.innerWidth - newW - EDGE_MARGIN);
                const maxY = Math.max(EDGE_MARGIN, window.innerHeight - newH - EDGE_MARGIN);

                return {
                    ...prev,
                    x: Math.max(EDGE_MARGIN, Math.min(newX, maxX)),
                    y: Math.max(EDGE_MARGIN, Math.min(newY, maxY)),
                    customW: newW,
                    customH: newH,
                };
            });
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            setResizeDir(null);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing, resizeDir]);

    /* ------------------------------------------------------------------ */
    /*  Toggle helpers                                                     */
    /* ------------------------------------------------------------------ */
    const toggleMinimize = () => setState((prev) => ({ ...prev, isOpen: !prev.isOpen }));
    const toggleMaximize = () =>
        setState((prev) => ({
            ...prev,
            isMaximized: !prev.isMaximized,
            x: !prev.isMaximized ? EDGE_MARGIN : prev.x,
            y: !prev.isMaximized ? EDGE_MARGIN : prev.y,
        }));

    // ─── Minimized state: floating circular launcher ──────────────────
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

    // ─── Open state: full draggable + resizable widget ────────────────
    const width = state.isMaximized ? 'calc(100vw - 32px)' : `${state.customW}px`;
    const height = state.isMaximized ? 'calc(100vh - 32px)' : `${state.customH}px`;

    // While dragging OR resizing the iframe should ignore pointer events
    const blockInteraction = isDragging || isResizing;

    return (
        <div
            ref={widgetRef}
            onMouseDown={blockInteraction ? undefined : handleDragStart}
            className={`fixed z-50 rounded-2xl overflow-hidden border border-white/15 shadow-2xl shadow-black/40 transition-shadow duration-200
                ${blockInteraction ? 'select-none' : ''}
            `}
            style={{
                left: `${state.x}px`,
                top: `${state.y}px`,
                width,
                height,
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(16px) saturate(180%)',
                WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                userSelect: blockInteraction ? 'none' : 'auto',
                cursor: isResizing && resizeDir ? CURSOR_MAP[resizeDir] : blockInteraction ? 'grabbing' : 'grab',
            }}
        >
            {/* Header (drag handle) — hidden resize handles are placed
                around the *entire* widget outside of this header area */}
            <div
                className="flex items-center justify-between px-3 select-none"
                style={{
                    height: `${HEADER_HEIGHT}px`,
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.18) 100%)',
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

            {/* ── Resize handles (8 directions) ────────────────────────
                Only rendered when the widget is NOT maximised, because
                a maximised widget fills the viewport and should not be
                user‑resizable. */}
            {!state.isMaximized && (
                <>
                    {/* Top edge */}
                    <div
                        onMouseDown={(e) => handleResizeStart(e, 'n')}
                        className="absolute top-0 left-0 right-0 z-20"
                        style={{ height: RESIZE_HANDLE, cursor: CURSOR_MAP.n }}
                    />
                    {/* Bottom edge */}
                    <div
                        onMouseDown={(e) => handleResizeStart(e, 's')}
                        className="absolute bottom-0 left-0 right-0 z-20"
                        style={{ height: RESIZE_HANDLE, cursor: CURSOR_MAP.s }}
                    />
                    {/* Left edge */}
                    <div
                        onMouseDown={(e) => handleResizeStart(e, 'w')}
                        className="absolute top-0 bottom-0 left-0 z-20"
                        style={{ width: RESIZE_HANDLE, cursor: CURSOR_MAP.w }}
                    />
                    {/* Right edge */}
                    <div
                        onMouseDown={(e) => handleResizeStart(e, 'e')}
                        className="absolute top-0 bottom-0 right-0 z-20"
                        style={{ width: RESIZE_HANDLE, cursor: CURSOR_MAP.e }}
                    />
                    {/* Top‑left corner */}
                    <div
                        onMouseDown={(e) => handleResizeStart(e, 'nw')}
                        className="absolute top-0 left-0 z-20"
                        style={{ width: RESIZE_HANDLE * 2, height: RESIZE_HANDLE * 2, cursor: CURSOR_MAP.nw }}
                    />
                    {/* Top‑right corner */}
                    <div
                        onMouseDown={(e) => handleResizeStart(e, 'ne')}
                        className="absolute top-0 right-0 z-20"
                        style={{ width: RESIZE_HANDLE * 2, height: RESIZE_HANDLE * 2, cursor: CURSOR_MAP.ne }}
                    />
                    {/* Bottom‑left corner */}
                    <div
                        onMouseDown={(e) => handleResizeStart(e, 'sw')}
                        className="absolute bottom-0 left-0 z-20"
                        style={{ width: RESIZE_HANDLE * 2, height: RESIZE_HANDLE * 2, cursor: CURSOR_MAP.sw }}
                    />
                    {/* Bottom‑right corner */}
                    <div
                        onMouseDown={(e) => handleResizeStart(e, 'se')}
                        className="absolute bottom-0 right-0 z-20"
                        style={{ width: RESIZE_HANDLE * 2, height: RESIZE_HANDLE * 2, cursor: CURSOR_MAP.se }}
                    />
                </>
            )}

            {/* White transparent backing layer */}
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

            {/* Locked overlay (not signed in) */}
            {isLocked ? (
                <div
                    data-no-drag
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center px-8 text-center"
                    style={{
                        top: `${HEADER_HEIGHT}px`,
                        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.55) 0%, rgba(15, 23, 42, 0.85) 100%)',
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
                /* Native RAG chat panel powered by the backend */
                <div
                    data-no-drag
                    style={{
                        position: 'relative',
                        zIndex: 1,
                        width: '100%',
                        height: `calc(100% - ${HEADER_HEIGHT}px)`,
                        pointerEvents: blockInteraction ? 'none' : 'auto',
                        background: 'rgba(10, 15, 30, 0.55)',
                        colorScheme: 'dark',
                    }}
                >
                    <ChatPanel compact={true} showHistory={false} />
                </div>
            )}
        </div>
    );
}
