
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { HEXAGRAMS } from '../constants';
import { QuizQuestion } from '../types';
import HexagramIcon from '../components/HexagramIcon';
import { getQuizHint } from '../services/geminiService';

interface TestArenaProps {
  onResult: (hexId: number, isCorrect: boolean, responseTime: number) => void;
}

const TestArena: React.FC<TestArenaProps> = ({ onResult }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get('mode') || 'visual';

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [hint, setHint] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const generateQuestions = () => {
      const qSet: QuizQuestion[] = [];
      const shuffledHex = [...HEXAGRAMS].sort(() => Math.random() - 0.5).slice(0, 10);

      shuffledHex.forEach(h => {
        let question: QuizQuestion;
        const distractors = HEXAGRAMS.filter(x => x.id !== h.id).sort(() => Math.random() - 0.5).slice(0, 3);
        const options = [h.name, ...distractors.map(d => d.name)].sort(() => Math.random() - 0.5);

        if (mode === 'visual') {
          question = {
            type: 'VISUAL',
            question: '观此象，为何卦？',
            options,
            answerIndex: options.indexOf(h.name),
            hexagramId: h.id,
            explanation: `此为【${h.name}】。上${h.upperTrigram}下${h.lowerTrigram}，${h.nature}。`
          };
        } else if (mode === 'structure') {
          const isUpper = Math.random() > 0.5;
          const trigramOptions = ['乾', '兑', '离', '震', '巽', '坎', '艮', '坤'];
          question = {
            type: 'STRUCTURE',
            question: `【${h.name}】之${isUpper ? '上' : '下'}卦为何？`,
            options: trigramOptions,
            answerIndex: trigramOptions.indexOf(isUpper ? h.upperTrigram : h.lowerTrigram),
            hexagramId: h.id,
            explanation: `【${h.name}】卦，上${h.upperTrigram}下${h.lowerTrigram}。`
          };
        } else {
          question = {
            type: 'TEXT',
            question: `识其辞：${h.guaci.substring(0, 20)}...`,
            options,
            answerIndex: options.indexOf(h.name),
            hexagramId: h.id,
            explanation: `此语出自【${h.name}】卦辞。`
          };
        }
        qSet.push(question);
      });
      setQuestions(qSet);
    };

    generateQuestions();
    const timer = setTimeout(() => setShowIntro(false), 2000);
    return () => clearTimeout(timer);
  }, [mode]);

  useEffect(() => {
    if (!showIntro) setStartTime(Date.now());
  }, [showIntro, currentIndex]);

  const handleAnswer = (idx: number) => {
    if (isAnswered) return;
    const timeTaken = Date.now() - startTime;
    setSelectedAnswer(idx);
    setIsAnswered(true);
    const isCorrect = idx === questions[currentIndex].answerIndex;
    onResult(questions[currentIndex].hexagramId, isCorrect, timeTaken);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setHint(null);
    } else {
      navigate('/');
    }
  };

  const fetchHint = async () => {
    const q = questions[currentIndex];
    const hex = HEXAGRAMS.find(h => h.id === q.hexagramId);
    if (hex) setHint(await getQuizHint(hex.name, hex.upperTrigram, hex.lowerTrigram));
  };

  if (showIntro) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center animate-pulse">
        <div className="w-32 h-32 border-2 border-[#A6937C]/40 rounded-full flex items-center justify-center animate-taiji">
          <div className="w-16 h-16 bg-[#323232] rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-[#F4F1EA] rounded-full translate-x-2"></div>
          </div>
        </div>
        <h2 className="mt-10 text-3xl font-black tracking-[1em] text-[#323232] translate-x-[0.5em]">静·悟</h2>
      </div>
    );
  }

  if (questions.length === 0) return null;
  const currentQ = questions[currentIndex];
  const hex = HEXAGRAMS.find(h => h.id === currentQ.hexagramId);

  return (
    <div className="py-6 space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex justify-between items-center px-2">
         <span className="text-[10px] font-black text-[#A6937C] uppercase tracking-[0.2em]">试炼进度: {currentIndex + 1} / {questions.length}</span>
         <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-[#9A2B2B] rounded-full" />
            <span className="text-[10px] font-black text-[#9A2B2B] uppercase tracking-widest">玄级难度</span>
         </div>
      </div>

      <div className="space-y-8">
        <h3 className="text-2xl font-black text-[#323232] text-center tracking-wider">{currentQ.question}</h3>
        
        <div className="bg-[#FBF9F5] rounded-xl p-10 border border-[#D4C4A8] shadow-inner flex justify-center relative">
           <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-[#A6937C]/30" />
           <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-[#A6937C]/30" />
           {hex && (currentQ.type === 'VISUAL' ? <HexagramIcon binary={hex.binary} size="xl" /> : <div className="text-6xl font-black text-[#323232]">{hex.name}</div>)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {currentQ.options.map((opt, idx) => {
          let stateClass = "bg-white/60 border-[#D4C4A8] text-[#323232]";
          if (isAnswered) {
            if (idx === currentQ.answerIndex) stateClass = "bg-[#2D5133]/10 border-[#2D5133] text-[#2D5133] scale-105 shadow-lg";
            else if (idx === selectedAnswer) stateClass = "bg-[#9A2B2B]/10 border-[#9A2B2B] text-[#9A2B2B] opacity-70";
            else stateClass = "opacity-20 border-[#D4C4A8]";
          }

          return (
            <button
              key={idx}
              disabled={isAnswered}
              onClick={() => handleAnswer(idx)}
              className={`py-6 rounded-lg border-2 font-black text-2xl transition-all shadow-sm active:scale-95 ${stateClass}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      <div className="min-h-[120px]">
        {!isAnswered ? (
          <div className="flex flex-col items-center gap-4">
             <button 
               onClick={fetchHint}
               className="flex items-center gap-3 text-[#A6937C] hover:text-[#323232] transition-colors"
             >
               <span className="text-2xl">🏮</span>
               <span className="text-[10px] font-black uppercase tracking-widest">求签启示</span>
             </button>
             {hint && (
               <div className="p-5 bg-white/40 border border-[#D4C4A8] rounded-lg text-xs text-[#323232]/80 leading-relaxed italic animate-in zoom-in-95 duration-500 text-center px-10">
                  {hint}
               </div>
             )}
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
             <div className="p-6 bg-[#323232] rounded-lg text-white shadow-xl border-t-2 border-[#9A2B2B]">
                {/* Brighter red for visibility on dark background */}
                <p className="text-[9px] text-[#FF6B6B] font-black mb-2 uppercase tracking-[0.2em] drop-shadow-sm">师尊解析</p>
                <p className="text-sm font-bold leading-relaxed text-white">{currentQ.explanation}</p>
             </div>
             
             <button 
               onClick={nextQuestion}
               className="w-full py-5 bg-[#9A2B2B] text-white rounded-lg font-black text-sm uppercase tracking-[0.3em] shadow-2xl hover:bg-[#B22222] transition-all active:scale-[0.98]"
             >
                {currentIndex === questions.length - 1 ? '试炼完成' : '下一卦试炼'}
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestArena;
