import React from 'react';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 4,
  className = '',
}) => {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`inline-block ${
        disabled
          ? 'text-gold-600'
          : 'bg-clip-text text-transparent bg-gradient-to-r from-gold-600 via-gold-200 via-gold-400 to-gold-700 bg-[length:200%_auto] animate-shimmer'
      } ${className}`}
      style={{
        animationDuration: disabled ? undefined : animationDuration,
      }}
    >
      {text}
    </span>
  );
};

export default ShinyText;
