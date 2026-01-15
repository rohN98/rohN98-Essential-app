
import React, { useState, useEffect, useRef } from 'react';
import { Hourglass } from './Hourglass';

interface FocusFlowProps {
  onBack: () => void;
}

export const FocusFlow: React.FC<FocusFlowProps> = ({ onBack }) => {
  const [task, setTask] = useState(() => localStorage.getItem('ess_sw_task') || '');
  const [isActive, setIsActive] = useState(() => localStorage.getItem('ess_sw_active') === 'true');
  const [seconds, setSeconds] = useState(() => Number(localStorage.getItem('ess_sw_seconds')) || 0);
  const [zenMode, setZenMode] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive) startTimer(true);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const startTimer = (isResuming = false) => {
    if (!task.trim()) return alert("Assign task designation.");
    if (!isResuming) setIsActive(true);
    
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setSeconds(prev => {
        const next = prev + 1;
        const formatted = formatTime(next);
        localStorage.setItem('ess_sw_seconds', next.toString());
        localStorage.setItem('ess_sw_seconds_formatted', formatted);
        localStorage.setItem('ess_sw_active', 'true');
        localStorage.setItem('ess_sw_task', task);
        return next;
      });
    }, 1000);
  };

  const stopTimer = () => {
    setIsActive(false);
    localStorage.setItem('ess_sw_active', 'false');
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const formatTime = (s: number) => {
    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (zenMode) {
    return (
      <div 
        className="fixed inset-0 z-[500] bg-black flex flex-col items-center justify-center animate-in fade-in"
        onClick={() => setZenMode(false)}
      >
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="space-y-8 text-center">
          <div className="w-2 h-2 rounded-full nothing-red-bg mx-auto animate-pulse shadow-[0_0_15px_red]" />
          <h1 className="text-[10rem] font-light dot-matrix tracking-tighter text-white leading-none">{formatTime(seconds).slice(3)}</h1>
          <p className="text-xs uppercase tracking-[1em] text-zinc-500 font-bold dot-matrix">{task}</p>
        </div>
        <p className="absolute bottom-20 text-[8px] uppercase tracking-[0.5em] text-zinc-800 font-black animate-pulse">TERMINATE IMMERSION_TAP</p>
      </div>
    );
  }

  return (
    <div className="animate-nothing space-y-10 max-w-xl mx-auto">
      <div className="flex justify-between items-end px-2">
        <div>
          <h2 className="text-4xl font-bold tracking-tighter uppercase dot-matrix">Focus Flow</h2>
          <p className="text-zinc-600 text-[10px] uppercase tracking-[0.3em] font-bold mt-2">Active Protocol Engine</p>
        </div>
        <div className={`w-3 h-3 rounded-full ${isActive ? 'nothing-red-bg animate-pulse shadow-[0_0_10px_red]' : 'bg-zinc-900'}`} />
      </div>

      <div className="glass-card p-12 space-y-16 relative overflow-hidden bg-zinc-950/40">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
        
        <div className="space-y-6">
          <label className="text-[8px] uppercase tracking-[0.5em] font-black text-zinc-700 dot-matrix ml-2">Protocol_ID</label>
          <input 
            type="text" 
            placeholder="SYSTEM_CMD" 
            value={task}
            onChange={(e) => setTask(e.target.value)}
            disabled={isActive}
            className="w-full bg-transparent border-b border-zinc-900 p-2 text-3xl font-bold focus:border-white outline-none transition-all placeholder:text-zinc-900 text-zinc-100"
          />
        </div>

        <div className="flex flex-col items-center gap-12">
           <Hourglass progress={(seconds % 3600) / 36} isActive={isActive} />
           <div className="text-center">
              <span className="text-[5rem] font-light tracking-tighter dot-matrix leading-none text-zinc-200">
                {formatTime(seconds)}
              </span>
           </div>
        </div>

        <div className="flex flex-col gap-4">
          <button 
            onClick={() => isActive ? stopTimer() : startTimer()}
            className={`w-full py-8 rounded-[3rem] font-black uppercase text-[11px] tracking-[0.4em] active:scale-95 transition-all shadow-xl ${isActive ? 'bg-zinc-900 text-zinc-500 border border-zinc-800' : 'bg-white text-black'}`}
          >
            {isActive ? 'Suspend Logic' : 'Initiate Session'}
          </button>
          <button 
            onClick={() => setZenMode(true)}
            className="w-full py-6 glass-card border-white/5 text-zinc-400 font-bold uppercase text-[9px] tracking-[0.5em] active:scale-95 hover:text-white"
          >
            Enter Immersion Mode
          </button>
        </div>
      </div>

      <div className="p-10 border border-zinc-900 border-dashed rounded-[3rem] text-center">
         <p className="text-[8px] uppercase tracking-[0.6em] text-zinc-800 font-black leading-relaxed">
           BIOMETRIC_SYNC_STABLE // SYSTEM_LOGS_CLINICAL
         </p>
      </div>
    </div>
  );
};
