
import React, { useState, useEffect, useMemo } from 'react';
import { ConfessionCard } from './components/ConfessionCard';
import { CreateModal } from './components/CreateModal';
import { LiveWhisper } from './components/LiveWhisper';
import { Confession, AnonymousMessage } from './types';
import { 
  Plus, 
  Music2, 
  Search, 
  Book, 
  Trophy, 
  Sparkles, 
  UserSearch, 
  X, 
  Send, 
  ArrowLeft, 
  MessageSquare, 
  Activity,
  Palette,
  Check
} from 'lucide-react';

const MOCK_CONFESSIONS: Confession[] = [
  {
    id: '1',
    type: 'music',
    to: 'Sarah',
    sourceTitle: 'Mystery of Love',
    sourceSub: 'Sufjan Stevens',
    dedicatedLines: 'The first time that you touched me, oh, will wonders ever cease?',
    message: 'We see each other every day at the library. You’re always lost in your music, but I’m always lost in thought about you.',
    timestamp: Date.now() - 3600000,
    likes: 42,
    comments: [{ id: 'c1', text: 'This is so sweet!', timestamp: Date.now() - 3000000 }]
  },
  {
    id: '2',
    type: 'book',
    to: 'Elias',
    sourceTitle: 'Normal People',
    sourceSub: 'Sally Rooney',
    dedicatedLines: 'It’s not like this with other people.',
    message: 'I read this and immediately thought of that rainy afternoon in the park. You have a way of making the world feel quiet.',
    timestamp: Date.now() - 7200000,
    likes: 128,
    comments: []
  },
  {
    id: '3',
    type: 'music',
    to: 'Alex',
    sourceTitle: 'Nightcall',
    sourceSub: 'Kavinsky',
    dedicatedLines: 'I am giving you a nightcall to tell you how I feel.',
    message: 'Every time I drive home late, this song reminds me of our long talks on your porch.',
    timestamp: Date.now() - 10800000,
    likes: 89,
    comments: []
  }
];

const RECOMMENDATIONS = {
  music: [
    { title: 'As It Was', artist: 'Harry Styles' },
    { title: 'Cruel Summer', artist: 'Taylor Swift' },
    { title: 'Die With A Smile', artist: 'Lady Gaga & Bruno Mars' }
  ],
  books: [
    { title: 'It Ends With Us', author: 'Colleen Hoover' },
    { title: 'The Seven Husbands of Evelyn Hugo', author: 'Taylor Jenkins Reid' },
    { title: 'Beach Read', author: 'Emily Henry' }
  ]
};

const THEMES = [
  { id: 'noir', name: 'Noir', color: '#09090b' },
  { id: 'paper', name: 'Paper', color: '#ffffff' },
  { id: 'sepia', name: 'Sepia', color: '#f8f5f2' },
  { id: 'midnight', name: 'Midnight', color: '#0f172a' }
];

