
import React, { useState, useEffect, useRef } from 'react';
import { Confession } from '../types';
import { Music, BookOpen, Quote } from 'lucide-react';

interface Props {
  confessions: Confession[];
}

export const LiveWhisper: React.FC<Props> = ({ confessions }) => {
  const [activeWhisper, setActiveWhisper] = useState<Confession | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  const confessionsRef = useRef<Confession[]>(confessions);
  const currentIdRef = useRef<string | null>(null);

  useEffect(() => {
    confessionsRef.current = confessions;
  }, [confessions]);

  useEffect(() => {
    if (confessions.length === 0) return;

    const rotate = () => {
      const list = confessionsRef.current;
      if (list.length === 0) return;

      setIsVisible(false);
      
      setTimeout(() => {
        let nextConfession: Confession;
        
        if (list.length > 1) {
          do {
            nextConfession = list[Math.floor(Math.random() * list.length)];
          } while (nextConfession.id === currentIdRef.current);
        } else {
          nextConfession = list[0];
        }

        currentIdRef.current = nextConfession.id;
        setActiveWhisper(nextConfession);
        
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      }, 800);
    };

    if (!activeWhisper) {
      rotate();
    }

    const interval = setInterval(rotate, 6500);

    return () => clearInterval(interval);
  }, [confessions.length > 0]);

  if (!activeWhisper) return null;

  const Icon = activeWhisper.type === 'music' ? Music : BookOpen;
  const accentColor = activeWhisper.type === 'music' 
    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
    : 'bg-amber-500/10 text-amber-400 border-amber-500/20';

  return (
    <div className={`transition-all duration-1000 transform will-change-transform ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
      <div className="minimal-card rounded-[2.5rem] p-8 border-border shadow-md relative overflow-hidden group bg-surface">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-primary">
          <Quote size={80} />
        </div>
        
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 rounded-xl bg-surfaceHover flex items-center justify-center text-secondary">
            <Icon size={16} />
          </div>
          <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Live Whisper</span>
        </div>

        <div className="space-y-4 relative z-10">
          <h4 className="text-xl font-extrabold tracking-tight leading-tight truncate text-primary">
            To: {activeWhisper.to}
          </h4>
          
          <div className="italic text-sm text-secondary leading-relaxed border-l-2 border-border pl-4 py-1 line-clamp-3">
            "{activeWhisper.dedicatedLines}"
          </div>

          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${accentColor}`}>
            <span className="truncate max-w-[180px]">{activeWhisper.sourceTitle}</span>
          </div>
        </div>

        <div className="absolute bottom-4 right-8 flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="text-[9px] font-black text-rose-500/50 tracking-widest uppercase">REAL-TIME</span>
        </div>
      </div>
    </div>
  );
};
