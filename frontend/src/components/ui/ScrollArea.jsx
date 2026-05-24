import { useRef, useEffect } from 'react';

const ScrollArea = ({ children, className = '', autoScroll = false, autoScrollThreshold = 100 }) => {
    const scrollRef = useRef(null);
    const isNearBottomRef = useRef(true);

    useEffect(() => {
        if (autoScroll && scrollRef.current && isNearBottomRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [children, autoScroll]);

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        isNearBottomRef.current = scrollHeight - scrollTop - clientHeight < autoScrollThreshold;
    };

    return (
        <div
            ref={scrollRef}
            onScroll={handleScroll}
            className={`overflow-y-auto custom-scrollbar ${className}`}
        >
            {children}
        </div>
    );
};

export default ScrollArea;