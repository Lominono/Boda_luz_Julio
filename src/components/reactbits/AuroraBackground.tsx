import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AuroraBackgroundProps {
  children?: React.ReactNode;
  showPetals?: boolean;
}

interface Petal {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  rotate: number;
}

export const AuroraBackground: React.FC<AuroraBackgroundProps> = ({
  children,
  showPetals = true,
}) => {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    if (!showPetals) return;
    const generatedPetals: Petal[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage
      size: Math.random() * 14 + 10,
      duration: Math.random() * 12 + 10,
      delay: Math.random() * 8,
      rotate: Math.random() * 360,
    }));
    setPetals(generatedPetals);
  }, [showPetals]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-ivory-200">
      {/* Subtle Aurora Ambient Lights */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-45">
        <div className="absolute -top-[20%] left-[10%] h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-gold-200/40 via-sage-100/30 to-transparent blur-3xl animate-pulse-subtle" />
        <div className="absolute top-[40%] -right-[10%] h-[600px] w-[600px] rounded-full bg-gradient-to-bl from-roseDust-200/30 via-gold-100/30 to-transparent blur-3xl" />
        <div className="absolute -bottom-[10%] left-[20%] h-[550px] w-[550px] rounded-full bg-gradient-to-tr from-sage-200/20 via-ivory-300/40 to-transparent blur-3xl" />
      </div>

      {/* Floating Botanical Petals */}
      {showPetals && (
        <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
          {petals.map((petal) => (
            <motion.div
              key={petal.id}
              className="absolute opacity-60"
              style={{
                left: `${petal.x}%`,
                top: '-5%',
              }}
              animate={{
                y: ['0vh', '110vh'],
                x: [`${petal.x}%`, `${petal.x + (petal.id % 2 === 0 ? 8 : -8)}%`, `${petal.x}%`],
                rotate: [petal.rotate, petal.rotate + 360],
                opacity: [0, 0.7, 0.7, 0],
              }}
              transition={{
                duration: petal.duration,
                repeat: Infinity,
                delay: petal.delay,
                ease: 'linear',
              }}
            >
              {/* Petal SVG */}
              <svg
                width={petal.size}
                height={petal.size * 1.4}
                viewBox="0 0 24 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 0C12 0 24 10 24 20C24 26.6274 18.6274 32 12 32C5.37258 32 0 26.6274 0 20C0 10 12 0 12 0Z"
                  fill={petal.id % 3 === 0 ? '#EBD8AF' : petal.id % 3 === 1 ? '#DEB3B3' : '#CBDBCB'}
                  fillOpacity="0.5"
                />
              </svg>
            </motion.div>
          ))}
        </div>
      )}

      {/* Content wrapper */}
      <div className="relative z-20 w-full">{children}</div>
    </div>
  );
};

export default AuroraBackground;
