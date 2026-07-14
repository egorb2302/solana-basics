import { useSpring, animated } from '@react-spring/web';
import { useRef, useState, type MouseEvent } from 'react';

export function DraggableWindow({ children, title = 'Window' }: { children: React.ReactNode; title?: string }) {
    const [isDragging, setIsDragging] = useState(false);
    const offset = useRef({ x: 0, y: 0 });

    const [springs, api] = useSpring(() => ({
        x: 650,
        y: 200,
        config: { tension: 400, friction: 30 },
    }));

    const handleMouseDown = (e: MouseEvent) => {
        setIsDragging(true);
        offset.current = {
            x: e.clientX - springs.x.get(),
            y: e.clientY - springs.y.get(),
        };
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        api.start({
            x: e.clientX - offset.current.x,
            y: e.clientY - offset.current.y,
            immediate: true,
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <animated.div
            className="absolute rounded-2xl bg-[#16141C] border border-[#2A2733] shadow-2xl overflow-hidden"
            style={{
                x: springs.x,
                y: springs.y,
                cursor: isDragging ? 'grabbing' : 'grab',
                userSelect: 'none',
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >

            <div
                className="px-4 py-6 bg-[#1E1B26] border-b border-[#2A2733] cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
            >
                <span className="text-sm text-[#D9D5E3] font-medium">{title}</span>
            </div>
            <div className="p-4">{children}</div>
        </animated.div>
    );
}