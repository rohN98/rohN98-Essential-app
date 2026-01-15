
import React, { useState, useEffect } from 'react';
import { CardItem } from './CardItem.tsx';
import { Hourglass } from './Hourglass.tsx';
import { GoogleGenAI } from "@google/genai";

interface DashboardProps {
  onNavigate: (view: any) => void;
}

const CLINICAL_MANTRAS = [
  "Action is signal. Noise is static.",
  "Precision over volume. Results over effort.",
  "Zero distractions. Maximum output.",
  "Mind is a tool. Execute the logic.",
  "Stay clinical. Stay liquid.",
  "Standard accepted is standard walked past."
];

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [time, setTime] = useState(new Date());
  const [strategy, setStrategy] = useState<string>(() => 
    CLINICAL_MANTRAS[Math.floor(Math.random() * CLINICAL_MANTRAS.length)]
  );
  const [isThinking, setIsThinking] = useState(false);
  const [capture, setCapture] = useState('');
  const [isTimerActive, setIsTimerActive] = useState(localStorage.getItem('ess_sw_active') === 'true');
  const [activeTask, setActiveTask] = useState(localStorage.getItem('ess_sw_task') || 'IDLE');

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      setIsTimerActive(localStorage.getItem('ess_sw_active') === 'true');
      setActiveTask(localStorage.getItem('ess_sw_task') || 'IDLE');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchNeuralStrategy = async () => {
    setIsThinking(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Give a 6-word productivity directive. Nothing OS style.`,
      });
      const text = response.text?.trim();
      if (text) setStrategy(text.replace(/"/g, ''));
    } catch (e) {
      setStrategy(CLINICAL_MANTRAS[Math.floor(Math.random() * CLINICAL_MANTRAS.length)]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleCaptureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!capture.trim()) return;
    const logs = JSON.parse(localStorage.getItem('ess_logic_ledger') || '[]');
    logs.unshift({ id: Date.now(), text: capture, time: new Date().toISOString() });
    localStorage.setItem('ess_logic_ledger', JSON.stringify(logs.slice(0, 50)));
    setCapture('');
  };

  const calculateWorkdayProgress = () => {
    const now = time.getHours() + time.getMinutes() / 60;
    const start = 9;
    const end = 22;
    if (now < start) return 0;
    if (now > end) return 100;
    return ((now - start) / (end - start)) * 100;
  };

  const dayLabel = time.toLocaleDateString('en-GB', { weekday: 'short' }).toUpperCase();
  const dateLabel = time.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase();

  return (
    <div className="space-y-6 animate-nothing max-w-2xl mx-auto pb-24">
      {/* Top System Hub */}
      <div className="glass-card p-7 min-h-[140px] flex flex-col justify-between relative overflow-hidden">
        <div className="flex justify-between items-start z-10">
          <div className="flex-1 pr-6" onClick={fetchNeuralStrategy}>
            <div className="flex items-center gap-2 mb-3 cursor-pointer group">
              <div className={`w-1 h-1 rounded-full ${isThinking ? 'bg-white animate-pulse' : 'nothing-red-bg shadow-[0_0_8px_red]'}`} />
              <span className="text-[7px] uppercase tracking-[0.4em] text-zinc-600 font-black dot-matrix group-hover:text-zinc-400 transition-colors">Neural_Directive</span>
            </div>
            <h2 className="text-xl md:text-2xl font-medium tracking-tight text-zinc-100 leading-tight">
              {strategy}
            </h2>
          </div>

          <div className="flex flex-col items-end shrink-0 pt-1">
            <Hourglass progress={calculateWorkdayProgress()} isActive={true} />
            <div className="mt-3 text-right">
              <div className="text-[10px] font-black text-white dot-matrix tracking-widest">{dayLabel}</div>
              <div className="text-[8px] font-bold text-zinc-700 dot-matrix tracking-tighter uppercase">{dateLabel}</div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end mt-6 z-10 border-t border-white/5 pt-4">
           <div className="flex items-center gap-3">
              <div className="text-[7px] uppercase tracking-[0.5em] text-zinc-800 font-black">Ref: 2a_CORE_OS4.0</div>
              <div className="text-[6px] text-zinc-900 dot-matrix font-bold px-1 border border-zinc-900 rounded-sm">PWA_LIVE</div>
           </div>
           <div className="text-[10px] dot-matrix text-zinc-500 tabular-nums font-bold">
             {time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
           </div>
        </div>
      </div>

      {/* Logic Terminal (Capture) */}
      <div className="px-4">
        <form onSubmit={handleCaptureSubmit} className="flex items-center gap-3 py-3 border-b border-zinc-900 focus-within:border-zinc-400 transition-colors">
          <span className="text-[8px] text-zinc-800 font-black dot-matrix">LOG_IN:</span>
          <input 
            type="text"
            value={capture}
            onChange={(e) => setCapture(e.target.value)}
            placeholder="TYPE_SYSTEM_CMD..."
            className="flex-1 bg-transparent text-[11px] font-bold text-zinc-300 outline-none placeholder:text-zinc-900 caret-red-500"
          />
        </form>
      </div>

      {isTimerActive && (
        <div 
          onClick={() => onNavigate('flow')}
          className="mx-2 glass-card p-5 bg-white/5 border-white/10 flex items-center justify-between cursor-pointer active:scale-95 transition-transform"
        >
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-1.5 rounded-full nothing-red-bg animate-pulse shadow-[0_0_10px_red]" />
            <div>
              <p className="text-[7px] uppercase tracking-[0.4em] text-zinc-700 font-bold">Protocol_Active</p>
              <h3 className="text-xs font-bold tracking-tight text-white uppercase dot-matrix">{activeTask}</h3>
            </div>
          </div>
          <span className="text-sm font-bold dot-matrix text-zinc-400">
            {localStorage.getItem('ess_sw_seconds_formatted') || '00:00:00'}
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 px-1">
        <CardItem title="Flow" subtitle="IMMERSION" onClick={() => onNavigate('flow')} active={isTimerActive} />
        <CardItem title="Log" subtitle="LEDGER" onClick={() => onNavigate('timetable')} />
        <CardItem title="Neural" subtitle="SYLLABUS" onClick={() => onNavigate('learning')} />
        <CardItem title="Biotic" subtitle="RECOVERY" onClick={() => onNavigate('acl')} />
      </div>

      <div className="pt-12 opacity-5 flex flex-col items-center">
        <div className="w-[1px] h-20 bg-white mb-4" />
        <span className="text-[6px] uppercase tracking-[1em] font-black text-white">System_Footer_End</span>
      </div>
    </div>
  );
};
