
import React, { useState } from 'react';

export const SystemInsights: React.FC = () => {
  const [range, setRange] = useState<'W' | 'M'>('W');
  const [habits, setHabits] = useState([
    { name: 'Deep Work', done: true },
    { name: 'Hydration', done: true },
    { name: 'Movement', done: false }
  ]);

  return (
    <div className="animate-nothing space-y-8 pb-12">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tighter uppercase dot-matrix">Insights</h2>
        <div className="flex gap-1 p-1 bg-zinc-900 rounded-full">
           <button onClick={() => setRange('W')} className={`px-4 py-1.5 rounded-full text-[8px] font-bold tracking-widest uppercase ${range === 'W' ? 'bg-white text-black' : 'text-zinc-600'}`}>W</button>
           <button onClick={() => setRange('M')} className={`px-4 py-1.5 rounded-full text-[8px] font-bold tracking-widest uppercase ${range === 'M' ? 'bg-white text-black' : 'text-zinc-600'}`}>M</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-7 aspect-square flex flex-col justify-between">
           <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Focus Avg</span>
           <span className="text-5xl font-light dot-matrix">6.4<span className="text-xs ml-1 text-zinc-700">h</span></span>
        </div>
        <div className="glass-card p-7 aspect-square flex flex-col justify-between">
           <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Efficiency</span>
           <span className="text-5xl font-light dot-matrix">82<span className="text-xs ml-1 text-zinc-700">%</span></span>
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-600 ml-4 dot-matrix">Daily Logic</h3>
        <div className="grid grid-cols-1 gap-2">
           {habits.map((h, i) => (
             <div 
               key={i} 
               onClick={() => setHabits(prev => prev.map((item, idx) => idx === i ? {...item, done: !item.done} : item))}
               className="glass-card p-6 flex justify-between items-center cursor-pointer"
             >
                <span className={`text-sm font-medium tracking-tight ${h.done ? 'text-zinc-600' : 'text-white'}`}>{h.name}</span>
                <div className={`w-5 h-5 rounded-full border transition-all flex items-center justify-center ${h.done ? 'bg-white border-white shadow-[0_0_10px_white]' : 'border-zinc-800'}`}>
                   {h.done && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
             </div>
           ))}
        </div>
      </section>

      <section className="glass-card p-8 space-y-6">
        <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-500 dot-matrix">Utilization Trend</h3>
        <div className="h-32 flex items-end gap-2 px-2">
           {[40, 60, 30, 90, 100, 70, 50].map((v, i) => (
             <div key={i} className="flex-1 bg-zinc-900 rounded-t-sm relative group">
                <div className="absolute bottom-0 w-full bg-white transition-all duration-700" style={{ height: `${v}%` }} />
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[6px] opacity-0 group-hover:opacity-100 dot-matrix">{v}%</div>
             </div>
           ))}
        </div>
        <div className="flex justify-between text-[8px] uppercase tracking-widest text-zinc-700 font-black px-2">
           <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
        </div>
      </section>
    </div>
  );
};
