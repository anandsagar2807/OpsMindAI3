import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Sheet = ({ open, onClose, side = 'right', children, title, width = 400 }) => {
    const overlayRef = useRef(null);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && open) onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [open, onClose]);

    const slideVariants = {
        right: {
            initial: { x: '100%' },
            animate: { x: 0 },
            exit: { x: '100%' },
        },
        left: {
            initial: { x: '-100%' },
            animate: { x: 0 },
            exit: { x: '-100%' },
        },
    };

    const direction = slideVariants[side];

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        ref={overlayRef}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={direction.initial}
                        animate={direction.animate}
                        exit={direction.exit}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed top-0 z-50 h-full bg-[#0a0f1a] border-l border-r border-white/10 shadow-2xl"
                        style={{
                            [side]: 0,
                            width: `${width}px`,
                            maxWidth: '90vw',
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                            <h2 className="text-lg font-semibold text-white">{title}</h2>
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="overflow-y-auto h-[calc(100%-64px)] custom-scrollbar">
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Sheet;