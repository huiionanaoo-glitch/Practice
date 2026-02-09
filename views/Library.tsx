
import React, { useState, useEffect, useMemo } from 'react';
import { HEXAGRAMS } from '../constants';
import HexagramIcon from '../components/HexagramIcon';
import { Hexagram } from '../types';

const Library: React.FC = () => {
  const [baseHex, setBaseHex] = useState<Hexagram>(HEXAGRAMS[0]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeTransform, setActiveTransform] = useState<'ZONG' | 'CUO' | null>(null);

  useEffect(() => {
    setIsFlipped(false);
    setActiveTransform(null);
  }, [baseHex]);

  const toggleHex = (id: number) => {
    const hex = HEXAGRAMS.find(h => h.id === id);
    if (hex) setBaseHex(hex);
  };

  const getZongBinary = (bin: string) => bin.split('').reverse().join('');
  const getCuoBinary = (bin: string) => bin.split('').map(b => b === '1' ? '0' : '1').join('');

  const displayHex = useMemo(() => {
    if (!activeTransform) return baseHex;
    
    const targetBin = activeTransform === 'ZONG' 
      ? getZongBinary(baseHex.binary) 
      : getCuoBinary(baseHex.binary);
      
    const target = HEXAGRAMS.find(h => h.binary === targetBin);
    return target || baseHex;
  }, [baseHex, activeTransform]);

  const handleTransformClick = (type: 'ZONG' | 'CUO') => {
    setActiveTransform(prev => prev === type ? null : type);
  };

  return (
    <div className="space-y-10 py-4 flex flex-col items-center">
      {/* 优化后的滑动选择栏 */}
      <div className="w-full overflow-x-auto scroll-hide border-b border-[#A6937C]/20 snap-x snap-mandatory">
        <div className="flex gap-4 py-6 px-6 min-w-max">
          {HEXAGRAMS.map(h => (
            <button
              key={h.id}
              onClick={() => toggleHex(h.id)}
              className={`flex-shrink-0 w-12 h-12 rounded-full border transition-all flex flex-col items-center justify-center snap-center ${baseHex.id === h.id ? 'bg-[#9A2B2B] text-[#F4F1EA] border-[#9A2B2B] shadow-lg scale-110' : 'bg-white/40 text-[#A6937C] border-[#D4C4A8] hover:border-[#A6937C]'}`}
            >
              <span className="text-sm font-black">{h.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 主卡片 */}
      <div 
        className="card-flip w-full max-w-[320px] aspect-[10/14] cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`card-inner w-full h-full relative ${isFlipped ? 'is-flipped' : ''}`}>
          <div className="card-face absolute inset-0 bg-[#FBF9F5] rounded-lg p-10 flex flex-col items-center justify-between border border-[#D4C4A8] shadow-2xl overflow-hidden">
             <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#9A2B2B]/40" />
             <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#9A2B2B]/40" />
             
             <div className="absolute top-6 right-6 p-2">
                <span className="text-[#A6937C] font-serif italic text-4xl opacity-10">{displayHex.sequence.toString().padStart(2, '0')}</span>
             </div>
             
             <div className="mt-8 transition-all duration-500 transform">
                <HexagramIcon binary={displayHex.binary} size="xl" />
             </div>
             
             <div className="text-center space-y-4 mb-6">
                <div className="relative inline-block px-4">
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-[#A6937C]/20" />
                  <div className="relative bg-[#FBF9F5] px-2 flex flex-col items-center">
                    {activeTransform && (
                      <span className="text-[10px] text-[#9A2B2B] font-black tracking-[0.3em] mb-1 animate-pulse">
                        {activeTransform === 'ZONG' ? '综 卦' : '错 卦'}
                      </span>
                    )}
                    <h2 className="text-5xl font-black text-[#323232] tracking-[0.3em]">{displayHex.name}</h2>
                  </div>
                </div>
                <p className="text-xs text-[#A6937C] font-bold tracking-[0.5em] uppercase">{displayHex.meaning}</p>
             </div>
          </div>

          {/* 背面：文辞 */}
          <div className="card-face card-back absolute inset-0 bg-[#323232] text-[#F4F1EA] rounded-lg p-10 border border-[#A6937C]/40 shadow-2xl flex flex-col justify-between">
             <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-[#A6937C]/40 pb-3">
                   <span className="text-[10px] text-[#D4C4A8] font-black uppercase tracking-widest">卦辞</span>
                   <span className="text-[10px] bg-[#9A2B2B] text-white px-2 py-0.5 rounded-sm font-bold shadow-sm">{displayHex.palace}</span>
                </div>
                <p className="text-xl leading-relaxed font-black tracking-wide text-white">{displayHex.guaci}</p>
                
                <div className="pt-2">
                   <span className="text-[10px] text-[#D4C4A8] font-black uppercase tracking-widest block mb-2">彖曰</span>
                   <p className="text-sm text-[#F4F1EA] leading-relaxed italic">{displayHex.tuanzhuan}</p>
                </div>
             </div>

             <div className="flex justify-between items-end">
                <div className="text-[9px] text-[#A6937C] flex gap-6">
                   <div className="flex flex-col">
                      <span className="text-[#D4C4A8]">上卦: <span className="text-white">{displayHex.upperTrigram}</span></span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[#D4C4A8]">下卦: <span className="text-white">{displayHex.lowerTrigram}</span></span>
                   </div>
                </div>
                <div className="font-serif italic text-xl text-[#A6937C]">易</div>
             </div>
          </div>
        </div>
      </div>

      {/* 变换按钮 */}
      <div className="flex gap-6 w-full px-4">
         <button 
           onClick={(e) => { e.stopPropagation(); handleTransformClick('ZONG'); }}
           className={`flex-1 py-4 border rounded-sm text-xs font-black flex flex-col items-center justify-center gap-1 shadow-sm transition-all active:scale-95 ${activeTransform === 'ZONG' ? 'bg-[#323232] text-white border-[#323232] ring-2 ring-[#9A2B2B]/20' : 'bg-white/60 border-[#D4C4A8] text-[#323232] hover:bg-white hover:border-[#A6937C]'}`}
         >
           <span className="text-lg">{activeTransform === 'ZONG' ? '🎯' : '🔄'}</span>
           <span>综卦 (反)</span>
         </button>
         <button 
           onClick={(e) => { e.stopPropagation(); handleTransformClick('CUO'); }}
           className={`flex-1 py-4 border rounded-sm text-xs font-black flex flex-col items-center justify-center gap-1 shadow-sm transition-all active:scale-95 ${activeTransform === 'CUO' ? 'bg-[#323232] text-white border-[#323232] ring-2 ring-[#9A2B2B]/20' : 'bg-white/60 border-[#D4C4A8] text-[#323232] hover:bg-white hover:border-[#A6937C]'}`}
         >
           <span className="text-lg">{activeTransform === 'CUO' ? '🎯' : '🌓'}</span>
           <span>错卦 (变)</span>
         </button>
      </div>
    </div>
  );
};

export default Library;
