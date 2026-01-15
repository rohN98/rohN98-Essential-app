
import React, { useState } from 'react';
import { SessionTimer } from './SessionTimer';

interface Topic {
  name: string;
  completed: boolean;
  priority: 'High' | 'Med' | 'Low';
  subtasks?: string[];
}

interface Domain {
  title: string;
  topics: Topic[];
}

const initialDS: Domain[] = [
  { 
    title: "Phase 1: Quant Foundations (6:25 - 7:30)", 
    topics: [
      { name: "Linear Algebra & Calculus", completed: true, priority: 'High', subtasks: ["Vector Spaces", "Eigenvalues", "Partial Derivatives"] },
      { name: "Probability & Inferential Stats", completed: false, priority: 'High', subtasks: ["Hypothesis Testing", "Bayes Theorem", "Z-Scores"] },
      { name: "Python for Data Analysis", completed: true, priority: 'High', subtasks: ["Pandas Multi-index", "Matplotlib Styles", "NumPy Vectorization"] }
    ] 
  },
  { 
    title: "Phase 2: Core ML (20:30 - 21:15)", 
    topics: [
      { name: "Supervised Learning Models", completed: false, priority: 'High', subtasks: ["Random Forest", "XGBoost Tuning", "SVM Kernels"] },
      { name: "Unsupervised Clustering", completed: false, priority: 'Med', subtasks: ["K-Means++", "DBSCAN", "PCA"] }
    ] 
  }
];

const initialFRM: Domain[] = [
  { 
    title: "Part I: Toolset (6:25 - 7:30)", 
    topics: [
      { name: "Foundations of Risk Mgmt", completed: true, priority: 'High', subtasks: ["CAPM", "Arbitrage Pricing", "Risk Typologies"] },
      { name: "Quantitative Analysis", completed: false, priority: 'High', subtasks: ["Monte Carlo", "VAR Methods", "Backtesting"] },
      { name: "Financial Markets", completed: false, priority: 'High', subtasks: ["Futures pricing", "Option Greeks", "Swaps"] }
    ] 
  }
];

export const Learning: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'DS' | 'FRM'>('DS');
  const [dsData, setDsData] = useState(initialDS);
  const [frmData, setFrmData] = useState(initialFRM);

  const toggleTopic = (domainIdx: number, topicIdx: number) => {
    const setter = activeTab === 'DS' ? setDsData : setFrmData;
    setter(prev => prev.map((domain, dIdx) => {
      if (dIdx !== domainIdx) return domain;
      const newTopics = domain.topics.map((topic, tIdx) => 
        tIdx === topicIdx ? { ...topic, completed: !topic.completed } : topic
      );
      return { ...domain, topics: newTopics };
    }));
  };

  const currentData = activeTab === 'DS' ? dsData : frmData;
  const totalTopics = currentData.reduce((acc, d) => acc + d.topics.length, 0);
  const completedTopics = currentData.reduce((acc, d) => acc + d.topics.filter(t => t.completed).length, 0);
  const progress = Math.round((completedTopics / totalTopics) * 100);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 pb-12">
      <SessionTimer activityId={`learning_${activeTab}`} expectedMinutes={65} />

      <div className="flex gap-4">
        <button 
          onClick={() => setActiveTab('DS')}
          className={`flex-1 py-4 rounded-[2rem] border transition-all dot-matrix uppercase tracking-widest text-[10px] font-bold ${activeTab === 'DS' ? 'bg-white text-black border-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
        >
          Data Science
        </button>
        <button 
          onClick={() => setActiveTab('FRM')}
          className={`flex-1 py-4 rounded-[2rem] border transition-all dot-matrix uppercase tracking-widest text-[10px] font-bold ${activeTab === 'FRM' ? 'bg-white text-black border-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
        >
          FRM Exam
        </button>
      </div>

      <div className="space-y-6">
        {currentData.map((domain, dIdx) => (
          <div key={domain.title} className="space-y-3">
            <h4 className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold ml-2">{domain.title}</h4>
            <div className="grid grid-cols-1 gap-3">
              {domain.topics.map((topic, tIdx) => (
                <div key={topic.name} className="p-5 rounded-[1.8rem] border bg-zinc-900/40 border-zinc-800/80">
                  <div 
                    onClick={() => toggleTopic(dIdx, tIdx)}
                    className="flex items-center justify-between cursor-pointer mb-3"
                  >
                    <div className="flex flex-col gap-1">
                      <span className={`text-sm tracking-tight font-medium ${topic.completed ? 'text-zinc-600 line-through' : 'text-zinc-200'}`}>
                        {topic.name}
                      </span>
                      <span className={`text-[8px] uppercase tracking-widest font-bold ${topic.priority === 'High' ? 'nothing-red' : 'text-zinc-600'}`}>
                        {topic.priority} Priority
                      </span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${topic.completed ? 'bg-white border-white' : 'border-zinc-700'}`}>
                      {topic.completed && <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                    </div>
                  </div>
                  {topic.subtasks && (
                    <div className="space-y-2 mt-4 pl-2 border-l border-zinc-800/50">
                       {topic.subtasks.map(s => (
                         <div key={s} className="flex items-center gap-3 text-[10px] text-zinc-500">
                           <div className="w-1 h-1 rounded-full bg-zinc-800" />
                           {s}
                         </div>
                       ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
