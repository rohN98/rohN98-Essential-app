
import React, { useState, useEffect } from 'react';

interface SettingsProps {
  onBack: () => void;
  onNotifyRequest: () => void;
  notifyStatus: NotificationPermission;
}

export const Settings: React.FC<SettingsProps> = ({ onBack, onNotifyRequest, notifyStatus }) => {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('ess_logic_ledger') || '[]');
    setLogs(saved);
  }, []);

  const clearLogs = () => {
    if(confirm("Wipe Logic Ledger?")) {
      localStorage.removeItem('ess_logic_ledger');
      setLogs([]);
    }
  };

  return (
    <div className="animate-nothing space-y-10 pb-32">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold tracking-tighter uppercase dot-matrix">System</h2>
        <div className="flex gap-2">
           <div className="w-1.5 h-1.5 rounded-full nothing-red-bg" />
           <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
        </div>
      </div>

      {/* Logic Ledger Section */}
      <section className="space-y-4">
        <div className="flex justify-between items-center ml-4">
          <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-zinc-600 dot-matrix">Logic_Ledger</h3>
          <button onClick={clearLogs} className="text-[7px] text-zinc-800 uppercase font-black hover:text-red-500">Wipe_Archive</button>
        </div>
        <div className="space-y-2 max-h-[300px] overflow-y-auto no-scrollbar">
           {logs.length === 0 ? (
             <div className="glass-card p-8 text-center opacity-20 text-[8px] uppercase tracking-widest font-bold">No Records Captured</div>
           ) : (
             logs.map(log => (
               <div key={log.id} className="glass-card p-5 space-y-2">
                 <p className="text-xs font-medium text-white">{log.text}</p>
                 <div className="flex justify-between items-center">
                   <span className="text-[8px] text-zinc-700 font-bold dot-matrix">{new Date(log.time).toLocaleTimeString()}</span>
                   <span className="text-[7px] text-zinc-800 font-black uppercase tracking-widest">Entry_{log.id.toString().slice(-4)}</span>
                 </div>
               </div>
             ))
           )}
        </div>
      </section>

      {/* System Actions */}
      <div className="space-y-4">
         <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-zinc-600 ml-4 dot-matrix">Maintenance</h3>
         <button 
           onClick={() => { if(confirm("Refresh Cache?")) window.location.reload(); }}
           className="w-full py-6 glass-card text-zinc-500 font-bold text-[10px] uppercase tracking-[0.5em] active:text-white"
         >
           Flush System Buffer
         </button>
      </div>

      <button 
          onClick={onBack}
          className="w-full py-6 rounded-[3rem] bg-white text-black font-bold uppercase text-xs tracking-[0.4em] shadow-2xl active:scale-95 transition-transform"
      >
          Synchronize
      </button>
    </div>
  );
};
