import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PixelSwapProps {
  src: string;
  alt: string;
  gridCols?: number;
  gridRows?: number;
  className?: string;
  aspectRatio?: string;
}

export const PixelSwap: React.FC<PixelSwapProps> = ({
  src,
  alt,
  gridCols = 10,
  gridRows = 12,
  className = '',
  aspectRatio = 'aspect-[3/4]',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [pixels, setPixels] = useState<{ id: number; delay: number; scale: number }[]>([]);

  useEffect(() => {
    const total = gridCols * gridRows;
    const items = Array.from({ length: total }, (_, i) => ({
      id: i,
      delay: (Math.random() * 0.8) + (i / total) * 0.3,
      scale: Math.random() * 0.4 + 0.8,
    }));
    setPixels(items);
    setIsLoaded(true);
  }, [gridCols, gridRows]);

  return (
    <div className={`relative overflow-hidden rounded-2xl ${aspectRatio} ${className}`}>
      {/* Real Image */}
      <motion.img
        src={src}
        alt={alt}
        initial={{ filter: 'blur(10px) brightness(0.6)', scale: 1.08 }}
        animate={{ filter: 'blur(0px) brightness(1)', scale: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-full object-cover object-center"
      />

      {/* Cinematic Golden Caustic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0E0C0A]/85 via-transparent to-[#0E0C0A]/20 pointer-events-none" />

      {/* Pixel Swap Grid Animation Layer */}
      {isLoaded && (
        <div
          className="absolute inset-0 pointer-events-none grid"
          style={{
            gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${gridRows}, minmax(0, 1fr))`,
          }}
        >
          {pixels.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, scale: p.scale, backgroundColor: '#C5A059' }}
              animate={{ opacity: 0, scale: 0, backgroundColor: 'transparent' }}
              transition={{
                duration: 0.7,
                delay: p.delay,
                ease: 'easeInOut',
              }}
              className="w-full h-full border-[0.5px] border-[#D4AF37]/30 backdrop-blur-[2px]"
            />
          ))}
        </div>
      )}

      {/* Shimmering Golden Edge Border */}
      <div className="absolute inset-0 rounded-2xl border border-gold-400/40 pointer-events-none shadow-[inset_0_0_20px_rgba(212,175,55,0.2)]" />
    </div>
  );
};

export default PixelSwap;
