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

      {/* DETAIL VIEW - MIT KOMMENTAR */}
      {selectedAnime && (
        <div
          className="fixed inset-0 bg-gradient-to-br from-black/95 via-black/90 to-yellow-900/20 z-50 flex items-center justify-center p-4 md:p-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(251, 191, 36, 0.1) 0%, transparent 50%), 
                             radial-gradient(circle at 80% 20%, rgba(251, 191, 36, 0.05) 0%, transparent 50%)`
          }}
          onClick={() => setSelectedAnime(null)}
        >
          <div
            className="relative w-full max-w-5xl bg-[#050505]/95 backdrop-blur-sm border border-yellow-500/40 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setSelectedAnime(null)}
              className="absolute top-4 right-4 text-yellow-300 hover:text-yellow-100 text-xl font-bold z-10"
            >
              ×
            </button>

            <div className="flex flex-col lg:flex-row gap-8 p-8 lg:p-10">
              {/* Left: Cover */}
              <div className="lg:w-1/3 flex-shrink-0">
                <div className="relative overflow-hidden rounded-xl border border-yellow-500/30 shadow-xl">
                  <img
                    src={selectedAnime.coverImageURL}
                    alt={selectedAnime.title}
                    className="w-full h-96 lg:h-[500px] object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                </div>
              </div>

              {/* Right: Info + Kommentar */}
              <div className="lg:w-2/3 flex flex-col gap-6">
                <div>
                  <h2 className="text-4xl lg:text-5xl font-black text-yellow-400 mb-3 leading-tight">
                    {selectedAnime.title}
                  </h2>
                  {('originalTitle' in selectedAnime && selectedAnime.originalTitle) && (
                    <p className="text-lg text-yellow-200/80 italic font-light">
                      {selectedAnime.originalTitle}
                    </p>
                  )}
                </div>

                {/* Meta row */}
                <div className="flex flex-wrap gap-3 text-sm lg:text-base text-gray-300">
                  {'year' in selectedAnime && selectedAnime.year && (
                    <span className="px-4 py-2 rounded-full bg-yellow-500/15 border border-yellow-500/40 font-medium">
                      {selectedAnime.year}
                    </span>
                  )}
                  {'status' in selectedAnime && selectedAnime.status && (
                    <span className="px-3 py-1.5 rounded-lg bg-gray-800/50 border border-yellow-500/20">
                      {selectedAnime.status}
                    </span>
                  )}
                  {'episodes' in selectedAnime && selectedAnime.episodes && (
                    <span className="px-3 py-1.5 rounded-lg bg-gray-800/50 border border-yellow-500/20">
                      {typeof selectedAnime.episodes === 'number' ? `${selectedAnime.episodes} Ep.` : selectedAnime.episodes}
                    </span>
                  )}
                  {'category' in selectedAnime && selectedAnime.category && (
                    <span className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 font-semibold">
                      {selectedAnime.category}
                    </span>
                  )}
                  {'rating' in selectedAnime && selectedAnime.rating && (
                    <span className="px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 font-bold text-yellow-400">
                      ★ {selectedAnime.rating}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-base lg:text-lg text-gray-200 leading-relaxed max-h-32 lg:max-h-40 overflow-y-auto pr-2">
                  {selectedAnime.description}
                </p>

                {/* Genres */}
                <div className="flex flex-wrap gap-2">
                  {selectedAnime.genres.map((g) => (
                    <span
                      key={g}
                      className="px-4 py-2 border border-yellow-500/40 text-yellow-300 text-sm rounded-full bg-yellow-500/5 backdrop-blur-sm font-medium hover:bg-yellow-500/10 transition-all"
                    >
                      {g}
                    </span>
                  ))}
                </div>

                {/* 🎯 DEIN KOMMENTAR-BEREICH */}
                <div className="pt-6 border-t border-yellow-500/20">
                  <div className="flex items-start gap-4 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center font-bold text-black text-sm flex-shrink-0">
                      ME
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-yellow-300 mb-1">Dein Kommentar:</p>
                      {('category' in selectedAnime && selectedAnime.category === 'must watch') ? (
                        <p className="text-lg font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent drop-shadow-lg">
                          🔥 JUST PEAK CINEMA 🔥
                        </p>
                      ) : (
                        <p className="text-base text-gray-100 leading-relaxed italic bg-gray-900/50 px-4 py-3 rounded-xl border border-gray-700/50 backdrop-blur-sm">
                          {('comment' in selectedAnime && selectedAnime.comment) 
                            ? selectedAnime.comment 
                            : 'Noch keine Notizen...'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-4 pt-4 border-t border-yellow-500/20">
                  {'trailerUrl' in selectedAnime && selectedAnime.trailerUrl && (
                    <button
                      onClick={() =>
                        window.open(
                          selectedAnime.trailerUrl as string,
                          '_blank',
                          'noopener,noreferrer'
                        )
                      }
                      className="group relative px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-lg rounded-xl hover:from-yellow-400 hover:to-orange-400 shadow-lg hover:shadow-yellow-500/25 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      ▶ Watch Trailer
                    </span>
                  )}

                  <button
                    onClick={() => setSelectedAnime(null)}
                    className="px-8 py-4 border-2 border-yellow-500/50 text-yellow-300 font-bold text-lg rounded-xl hover:bg-yellow-500/20 backdrop-blur-sm transition-all hover:scale-[1.02]"
                  >
                    ← Zurück zur Liste
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
