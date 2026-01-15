
import React, { useState, useEffect, useRef } from 'react';
import { Hourglass } from './Hourglass';

interface StopwatchProps {
  onStartSession?: () => void;
}

export const Stopwatch: React.FC<StopwatchProps> = ({ onStartSession }) => {
  const [taskName, setTaskName] = useState(() => localStorage.getItem('ess_sw_task') || '');
  const [isActive, setIsActive] = useState(() => localStorage.getItem('ess_sw_active') === 'true');
  const [seconds, setSeconds] = useState(() => Number(localStorage.getItem('ess_sw_seconds')) || 0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive) {
      startTimer(true);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('ess_sw_task', taskName);
    localStorage.setItem('ess_sw_active', isActive.toString());
    localStorage.setItem('ess_sw_seconds', seconds.toString());
  }, [taskName, isActive, seconds]);

  const startTimer = (isResuming = false) => {
    if (!taskName.trim()) {
      alert("Please enter a task name first.");
      return;
    }
    
    if (!isResuming) {
      setIsActive(true);
      if (onStartSession) onStartSession();
    }

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setSeconds(prev => {
        const next = prev + 1;
        if (next % 30 === 0) {
          logActivity(30);
        }
        return next;
      });
    }, 1000);
  };

  const stopTimer = () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    
    const remainder = seconds % 30;
    if (remainder > 0) {
      logActivity(remainder);
    }
  };

  const resetTimer = () => {
    stopTimer();
    setSeconds(0);
    setTaskName('');
    localStorage.removeItem('ess_sw_task');
    localStorage.removeItem('ess_sw_seconds');
    localStorage.removeItem('ess_sw_active');
  };

  const logActivity = (duration: number) => {
    const history = JSON.parse(localStorage.getItem('ess_activity_history') || '[]');
    history.push({ 
      date: new Date().toISOString().split('T')[0], 
      activityId: `stopwatch_${taskName.trim().toLowerCase().replace(/\s+/g, '_')}`, 
      durationSeconds: duration 
    });
    localStorage.setItem('ess_activity_history', JSON.stringify(history));
  };

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-6 duration-700 space-y-10 pb-20">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tighter uppercase dot-matrix">Stopwatch</h2>
        <p className="text-zinc-500 text-xs uppercase tracking-widest font-medium">Ad-hoc Activity Logger</p>
      </div>

      <div className="bg-zinc-900/60 border border-zinc-800 rounded-[2.5rem] p-8 space-y-10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[60px] pointer-events-none" />
        
        <div className="space-y-4">
          <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-500 dot-matrix ml-2">Task Designation</label>
          <input 
            type="text" 
            placeholder="What are you focusing on?" 
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            disabled={isActive}
            className="w-full bg-black/50 border border-zinc-800 rounded-[2rem] p-6 text-white text-lg focus:border-zinc-500 outline-none transition-all placeholder:text-zinc-800"
          />
        </div>

        <div className="flex flex-col items-center justify-center gap-8 py-4">
          <div className="relative">
            <Hourglass progress={(seconds % 3600) / 36} isActive={isActive} />
            <div className="absolute -inset-8 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          </div>
          
          <div className="text-center space-y-2 relative">
             <span className="text-6xl font-light tracking-tighter dot-matrix">{formatTime(seconds)}</span>
          </div>
        </div>

        <div className="flex gap-4">
          {!isActive ? (
            <button 
              onClick={() => startTimer(false)}
              className="flex-1 py-6 bg-white text-black rounded-[2rem] font-bold uppercase text-[10px] tracking-widest active:scale-95 transition-all shadow-lg"
            >
              Start Session
            </button>
          ) : (
            <button 
              onClick={stopTimer}
              className="flex-1 py-6 bg-zinc-800 text-white rounded-[2rem] border border-zinc-700 font-bold uppercase text-[10px] tracking-widest active:scale-95 transition-all"
            >
              Pause
            </button>
          )}
          
          <button 
            onClick={resetTimer}
            className="px-8 py-6 bg-zinc-900 border border-zinc-800 text-zinc-600 rounded-[2rem] font-bold uppercase text-[10px] tracking-widest active:scale-95 transition-all hover:text-red-500 hover:border-red-500/30"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="p-8 border border-zinc-900 border-dashed rounded-[3rem] text-center space-y-4">
         <p className="text-[8px] uppercase tracking-[0.5em] text-zinc-700 font-bold leading-relaxed">
           Ad-hoc sessions are logged automatically to your daily focus report.
         </p>
      </div>
    </div>
  );
};
