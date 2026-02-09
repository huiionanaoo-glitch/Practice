
import React from 'react';
import { UserProgress, UserTitle } from '../types';
import { HEXAGRAMS } from '../constants';

interface ProfileProps {
  progress: UserProgress[];
}

const Profile: React.FC<ProfileProps> = ({ progress }) => {
  const masteredCount = progress.filter(p => p.mastery === 'MASTERED').length;
  const avgResponse = progress.length > 0 
    ? (progress.reduce((acc, p) => acc + p.responseTimeMs, 0) / progress.length / 1000).toFixed(1) 
    : "0.0";
  const accuracy = progress.length > 0 
    ? (100 - (progress.reduce((acc, p) => acc + p.errorCount, 0) / (progress.length + 1) * 10)).toFixed(1) 
    : "100";

  const getTitle = (count: number): UserTitle => {
    if (count >= 64) return UserTitle.YI_SHENG;
    if (count >= 48) return UserTitle.ZONG_SHI;
    if (count >= 36) return UserTitle.HAN_LIN;
    if (count >= 24) return UserTitle.JIN_SHI;
    if (count >= 12) return UserTitle.JU_REN;
    if (count >= 4) return UserTitle.XIU_CAI;
    return UserTitle.TONG_SHENG;
  };

  const currentTitle = getTitle(masteredCount);

  const achievements = [
    { name: '初窥门径', icon: '🌱', unlocked: masteredCount >= 1 },
    { name: '略有薄名', icon: '📜', unlocked: masteredCount >= 10 },
    { name: '登堂入室', icon: '🏛️', unlocked: masteredCount >= 32 },
    { name: '易理圆通', icon: '☯️', unlocked: masteredCount >= 64 },
  ];

  return (
    <div className="space-y-8 py-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Profile Header */}
      <section className="relative bg-[#FBF9F5] rounded-xl p-8 border border-[#D4C4A8] shadow-sm flex flex-col items-center">
        <div className="w-20 h-20 bg-[#323232] rounded-full flex items-center justify-center border-4 border-[#9A2B2B] mb-4 shadow-xl">
           <span className="text-3xl text-white font-black">道</span>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black text-[#323232] tracking-widest">{currentTitle}</h2>
        </div>
        
        <div className="absolute top-4 right-4 px-2 py-4 bg-[#9A2B2B] text-white seal-font text-[10px] font-bold shadow-md rounded-sm">
           易林传人
        </div>
      </section>

      {/* Stats Summary */}
      <section className="grid grid-cols-3 gap-4">
        <div className="bg-white/60 p-4 rounded-lg border border-[#D4C4A8] text-center">
          <span className="block text-[10px] text-[#A6937C] font-black mb-1">修习总数</span>
          <span className="text-xl font-black text-[#323232]">{masteredCount}</span>
        </div>
        <div className="bg-white/60 p-4 rounded-lg border border-[#D4C4A8] text-center">
          <span className="block text-[10px] text-[#A6937C] font-black mb-1">辨识均速</span>
          <span className="text-xl font-black text-[#323232]">{avgResponse}s</span>
        </div>
        <div className="bg-white/60 p-4 rounded-lg border border-[#D4C4A8] text-center">
          <span className="block text-[10px] text-[#A6937C] font-black mb-1">神应率</span>
          <span className="text-xl font-black text-[#323232]">{accuracy}%</span>
        </div>
      </section>

      {/* Achievement Wall */}
      <section>
        <h3 className="text-xs font-black text-[#323232] mb-4 flex items-center gap-2 uppercase tracking-widest">
           <span className="w-1.5 h-1.5 bg-[#9A2B2B] rotate-45" />
           修行成就
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {achievements.map((a, idx) => (
            <div 
              key={idx} 
              className={`p-4 rounded-lg border flex items-center gap-3 transition-all ${a.unlocked ? 'bg-white border-[#A6937C] shadow-sm' : 'bg-stone-100 border-stone-200 grayscale opacity-40'}`}
            >
              <span className="text-2xl">{a.icon}</span>
              <div>
                <span className="block text-xs font-black text-[#323232]">{a.name}</span>
                <span className="block text-[9px] text-[#A6937C]">{a.unlocked ? '已达成' : '修行中'}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Master's Insight - Optimized chart text with brighter red label */}
      <section className="p-6 bg-[#323232] rounded-xl text-[#F4F1EA] relative overflow-hidden shadow-2xl border-t border-white/10">
         <div className="absolute top-0 right-0 w-32 h-32 bg-[#9A2B2B]/10 rounded-full blur-2xl" />
         <h4 className="text-[10px] font-black text-[#FF6B6B] mb-3 uppercase tracking-[0.2em] drop-shadow-sm">吾道指引</h4>
         <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
               <span className="text-[#D4C4A8] font-bold">视觉灵敏度</span>
               <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#9A2B2B]" style={{ width: '75%' }} />
               </div>
            </div>
            <div className="flex justify-between items-center text-xs">
               <span className="text-[#D4C4A8] font-bold">逻辑推演力</span>
               <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#9A2B2B]" style={{ width: '45%' }} />
               </div>
            </div>
            <div className="flex justify-between items-center text-xs">
               <span className="text-[#D4C4A8] font-bold">易辞熟悉度</span>
               <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#9A2B2B]" style={{ width: '60%' }} />
               </div>
            </div>
         </div>
      </section>

      <div className="text-center pt-4">
        <button 
          onClick={() => {
            if(confirm('修行路漫漫，确定要清空所有感悟重来吗？')) {
              localStorage.removeItem('yilin_progress');
              window.location.reload();
            }
          }}
          className="text-[9px] font-bold text-[#A6937C] uppercase tracking-[0.2em] border-b border-transparent hover:border-[#9A2B2B] transition-all"
        >
          重置修行进度
        </button>
      </div>
    </div>
  );
};

export default Profile;
