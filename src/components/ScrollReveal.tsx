
import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
    children: React.ReactNode;
    animation?: 'fade-up' | 'scale-in' | 'slide-right' | 'fade-right' | 'fade-left';
    delay?: number;
    className?: string;
    threshold?: number;
}

const ScrollReveal = ({
    children,
    animation = 'fade-up',
    delay = 0,
    className = "",
    threshold = 0.1
}: ScrollRevealProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // Only animate once
                }
            },
            { threshold }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [threshold]);

    const getAnimationClass = () => {
        switch (animation) {
            case 'fade-up': return 'animate-reveal-up';
            case 'scale-in': return 'animate-reveal-in';
            case 'slide-right': return 'animate-slide-up';
            case 'fade-right': return 'animate-fade-right';
            case 'fade-left': return 'animate-fade-left';
            default: return 'animate-fade-in';
        }
    };

    return (
        <div
            ref={ref}
            className={`${className} transition-opacity duration-500 ${isVisible ? getAnimationClass() : 'opacity-0'}`}
            style={{ animationDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

export default ScrollReveal;
