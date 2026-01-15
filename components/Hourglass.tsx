
import React from 'react';

interface HourglassProps {
  progress?: number; // 0 to 100
  isActive?: boolean;
}

export const Hourglass: React.FC<HourglassProps> = ({ progress = 0, isActive = false }) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const bottomFillPercentage = clampedProgress; 
  const topFillPercentage = 100 - clampedProgress;

  return (
    <div 
      className={`relative w-8 h-10 transition-all duration-500 ease-in-out ${isActive ? 'scale-100' : 'scale-90 opacity-60'}`}
      role="progressbar"
      aria-valuenow={Math.round(clampedProgress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg viewBox="0 0 24 32" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <clipPath id="topBulbClip">
            <path d="M5 2 L12 16 L19 2 Z" />
          </clipPath>
          <clipPath id="bottomBulbClip">
            <path d="M5 30 L12 16 L19 30 Z" />
          </clipPath>
        </defs>

        <path 
          d="M4 2h16M4 30h16" 
          className="stroke-zinc-800" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
        />
        
        <path 
          d="M5 2 L12 16 L19 30 M19 2 L12 16 L5 30" 
          className="stroke-zinc-900" 
          strokeWidth="0.8" 
        />

        <rect 
          x="4" 
          y={16 - (14 * (topFillPercentage / 100))} 
          width="16" 
          height="14" 
          fill="white" 
          fillOpacity="0.1"
          clipPath="url(#topBulbClip)"
          className="transition-all duration-1000 ease-linear"
        />

        <rect 
          x="4" 
          y={30 - (14 * (bottomFillPercentage / 100))} 
          width="16" 
          height="14" 
          fill="white" 
          fillOpacity="0.6"
          clipPath="url(#bottomBulbClip)"
          className="transition-all duration-1000 ease-linear"
        />

        {isActive && clampedProgress < 100 && (
          <line 
            x1="12" y1="16" x2="12" y2="30" 
            stroke="white" 
            strokeWidth="0.5" 
            strokeDasharray="1,2"
          >
            <animate attributeName="stroke-dashoffset" from="6" to="0" dur="0.8s" repeatCount="indefinite" />
          </line>
        )}
      </svg>
    </div>
  );
};
