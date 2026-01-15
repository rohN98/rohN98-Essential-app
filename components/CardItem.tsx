
import React from 'react';

interface CardItemProps {
  title: string;
  subtitle: string;
  onClick: () => void;
  active?: boolean;
}

export const CardItem: React.FC<CardItemProps> = ({ title, subtitle, onClick, active = false }) => {
  return (
    <button
      onClick={onClick}
      className={`glass-card text-left p-6 flex flex-col justify-between min-h-[120px] w-full relative group overflow-hidden
        ${active ? 'bg-white text-black' : 'text-zinc-400'}`}
    >
      <div className="flex justify-between items-start">
        <h3 className={`text-xl font-bold tracking-tighter dot-matrix uppercase transition-colors ${active ? 'text-black' : 'text-zinc-100 group-hover:text-white'}`}>
          {title}
        </h3>
        <div className={`w-1.5 h-1.5 rounded-full ${active ? 'nothing-red-bg shadow-[0_0_10px_rgba(255,46,46,0.6)]' : 'bg-zinc-800'}`} />
      </div>
      
      <div className="space-y-2">
        <div className={`w-8 h-[1px] ${active ? 'bg-black/20' : 'bg-zinc-800'}`} />
        <p className={`text-[8px] uppercase tracking-[0.4em] font-black transition-colors ${active ? 'text-zinc-600' : 'text-zinc-600 group-hover:text-zinc-400'}`}>
          {subtitle}
        </p>
      </div>
    </button>
  );
};
