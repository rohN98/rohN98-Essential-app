
import React, { useState, useEffect } from 'react';
import { SessionTimer } from './SessionTimer';

interface Phase {
  id: number;
  name: string;
  timeline: string;
  exercises: string[];
}

const initialPhases: Phase[] = [
  { id: 1, name: "Phase 1: Protection", timeline: "Week 0–4", exercises: ["Ankle Pumps (3x20)", "Quad Sets (3x15)", "Heel Slides (3x15)", "Straight Leg Raises (3x12)", "Passive Extension (5-10m)"] },
  { id: 2, name: "Phase 2: Strength", timeline: "Month 2–3", exercises: ["Mini Squats (3x12)", "Hamstring Curls (3x12)", "Step-Ups (3x10)", "Glute Bridges (3x15)", "Stationary Cycling (15-25m)"] },
];

export const ACLChecklist: React.FC = () => {
  const [phases, setPhases] = useState<Phase[]>(() => {
    const saved = localStorage.getItem('ess_acl');
    return saved ? JSON.parse(saved) : initialPhases;
  });
  const [activePhaseId, setActivePhaseId] = useState(1);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const activePhase = phases.find(p => p.id === activePhaseId)!;
  const toggleCheck = (item: string) => setChecked(p => ({ ...p, [item]: !p[item] }));

  return (
    <div className="animate-in fade-in space-y-8 pb-12">
      <SessionTimer activityId={`rehab_phase_${activePhaseId}`} expectedMinutes={30} />
      
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar" role="tablist" aria-label="Rehabilitation Phases">
        {phases.map(p => (
          <button 
            key={p.id} 
            role="tab"
            aria-selected={activePhaseId === p.id}
            onClick={() => setActivePhaseId(p.id)} 
            className={`px-5 py-3 rounded-full text-[10px] font-bold uppercase border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${activePhaseId === p.id ? 'bg-white text-black border-white' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}
          >
            Phase {p.id}
          </button>
        ))}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] space-y-4" role="tabpanel" aria-label={activePhase.name}>
        <h3 className="text-xl font-bold">{activePhase.name}</h3>
        <div className="space-y-4">
          {activePhase.exercises.map(ex => (
            <div 
              key={ex} 
              onClick={() => toggleCheck(ex)} 
              role="checkbox"
              aria-checked={checked[ex] || false}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggleCheck(ex); } }}
              className="flex items-center gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-black focus-visible:ring-white rounded-lg p-1"
            >
              <div className={`w-6 h-6 rounded border transition-all flex items-center justify-center ${checked[ex] ? 'bg-white border-white' : 'border-zinc-700'}`} aria-hidden="true">
                {checked[ex] && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
              <span className={`text-sm ${checked[ex] ? 'text-zinc-600 line-through' : 'text-zinc-200'}`}>{ex}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
