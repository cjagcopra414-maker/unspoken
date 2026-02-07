
import React, { useState, useRef } from 'react';
import { X, Music, Search, Send, Sparkles, BookOpen } from 'lucide-react';
import { getSuggestions, refineConfession } from '../services/geminiService';
import { Suggestion, Confession, ConfessionType } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (confession: Confession) => void;
}

export const CreateModal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [type, setType] = useState<ConfessionType>('music');
  const [to, setTo] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async () => {
    if (!searchQuery) return;
    setLoading(true);
    const result = await getSuggestions(searchQuery, type);
    setSuggestions(result.suggestions);
    setLoading(false);
  };

  const handleRefine = async () => {
    if (!message) return;
    setLoading(true);
    const refined = await refineConfession(message);
    setMessage(refined);
    setLoading(false);
  };

  const handleSubmit = () => {
    if (!to || !selectedSuggestion || !message) return;
    
    const newConfession: Confession = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      to,
      sourceTitle: selectedSuggestion.title,
      sourceSub: selectedSuggestion.sub,
      dedicatedLines: selectedSuggestion.lines,
      message,
      timestamp: Date.now(),
      likes: 0,
      comments: []
    };

    onSubmit(newConfession);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setStep(1);
    setTo('');
    setSearchQuery('');
    setSuggestions([]);
    setSelectedSuggestion(null);
    setMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="minimal-card w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-500 border-border bg-surface">
        <div className="flex items-center justify-between p-10 pb-4">
          <h2 className="text-3xl font-extrabold tracking-tighter text-primary">New Unspoken</h2>
          <button onClick={onClose} className="p-3 hover:bg-surfaceHover rounded-full transition-colors text-secondary hover:text-primary">
            <X size={24} />
          </button>
        </div>

        <div className="p-10 pt-4 max-h-[75vh] overflow-y-auto space-y-10 scrollbar-hide">
          {step === 1 && (
            <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-500">
              <div className="flex p-2 bg-surfaceHover rounded-3xl border border-border">
                <button 
                  onClick={() => setType('music')}
                  className={`flex-1 py-4 px-6 rounded-2xl text-xs font-black tracking-widest uppercase transition-all flex items-center justify-center space-x-3 ${type === 'music' ? 'bg-primary text-background shadow-lg' : 'text-secondary hover:text-primary'}`}
                >
                  <Music size={16} />
                  <span>The Melody</span>
                </button>
                <button 
                  onClick={() => setType('book')}
                  className={`flex-1 py-4 px-6 rounded-2xl text-xs font-black tracking-widest uppercase transition-all flex items-center justify-center space-x-3 ${type === 'book' ? 'bg-primary text-background shadow-lg' : 'text-secondary hover:text-primary'}`}
                >
                  <BookOpen size={16} />
                  <span>The Verse</span>
                </button>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-[0.3em] ml-3">To the heart of</label>
                <input 
                  type="text" 
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="Who's the recipient?"
                  className="w-full bg-surfaceHover border border-border text-primary rounded-3xl px-8 py-5 focus:outline-none focus:border-secondary transition-all font-semibold placeholder:text-secondary/50"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-[0.3em] ml-3">Search for {type === 'music' ? 'Song' : 'Book'}</label>
                <div className="flex space-x-4">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={type === 'music' ? "Artist or song name..." : "Author or book title..."}
                    className="flex-1 bg-surfaceHover border border-border text-primary rounded-3xl px-8 py-5 focus:outline-none focus:border-secondary transition-all font-semibold placeholder:text-secondary/50"
                  />
                  <button 
                    onClick={handleSearch}
                    disabled={loading}
                    className="bg-primary text-background px-8 rounded-3xl hover:opacity-90 transition-all disabled:opacity-50 font-black"
                  >
                    <Search size={24} />
                  </button>
                </div>
              </div>

              {loading && <div className="text-center py-8 text-[10px] text-secondary font-black animate-pulse tracking-[0.4em]">WHISPERING TO THE SPIRITS...</div>}

              <div className="grid grid-cols-1 gap-5">
                {suggestions.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedSuggestion(item); setStep(2); }}
                    className={`text-left p-8 rounded-[2rem] border transition-all duration-300 ${
                      selectedSuggestion === item 
                        ? 'border-primary bg-surfaceHover shadow-md' 
                        : 'border-border bg-surfaceHover hover:bg-surfaceHover/80 hover:border-secondary'
                    }`}
                  >
                    <div className="font-extrabold text-lg mb-1 text-primary">{item.title}</div>
                    <div className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">{item.sub}</div>
                    <div className="mt-4 text-sm italic text-secondary leading-relaxed border-l-2 border-border pl-5">"{item.lines}"</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-10 animate-in slide-in-from-right-6 duration-500">
              <div className="flex items-center space-x-6 bg-surfaceHover p-8 rounded-[2.5rem] border border-border">
                <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center text-background shadow-lg transition-transform hover:rotate-6">
                  {type === 'music' ? <Music size={32} /> : <BookOpen size={32} />}
                </div>
                <div>
                  <h3 className="font-black text-xl tracking-tight text-primary">{selectedSuggestion?.title}</h3>
                  <p className="text-[10px] text-secondary font-bold tracking-[0.2em] uppercase">{selectedSuggestion?.sub}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center ml-3">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-[0.3em]">The Message</label>
                  <button 
                    onClick={handleRefine}
                    className="flex items-center space-x-2 text-[10px] text-secondary hover:text-primary transition-all bg-surfaceHover px-4 py-2 rounded-full border border-border font-black uppercase tracking-widest"
                  >
                    <Sparkles size={12} className="text-purple-400" />
                    <span>REFINE HEART</span>
                  </button>
                </div>
                <textarea 
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What's been hiding in your thoughts?"
                  className="w-full bg-surfaceHover border border-border text-primary rounded-[2rem] p-8 focus:outline-none focus:border-secondary transition-all resize-none text-base font-medium leading-relaxed placeholder:text-secondary/50"
                />
              </div>
            </div>
          )}
        </div>

        <div className="p-10 border-t border-border bg-surfaceHover flex justify-between items-center">
          {step === 2 ? (
            <button onClick={() => setStep(1)} className="px-8 py-4 rounded-full text-xs font-black tracking-widest uppercase text-secondary hover:text-primary transition-all">Go Back</button>
          ) : <div />}
          <button 
            onClick={step === 1 ? () => selectedSuggestion && setStep(2) : handleSubmit}
            disabled={step === 1 ? !selectedSuggestion : !message}
            className="bg-primary text-background px-12 py-5 rounded-full font-black text-xs tracking-widest uppercase hover:scale-[1.03] active:scale-95 transition-all disabled:opacity-20 shadow-lg flex items-center space-x-4"
          >
            <span>{step === 1 ? 'Next Step' : 'Share Unspoken'}</span>
            <Send size={18} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};
