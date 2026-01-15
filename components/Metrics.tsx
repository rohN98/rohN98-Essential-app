
import React, { useState, useEffect } from 'react';

interface Habit {
  id: string;
  name: string;
  done: boolean;
}

interface Stat {
  id: string;
  label: string;
  val: string;
  target: string;
}

const initialHabits: Habit[] = [
  { id: '1', name: 'Sleep ≥ 6h', done: true },
  { id: '2', name: 'Exercise', done: true },
  { id: '3', name: 'Meditation', done: true },
  { id: '4', name: 'Study Done', done: true },
];

const initialStats: Stat[] = [
  { id: '1', label: 'DS Hours/Week', val: '12.5', target: '15' },
  { id: '2', label: 'FRM Questions', val: '45', target: '50' },
  { id: '3', label: 'Projects Done', val: '2', target: '3' },
];

export const Metrics: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('ess_habits');
    return saved ? JSON.parse(saved) : initialHabits;
  });
  const [stats, setStats] = useState<Stat[]>(() => {
    const saved = localStorage.getItem('ess_stats');
    return saved ? JSON.parse(saved) : initialStats;
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newHabit, setNewHabit] = useState('');
  const [newStat, setNewStat] = useState({ label: '', target: '' });

  useEffect(() => {
    localStorage.setItem('ess_habits', JSON.stringify(habits));
    localStorage.setItem('ess_stats', JSON.stringify(stats));
  }, [habits, stats]);

  const toggleHabit = (id: string) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, done: !h.done } : h));
  };

  const removeHabit = (id: string) => setHabits(prev => prev.filter(h => h.id !== id));
  const removeStat = (id: string) => setStats(prev => prev.filter(s => s.id !== id));

  const addHabit = () => {
    if (!newHabit) return;
    setHabits(prev => [...prev, { id: Date.now().toString(), name: newHabit, done: false }]);
    setNewHabit('');
  };

  const addStat = () => {
    if (!newStat.label || !newStat.target) return;
    setStats(prev => [...prev, { id: Date.now().toString(), label: newStat.label, val: '0', target: newStat.target }]);
    setNewStat({ label: '', target: '' });
  };

  const updateStatVal = (id: string, val: string) => {
    setStats(prev => prev.map(s => s.id === id ? { ...s, val } : s));
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-6 duration-700 space-y-8 pb-20">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-3xl font-bold tracking-tighter uppercase dot-matrix">Metrics</h2>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          aria-pressed={isEditing}
          className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${isEditing ? 'bg-white text-black border-white' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}
        >
          {isEditing ? 'Done' : 'Edit'}
        </button>
      </div>
      <p className="text-zinc-500 text-xs uppercase tracking-widest">Performance Tracker</p>

      {/* Habits Section */}
      <section aria-labelledby="habits-heading">
        <h3 id="habits-heading" className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-500 mb-4 dot-matrix">Daily Habits</h3>
        <div className="grid grid-cols-2 gap-3" role="group" aria-label="Daily habits list">
          {habits.map(h => (
            <div 
              key={h.id} 
              className="relative p-4 bg-zinc-900/60 rounded-3xl border border-zinc-800/50 flex flex-col justify-between aspect-[1.5/1]"
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-600 line-clamp-1">{h.name}</span>
                {isEditing && (
                  <button 
                    onClick={() => removeHabit(h.id)} 
                    aria-label={`Remove habit: ${h.name}`}
                    className="text-zinc-700 hover:text-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                )}
              </div>
              <div 
                onClick={() => !isEditing && toggleHabit(h.id)} 
                role="checkbox"
                aria-checked={h.done}
                aria-label={`Mark ${h.name} as ${h.done ? 'incomplete' : 'complete'}`}
                tabIndex={isEditing ? -1 : 0}
                onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggleHabit(h.id); } }}
                className={`flex justify-between items-center ${!isEditing ? 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white' : ''} rounded-xl p-1`}
              >
                 <span className={`text-2xl dot-matrix font-light transition-opacity ${h.done ? 'opacity-100' : 'opacity-20'}`} aria-hidden="true">
                    {h.done ? 'YES' : 'NO'}
                 </span>
                 <div className={`w-1.5 h-1.5 rounded-full transition-colors ${h.done ? 'nothing-red-bg' : 'bg-zinc-800'}`} aria-hidden="true"></div>
              </div>
            </div>
          ))}
          {isEditing && (
            <div className="p-4 bg-zinc-900/20 border border-zinc-800 border-dashed rounded-3xl flex flex-col gap-2 aspect-[1.5/1]">
              <input 
                type="text" 
                aria-label="New habit name"
                placeholder="New..." 
                value={newHabit}
                onChange={e => setNewHabit(e.target.value)}
                className="bg-transparent text-[10px] uppercase border-b border-zinc-800 focus:border-white outline-none"
              />
              <button onClick={addHabit} className="text-[10px] font-bold text-zinc-500 uppercase hover:text-white transition-colors focus:outline-none focus-visible:underline">Add Habit</button>
            </div>
          )}
        </div>
      </section>

      {/* Learning Metrics */}
      <section aria-labelledby="learning-stats-heading">
        <h3 id="learning-stats-heading" className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-500 mb-4 dot-matrix">Learning Stats</h3>
        <div className="bg-zinc-900/40 rounded-[2.5rem] border border-zinc-800/50 p-6 space-y-6">
           {stats.map(stat => (
             <div key={stat.id} className="group">
                <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500">{stat.label}</span>
                      {isEditing && (
                        <button 
                          onClick={() => removeStat(stat.id)} 
                          aria-label={`Remove statistic: ${stat.label}`}
                          className="text-zinc-700 hover:text-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-full"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        </button>
                      )}
                    </div>
                    {isEditing ? (
                      <div className="flex gap-2">
                        <input 
                          type="number" 
                          aria-label={`Value for ${stat.label}`}
                          value={stat.val} 
                          onChange={e => updateStatVal(stat.id, e.target.value)}
                          className="bg-transparent w-8 text-right border-b border-zinc-800 focus:border-white outline-none"
                        />
                        <span className="text-zinc-700" aria-hidden="true">/</span>
                        <span className="text-zinc-600" aria-label="Target">{stat.target}</span>
                      </div>
                    ) : (
                      <span className="text-white" aria-label={`Current: ${stat.val} out of ${stat.target}`}>{stat.val} / {stat.target}</span>
                    )}
                </div>
                <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden" role="progressbar" aria-valuenow={Math.min(100, (parseFloat(stat.val)/parseFloat(stat.target))*100)} aria-valuemin={0} aria-valuemax={100} aria-label={`${stat.label} progress`}>
                    <div className="bg-white h-full transition-all duration-1000" style={{ width: `${Math.min(100, (parseFloat(stat.val)/parseFloat(stat.target))*100)}%` }}></div>
                </div>
             </div>
           ))}
           {isEditing && (
             <div className="flex flex-col gap-3 pt-2">
                <input 
                  type="text" 
                  aria-label="New metric label"
                  placeholder="Metric Label" 
                  value={newStat.label}
                  onChange={e => setNewStat(n => ({ ...n, label: e.target.value }))}
                  className="bg-transparent text-[10px] uppercase border-b border-zinc-800 focus:border-white outline-none"
                />
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    aria-label="New metric target"
                    placeholder="Target" 
                    value={newStat.target}
                    onChange={e => setNewStat(n => ({ ...n, target: e.target.value }))}
                    className="flex-1 bg-transparent text-[10px] uppercase border-b border-zinc-800 focus:border-white outline-none"
                  />
                  <button onClick={addStat} className="text-[10px] font-bold text-white uppercase px-5 py-2 bg-zinc-800 rounded-full hover:bg-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white">Add Stat</button>
                </div>
             </div>
           )}
        </div>
      </section>
    </div>
  );
};
