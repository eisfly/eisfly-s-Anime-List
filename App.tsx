import React, { useState, useMemo, useRef, useEffect, useCallback, memo } from 'react';
import { ANIME_LIST, CATEGORIES } from './constants';
import { Anime } from './types';

/* =========================
   THEMED SCROLLBAR CSS
   - funktioniert ohne Tailwind scrollbar plugin
   - WebKit + Firefox
========================= */
const ThemedScrollbarStyles = () => (
  <style>{`
    /* Shared */
    .themed-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: rgba(234,179,8,0.55) rgba(234,179,8,0.12); /* thumb track */
    }
    .themed-scrollbar::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }
    .themed-scrollbar::-webkit-scrollbar-track {
      background: rgba(234,179,8,0.10);
      border-radius: 999px;
    }
    .themed-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(234,179,8,0.40);
      border-radius: 999px;
      border: 2px solid rgba(0,0,0,0.60);
    }
    .themed-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(234,179,8,0.60);
    }

    /* Smaller variant (genres etc.) */
    .themed-scrollbar-sm {
      scrollbar-width: thin;
      scrollbar-color: rgba(234,179,8,0.50) rgba(234,179,8,0.10);
    }
    .themed-scrollbar-sm::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    .themed-scrollbar-sm::-webkit-scrollbar-track {
      background: rgba(234,179,8,0.08);
      border-radius: 999px;
    }
    .themed-scrollbar-sm::-webkit-scrollbar-thumb {
      background: rgba(234,179,8,0.35);
      border-radius: 999px;
      border: 2px solid rgba(0,0,0,0.65);
    }
    .themed-scrollbar-sm::-webkit-scrollbar-thumb:hover {
      background: rgba(234,179,8,0.55);
    }

    /* Optional: hide scrollbar utility (you used no-scrollbar) */
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    /* Smooth scrolling feel (doesn't break) */
    .scroll-snap-align-center { scroll-snap-align: center; }
    .kinetic-rail { scroll-snap-type: x mandatory; scroll-behavior: smooth; }
  `}</style>
);

/* =========================
   CURSOR (perf-fix)
   - Keine setState pro mousemove
   - Zentriert auf echten Mauspunkt
   - Automatisch aus auf Touch
========================= */
const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const visibleOnce = useRef(false);

  useEffect(() => {
    const isTouchDevice =
      'ontouchstart' in window || (navigator?.maxTouchPoints ?? 0) > 0 || window.matchMedia?.('(pointer: coarse)')?.matches;

    if (isTouchDevice) return;

    // System-Cursor aus (Desktop)
    document.body.style.cursor = 'none';

    const moveCursor = (e: MouseEvent) => {
      const el = cursorRef.current;
      if (!el) return;

      // nur einmal sichtbar machen (kein re-render spam)
      if (!visibleOnce.current) {
        visibleOnce.current = true;
        el.style.opacity = '1';
      }

      // Left/Top + translate(-50%,-50%) => exakt zentriert
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
    };

    window.addEventListener('mousemove', moveCursor, { passive: true });
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.body.style.cursor = 'default';
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: 0,
        top: 0,
        transform: 'translate(-50%, -50%)',
        opacity: 0,
        transition: 'opacity 200ms ease',
        willChange: 'left, top',
      }}
    >
      <div className="w-7 h-7 rounded-full border border-yellow-500/50 flex items-center justify-center relative bg-yellow-500/5 backdrop-blur-[1px] shadow-[0_0_20px_rgba(234,179,8,0.12)]">
        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(255,215,0,0.85)]" />
      </div>
    </div>
  );
};

