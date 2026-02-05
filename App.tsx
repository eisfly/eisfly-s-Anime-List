import React, { useState, useMemo, useRef, useCallback, memo } from 'react';
import { ANIME_LIST, CATEGORIES } from './constants';
import { Anime } from './types';

/* ========== CUSTOM CURSOR ========== */
const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    document.body.style.cursor = 'none';
    
    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    window.addEventListener('mousemove', moveCursor);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.body.style.cursor = '';
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
    >
      <div className="w-6 h-6 rounded-full border border-yellow-500/50 flex items-center justify-center bg-yellow-500/10">
        <div className="w-2 h-2 bg-yellow-400 rounded-full" />
      </div>
    </div>
  );
};

/* ========== ANIME CARD ========== */
const AnimeCard = memo(
  ({
    anime,
    active,
    onSelect,
    registerRef,
  }: {
    anime: Anime;
    active: boolean;
    onSelect: () => void;
    registerRef: (el: HTMLDivElement | null) => void;
  }) => {
    return (
      <div
        ref={registerRef}
        onClick={onSelect}
        className={`
          kinetic-card relative h-[45vh] flex-shrink-0 overflow-hidden 
          border border-yellow-500/10 group transition-all duration-500
          ${active
            ? 'w-[420px] mx-3 z-20 brightness-100 grayscale-0'
            : 'w-[150px] mx-1 grayscale brightness-[0.4] hover:brightness-[0.6]'
          }
        `}
      >
        <img
          src={anime.coverImageURL}
          alt={anime.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        <div
          className={`
            absolute bottom-0 left-0 p-6 transition-all
            ${active ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <h2 className="text-2xl font-bold text-yellow-400">
            {anime.title}
          </h2>

          <p className="text-sm text-gray-300 line-clamp-2 mt-2">
            {anime.description}
          </p>
        </div>
      </div>
    );
  }
);

/* ========== MAIN APP ========== */
export default function App() {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);

  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const filteredAnime = useMemo(() => {
    return ANIME_LIST.filter((a) => {
      const matchCat = category === 'All' || a.category === category;
      const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [category, search]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (selectedAnime) return;

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
    },
    [selectedAnime]
  );

  return (
    <div className="h-screen w-screen bg-[#030303] text-white overflow-hidden">
      <Cursor />

      {/* HEADER */}
      <header className="p-6 flex flex-col md:flex-row gap-6 items-center justify-between border-b border-yellow-500/10">
        <h1 className="text-yellow-500 font-bold text-xl">
          Anime Archive
        </h1>

        <div className="flex gap-4 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 border ${
                category === cat
                  ? 'border-yellow-500 text-yellow-400'
                  : 'border-transparent text-gray-500'
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
          className="bg-black border border-yellow-500/20 px-4 py-2 text-sm"
        />
      </header>

      {/* MAIN RAIL */}
      <main
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredId(null)}
        className="flex items-center gap-2 overflow-x-auto h-full px-10"
      >
        {filteredAnime.map((anime) => (
          <AnimeCard
            key={anime.id}
            anime={anime}
            active={hoveredId === anime.id}
            onSelect={() => setSelectedAnime(anime)}
            registerRef={(el) => (cardRefs.current[anime.id] = el)}
          />
        ))}

        {filteredAnime.length === 0 && (
          <div className="text-center w-full text-gray-600">
            No Anime Found
          </div>
        )}
      </main>

      {/* DETAIL VIEW - FIX */}
      {selectedAnime && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 md:p-10"
          onClick={() => setSelectedAnime(null)}
        >
          <div
            className="relative w-full max-w-5xl bg-[#050505] border border-yellow-500/30 rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedAnime(null)}
              className="absolute top-4 right-4 text-yellow-300 hover:text-yellow-100 text-sm tracking-wide z-10"
            >
              ×
            </button>

            <div className="flex flex-col md:flex-row gap-6 md:gap-10 p-6 md:p-8">
              {/* Cover */}
              <div className="md:w-1/3 flex-shrink-0">
                <div className="relative overflow-hidden rounded-lg border border-yellow-500/20 h-96">
                  <img
                    src={selectedAnime.coverImageURL}
                    alt={selectedAnime.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="md:w-2/3 flex flex-col gap-4">
                <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">
                  {selectedAnime.title}
                </h2>

                <p className="text-sm md:text-base text-gray-200 leading-relaxed max-h-40 overflow-y-auto pr-1">
                  {selectedAnime.description}
                </p>

                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedAnime.genres.map((g) => (
                    <span key={g} className="px-3 py-1 border border-yellow-500/30 text-yellow-200 text-sm rounded-full bg-yellow-500/5">
                      {g}
                    </span>
                  ))}
                </div>

                {/* KOMMENTAR-BEREICH */}
                <div className="border-t border-yellow-500/30 pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center font-bold text-black text-lg flex-shrink-0 mt-1">
                      ME
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-yellow-300 mb-3">short comment from eisfly:</h4>
                      {selectedAnime.category === 'must watch' ? (
                        <p className="text-xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent drop-shadow-lg">
                          🔥 JUST PEAK CINEMA 🔥
                        </p>
                      ) : (
                        <div className="text-lg text-gray-100 italic bg-gray-900/60 px-6 py-4 rounded-xl border border-gray-700/50">
                          {selectedAnime.comment || 'Noch keine Notizen...'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap gap-4 mt-auto">
                  {selectedAnime.trailerUrl && (
                    <button
                      onClick={() => window.open(selectedAnime.trailerUrl, '_blank', 'noopener,noreferrer')}
                      className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-all flex items-center gap-2"
                    >
                      ▶ Watch Trailer
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedAnime(null)}
                    className="px-6 py-3 border border-yellow-500 text-yellow-400 font-semibold rounded-lg hover:bg-yellow-500/20 transition-all"
                  >
                    Zurück zur Liste
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
