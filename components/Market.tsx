
import React, { useState, useEffect } from 'react';
import { SessionTimer } from './SessionTimer';

interface AnalysisTask {
  id: string;
  text: string;
  done: boolean;
}

export const Market: React.FC = () => {
  const [wins, setWins] = useState(() => Number(localStorage.getItem('ess_m_wins')) || 0);
  const [losses, setLosses] = useState(() => Number(localStorage.getItem('ess_m_losses')) || 0);
  const [tasks, setTasks] = useState<AnalysisTask[]>([
    { id: '1', text: 'Identify Higher Timeframe Trend', done: false },
    { id: '2', text: 'Mark Key S/R Zones (Daily)', done: false },
    { id: '3', text: 'Scan for Divergence (RSI/MACD)', done: false },
    { id: '4', text: 'Volume Analysis at Key Levels', done: false },
    { id: '5', text: 'Check Economic Calendar Alerts', done: false },
    { id: '6', text: 'Calculate Risk/Reward (min 1:3)', done: false }
  ]);

  useEffect(() => {
    localStorage.setItem('ess_m_wins', wins.toString());
    localStorage.setItem('ess_m_losses', losses.toString());
  }, [wins, losses]);

  const total = wins + losses;
  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;
  
  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 pb-12">
      <SessionTimer activityId="market_analysis" expectedMinutes={20} />

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900/40 rounded-[2.5rem] border border-zinc-800 p-8 flex flex-col justify-between aspect-square relative">
           <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">Win Edge</span>
           <div className="flex flex-col">
              <span className={`text-5xl font-light dot-matrix tracking-tighter ${winRate >= 50 ? 'text-white' : 'nothing-red'}`}>
                {winRate}<span className="text-lg ml-1 text-zinc-700">%</span>
              </span>
              <div className="mt-3 h-1.5 bg-zinc-800 rounded-full w-full overflow-hidden">
                <div className="h-full bg-white transition-all duration-700" style={{ width: `${winRate}%` }} />
              </div>
           </div>
        </div>

        <div className="bg-zinc-900/40 rounded-[2.5rem] border border-zinc-800 p-8 flex flex-col justify-between aspect-square">
           <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">Risk L</span>
           <div className="flex flex-col">
              <span className="text-5xl font-light dot-matrix tracking-tighter nothing-red">
                {losses}<span className="text-lg ml-1 text-zinc-800">L</span>
              </span>
              <div className="mt-3 h-1.5 bg-zinc-800 rounded-full w-full overflow-hidden">
                <div className="h-full bg-red-500 transition-all duration-700" style={{ width: `${total > 0 ? (losses / total) * 100 : 0}%` }} />
              </div>
           </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-600 ml-4 dot-matrix">Daily Analysis Flow</h4>
        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-[2.5rem] p-8 space-y-4">
           {tasks.map(t => (
             <div 
               key={t.id} 
               onClick={() => toggleTask(t.id)}
               className="flex items-center gap-4 cursor-pointer group py-1"
             >
                <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${t.done ? 'bg-white border-white' : 'border-zinc-800 group-hover:border-zinc-500'}`}>
                   {t.done && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
                <span className={`text-sm font-medium tracking-tight transition-all ${t.done ? 'text-zinc-600 line-through' : 'text-zinc-300'}`}>{t.text}</span>
             </div>
           ))}
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 space-y-6">
        <div className="flex justify-between items-center">
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-500 dot-matrix">Execution Ledger</h4>
            <span className="text-[8px] uppercase tracking-widest text-zinc-700 font-bold">{total} Total Trades</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => setWins(p => p + 1)}
            className="py-12 rounded-[2.5rem] bg-white text-black font-bold flex flex-col items-center justify-center gap-3 active:scale-95 transition-all shadow-2xl"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <span className="text-[9px] uppercase tracking-[0.3em]">Book Win</span>
          </button>
          <button 
            onClick={() => setLosses(p => p + 1)}
            className="py-12 rounded-[2.5rem] bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold flex flex-col items-center justify-center gap-3 active:scale-95 transition-all"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            <span className="text-[9px] uppercase tracking-[0.3em]">Cut Loss</span>
          </button>
        </div>
      </div>
    </div>
  );
};
