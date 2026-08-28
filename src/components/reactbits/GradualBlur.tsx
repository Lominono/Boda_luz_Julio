import React from 'react';

interface GradualBlurProps {
  position?: 'top' | 'bottom' | 'both';
  height?: string;
  className?: string;
}

export const GradualBlur: React.FC<GradualBlurProps> = ({
  position = 'both',
  height = '140px',
  className = '',
}) => {
  return (
    <>
      {(position === 'top' || position === 'both') && (
        <div
          className={`pointer-events-none fixed top-0 left-0 right-0 z-30 ${className}`}
          style={{ height }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#0E0C0A]/90 via-[#0E0C0A]/40 to-transparent backdrop-blur-[12px] [mask-image:linear-gradient(to_bottom,black_20%,transparent_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0E0C0A]/60 to-transparent backdrop-blur-[6px] [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]" />
        </div>
      )}

      {(position === 'bottom' || position === 'both') && (
        <div
          className={`pointer-events-none fixed bottom-0 left-0 right-0 z-30 ${className}`}
          style={{ height }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E0C0A]/95 via-[#0E0C0A]/50 to-transparent backdrop-blur-[14px] [mask-image:linear-gradient(to_top,black_30%,transparent_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E0C0A]/70 to-transparent backdrop-blur-[6px] [mask-image:linear-gradient(to_top,black_50%,transparent_100%)]" />
        </div>
      )}
    </>
  );
};

export default GradualBlur;