const AnimeCard = memo(
  ({
    anime,
    isHovered,
    onClick,
    cardRef,
  }: {
    anime: Anime;
    isHovered: boolean;
    onClick: () => void;
    cardRef: React.Ref<HTMLDivElement>;
  }) => {
    return (
      <div
        ref={cardRef}
        onClick={onClick}
        className={`
          kinetic-card relative h-[50vh] md:h-[45vh] flex-shrink-0 cursor-none overflow-hidden border border-yellow-500/10 group transition-all duration-700
          ${isHovered
            ? 'w-[85vw] md:w-[420px] mx-1 md:mx-3 z-20 shadow-[0_0_50px_rgba(0,0,0,0.9)] brightness-100 grayscale-0'
            : 'w-[120px] md:w-[150px] mx-0.5 md:mx-1 grayscale brightness-[0.4] hover:brightness-[0.6]'}
        `}
      >
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={anime.coverImageURL}
            alt={anime.title}
            loading="lazy"
            decoding="async"
            draggable={false}
            className={`w-full h-full object-cover object-top transition-transform duration-[1200ms] ${
              isHovered ? 'scale-[1.06]' : 'scale-100'
            }`}
          />
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity duration-500 ${
              isHovered ? 'opacity-95' : 'opacity-70'
            }`}
          />
        </div>

        {/* Corner Brackets */}
        <div
          className={`absolute top-0 right-0 w-8 h-8 border-t border-r border-yellow-500/40 transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`absolute bottom-0 left-0 w-8 h-8 border-b border-l border-yellow-500/40 transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Collapsed Vertical Title */}
        <div
          className={`absolute bottom-0 left-0 w-full p-4 md:p-6 transition-all duration-300 pointer-events-none ${
            isHovered ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'
          }`}
        >
          <h3 className="font-cinzel font-black text-xs md:text-base rotate-[-90deg] origin-bottom-left whitespace-nowrap uppercase tracking-[0.2em] text-yellow-500/50 group-hover:text-yellow-500 transition-colors">
            {anime.title}
          </h3>
        </div>

        {/* Expanded Details */}
        <div
          className={`absolute inset-0 flex flex-col justify-end p-6 md:p-8 transition-all duration-500 pointer-events-none ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="space-y-2 md:space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {anime.genres.slice(0, 2).map((g) => (
                <span
                  key={g}
                  className="text-[7px] md:text-[8px] border border-yellow-500/20 px-2 py-0.5 uppercase font-bold tracking-widest text-yellow-100 bg-black/40"
                >
                  {g}
                </span>
              ))}
            </div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-cinzel font-black leading-tight tracking-tighter uppercase text-white sun-glow line-clamp-2">
              {anime.title}
            </h2>
            <p className="text-[9px] md:text-[11px] text-gray-300/70 max-w-xs leading-relaxed line-clamp-2 font-medium tracking-wide italic border-l-2 border-yellow-600/50 pl-3">
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
  }
);

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isChanging, setIsChanging] = useState(false);

  const railRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const filteredAnime = useMemo(() => {
    return ANIME_LIST.filter((a) => {
      const matchCat = selectedCategory === 'All' || a.category === selectedCategory;
      const matchSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  /* Desktop hover detection (dein scan bleibt, aber wir verhindern unnötige work) */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (window.innerWidth < 768) return;
      if (selectedAnime || isChanging) return;

      let foundId: string | null = null;
      const items = Object.entries(cardRefs.current);

      for (const [id, el] of items) {
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right) {
          foundId = id;
          break;
        }
      }

      if (foundId !== hoveredId) setHoveredId(foundId);
    },
    [hoveredId, selectedAnime, isChanging]
  );

  const handleMouseLeave = useCallback(() => {
    if (window.innerWidth >= 768) setHoveredId(null);
  }, []);

  /* Mobile: center card highlight */
  useEffect(() => {
    if (window.innerWidth >= 768) return;

    const root = railRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // nur die stärkste intersecting nehmen
        let best: { id: string; ratio: number } | null = null;
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute('data-id');
          if (!id) return;
          const ratio = entry.intersectionRatio ?? 0;
          if (!best || ratio > best.ratio) best = { id, ratio };
        });
        if (best) setHoveredId(best.id);
      },
      { root, threshold: [0.5, 0.6, 0.7], rootMargin: '0px -40% 0px -40%' }
    );

    Object.values(cardRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [filteredAnime]);

  const handleCategoryChange = useCallback(
    (cat: string) => {
      if (cat === selectedCategory || isChanging) return;
      setIsChanging(true);
      setHoveredId(null);

      setTimeout(() => {
        setSelectedCategory(cat);
        setIsChanging(false);
        if (railRef.current) railRef.current.scrollTo({ left: 0, behavior: 'auto' });
      }, 350);
    },
    [selectedCategory, isChanging]
  );

  const closeFocus = useCallback(() => setSelectedAnime(null), []);

  const openExternalTrailer = (anime: Anime) => {
    const query = encodeURIComponent(anime.title + ' official trailer anime');
    window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank', 'noopener,noreferrer');
  };

  /* Escape closes modal + lock background scroll */
  useEffect(() => {
    if (!selectedAnime) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeFocus();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [selectedAnime, closeFocus]);

  return (
    <div className="relative h-screen w-screen text-white overflow-hidden select-none bg-[#040404]">
      <ThemedScrollbarStyles />
      <Cursor />

      {/* BACKGROUND: less boring than pure black */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#050505] via-[#030303] to-[#090607]" />
        {/* gold glow */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[120vw] h-[70vh] rounded-full blur-[120px] opacity-[0.14] bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.55),transparent_60%)]" />
        {/* subtle corner ember */}
        <div className="absolute -bottom-24 -right-24 w-[60vw] h-[55vh] blur-[140px] opacity-[0.10] bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.45),transparent_60%)]" />
        {/* faint texture-ish band */}
        <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(90deg,transparent,rgba(234,179,8,0.35),transparent)]" />
      </div>

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/92 backdrop-blur-xl border-b border-yellow-500/10">
        <div className="max-w-[1920px] mx-auto px-4 md:px-12 py-4 md:py-5">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 md:gap-6">
            <div className="flex items-center gap-4 md:gap-6 group">
              <div className="w-8 h-8 md:w-10 md:h-10 border border-yellow-500/50 flex items-center justify-center text-lg md:text-xl font-cinzel font-black text-yellow-500 shadow-[0_0_12px_rgba(234,179,8,0.18)]">
                Ω
              </div>
              <div>
                <h1 className="text-sm md:text-lg font-cinzel font-black tracking-tight uppercase text-yellow-500 sun-glow">
                  Eisfly Archive
                </h1>
                <p className="text-[7px] md:text-[8px] font-black tracking-[0.5em] text-white/20 uppercase">
                  Archive Record
                </p>
              </div>
            </div>

            {/* Categories: keep scrollable on mobile + themed scrollbar */}
            <nav className="themed-scrollbar-sm flex overflow-x-auto max-w-full justify-start md:justify-center items-center gap-x-6 md:gap-x-8 py-2 md:py-0 px-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`text-[8px] md:text-[9px] whitespace-nowrap font-black uppercase tracking-[0.2em] font-cinzel transition-all duration-300 relative py-1 group ${
                    selectedCategory === cat ? 'text-yellow-400' : 'text-gray-600 hover:text-white'
                  }`}
                >
                  {cat}
                  <div
                    className={`absolute -bottom-1.5 left-0 h-[1.5px] bg-yellow-500/80 transition-all duration-700 ${
                      selectedCategory === cat ? 'w-full shadow-[0_0_8px_rgba(234,179,8,0.85)]' : 'w-0'
                    }`}
                  />
                </button>
              ))}
            </nav>

            <div className="relative min-w-[200px] md:min-w-[240px] w-full md:w-auto">
              <input
                type="text"
                placeholder="SEEKING..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-yellow-500/5 border border-yellow-500/15 rounded-none py-2 px-4 md:px-6 font-cinzel text-[9px] md:text-[10px] outline-none w-full focus:border-yellow-500/35 transition-all duration-500 placeholder:text-yellow-900/40 text-yellow-100 uppercase tracking-widest"
              />
            </div>
          </div>
        </div>
      </header>

      {/* RAIL (WICHTIG: bei Modal NICHT rendern -> weniger Lag) */}
      {!selectedAnime && (
        <main
          ref={railRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={`kinetic-rail themed-scrollbar relative h-full flex items-center px-8 md:px-32 lg:px-64 gap-2 md:gap-2 overflow-x-auto pt-24 md:pt-16 transition-all duration-[700ms]
            ${isChanging ? 'opacity-0 scale-[0.99] blur-md translate-y-3' : 'opacity-100 scale-100 blur-0 translate-y-0'}
          `}
        >
          {filteredAnime.length === 0 ? (
            <div className="w-full text-center py-20">
              <h2 className="text-2xl md:text-4xl font-cinzel font-black text-white/5 tracking-[0.5em] uppercase">
                UNWORTHY
              </h2>
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
                  cardRef={(el) => {
                    cardRefs.current[anime.id] = el;
                  }}
                />
              </div>
            ))
          )}
        </main>
      )}

      {/* FOCUS MODE */}
      {selectedAnime && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-0 md:p-8 lg:p-16">
          {/* Backdrop: weniger Blur -> weniger GPU lag */}
          <div
            className="absolute inset-0 bg-black/90"
            onClick={closeFocus}
            aria-hidden="true"
          />

          <div
            className="relative w-full max-w-6xl h-full md:h-[80vh] bg-[#050505] border-0 md:border border-yellow-500/15 overflow-hidden flex flex-col lg:flex-row shadow-2xl"
            role="dialog"
            aria-modal="true"
          >
            {/* Left cover */}
            <div className="lg:w-[40%] h-[40%] lg:h-full relative overflow-hidden">
              <img
                src={selectedAnime.coverImageURL}
                alt={selectedAnime.title}
                className="w-full h-full object-cover object-top"
                decoding="async"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#050505] hidden lg:block" />

              <button
                onClick={closeFocus}
                className="absolute top-4 left-4 md:top-6 md:left-6 w-10 h-10 md:w-12 md:h-12 border border-yellow-500/30 flex items-center justify-center hover:bg-yellow-500 hover:text-black transition-all duration-300 z-50"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Right content (themed scrollbar) */}
            <div className="themed-scrollbar flex-1 p-6 md:p-10 lg:p-16 flex flex-col justify-start overflow-y-auto">
              <div className="mb-4 md:mb-8">
                <div className="flex items-center gap-4 mb-4 md:mb-8 text-yellow-500/25">
                  <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em]">
                    PRIDE_ENTRY_#0{selectedAnime.id}
                  </span>
                  <div className="h-px flex-1 bg-yellow-500/10" />
                </div>

                <h2 className="text-2xl md:text-4xl lg:text-6xl font-cinzel font-black mb-4 md:mb-6 leading-[0.92] tracking-tighter uppercase text-white">
                  {selectedAnime.title}
                </h2>

                {/* Genres: horizontal scroll + themed scrollbar */}
                <div className="themed-scrollbar-sm overflow-x-auto pb-2 -mb-2">
                  <div className="flex gap-2 md:gap-3 mb-4 md:mb-8 min-w-max">
                    {selectedAnime.genres.map((g) => (
                      <span
                        key={g}
                        className="px-2 md:px-4 py-1 md:py-1.5 border border-yellow-500/18 text-[7px] md:text-[9px] font-black uppercase hover:bg-yellow-500 hover:text-black transition-all duration-300 tracking-widest bg-black/20"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 md:gap-10 mb-6 md:mb-10 border-y border-yellow-500/10 py-4 md:py-8">
                <div>
                  <h4 className="text-[8px] md:text-[9px] font-black text-gray-700 uppercase tracking-widest mb-1 md:mb-2">
                    Era
                  </h4>
                  <p className="text-xl md:text-3xl font-cinzel font-black tracking-tighter text-yellow-500">
                    {selectedAnime.releaseYear}
                  </p>
                </div>
                <div>
                  <h4 className="text-[8px] md:text-[9px] font-black text-gray-700 uppercase tracking-widest mb-1 md:mb-2">
                    Status
                  </h4>
                  <p className="text-xl md:text-3xl font-cinzel font-black uppercase tracking-tighter text-yellow-500">
                    {selectedAnime.status}
                  </p>
                </div>
              </div>

              <div className="space-y-6 md:space-y-10">
                {/* Description: keeps readable, no extra nested scroll needed */}
                <p className="text-sm md:text-xl lg:text-2xl font-light text-gray-300/75 leading-snug italic border-l-2 border-yellow-500/70 pl-4 md:pl-8 py-1">
                  "{selectedAnime.description}"
                </p>

                <div className="pt-2 md:pt-4 flex flex-col sm:flex-row gap-3 md:gap-4 pb-8 md:pb-0">
                  <button
                    className="flex-1 bg-yellow-500 text-black font-cinzel font-black py-3 md:py-4 px-6 md:px-10 text-[9px] md:text-xs tracking-[0.4em] uppercase hover:bg-white transition-all duration-300 shadow-lg"
                    onClick={() =>
                      window.open(
                        `https://myanimelist.net/search/all?q=${encodeURIComponent(selectedAnime.title)}`,
                        '_blank',
                        'noopener,noreferrer'
                      )
                    }
                  >
                    EXPLORE →
                  </button>

                  <button
                    className="flex-1 border border-yellow-500/45 text-yellow-500 font-cinzel font-black py-3 md:py-4 px-6 md:px-10 text-[9px] md:text-xs tracking-[0.4em] uppercase hover:bg-yellow-500 hover:text-black transition-all duration-300"
                    onClick={() => openExternalTrailer(selectedAnime)}
                  >
                    VIEW TRAILER ↗
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 md:p-10 flex justify-between items-end pointer-events-none z-40 bg-gradient-to-t from-black/70 to-transparent">
        <div />
        <div className="flex flex-col md:flex-row items-end md:items-center gap-4 md:gap-12 pointer-events-auto w-full md:w-auto">
          <div className="flex gap-2 md:gap-3 items-center justify-end w-full md:w-auto">
            {CATEGORIES.map((cat, i) => (
              <div
                key={i}
                className={`w-0.5 md:w-1 h-0.5 md:h-1 rounded-none transition-all duration-[800ms] ${
                  CATEGORIES.indexOf(selectedCategory) === i
                    ? 'bg-yellow-500 scale-[2] md:scale-[2.5] rotate-45 shadow-[0_0_10px_rgba(234,179,8,0.9)]'
                    : 'bg-white/5'
                }`}
              />
            ))}
          </div>
          <p className="text-[7px] md:text-[10px] font-cinzel font-black tracking-[0.4em] md:tracking-[0.8em] text-yellow-500/10 uppercase italic">
            "WHO DECIDED THAT?"
          </p>
        </div>
      </footer>
    </div>
  );
}
