
import React, { useState, useEffect, useRef } from 'react';
import { Hourglass } from './Hourglass';

interface SessionTimerProps {
  activityId: string;
  expectedMinutes: number;
}

export const SessionTimer: React.FC<SessionTimerProps> = ({ activityId, expectedMinutes }) => {
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => stopTimer();
  }, []);

  const startTimer = () => {
    if (isActive) return;
    setIsActive(true);
    timerRef.current = window.setInterval(() => {
      setSeconds(prev => {
        const next = prev + 1;
        if (next % 30 === 0) {
          const history = JSON.parse(localStorage.getItem('ess_activity_history') || '[]');
          history.push({ date: new Date().toISOString().split('T')[0], activityId, durationSeconds: 30 });
          localStorage.setItem('ess_activity_history', JSON.stringify(history));
        }
        return next;
      });
    }, 1000);
  };

  const stopTimer = () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const rs = s % 60;
    return `${m.toString().padStart(2, '0')}:${rs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] flex items-center justify-between">
      <div>
        <p className="text-[10px] uppercase font-bold text-zinc-500 dot-matrix">Focus Session</p>
        <p className="text-4xl font-light dot-matrix" aria-live="polite" aria-atomic="true">
          <span className="sr-only">Elapsed time: </span>
          {formatTime(seconds)}
        </p>
      </div>
      <div className="flex flex-col items-center gap-4">
        <Hourglass progress={(seconds/(expectedMinutes*60))*100} isActive={isActive} />
        <button 
          onClick={isActive ? stopTimer : startTimer} 
          aria-label={isActive ? "Pause timer" : "Start timer"}
          className="text-[10px] uppercase font-bold text-white border border-zinc-800 px-4 py-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white active:scale-95 transition-all"
        >
          {isActive ? 'Pause' : 'Start'}
        </button>
      </div>
    </div>
  );
};
