
import React, { useState, useEffect } from 'react';
import { compareAsc, parse, format, isWithinInterval, addMinutes, startOfToday } from 'https://esm.sh/date-fns@4.1.0';

interface ScheduleItem {
  id: string;
  time: string; // HH:mm format
  task: string;
  category: 'Morning' | 'Workday' | 'Evening';
}

const initialSchedule: ScheduleItem[] = [
  { id: '1', time: '04:00', task: 'Wake up + Hydration', category: 'Morning' },
  { id: '2', time: '04:10', task: 'Meditation (Mindfulness)', category: 'Morning' },
  { id: '3', time: '04:40', task: 'Rehab / Cycling (ACL Safe)', category: 'Morning' },
  { id: '4', time: '09:00', task: 'Deep Work Session 1', category: 'Workday' },
  { id: '5', time: '13:00', task: 'Lunch + Mobility', category: 'Workday' },
  { id: '6', time: '14:00', task: 'Deep Work Session 2', category: 'Workday' },
  { id: '7', time: '20:00', task: 'Dinner + Rest', category: 'Evening' },
  { id: '8', time: '22:00', task: 'Sleep', category: 'Evening' },
];

export const Timetable: React.FC = () => {
  const [schedule, setSchedule] = useState<ScheduleItem[]>(() => {
    const saved = localStorage.getItem('ess_timetable');
    return saved ? JSON.parse(saved) : initialSchedule;
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [newItem, setNewItem] = useState<Omit<ScheduleItem, 'id'>>({ 
    time: '08:00', 
    task: '', 
    category: 'Workday' 
  });

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('ess_timetable', JSON.stringify(schedule));
  }, [schedule]);

  const parseTime = (timeStr: string) => {
    return parse(timeStr, 'HH:mm', startOfToday());
  };

  const sortSchedule = (list: ScheduleItem[]) => {
    return [...list].sort((a, b) => compareAsc(parseTime(a.time), parseTime(b.time)));
  };

  const determineCategory = (time: string): 'Morning' | 'Workday' | 'Evening' => {
    const hour = parseInt(time.split(':')[0]);
    if (hour < 9) return 'Morning';
    if (hour < 18) return 'Workday';
    return 'Evening';
  };

  const addItem = () => {
    if (!newItem.task.trim()) return;
    const item: ScheduleItem = { 
      ...newItem, 
      id: Date.now().toString(),
      category: determineCategory(newItem.time)
    };
    setSchedule(prev => sortSchedule([...prev, item]));
    setNewItem({ time: '08:00', task: '', category: 'Workday' });
  };

  const removeItem = (id: string) => {
    setSchedule(prev => prev.filter(i => i.id !== id));
  };

  const updateItem = (id: string, updates: Partial<ScheduleItem>) => {
    setSchedule(prev => {
      const updated = prev.map(i => {
        if (i.id === id) {
          const newObj = { ...i, ...updates };
          if (updates.time) newObj.category = determineCategory(updates.time);
          return newObj;
        }
        return i;
      });
      return updates.time ? sortSchedule(updated) : updated;
    });
  };

  const getActiveTaskId = () => {
    const sorted = sortSchedule(schedule);
    const now = currentTime;
    
    for (let i = 0; i < sorted.length; i++) {
      const startTime = parseTime(sorted[i].time);
      const nextItem = sorted[i + 1];
      const endTime = nextItem ? parseTime(nextItem.time) : addMinutes(startTime, 60);

      if (isWithinInterval(now, { start: startTime, end: endTime })) {
        return sorted[i].id;
      }
    }
    return null;
  };

  const activeTaskId = getActiveTaskId();

  return (
    <div className="animate-in fade-in slide-in-from-right-6 duration-700 pb-20">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-3xl font-bold tracking-tighter uppercase dot-matrix">Schedule</h2>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className={`text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-full border transition-all active:scale-90 ${isEditing ? 'bg-white text-black border-white' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}
        >
          {isEditing ? 'Done' : 'Modify'}
        </button>
      </div>
      <div className="flex justify-between items-center mb-10">
        <p className="text-zinc-500 text-xs uppercase tracking-widest font-medium">Daily Execution Ledger</p>
        <p className="text-[10px] dot-matrix font-bold text-zinc-600 uppercase tracking-tighter">
          System Time: {format(currentTime, 'HH:mm')}
        </p>
      </div>
      
      {isEditing && (
        <div className="mb-12 p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] space-y-6 animate-in slide-in-from-top-4">
          <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-500 dot-matrix">Add New Entry</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1">
              <input 
                type="time" 
                value={newItem.time} 
                onChange={e => setNewItem(n => ({ ...n, time: e.target.value }))} 
                className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-white text-sm dot-matrix outline-none focus:border-white transition-colors" 
              />
            </div>
            <div className="col-span-2">
              <input 
                type="text" 
                placeholder="Task Description" 
                value={newItem.task} 
                onChange={e => setNewItem(n => ({ ...n, task: e.target.value }))} 
                className="w-full bg-black border border-zinc-800 rounded-2xl p-4 text-white text-sm outline-none focus:border-white transition-colors" 
              />
            </div>
          </div>
          <button 
            onClick={addItem} 
            disabled={!newItem.task}
            className="w-full py-5 bg-white text-black font-bold uppercase text-[10px] tracking-widest rounded-2xl active:scale-95 disabled:opacity-30 transition-all hover:bg-zinc-200"
          >
            Append to Ledger
          </button>
        </div>
      )}

      <div className="relative border-l border-zinc-900 ml-4 pl-10 space-y-12">
        {schedule.map((item) => {
          const isActive = item.id === activeTaskId;
          return (
            <div key={item.id} className={`relative group transition-all duration-500 ${isActive ? 'scale-[1.02]' : ''}`}>
              <div className={`absolute -left-[49px] top-1.5 w-4 h-4 rounded-full border-2 bg-black transition-all duration-700 ${isActive ? 'border-[#4ADE80] scale-125 shadow-[0_0_12px_rgba(74,222,128,0.4)]' : item.category === 'Evening' ? 'border-[#FF2E2E]' : 'border-zinc-800'}`} />
              <div className="flex justify-between items-start w-full">
                <div className="flex-1">
                  {isEditing ? (
                    <div className="p-6 bg-zinc-900/30 border border-zinc-800/40 rounded-[2rem] space-y-4 animate-in zoom-in-95">
                      <div className="flex items-center gap-4">
                        <input 
                          type="time" 
                          value={item.time} 
                          onChange={e => updateItem(item.id, { time: e.target.value })} 
                          className="bg-black border border-zinc-800 rounded-xl px-3 py-2 text-white dot-matrix text-xs outline-none focus:border-white" 
                        />
                        <span className="text-[9px] uppercase tracking-widest text-zinc-600 font-bold">{item.category}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <input 
                          type="text" 
                          value={item.task} 
                          onChange={e => updateItem(item.id, { task: e.target.value })} 
                          className="flex-1 bg-transparent border-b border-zinc-800 text-white font-medium py-1 outline-none focus:border-white transition-all" 
                        />
                        <button onClick={() => removeItem(item.id)} className="p-2 text-zinc-600 hover:text-red-500 transition-colors active:scale-75">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={`py-1 rounded-2xl transition-all duration-500 ${isActive ? 'bg-zinc-900/40 p-6 -m-4 border border-zinc-800/50 shadow-xl' : ''}`}>
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`text-[10px] dot-matrix font-bold tracking-widest ${isActive ? 'text-[#4ADE80]' : item.category === 'Evening' ? 'nothing-red' : 'text-zinc-600'}`}>
                          {item.time}
                        </span>
                        {isActive && <span className="text-[8px] bg-[#4ADE80] text-black px-2 py-0.5 rounded-full font-black uppercase tracking-tighter animate-pulse">Active Now</span>}
                      </div>
                      <h3 className={`text-xl font-medium tracking-tight transition-colors ${isActive ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>
                        {item.task}
                      </h3>
                      <p className={`text-[8px] uppercase tracking-[0.4em] mt-2 font-bold ${isActive ? 'text-zinc-400' : 'text-zinc-700'}`}>{item.category}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
