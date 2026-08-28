import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface FoldTextProps {
  text: string;
  className?: string;
  foldClassName?: string;
  highlightWords?: string[];
  highlightClassName?: string;
  staggerDelay?: number;
  duration?: number;
  autoPlay?: boolean;
}

export const FoldText: React.FC<FoldTextProps> = ({
  text,
  className = '',
  foldClassName = '',
  highlightWords = [],
  highlightClassName = 'text-gold-500 font-script italic',
  staggerDelay = 0.05,
  duration = 0.7,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const words = text.split(' ');

  return (
    <div
      className={`inline-flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 select-none perspective-[1000px] ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {words.map((word, wordIndex) => {
        const isHighlight = highlightWords.some(
          (hw) => hw.toLowerCase() === word.toLowerCase() || word.toLowerCase().includes(hw.toLowerCase())
        );

        return (
          <span key={wordIndex} className="inline-flex whitespace-nowrap overflow-hidden">
            {word.split('').map((char, charIndex) => {
              const totalIndex = wordIndex * 8 + charIndex;

              return (
                <motion.span
                  key={charIndex}
                  className={`inline-block origin-bottom transform-gpu ${
                    isHighlight ? highlightClassName : foldClassName
                  }`}
                  initial={{
                    rotateX: 90,
                    opacity: 0,
                    scale: 0.8,
                    y: 20,
                  }}
                  whileInView={{
                    rotateX: 0,
                    opacity: 1,
                    scale: 1,
                    y: 0,
                  }}
                  animate={
                    isHovered
                      ? {
                          rotateX: [0, -15, 0],
                          y: [0, -4, 0],
                          transition: {
                            duration: 0.4,
                            delay: totalIndex * 0.02,
                            ease: 'easeInOut',
                          },
                        }
                      : {}
                  }
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{
                    duration: duration,
                    delay: totalIndex * staggerDelay,
                    ease: [0.215, 0.61, 0.355, 1], // easeOutCubic
                  }}
                >
                  {char}
                </motion.span>
              );
            })}
          </span>
        );
      })}
    </div>
  );
};

export default FoldText;
