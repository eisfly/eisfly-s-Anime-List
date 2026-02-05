import React, { useState, useMemo, useRef, useCallback, memo } from 'react';
import { ANIME_LIST, CATEGORIES } from './constants';
import { Anime } from './types';

/* ========== CUSTOM CURSOR ========== */
const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform =
          `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
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

      {/* DETAIL VIEW */}
      {selectedAnime && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 md:p-10">
          <div className="relative w-full max-w-5xl bg-[#050505] border border-yellow-500/30 rounded-xl overflow-hidden shadow-2xl">
            {/* Close */}
            <button
              onClick={() => setSelectedAnime(null)}
              className="absolute top-4 right-4 text-yellow-300 hover:text-yellow-100 text-sm tracking-wide"
            >
              CLOSE ✕
            </button>

            <div className="flex flex-col md:flex-row gap-6 md:gap-10 p-6 md:p-8">
              {/* Left: Cover */}
              <div className="md:w-1/3 flex-shrink-0">
                <div className="relative overflow-hidden rounded-lg border border-yellow-500/20">
                  <img
                    src={selectedAnime.coverImageURL}
                    alt={selectedAnime.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
              </div>

              {/* Right: Info */}
              <div className="md:w-2/3 flex flex-col gap-4">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">
                    {selectedAnime.title}
                  </h2>

                  {selectedAnime.originalTitle && (
                    <p className="text-sm text-yellow-200/70 italic">
                      {selectedAnime.originalTitle}
                    </p>
                  )}
                </div>

                {/* Meta row – optional Felder je nach Typ */}
                <div className="flex flex-wrap gap-3 text-xs md:text-sm text-gray-300">
                  {'year' in selectedAnime && selectedAnime.year && (
                    <span className="px-2 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30">
                      {selectedAnime.year}
                    </span>
                  )}
                  {'status' in selectedAnime && selectedAnime.status && (
                    <span className="px-2 py-1 rounded-full bg-yellow-500/5 border border-yellow-500/20">
                      {selectedAnime.status}
                    </span>
                  )}
                  {'episodes' in selectedAnime && selectedAnime.episodes && (
                    <span className="px-2 py-1 rounded-full bg-yellow-500/5 border border-yellow-500/20">
                      {selectedAnime.episodes} Episodes
                    </span>
                  )}
                  {'category' in selectedAnime && selectedAnime.category && (
                    <span className="px-2 py-1 rounded-full bg-yellow-500/5 border border-yellow-500/20">
                      {selectedAnime.category}
                    </span>
                  )}
                  {'rating' in selectedAnime && selectedAnime.rating && (
                    <span className="px-2 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/40">
                      ★ {selectedAnime.rating}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm md:text-base text-gray-200 leading-relaxed max-h-40 md:max-h-48 overflow-y-auto pr-1">
                  {selectedAnime.description}
                </p>

                {/* Genres */}
                <div className="flex flex-wrap gap-2">
                  {selectedAnime.genres.map((g) => (
                    <span
                      key={g}
                      className="px-2 py-1 border border-yellow-500/30 text-yellow-200 text-xs rounded-full bg-yellow-500/5"
                    >
                      {g}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-2 flex flex-wrap gap-3">
                  {selectedAnime.trailerUrl && (
                    <button
                      onClick={() =>
                        window.open(
                          selectedAnime.trailerUrl,
                          '_blank',
                          'noopener,noreferrer'
                        )
                      }
                      className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black text-sm font-semibold rounded-md hover:bg-yellow-400 transition-colors"
                    >
                      ▶ Watch trailer
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedAnime(null)}
                    className="px-4 py-2 border border-yellow-500/40 text-yellow-200 text-sm rounded-md hover:bg-yellow-500/10 transition-colors"
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
