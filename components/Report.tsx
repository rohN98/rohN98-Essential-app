
import React, { useState } from 'react';

export const Report: React.FC = () => {
  const [reportRange, setReportRange] = useState<'Week' | 'Month'>('Week');

  const getHistory = () => {
    const raw = localStorage.getItem('ess_activity_history');
    return raw ? JSON.parse(raw) : [];
  };

  const history = getHistory();
  const rangeDays = reportRange === 'Week' ? 7 : 30;
  
  const lastXDays = [...Array(rangeDays)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const getDayTotal = (date: string) => {
    return history
      .filter((h: any) => h.date === date)
      .reduce((acc: number, h: any) => acc + h.durationSeconds, 0);
  };

  const dayTotals = lastXDays.map(date => ({ date, total: Math.floor(getDayTotal(date) / 60) }));
  const maxMins = Math.max(...dayTotals.map(d => d.total), 60);

  const averageDaily = Math.round(dayTotals.reduce((a, b) => a + b.total, 0) / rangeDays);
  const totalFocus = Math.round(dayTotals.reduce((a, b) => a + b.total, 0));
  const utilizationRate = Math.round((averageDaily / 600) * 100);

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "essential_data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 pb-12">
      <div className="flex gap-2 p-1 bg-zinc-900/50 rounded-2xl border border-zinc-800">
         <button onClick={() => setReportRange('Week')} className={`flex-1 py-3 text-[10px] uppercase tracking-widest font-bold rounded-xl transition-all ${reportRange === 'Week' ? 'bg-zinc-800 text-white' : 'text-zinc-600'}`}>Weekly</button>
         <button onClick={() => setReportRange('Month')} className={`flex-1 py-3 text-[10px] uppercase tracking-widest font-bold rounded-xl transition-all ${reportRange === 'Month' ? 'bg-zinc-900 text-white' : 'text-zinc-600'}`}>Monthly</button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900/40 rounded-[2.5rem] border border-zinc-800 p-7 flex flex-col justify-between aspect-square">
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Total Focus</span>
          <span className="text-4xl font-light dot-matrix">{totalFocus}<span className="text-xs text-zinc-600 ml-1">m</span></span>
        </div>
        <div className="bg-zinc-900/40 rounded-[2.5rem] border border-zinc-800 p-7 flex flex-col justify-between aspect-square">
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Avg Rate</span>
          <span className="text-4xl font-light dot-matrix">{utilizationRate}<span className="text-xs text-zinc-600 ml-1">%</span></span>
        </div>
      </div>

      <div className="bg-zinc-900/60 border border-zinc-800/50 rounded-[2.5rem] p-8 space-y-6">
        <div className="flex justify-between items-center">
           <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-500 dot-matrix">{reportRange} Utilization Chart</h3>
           <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full nothing-red-bg" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
           </div>
        </div>
        <div className={`h-40 flex items-end justify-between gap-1 px-1 ${reportRange === 'Month' ? 'gap-0.5' : 'gap-2'}`}>
          {dayTotals.map((d, i) => (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-2 group relative">
              <div 
                className={`w-full rounded-t-lg transition-all duration-700 ${d.total > 0 ? (i === dayTotals.length - 1 ? 'bg-[#4ADE80]' : 'bg-white') : 'bg-zinc-800/20'}`}
                style={{ height: `${(d.total / maxMins) * 100}%` }}
              />
              {reportRange === 'Week' && <span className="text-[7px] text-zinc-600 dot-matrix">{d.date.split('-')[2]}</span>}
              
              <div className="absolute -top-10 bg-white text-black text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity font-bold whitespace-nowrap z-20">
                {d.date}: {d.total}m
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-500 dot-matrix ml-2">Activity Breakdown</h3>
        <div className="space-y-2">
           {['learning', 'market', 'rehab', 'timetable', 'stopwatch'].map(cat => {
             const catMins = Math.floor(history.filter((h:any) => h.activityId.includes(cat)).reduce((a:any,b:any) => a+b.durationSeconds, 0)/60);
             if (catMins === 0) return null;
             const share = totalFocus > 0 ? Math.round((catMins / totalFocus) * 100) : 0;
             return (
               <div key={cat} className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-[2rem] space-y-3">
                 <div className="flex items-center justify-between">
                   <span className="text-xs uppercase tracking-widest text-zinc-400 font-bold">{cat}</span>
                   <span className="text-sm dot-matrix text-white">{catMins}m</span>
                 </div>
                 <div className="h-1 bg-zinc-800 rounded-full w-full overflow-hidden">
                    <div className="h-full bg-zinc-500 transition-all duration-1000" style={{ width: `${share}%` }} />
                 </div>
               </div>
             )
           })}
        </div>
      </div>

      <button 
        onClick={exportData}
        className="w-full py-5 bg-zinc-900 border border-zinc-800 rounded-3xl text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-500 hover:text-white hover:border-zinc-500 transition-all active:scale-95"
      >
        Export System History (JSON)
      </button>
    </div>
  );
};
