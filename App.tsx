import React, { useState, useMemo, useRef, useCallback, memo, useEffect } from 'react';
import { ANIME_LIST, CATEGORIES } from './constants';
import { Anime } from './types';

/* ========== SMOOTH CURSOR - LAG FREE IN DETAIL VIEW ========== */
const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  React.useEffect(() => {
    if (window.innerWidth <= 768) return;

    document.body.style.cursor = 'none';

    const moveCursor = (e: MouseEvent) => {
      if (!isDetailOpen) {
        mousePos.current = { x: e.clientX, y: e.clientY };
      }
    };

    const updateCursor = () => {
      if (!isDetailOpen && cursorRef.current) {
        cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * 0.15;
        cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * 0.15;
        cursorRef.current.style.transform = `translate3d(${cursorPos.current.x}px, ${cursorPos.current.y}px, 0)`;
      }
      rafRef.current = requestAnimationFrame(updateCursor);
    };

    updateCursor();
    window.addEventListener('mousemove', moveCursor);
    
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', moveCursor);
      document.body.style.cursor = '';
    };
  }, [isDetailOpen]);

  // Hide cursor completely on mobile or detail view
  if (window.innerWidth <= 768 || isDetailOpen) return null;

  return (
    <div ref={cursorRef} className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2">
      <div className="w-6 h-6 rounded-full border border-yellow-500/50 flex items-center justify-center bg-yellow-500/10 backdrop-blur-sm shadow-lg">
        <div className="w-2 h-2 bg-yellow-400 rounded-full" />
      </div>
    </div>
  );
};

