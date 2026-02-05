
import React, { useState, useMemo, useRef, useEffect, useCallback, memo } from 'react';
import { ANIME_LIST, CATEGORIES } from './constants';
import { Anime, AnimeCategory } from './types';

const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        setIsVisible(true);
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out"
    >
      <div className="w-6 h-6 rounded-full border border-yellow-500/50 flex items-center justify-center relative bg-yellow-500/5 backdrop-blur-[1px]">
        <div className="w-1 h-1 bg-yellow-400 rounded-full shadow-[0_0_8px_#FFD700]" />
      </div>
    </div>
  );
};

const AnimeCard = memo(({ anime, isHovered, onClick, cardRef }: { 
  anime: Anime, 
  isHovered: boolean, 
  onClick: () => void,
  cardRef: React.Ref<HTMLDivElement>
}) => {
  return (
    <div 
      ref={cardRef}
      onClick={onClick}
      className={`
        kinetic-card relative h-[50vh] md:h-[45vh] flex-shrink-0 cursor-none overflow-hidden border border-yellow-500/10 group transition-all duration-700
        ${isHovered ? 'w-[85vw] md:w-[420px] mx-1 md:mx-3 z-20 shadow-[0_0_50px_rgba(0,0,0,0.9)] brightness-100 grayscale-0' : 'w-[120px] md:w-[150px] mx-0.5 md:mx-1 grayscale brightness-[0.4] hover:brightness-[0.6]'}
      `}
    >
      <div className="absolute inset-0 pointer-events-none">
        <img 
          src={anime.coverImageURL} 
          alt={anime.title}
          loading="lazy"
          className={`w-full h-full object-cover object-top transition-transform duration-[1500ms] ${isHovered ? 'scale-105' : 'scale-100'}`}
        />
        <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-95' : 'opacity-70'}`} />
      </div>
      
      {/* Pride Accent: Corner Brackets */}
      <div className={`absolute top-0 right-0 w-8 h-8 border-t border-r border-yellow-500/40 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
      <div className={`absolute bottom-0 left-0 w-8 h-8 border-b border-l border-yellow-500/40 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
      
      {/* Vertical Title (Collapsed State) */}
      <div className={`absolute bottom-0 left-0 w-full p-4 md:p-6 transition-all duration-300 pointer-events-none ${isHovered ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'}`}>
        <h3 className="font-cinzel font-black text-xs md:text-base rotate-[-90deg] origin-bottom-left whitespace-nowrap uppercase tracking-[0.2em] text-yellow-500/50 group-hover:text-yellow-500 transition-colors">
          {anime.title}
        </h3>
      </div>

      {/* Expanded Details (Hover/Active State) */}
      <div className={`absolute inset-0 flex flex-col justify-end p-6 md:p-8 transition-all duration-500 pointer-events-none ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <div className="space-y-2 md:y-3">
          <div className="flex flex-wrap gap-1.5">
            {anime.genres.slice(0, 2).map(g => (
              <span key={g} className="text-[7px] md:text-[8px] border border-yellow-500/20 px-2 py-0.5 uppercase font-bold tracking-widest text-yellow-100 bg-black/40">{g}</span>
            ))}
          </div>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-cinzel font-black leading-tight tracking-tighter uppercase text-white sun-glow line-clamp-2">{anime.title}</h2>
          <p className="text-[9px] md:text-[11px] text-gray-400 max-w-xs leading-relaxed line-clamp-2 font-medium tracking-wide italic border-l-2 border-yellow-600/50 pl-3">
            {anime.description}
          </p>
          <div className="flex items-center gap-3 md:gap-4 text-[8px] md:text-[9px] font-black tracking-[0.3em] text-yellow-500 uppercase font-cinzel">
            <span className="text-white/60">{anime.releaseYear}</span>
            <div className="w-1 h-1 bg-yellow-500/50 rotate-45" />
            <span className="text-white/60">{anime.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isChanging, setIsChanging] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Fix for line 148 error: Move filteredAnime declaration before it's used in hooks
  const filteredAnime = useMemo(() => {
    return ANIME_LIST.filter(a => {
      const matchCat = selectedCategory === 'All' || a.category === selectedCategory;
      const matchSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (window.innerWidth < 768) return; // Disable hover-based logic on mobile
    if (selectedAnime || isChanging) return;

    let foundId: string | null = null;
    const items = Object.entries(cardRefs.current);

    for (const [id, el] of items) {
      if (el) {
        const rect = el.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right) {
          foundId = id;
          break;
        }
      }
    }

    if (foundId !== hoveredId) {
      setHoveredId(foundId);
    }
  }, [hoveredId, selectedAnime, isChanging]);

  // For mobile, we'll use intersection observer to highlight the center card
  useEffect(() => {
    if (window.innerWidth >= 768) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-id');
            setHoveredId(id);
          }
        });
      },
      { root: railRef.current, threshold: 0.6, rootMargin: '0px -40% 0px -40%' }
    );

    Object.values(cardRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [filteredAnime]);

  const handleMouseLeave = useCallback(() => {
    if (window.innerWidth >= 768) {
      setHoveredId(null);
    }
  }, []);

  const handleCategoryChange = useCallback((cat: string) => {
    if (cat === selectedCategory || isChanging) return;
    setIsChanging(true);
    setHoveredId(null);
    setTimeout(() => {
      setSelectedCategory(cat);
      setIsChanging(false);
      if (railRef.current) railRef.current.scrollTo({ left: 0, behavior: 'auto' });
    }, 450);
  }, [selectedCategory, isChanging]);

  const closeFocus = () => {
    setSelectedAnime(null);
  };

  const openExternalTrailer = (anime: Anime) => {
    const query = encodeURIComponent(anime.title + ' official trailer anime');
    window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
  };

  return (
    <div className="relative h-screen w-screen bg-[#020202] text-white overflow-hidden select-none">
      <Cursor />

      {/* AMBIENT BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="sun-bg absolute top-[-30%] left-1/2 -translate-x-1/2 w-[150vw] h-[80vh] blur-[120px] opacity-10" />
        <div className="absolute bottom-0 right-0 w-[40vw] h-[40vh] bg-yellow-900/5 blur-[100px]" />
      </div>

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/95 backdrop-blur-2xl border-b border-yellow-500/5">
        <div className="max-w-[1920px] mx-auto px-4 md:px-12 py-4 md:py-5">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 md:gap-6">
            
            <div className="flex items-center gap-4 md:gap-6 group">
              <div 
                className="w-8 h-8 md:w-10 md:h-10 border border-yellow-500/50 flex items-center justify-center text-lg md:text-xl font-cinzel font-black text-yellow-500 shadow-[0_0_10px_rgba(255,215,0,0.2)]"
              >Ω</div>
              <div>
                <h1 className="text-sm md:text-lg font-cinzel font-black tracking-tight uppercase text-yellow-500 sun-glow">Eisfly Archive</h1>
                <p className="text-[7px] md:text-[8px] font-black tracking-[0.5em] text-white/20 uppercase">Archive Record</p>
              </div>
            </div>

            <nav className="flex overflow-x-auto no-scrollbar max-w-full justify-start md:justify-center items-center gap-x-6 md:gap-x-8 py-2 md:py-0 px-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`text-[8px] md:text-[9px] whitespace-nowrap font-black uppercase tracking-[0.2em] font-cinzel transition-all duration-300 relative py-1 group ${selectedCategory === cat ? 'text-yellow-400' : 'text-gray-600 hover:text-white'}`}
                >
                  {cat}
                  <div className={`absolute -bottom-1.5 left-0 h-[1.5px] bg-yellow-500/80 transition-all duration-700 ${selectedCategory === cat ? 'w-full shadow-[0_0_8px_#FFD700]' : 'w-0'}`} />
                </button>
              ))}
            </nav>

            <div className="relative min-w-[200px] md:min-w-[240px] w-full md:w-auto">
              <input 
                type="text" 
                placeholder="SEEKING..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-yellow-500/5 border border-yellow-500/10 rounded-none py-2 px-4 md:px-6 font-cinzel text-[9px] md:text-[10px] outline-none w-full focus:border-yellow-500/30 transition-all duration-500 placeholder:text-yellow-900/40 text-yellow-100 uppercase tracking-widest"
              />
            </div>
          </div>
        </div>
      </header>

      {/* RAIL */}
      <main 
        ref={railRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`kinetic-rail relative h-full flex items-center px-8 md:px-32 lg:px-64 gap-2 md:gap-2 overflow-x-auto pt-24 md:pt-16 transition-all duration-[800ms]
          ${isChanging ? 'opacity-0 scale-98 blur-2xl translate-y-4' : 'opacity-100 scale-100 blur-0 translate-y-0'}
        `}
      >
        {filteredAnime.length === 0 ? (
          <div className="w-full text-center py-20">
            <h2 className="text-2xl md:text-4xl font-cinzel font-black text-white/5 tracking-[0.5em] uppercase">UNWORTHY</h2>
          </div>
        ) : (
          filteredAnime.map((anime) => (
            <div key={anime.id} data-id={anime.id} className="scroll-snap-align-center">
              <AnimeCard 
                anime={anime}
                isHovered={hoveredId === anime.id}
                onClick={() => {
                  if (window.innerWidth < 768 && hoveredId !== anime.id) {
                    setHoveredId(anime.id);
                  } else {
                    setSelectedAnime(anime);
                  }
                }}
                cardRef={(el) => { cardRefs.current[anime.id] = el; }}
              />
            </div>
          ))
        )}
      </main>

      {/* FOCUS MODE */}
      {selectedAnime && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-0 md:p-8 lg:p-16">
          <div className="absolute inset-0 bg-black/98 backdrop-blur-[30px] animate-in fade-in duration-500" onClick={closeFocus} />
          
          <div className="relative w-full max-w-6xl h-full md:h-[80vh] bg-[#050505] border-0 md:border border-yellow-500/10 overflow-hidden flex flex-col lg:flex-row shadow-2xl animate-flare">
            
            <div className="lg:w-[40%] h-[40%] lg:h-full relative overflow-hidden group">
               <img 
                src={selectedAnime.coverImageURL} 
                alt={selectedAnime.title}
                className="w-full h-full object-cover object-top transition-transform duration-[4000ms] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#050505] hidden lg:block" />
              <button 
                onClick={closeFocus}
                className="absolute top-4 left-4 md:top-6 md:left-6 w-10 h-10 md:w-12 md:h-12 border border-yellow-500/30 flex items-center justify-center hover:bg-yellow-500 hover:text-black transition-all duration-500 z-50"
              >✕</button>
            </div>

            <div className="flex-1 p-6 md:p-10 lg:p-16 flex flex-col justify-center overflow-y-auto">
              <div className="mb-4 md:mb-8">
                <div className="flex items-center gap-4 mb-4 md:mb-8 text-yellow-500/20">
                  <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em]">PRIDE_ENTRY_#0{selectedAnime.id}</span>
                  <div className="h-px flex-1 bg-yellow-500/10" />
                </div>
                <h2 className="text-2xl md:text-4xl lg:text-6xl font-cinzel font-black mb-4 md:mb-6 leading-[0.9] tracking-tighter uppercase text-white animate-in slide-in-from-bottom-6 duration-700">
                  {selectedAnime.title}
                </h2>
                <div className="flex flex-wrap gap-2 md:gap-3 mb-4 md:mb-8">
                  {selectedAnime.genres.map(g => (
                    <span key={g} className="px-2 md:px-4 py-1 md:py-1.5 border border-yellow-500/15 text-[7px] md:text-[9px] font-black uppercase hover:bg-yellow-500 hover:text-black transition-all duration-500 tracking-widest">
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 md:gap-10 mb-6 md:mb-10 border-y border-yellow-500/5 py-4 md:py-8">
                <div>
                  <h4 className="text-[8px] md:text-[9px] font-black text-gray-700 uppercase tracking-widest mb-1 md:mb-2">Era</h4>
                  <p className="text-xl md:text-3xl font-cinzel font-black tracking-tighter text-yellow-500">{selectedAnime.releaseYear}</p>
                </div>
                <div>
                  <h4 className="text-[8px] md:text-[9px] font-black text-gray-700 uppercase tracking-widest mb-1 md:mb-2">Status</h4>
                  <p className="text-xl md:text-3xl font-cinzel font-black uppercase tracking-tighter text-yellow-500">{selectedAnime.status}</p>
                </div>
              </div>

              <div className="space-y-6 md:space-y-10">
                <p className="text-sm md:text-xl lg:text-2xl font-light text-gray-400 leading-snug italic border-l-2 border-yellow-500 pl-4 md:pl-8 py-1">
                  "{selectedAnime.description}"
                </p>
                
                <div className="pt-2 md:pt-4 flex flex-col sm:flex-row gap-3 md:gap-4 pb-8 md:pb-0">
                  <button 
                    className="flex-1 bg-yellow-500 text-black font-cinzel font-black py-3 md:py-4 px-6 md:px-10 text-[9px] md:text-xs tracking-[0.4em] uppercase hover:bg-white transition-all duration-500 shadow-lg"
                    onClick={() => window.open(`https://myanimelist.net/search/all?q=${encodeURIComponent(selectedAnime.title)}`, '_blank')}
                  >EXPLORE →</button>
                  <button 
                    className="flex-1 border border-yellow-500/40 text-yellow-500 font-cinzel font-black py-3 md:py-4 px-6 md:px-10 text-[9px] md:text-xs tracking-[0.4em] uppercase hover:bg-yellow-500 hover:text-black transition-all duration-500"
                    onClick={() => openExternalTrailer(selectedAnime)}
                  >VIEW TRAILER ↗</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 md:p-10 flex justify-between items-end pointer-events-none z-40 bg-gradient-to-t from-black/80 to-transparent">
        <div /> 
        <div className="flex flex-col md:flex-row items-end md:items-center gap-4 md:gap-12 pointer-events-auto w-full md:w-auto">
          <div className="flex gap-2 md:gap-3 items-center justify-end w-full md:w-auto">
             {CATEGORIES.map((cat, i) => (
               <div key={i} className={`w-0.5 md:w-1 h-0.5 md:h-1 rounded-none transition-all duration-[1000ms] ${CATEGORIES.indexOf(selectedCategory) === i ? 'bg-yellow-500 scale-[2] md:scale-[2.5] rotate-45 shadow-[0_0_10px_#FFD700]' : 'bg-white/5'}`} />
             ))}
          </div>
          <p className="text-[7px] md:text-[10px] font-cinzel font-black tracking-[0.4em] md:tracking-[0.8em] text-yellow-500/10 uppercase italic">"WHO DECIDED THAT?"</p>
        </div>
      </footer>
    </div>
  );
}
