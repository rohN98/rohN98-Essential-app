
import React, { useState, useEffect, useRef } from 'react';
import { Dashboard } from './components/Dashboard.tsx';
import { Timetable } from './components/Timetable.tsx';
import { SystemInsights } from './components/SystemInsights.tsx';
import { Settings } from './components/Settings.tsx';
import { Learning } from './components/Learning.tsx';
import { Market } from './components/Market.tsx';
import { FocusFlow } from './components/FocusFlow.tsx';
import { ACLChecklist } from './components/ACLChecklist.tsx';

export type View = 'dashboard' | 'timetable' | 'insights' | 'settings' | 'learning' | 'market' | 'flow' | 'acl';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const [isFocusActive, setIsFocusActive] = useState(() => localStorage.getItem('ess_sw_active') === 'true');

  const navigateTo = (view: View) => {
    setCurrentView(view);
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleStorage = () => {
      setIsFocusActive(localStorage.getItem('ess_sw_active') === 'true');
    };
    window.addEventListener('storage', handleStorage);
    const interval = setInterval(handleStorage, 1000);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  const renderView = () => {
    switch(currentView) {
      case 'dashboard': return <Dashboard onNavigate={navigateTo} />;
      case 'timetable': return <Timetable />;
      case 'insights': return <SystemInsights />;
      case 'flow': return <FocusFlow onBack={() => navigateTo('dashboard')} />;
      case 'learning': return <Learning />;
      case 'market': return <Market />;
      case 'acl': return <ACLChecklist />;
      case 'settings': return <Settings onBack={() => navigateTo('dashboard')} onNotifyRequest={() => {}} notifyStatus="default" />;
      default: return <Dashboard onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="h-screen w-screen bg-black overflow-hidden flex flex-col">
      <header className="pt-14 px-10 pb-4 flex justify-between items-center z-40 relative">
        <div onClick={() => navigateTo('dashboard')} className="cursor-pointer active:scale-95 transition-transform group">
          <h1 className="text-lg font-black tracking-tighter dot-matrix uppercase flex items-center gap-1">
            Essential<span className={`transition-all duration-700 ${isFocusActive ? 'nothing-red animate-pulse' : 'text-zinc-900 group-hover:text-zinc-700'}`}>•</span>
          </h1>
        </div>
        <div className="flex gap-3 items-center">
           <div className="text-[6px] font-black text-zinc-800 uppercase tracking-[0.4em]">STABLE_LINK</div>
           <div className={`w-1.5 h-1.5 rounded-full ${isFocusActive ? 'nothing-red-bg' : 'bg-zinc-900'}`} />
        </div>
      </header>

      <main ref={mainScrollRef} className="flex-1 overflow-y-auto no-scrollbar relative z-10 px-6 pt-4 pb-32">
        {renderView()}
      </main>

      <nav className="floating-nav">
        <div className="glass-card rounded-full p-2 flex items-center justify-between shadow-[0_30px_60px_rgba(0,0,0,0.9)] border-white/5 bg-zinc-950/50">
          <button onClick={() => navigateTo('dashboard')} className={`flex-1 py-4 rounded-full text-[8px] uppercase tracking-[0.4em] font-black transition-all ${currentView === 'dashboard' ? 'bg-white text-black' : 'text-zinc-700 hover:text-zinc-500'}`}>Core</button>
          <button onClick={() => navigateTo('insights')} className={`flex-1 py-4 rounded-full text-[8px] uppercase tracking-[0.4em] font-black transition-all ${currentView === 'insights' ? 'bg-white text-black' : 'text-zinc-700 hover:text-zinc-500'}`}>Log</button>
          <button onClick={() => navigateTo('flow')} className={`flex-1 py-4 rounded-full text-[8px] uppercase tracking-[0.4em] font-black transition-all ${currentView === 'flow' ? 'bg-white text-black' : 'nothing-red hover:opacity-80'}`}>Flow</button>
          <button onClick={() => navigateTo('settings')} className={`w-12 h-12 flex items-center justify-center rounded-full transition-all active:scale-90 ${currentView === 'settings' ? 'bg-white text-black' : 'text-zinc-800 hover:text-white'}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;
