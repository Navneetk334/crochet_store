import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { useBoutique } from "@/store/useBoutique";

export default function CustomCursor() {
    const { cursorVariant } = useBoutique();
    const [cursorState, setCursorState] = useState<"default" | "hover" | "interaction" | "text">("default");
    const [isVisible, setIsVisible] = useState(false);

    // Position of the dot (follows exactly)
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Position of the loop (follows with lag/elasticity)
    const loopX = useSpring(cursorX, { damping: 20, stiffness: 250 });
    const loopY = useSpring(cursorY, { damping: 20, stiffness: 250 });

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        const handleOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target) return;

            // Check for links, buttons, or elements with specific cursor data
            if (target.closest('a') || target.closest('button')) {
                setCursorState("interaction");
            } else if (target.closest('[data-cursor="view"]')) {
                setCursorState("hover");
            } else if (target.getAttribute('type') === 'text' || target.tagName === 'P' || target.tagName === 'H1' || target.tagName === 'H2' || target.tagName === 'H3') {
                setCursorState("text");
            } else {
                setCursorState("default");
            }
        };

        window.addEventListener("mousemove", moveCursor);
        window.addEventListener("mouseover", handleOver);
        document.addEventListener("mouseleave", handleMouseLeave);
        document.addEventListener("mouseenter", handleMouseEnter);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("mouseover", handleOver);
            document.removeEventListener("mouseleave", handleMouseLeave);
            document.removeEventListener("mouseenter", handleMouseEnter);
        };
    }, [isVisible]);

    if (typeof window !== "undefined" && ('ontouchstart' in window)) return null;

    return (
        <>
            {/* The Precision Tool (Dot or Needle) */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[10000]"
                style={{
                    x: cursorX,
                    y: cursorY,
                }}
                animate={{
                    scale: isVisible && cursorVariant !== "yarn" ? 1 : 0,
                    opacity: isVisible && cursorVariant !== "yarn" ? 1 : 0,
                }}
            >
                {cursorVariant === "needle" ? (
                    <motion.div
                        className="relative"
                        animate={{ rotate: -25 }} // Angled like a standard cursor
                        style={{
                            transformOrigin: "top left",
                            x: -2,
                            y: -2
                        }}
                    >
                        {/* High-Fidelity Needle SVG */}
                        <svg width="12" height="48" viewBox="0 0 12 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* The Sharp Tip - Starts at the very top (6, 0) */}
                            <path
                                d="M6 0L4 12V42C4 45.3137 4.89543 48 6 48C7.10457 48 8 45.3137 8 42V12L6 0Z"
                                fill="#E5E5E5" // Brighter Steel
                                className="mix-blend-difference"
                            />
                            {/* The Eye (Hole) */}
                            <ellipse cx="6" cy="38" rx="1.5" ry="3.5" fill="black" />
                            {/* Thread */}
                            <path
                                d="M6 38C10 38 16 42 16 48"
                                stroke="#C07050"
                                strokeWidth="0.8"
                                strokeLinecap="round"
                            />
                        </svg>
                    </motion.div>
                ) : (
                    <motion.div
                        className="bg-charcoal rounded-full mix-blend-difference"
                        style={{ x: "-50%", y: "-50%" }}
                        animate={{
                            width: 6,
                            height: 6,
                        }}
                    />
                )}
            </motion.div>

            {/* The Outer Loop / Yarn Ball */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999]"
                style={{
                    x: loopX,
                    y: loopY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    width: (cursorVariant === "minimal" || cursorVariant === "needle")
                        ? 0
                        : cursorState === "hover" ? 90 : cursorState === "interaction" ? 45 : 30,
                    height: (cursorVariant === "minimal" || cursorVariant === "needle")
                        ? 0
                        : cursorState === "hover" ? 90 : cursorState === "interaction" ? 45 : 30,
                    borderRadius: "100%",
                    rotate: cursorVariant === "yarn" ? [0, 90, 180, 270, 360] : 0,
                    borderWidth: cursorVariant === "yarn" ? 0 : 1.5,
                    borderColor: cursorState === "interaction" ? "rgb(192, 112, 80)" : "rgb(138, 154, 91)",
                    borderStyle: "solid",
                    backgroundColor: cursorState === "interaction" ? "rgba(192, 112, 80, 0.05)" : "rgba(138, 154, 91, 0)",
                    scale: isVisible && cursorVariant !== "needle" && cursorVariant !== "minimal" ? 1 : 0,
                    opacity: isVisible && cursorVariant !== "needle" && cursorVariant !== "minimal" ? 1 : 0,
                }}
                transition={{
                    rotate: cursorVariant === "yarn" ? { duration: 15, repeat: Infinity, ease: "linear" } : {},
                    type: "spring",
                    stiffness: 250,
                    damping: 30
                }}
            >
                {cursorVariant === "yarn" && (
                    <svg viewBox="0 0 100 100" className="w-full h-full text-sage fill-none overflow-visible">
                        {/* The Yarn Ball Outline */}
                        <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="2.5" />

                        {/* Segment 1: Top Left Verticalish Winding */}
                        <g opacity="0.8">
                            <path d="M30 15 Q 40 30 45 50" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M22 22 Q 32 35 37 55" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M15 30 Q 25 40 30 60" stroke="currentColor" strokeWidth="1.5" />
                        </g>

                        {/* Segment 2: Bottom Mid Horizontalish Winding */}
                        <g opacity="0.8">
                            <path d="M20 70 Q 50 85 85 75" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M25 60 Q 50 75 80 65" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M30 50 Q 55 65 75 55" stroke="currentColor" strokeWidth="1.5" />
                        </g>

                        {/* Segment 3: Top Right Diagonal Winding */}
                        <g opacity="0.8">
                            <path d="M60 10 Q 75 30 85 55" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M70 15 Q 85 35 90 50" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M80 25 Q 90 40 95 45" stroke="currentColor" strokeWidth="1.5" />
                        </g>

                        {/* Segment 4: Mid Cross Winding */}
                        <g opacity="0.9">
                            <path d="M10 50 Q 50 35 90 50" stroke="currentColor" strokeWidth="2" />
                            <path d="M12 58 Q 50 43 88 58" stroke="currentColor" strokeWidth="2" />
                            <path d="M15 42 Q 50 27 85 42" stroke="currentColor" strokeWidth="2" />
                        </g>

                        {/* Trailing Thread - Fixed at bottom right */}
                        <path
                            d="M85 85 Q 95 95 95 110 S 80 120 75 115"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            className="drop-shadow-sm"
                        />
                    </svg>
                )}

                {cursorState === "hover" && cursorVariant !== "minimal" && cursorVariant !== "needle" && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-sage">View</span>
                    </motion.div>
                )}
            </motion.div>
        </>
    );
}