/* ========== ANIME CARD ========== */
const AnimeCard = memo(({ anime, active, onSelect, registerRef }: {
  anime: Anime;
  active: boolean;
  onSelect: () => void;
  registerRef: (el: HTMLDivElement | null) => void;
}) => (
  <div
    ref={registerRef}
    onClick={onSelect}
    className={`
      relative h-[45vh] md:h-[50vh] flex-shrink-0 overflow-hidden 
      border border-yellow-500/10 group transition-all duration-500 rounded-lg shadow-lg
      ${active
        ? 'w-[90vw] md:w-[420px] mx-2 md:mx-3 z-20 brightness-100 grayscale-0 shadow-2xl scale-105'
        : 'w-[70vw] md:w-[150px] mx-1 md:mx-1 grayscale brightness-[0.4] hover:brightness-[0.6]'
      }
    `}
  >
    <img
      src={anime.coverImageURL}
      alt={anime.title}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      loading="lazy"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
    <div className={`absolute bottom-0 left-0 p-4 md:p-6 transition-all ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
      <h2 className="text-xl md:text-2xl font-bold text-yellow-400 drop-shadow-lg line-clamp-2">
        {anime.title}
      </h2>
      <p className="text-xs md:text-sm text-gray-300 line-clamp-2 mt-2">
        {anime.description}
      </p>
    </div>
  </div>
));

/* ========== MAIN APP ========== */
export default function App() {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const filteredAnime = useMemo(() => {
    return ANIME_LIST.filter((a) => {
      const matchCat = category === 'All' || a.category === category;
      const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [category, search]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (selectedAnime || window.innerWidth <= 768) return;

    let found: string | null = null;
    for (const [id, el] of Object.entries(cardRefs.current)) {
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (e.clientX >= rect.left && e.clientX <= rect.right) {
        found = id;
        break;
      }
    }
    setHoveredId((prev) => (prev === found ? prev : found));
  }, [selectedAnime]);

  const openDetail = useCallback((anime: Anime) => {
    setSelectedAnime(anime);
    setIsDetailOpen(true);
  }, []);

  const closeDetail = useCallback(() => {
    setSelectedAnime(null);
    setIsDetailOpen(false);
    setHoveredId(null);
  }, []);

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[#030303] to-[#0a0a0a] text-white overflow-hidden">
      <Cursor isDetailOpen={isDetailOpen} />

      {/* HEADER */}
      <header className="p-4 md:p-6 flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-yellow-500/10 bg-black/30 backdrop-blur-sm sticky top-0 z-30">
        <h1 className="text-yellow-500 font-black text-xl md:text-2xl tracking-wide">
          Anime Archive
        </h1>

        <div className="flex gap-2 md:gap-4 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 md:px-3 md:py-1 border rounded-full text-xs md:text-sm whitespace-nowrap flex-shrink-0 transition-all backdrop-blur-sm ${
                category === cat
                  ? 'border-yellow-500 text-yellow-400 bg-yellow-500/10 shadow-md'
                  : 'border-transparent text-gray-500 hover:text-yellow-400 hover:border-yellow-500/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <input
          placeholder="Search Anime..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-black/50 border border-yellow-500/30 px-4 py-2 text-sm rounded-lg backdrop-blur-sm w-full sm:w-64 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all"
        />
      </header>

      {/* MAIN RAIL */}
      <main
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredId(null)}
        className="flex items-center gap-2 overflow-x-auto h-[calc(100vh-140px)] px-4 md:px-10 py-4 snap-x snap-mandatory scrollbar-hide"
      >
        {filteredAnime.map((anime) => (
          <AnimeCard
            key={anime.id}
            anime={anime}
            active={hoveredId === anime.id}
            onSelect={() => openDetail(anime)}
            registerRef={(el) => (cardRefs.current[anime.id] = el)}
          />
        ))}

        {filteredAnime.length === 0 && (
          <div className="text-center w-full text-gray-500 py-20 text-lg flex flex-col items-center">
            <span className="text-4xl mb-4">😢</span>
            No Anime Found
          </div>
        )}
      </main>

      {/* DETAIL VIEW - 100% LAG FREE */}
      {selectedAnime && (
        <>
          {/* Background Overlay */}
          <div 
            className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50"
            onClick={closeDetail}
          />
          
          {/* Content */}
          <div className="fixed inset-0 z-[51] flex items-center justify-center p-4 pointer-events-none">
            <div
              className="relative w-full max-w-4xl max-h-[90vh] bg-[#0a0a0a]/95 border border-yellow-500/40 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto max-w-lg mx-4 lg:max-w-5xl lg:max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeDetail}
                className="absolute top-4 right-4 text-yellow-400 hover:text-yellow-200 text-2xl font-bold z-10 p-2 rounded-full hover:bg-yellow-500/20 transition-all backdrop-blur-sm"
                aria-label="Close"
              >
                ×
              </button>

              <div className="p-6 md:p-8 overflow-y-auto max-h-[90vh]">
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-yellow-400 mb-6 md:mb-8 drop-shadow-2xl text-center md:text-left leading-tight">
                  {selectedAnime.title}
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-start">
                  {/* Cover */}
                  <div className="order-2 lg:order-1">
                    <div className="relative overflow-hidden rounded-xl border-2 border-yellow-500/30 shadow-2xl">
                      <img
                        src={selectedAnime.coverImageURL}
                        alt={selectedAnime.title}
                        className="w-full h-64 md:h-80 lg:h-[450px] object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                    </div>
                  </div>

                  {/* Info + Comment */}
                  <div className="order-1 lg:order-2 flex flex-col h-full">
                    {/* Description */}
                    <p className="text-sm md:text-base lg:text-lg text-gray-200 leading-relaxed mb-6 md:mb-8 flex-1">
                      {selectedAnime.description}
                    </p>

                    {/* Genres */}
                    <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
                      {selectedAnime.genres.map((g) => (
                        <span
                          key={g}
                          className="px-3 py-1.5 border border-yellow-500/40 text-yellow-300 text-xs md:text-sm rounded-full bg-yellow-500/5 font-medium backdrop-blur-sm hover:bg-yellow-500/10 transition-all"
                        >
                          {g}
                        </span>
                      ))}
                    </div>

                    {/* COMMENT SECTION */}
                    <div className="border-t border-yellow-500/30 pt-6 mb-8">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center font-bold text-black text-sm md:text-lg flex-shrink-0 mt-1 shadow-lg">
                          ME
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs md:text-sm font-semibold text-yellow-300 mb-3 tracking-wide">
                            My Comment:
                          </h4>
                          {selectedAnime.category === 'must watch' ? (
                            <p className="text-lg md:text-xl lg:text-2xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent drop-shadow-lg animate-pulse">
                              🔥 JUST PEAK CINEMA 🔥
                            </p>
                          ) : (
                            <div className="text-base md:text-lg lg:text-xl text-gray-100 italic bg-gray-900/70 px-4 md:px-6 py-3 md:py-4 rounded-xl border border-gray-700/60 backdrop-blur-sm shadow-lg hover:shadow-yellow-500/10 transition-all">
                              {selectedAnime.comment || 'No notes yet...'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-yellow-500/20">
                      {selectedAnime.trailerUrl && (
                        <button
                          onClick={() => window.open(selectedAnime.trailerUrl, '_blank', 'noopener,noreferrer')}
                          className="flex-1 px-6 py-3 md:py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-sm md:text-base lg:text-lg rounded-xl hover:from-yellow-400 hover:to-orange-400 shadow-lg hover:shadow-yellow-500/25 transition-all duration-300 hover:-translate-y-1"
                        >
                          ▶ Watch Trailer
                        </button>
                      )}
                      <button
                        onClick={closeDetail}
                        className="flex-1 px-6 py-3 md:py-4 border-2 border-yellow-500 text-yellow-400 font-semibold text-sm md:text-base lg:text-lg rounded-xl hover:bg-yellow-500/20 hover:border-yellow-400 transition-all duration-300 backdrop-blur-sm"
                      >
                        Back to List
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