const App: React.FC = () => {
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'popular' | 'recent'>('all');
  const [nameSearch, setNameSearch] = useState('');
  const [inboxId, setInboxId] = useState<string | null>(null);
  const [anonymousMessages, setAnonymousMessages] = useState<AnonymousMessage[]>([]);
  const [anonInput, setAnonInput] = useState('');
  const [sentStatus, setSentStatus] = useState(false);
  
  // Theme State
  const [currentTheme, setCurrentTheme] = useState('noir');
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  useEffect(() => {
    // Check for inbox routing
    const params = new URLSearchParams(window.location.search);
    const inbox = params.get('inbox');
    if (inbox) setInboxId(inbox);

    // Load Data
    const savedConfessions = localStorage.getItem('unspoken_v3');
    if (savedConfessions) {
      setConfessions(JSON.parse(savedConfessions));
    } else {
      setConfessions(MOCK_CONFESSIONS);
    }

    const savedMessages = localStorage.getItem('unspoken_messages');
    if (savedMessages) {
      setAnonymousMessages(JSON.parse(savedMessages));
    }

    // Load Theme
    const savedTheme = localStorage.getItem('unspoken_theme') || 'noir';
    setTheme(savedTheme);
  }, []);

  const setTheme = (themeId: string) => {
    setCurrentTheme(themeId);
    document.documentElement.setAttribute('data-theme', themeId);
    localStorage.setItem('unspoken_theme', themeId);
    setIsThemeMenuOpen(false);
  };

  const handleAddConfession = (newConfession: Confession) => {
    const updated = [newConfession, ...confessions];
    setConfessions(updated);
    localStorage.setItem('unspoken_v3', JSON.stringify(updated));
  };

  const handleAddComment = (confessionId: string, commentText: string) => {
    const updated = confessions.map(c => {
      if (c.id === confessionId) {
        return {
          ...c,
          comments: [...c.comments, { 
            id: Math.random().toString(36).substr(2, 9), 
            text: commentText, 
            timestamp: Date.now() 
          }]
        };
      }
      return c;
    });
    setConfessions(updated);
    localStorage.setItem('unspoken_v3', JSON.stringify(updated));
  };

  const sendAnonymousMessage = () => {
    if (!anonInput.trim() || !inboxId) return;
    const newMessage: AnonymousMessage = {
      id: Math.random().toString(36).substr(2, 9),
      targetId: inboxId,
      text: anonInput,
      timestamp: Date.now()
    };
    const updated = [newMessage, ...anonymousMessages];
    setAnonymousMessages(updated);
    localStorage.setItem('unspoken_messages', JSON.stringify(updated));
    setAnonInput('');
    setSentStatus(true);
    setTimeout(() => setSentStatus(false), 3000);
  };

  const filteredConfessions = useMemo(() => {
    let result = [...confessions];
    if (nameSearch.trim()) {
      result = result.filter(c => c.to.toLowerCase().includes(nameSearch.toLowerCase()));
    }
    return result.sort((a, b) => {
      if (filter === 'popular') return b.likes - a.likes;
      if (filter === 'recent') return b.timestamp - a.timestamp;
      return 0;
    });
  }, [confessions, filter, nameSearch]);

  const mostUsed = useMemo(() => {
    const counts: Record<string, { count: number; sub: string; type: string }> = {};
    confessions.forEach(c => {
      const key = `${c.type}:${c.sourceTitle}`;
      if (!counts[key]) {
        counts[key] = { count: 1, sub: c.sourceSub, type: c.type };
      } else {
        counts[key].count++;
      }
    });
    return Object.entries(counts)
      .map(([key, val]) => ({ title: key.split(':')[1], ...val }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }, [confessions]);

  const targetConfession = useMemo(() => {
    return confessions.find(c => c.id === inboxId);
  }, [confessions, inboxId]);

  // View: Anonymous Inbox
  if (inboxId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative bg-background">
        <button 
          onClick={() => {
            setInboxId(null);
            window.history.pushState({}, '', window.location.pathname);
          }}
          className="absolute top-10 left-10 text-secondary hover:text-primary flex items-center space-x-2 transition-all z-10"
        >
          <ArrowLeft size={20} />
          <span className="text-xs font-bold uppercase tracking-widest">Back</span>
        </button>

        <div className="w-full max-w-lg space-y-8 animate-in fade-in zoom-in duration-500 z-10">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-surface rounded-[2.5rem] flex items-center justify-center mx-auto border border-border shadow-sm">
              <MessageSquare size={40} className="text-primary" />
            </div>
            <h2 className="text-4xl font-extrabold tracking-tighter text-primary">Anonymous Chat</h2>
            {targetConfession && (
              <p className="text-secondary text-sm font-medium">
                Sending a response to the confession for <span className="text-primary">"{targetConfession.to}"</span>
              </p>
            )}
          </div>

          <div className="minimal-card rounded-[3rem] p-8 space-y-6">
            <textarea 
              rows={6}
              value={anonInput}
              onChange={(e) => setAnonInput(e.target.value)}
              placeholder="Send an anonymous message..."
              className="w-full bg-surfaceHover border border-border text-primary rounded-3xl p-6 focus:outline-none focus:border-secondary transition-all resize-none font-medium leading-relaxed placeholder:text-secondary/50"
            />
            <button 
              onClick={sendAnonymousMessage}
              disabled={!anonInput.trim()}
              className="w-full bg-primary text-background py-5 rounded-full font-black text-xs tracking-widest uppercase hover:opacity-90 active:scale-95 transition-all disabled:opacity-30 shadow-lg flex items-center justify-center space-x-3"
            >
              <Send size={18} />
              <span>{sentStatus ? 'Message Sent!' : 'Send Secret Message'}</span>
            </button>
          </div>
          
          <p className="text-center text-[10px] font-bold text-secondary uppercase tracking-[0.3em]">
            Messages are shared only with the link owner.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-40 relative bg-background transition-colors duration-300">
      <nav className="fixed top-0 inset-x-0 z-40 h-20 flex items-center justify-center px-6">
        <div className="w-full max-w-5xl minimal-card h-14 rounded-full flex items-center justify-between px-8 shadow-sm">
          <div className="flex items-center">
            <span className="font-extrabold text-sm tracking-widest uppercase text-primary">Unspoken</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => { setFilter('all'); setNameSearch(''); }} className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-all ${filter === 'all' && !nameSearch ? 'text-primary' : 'text-secondary hover:text-primary'}`}>Explore</button>
            <button onClick={() => setFilter('popular')} className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-all ${filter === 'popular' ? 'text-primary' : 'text-secondary hover:text-primary'}`}>Trending</button>
            <button onClick={() => setFilter('recent')} className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-all ${filter === 'recent' ? 'text-primary' : 'text-secondary hover:text-primary'}`}>Recent</button>
          </div>
          <div className="flex items-center space-x-4">
            {/* Theme Switcher */}
            <div className="relative">
              <button 
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className="text-secondary hover:text-primary transition-colors p-2"
              >
                <Palette size={18} />
              </button>
              
              {isThemeMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsThemeMenuOpen(false)}></div>
                  <div className="absolute top-full right-0 mt-2 w-48 minimal-card rounded-2xl p-2 z-20 shadow-xl flex flex-col space-y-1 animate-in fade-in zoom-in-95 duration-200">
                     {THEMES.map(theme => (
                       <button
                         key={theme.id}
                         onClick={() => setTheme(theme.id)}
                         className="flex items-center justify-between w-full px-4 py-3 rounded-xl hover:bg-surfaceHover transition-colors text-left"
                       >
                         <div className="flex items-center space-x-3">
                           <div className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: theme.color }}></div>
                           <span className={`text-xs font-bold uppercase tracking-wider ${currentTheme === theme.id ? 'text-primary' : 'text-secondary'}`}>{theme.name}</span>
                         </div>
                         {currentTheme === theme.id && <Check size={14} className="text-primary" />}
                       </button>
                     ))}
                  </div>
                </>
              )}
            </div>

            <button className="text-secondary hover:text-primary transition-colors"><Search size={18} /></button>
            <div 
              onClick={() => setIsModalOpen(true)}
              className="w-8 h-8 rounded-full bg-surfaceHover border border-border flex items-center justify-center cursor-pointer hover:bg-border transition-colors text-primary"
            >
              <Plus size={16} />
            </div>
          </div>
        </div>
      </nav>

      <header className="pt-40 pb-16 px-6 text-center max-w-4xl mx-auto space-y-6 relative z-10">
        <div className="inline-flex items-center space-x-2 bg-surface px-4 py-2 rounded-full border border-border mb-2">
          <Sparkles size={14} className="text-purple-400" />
          <span className="text-[10px] font-bold tracking-widest uppercase text-secondary">The Echo of Silent Conversations</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-primary">
          Unspoken.
        </h1>
        <p className="text-secondary text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
          Dedicate a melody or a verse to the heart that captures your silence. Shared anonymously, felt universally.
        </p>

        <div className="max-w-md mx-auto mt-12 relative animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="relative minimal-card rounded-[2.5rem] p-2 flex items-center shadow-lg">
            <div className="pl-6 text-secondary"><UserSearch size={20} /></div>
            <input 
              type="text" 
              value={nameSearch} 
              onChange={(e) => setNameSearch(e.target.value)} 
              placeholder="Search your name..." 
              className="bg-transparent border-none focus:outline-none flex-1 px-4 py-4 text-primary placeholder:text-secondary/50 font-bold" 
            />
            {nameSearch && <button onClick={() => setNameSearch('')} className="p-3 text-secondary hover:text-primary transition-colors"><X size={18} /></button>}
          </div>
          <p className="mt-4 text-[10px] font-bold tracking-widest uppercase text-secondary/50">Find out if someone left a message for you</p>
        </div>
      </header>

      {!nameSearch && (
        <section className="max-w-[1600px] mx-auto px-6 mb-16 grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
          <div className="minimal-card rounded-[2.5rem] p-8 flex flex-col space-y-6 shadow-sm">
            <div className="flex items-center space-x-3 text-secondary">
              <Trophy size={18} />
              <h2 className="text-xs font-bold uppercase tracking-widest">Most Used</h2>
            </div>
            <div className="space-y-4">
              {mostUsed.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between group">
                  <div className="flex items-center space-x-4">
                    <span className="text-xl font-black text-secondary/30">{idx + 1}</span>
                    <div>
                      <div className="text-sm font-extrabold text-primary">{item.title}</div>
                      <div className="text-[10px] font-bold text-secondary uppercase tracking-tight">{item.sub}</div>
                    </div>
                  </div>
                  <div className="bg-surfaceHover px-3 py-1 rounded-full text-[10px] font-black text-secondary">{item.count} posts</div>
                </div>
              ))}
            </div>
          </div>

          <div className="minimal-card rounded-[2.5rem] p-8 flex flex-col space-y-6 shadow-sm">
            <div className="flex items-center space-x-3 text-purple-400">
              <Music2 size={18} />
              <h2 className="text-xs font-bold uppercase tracking-widest">Famous Music</h2>
            </div>
            <div className="space-y-4">
              {RECOMMENDATIONS.music.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-4 hover:bg-surfaceHover p-2 rounded-2xl transition-colors cursor-default">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400"><Music2 size={16} /></div>
                  <div>
                    <div className="text-sm font-bold text-primary">{item.title}</div>
                    <div className="text-[10px] font-bold text-secondary uppercase">{item.artist}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="minimal-card rounded-[2.5rem] p-8 flex flex-col space-y-6 shadow-sm">
            <div className="flex items-center space-x-3 text-amber-400">
              <Book size={18} />
              <h2 className="text-xs font-bold uppercase tracking-widest">Timeless Reads</h2>
            </div>
            <div className="space-y-4">
              {RECOMMENDATIONS.books.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-4 hover:bg-surfaceHover p-2 rounded-2xl transition-colors cursor-default">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-400"><Book size={16} /></div>
                  <div>
                    <div className="text-sm font-bold text-primary">{item.title}</div>
                    <div className="text-[10px] font-bold text-secondary uppercase">{item.author}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="max-w-[1600px] mx-auto px-6 mb-8 flex items-center justify-between relative z-10">
         <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-secondary">
              {nameSearch ? `Confessions for "${nameSearch}"` : 'Live Feed'}
            </span>
         </div>
         <div className="flex space-x-2">
            <button onClick={() => setFilter('recent')} className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${filter === 'recent' ? 'bg-primary text-background' : 'bg-surface text-secondary border border-border hover:bg-surfaceHover'}`}>LATEST</button>
            <button onClick={() => setFilter('popular')} className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${filter === 'popular' ? 'bg-primary text-background' : 'bg-surface text-secondary border border-border hover:bg-surfaceHover'}`}>TOP</button>
         </div>
      </div>

      <main className="max-w-[1600px] mx-auto px-6 min-h-[400px] relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-10">
          <div>
            {filteredConfessions.length > 0 ? (
              <div className="masonry-grid">
                {filteredConfessions.map(confession => (
                  <ConfessionCard 
                    key={confession.id} 
                    confession={confession} 
                    onAddComment={handleAddComment}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-50 animate-in fade-in duration-700 text-secondary">
                <Search size={48} strokeWidth={1.5} />
                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-primary">No echoes found.</h3>
                  <p className="text-sm">Maybe the right words haven't been spoken yet.</p>
                </div>
              </div>
            )}
          </div>

          <aside className="hidden xl:block space-y-6">
            <div className="sticky top-28 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-secondary">
                  <Activity size={18} />
                  <h2 className="text-xs font-bold uppercase tracking-widest">Live Whispers</h2>
                </div>
              </div>
              
              <div className="relative min-h-[250px] w-full">
                <LiveWhisper confessions={confessions} />
              </div>

              <div className="minimal-card rounded-[2rem] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[10px] font-bold uppercase text-secondary tracking-widest">Active Echoes</h3>
                  <div className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[9px] font-black tracking-widest">LIVE</div>
                </div>
                <div className="text-3xl font-black tracking-tighter mb-1 text-primary">{confessions.length + 124}</div>
                <p className="text-secondary text-[10px] font-medium leading-relaxed">Conversations shared silently across the universe today.</p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="group flex items-center space-x-4 bg-primary text-background pl-6 pr-8 py-5 rounded-[2.5rem] shadow-2xl transition-all duration-500 hover:scale-[1.05] active:scale-95"
        >
          <div className="w-12 h-12 bg-background rounded-3xl flex items-center justify-center text-primary transition-transform group-hover:rotate-12">
            <Plus size={28} strokeWidth={3} />
          </div>
          <span className="font-extrabold text-lg tracking-tight">Post a Confession</span>
        </button>
      </div>

      <CreateModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddConfession} 
      />
    </div>
  );
};

export default App;
