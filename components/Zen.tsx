
import React, { useState, useEffect, useRef } from 'react';
import { format } from 'https://esm.sh/date-fns';

interface ZenProps {
  onBack: () => void;
}

export const Zen: React.FC<ZenProps> = ({ onBack }) => {
  const [time, setTime] = useState(new Date());
  const [swActive, setSwActive] = useState(false);
  const [swSeconds, setSwSeconds] = useState(0);
  const [swTask, setSwTask] = useState('');
  const [ambientMode, setAmbientMode] = useState<'off' | 'brown' | 'rain'>('off');
  const [scale, setScale] = useState(1);
  const [isPinching, setIsPinching] = useState(false);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);
  const pinchStartDistRef = useRef<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
      const active = localStorage.getItem('ess_sw_active') === 'true';
      const seconds = Number(localStorage.getItem('ess_sw_seconds')) || 0;
      const task = localStorage.getItem('ess_sw_task') || '';
      setSwActive(active);
      setSwSeconds(seconds);
      setSwTask(task);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Ambient Soundscape Generator
  useEffect(() => {
    if (ambientMode === 'off') {
      if (noiseNodeRef.current) {
        noiseNodeRef.current.disconnect();
        noiseNodeRef.current = null;
      }
      return;
    }

    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    if (ambientMode === 'brown') {
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Gain adjustment
      }
    } else if (ambientMode === 'rain') {
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    }

    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = ambientMode === 'brown' ? 'lowpass' : 'bandpass';
    filter.frequency.value = ambientMode === 'brown' ? 400 : 1200;
    filter.Q.value = 0.5;

    const gain = ctx.createGain();
    gain.gain.value = 0.05;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    source.start();
    noiseNodeRef.current = source;

    return () => {
      source.stop();
      source.disconnect();
    };
  }, [ambientMode]);

  // Reactive Pinch to Exit Logic
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      pinchStartDistRef.current = dist;
      setIsPinching(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStartDistRef.current !== null) {
      const dist = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      
      // Calculate real-time scale (pinch in = scale down)
      const newScale = Math.min(1.1, Math.max(0.5, dist / pinchStartDistRef.current));
      setScale(newScale);

      // Exit threshold: If scaled down to 70% or less
      if (newScale < 0.7) {
        onBack();
        pinchStartDistRef.current = null;
        setIsPinching(false);
      }
    }
  };

  const handleTouchEnd = () => {
    // Smoothly snap back if not exited
    setIsPinching(false);
    setScale(1);
    pinchStartDistRef.current = null;
  };

  const formatStopwatch = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = swActive ? (swSeconds % 60) / 60 : (time.getSeconds() / 60);
  const strokeDash = 2 * Math.PI * 45;

  return (
    <div 
      className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center overflow-hidden animate-in fade-in duration-1000"
      style={{ 
        transform: `scale(${scale})`, 
        transition: isPinching ? 'none' : 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        opacity: scale < 1 ? Math.max(0.2, scale) : 1
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Immersive Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-30">
          <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] -rotate-90" viewBox="0 0 100 100">
            <circle 
              cx="50" cy="50" r="45" 
              fill="none" 
              stroke="white" 
              strokeWidth="1.5" 
              strokeDasharray={strokeDash}
              strokeDashoffset={strokeDash * (1 - progressPercent)}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
              opacity="0.8"
            />
            <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="0.5" opacity="0.1" />
          </svg>
          
          <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] animate-glyph" viewBox="0 0 100 100">
            <path d="M 50 10 A 40 40 0 0 1 90 50" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="1 3" />
          </svg>
          <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] animate-glyph" style={{ animationDelay: '2s' }} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="none" stroke="white" strokeWidth="0.1" strokeDasharray="5 5" opacity="0.2" />
          </svg>
        </div>
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, #fff 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
      </div>

      <div className="relative z-10 text-center space-y-16">
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-2">
            <div className={`w-1 h-1 rounded-full nothing-red-bg mb-2 ${swActive ? 'animate-ping' : ''}`} />
            <p className="text-[10px] uppercase tracking-[0.6em] text-zinc-600 font-bold dot-matrix">
              {swActive ? `ACTIVE: ${swTask}` : 'OS 4.0 ZEN'}
            </p>
          </div>
          
          <div className="flex flex-col items-center">
             <h1 className="text-9xl font-light tracking-tighter dot-matrix text-white select-none transition-all duration-1000 scale-110">
                {swActive ? formatStopwatch(swSeconds) : format(time, 'HH:mm')}
             </h1>
             {!swActive && (
               <p className="text-zinc-800 tabular-nums font-bold dot-matrix tracking-widest text-xl -mt-4">
                 {format(time, 'ss')}
               </p>
             )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-8">
          <div className="flex gap-4 p-1 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
            {(['off', 'brown', 'rain'] as const).map((mode) => (
              <button 
                key={mode}
                onClick={(e) => { e.stopPropagation(); setAmbientMode(mode); }}
                className={`px-4 py-2 rounded-full text-[8px] uppercase tracking-widest font-bold transition-all ${ambientMode === mode ? 'bg-white text-black' : 'text-zinc-600 hover:text-white'}`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            onClick={onBack}
            aria-label="Exit Zen mode"
            className="group relative flex flex-col items-center gap-4 transition-all hover:opacity-100 opacity-20"
          >
            <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center group-hover:scale-110 group-hover:border-white/40 transition-all duration-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="rotate-180 opacity-50 group-hover:opacity-100 transition-opacity"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
            <span className="text-[9px] uppercase tracking-[0.4em] font-bold text-zinc-600 group-hover:text-white transition-colors">Terminate Focus</span>
            <p className="text-[7px] text-zinc-800 uppercase tracking-widest mt-2 animate-pulse">Pinch screen to exit</p>
          </button>
        </div>
      </div>

      <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-6 opacity-10" aria-hidden="true">
        <div className="w-6 h-[1px] bg-white" />
        <div className="w-1 h-1 rounded-full bg-white" />
        <div className="w-6 h-[1px] bg-white" />
      </div>
    </div>
  );
};
