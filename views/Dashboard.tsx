
import React, { useMemo } from 'react';
import { UserProgress, MasteryLevel, UserTitle } from '../types';
import { HEXAGRAMS } from '../constants';

interface DashboardProps {
  progress: UserProgress[];
}

const Dashboard: React.FC<DashboardProps> = ({ progress }) => {
  const masteredCount = progress.filter(p => p.mastery === 'MASTERED').length;
  const weakCount = progress.filter(p => p.mastery === 'WEAK').length;
  const unstableCount = progress.filter(p => p.mastery === 'UNSTABLE').length;

  const titleConfigs = [
    { title: UserTitle.TONG_SHENG, threshold: 0 },
    { title: UserTitle.XIU_CAI, threshold: 4 },
    { title: UserTitle.JU_REN, threshold: 12 },
    { title: UserTitle.JIN_SHI, threshold: 24 },
    { title: UserTitle.HAN_LIN, threshold: 36 },
    { title: UserTitle.ZONG_SHI, threshold: 48 },
    { title: UserTitle.YI_SHENG, threshold: 64 },
  ];

  const { currentTitle, nextTitle, neededForNext } = useMemo(() => {
    let current = titleConfigs[0].title;
    let next = titleConfigs[1].title;
    let needed = titleConfigs[1].threshold - masteredCount;

    for (let i = 0; i < titleConfigs.length; i++) {
      if (masteredCount >= titleConfigs[i].threshold) {
        current = titleConfigs[i].title;
        if (i < titleConfigs.length - 1) {
          next = titleConfigs[i+1].title;
          needed = titleConfigs[i+1].threshold - masteredCount;
        } else {
          next = UserTitle.YI_SHENG;
          needed = 0;
        }
      }
    }
    return { currentTitle: current, nextTitle: next, neededForNext: Math.max(0, needed) };
  }, [masteredCount]);

  const dailyQuotes = [
    "天行健，君子以自强不息。",
    "地势坤，君子以厚德载物。",
    "穷则变，变则通，通则久。",
    "顺天应人，随时而动。",
    "积善之家，必有余庆。",
    "其亡其亡，系于苞桑。"
  ];

  const randomQuote = useMemo(() => dailyQuotes[Math.floor(Math.random() * dailyQuotes.length)], []);

  const getMasteryColor = (level: MasteryLevel) => {
    switch (level) {
      case 'MASTERED': return 'bg-[#2D5133]'; 
      case 'UNSTABLE': return 'bg-[#A6937C]'; 
      case 'WEAK': return 'bg-[#9A2B2B]';     
      default: return 'bg-[#D4C4A8]/40';      
    }
  };

  return (
    <div className="space-y-8 py-4 animate-in fade-in duration-700">
      {/* 修为卡片 */}
      <section className="bg-white/70 backdrop-blur-md rounded-lg p-8 border border-[#A6937C]/20 shadow-sm relative overflow-hidden">
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-[#9A2B2B]/5 rounded-full blur-3xl" />
        
        <div className="flex justify-between items-start">
          <div className="flex gap-4">
            <div className="px-1.5 py-4 bg-[#9A2B2B] text-[#F4F1EA] seal-font text-xs font-bold rounded-sm shadow-md">
              修为境界
            </div>
            <div className="flex flex-col">
              <h2 className="text-4xl font-black text-[#323232] mt-1 tracking-widest">{currentTitle}</h2>
              <div className="mt-2 space-y-0.5">
                <p className="text-[10px] text-[#A6937C] font-bold tracking-wider">
                  {neededForNext > 0 ? `下一境界：${nextTitle}` : '已至巅峰之境'}
                </p>
                {neededForNext > 0 && (
                  <p className="text-[9px] text-[#A6937C]/60 italic">尚需圆满 {neededForNext} 卦</p>
                )}
              </div>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
             <div className="flex items-baseline">
               <span className="text-3xl font-black text-[#9A2B2B]">{masteredCount}</span>
               <span className="text-xs text-[#A6937C] font-bold ml-1">/ 64</span>
             </div>
             <span className="text-[8px] text-[#A6937C] uppercase tracking-tighter mt-1">卦象圆满度</span>
          </div>
        </div>
        
        <div className="mt-8 flex gap-1 h-1 rounded-full overflow-hidden bg-[#D4C4A8]/20">
          <div className="bg-[#2D5133] h-full transition-all duration-1000" style={{ width: `${(masteredCount/64)*100}%` }} />
          <div className="bg-[#A6937C] h-full transition-all duration-1000" style={{ width: `${(unstableCount/64)*100}%` }} />
          <div className="bg-[#9A2B2B] h-full transition-all duration-1000" style={{ width: `${(weakCount/64)*100}%` }} />
        </div>
      </section>

      {/* 新增：易道语录模块 */}
      <section className="relative px-4 py-6 border-y border-[#A6937C]/10 flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center text-8xl font-black select-none">
          易
        </div>
        <div className="w-1 h-6 bg-[#9A2B2B]/20 mb-4" />
        <p className="text-sm font-bold text-[#323232]/80 tracking-[0.2em] leading-loose text-center max-w-[80%] italic">
          「 {randomQuote} 」
        </p>
        <div className="w-1 h-6 bg-[#9A2B2B]/20 mt-4" />
      </section>

      {/* 记忆热力图 */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-black text-[#323232] flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-[#9A2B2B] rotate-45" />
            易象记忆图谱
          </h3>
          <div className="flex gap-3 text-[9px] text-[#A6937C] font-bold uppercase tracking-tighter">
            <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 bg-[#D4C4A8]/40 border border-[#A6937C]/10" />未悟</div>
            <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 bg-[#9A2B2B] border border-white/10" />难点</div>
            <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 bg-[#2D5133] border border-white/10" />圆满</div>
          </div>
        </div>
        <div className="grid grid-cols-8 gap-2 p-5 bg-[#D4C4A8]/5 rounded-xl border border-[#D4C4A8]/20">
          {HEXAGRAMS.map(h => {
            const p = progress.find(item => item.hexagramId === h.id);
            return (
              <div 
                key={h.id} 
                className={`aspect-square rounded-[1px] ${getMasteryColor(p?.mastery || 'UNTOUCHED')} transition-all hover:scale-125 hover:z-10 cursor-pointer relative group border border-white/5 shadow-sm`}
              >
                <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#323232] text-[#F4F1EA] text-[10px] rounded-sm whitespace-nowrap z-20 shadow-xl border border-[#A6937C]">
                  {h.sequence}. {h.name}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 每日挑战 */}
      <section className="bg-[#323232] rounded-xl p-6 text-[#F4F1EA] flex items-center justify-between border-t border-[#A6937C]/30 shadow-2xl relative group overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#9A2B2B] group-hover:w-2 transition-all" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-white/5 skew-x-[-20deg] translate-x-16 group-hover:translate-x-8 transition-transform" />
        
        <div className="space-y-1 pl-4 z-10">
          <h4 className="text-lg font-bold tracking-wider text-white">今日宜：攻破重难点</h4>
          <p className="text-[9px] text-[#A6937C] font-bold tracking-widest">精准复习 · 强化记忆</p>
        </div>
        <button className="px-6 py-2 bg-[#9A2B2B] hover:bg-[#B22222] text-white rounded-sm text-xs font-black transition-all shadow-lg active:scale-95 border border-white/10 uppercase tracking-widest z-10">
          启程
        </button>
      </section>
    </div>
  );
};

export default Dashboard;
