import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ANIME_LIST, CATEGORIES } from './constants';
import { Anime } from './types';

/* ========== CUSTOM CURSOR (PIXELGENAU, NUR PC/MAUS) ========== */
function Cursor({ enabled = true }: { enabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const ticking = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Touch/Handy: kein Custom Cursor
    const isCoarse = window.matchMedia?.('(pointer: coarse)').matches ?? false;
    if (isCoarse) return;

    // Systemcursor aus, solange enabled
    document.body.style.cursor = enabled ? 'none' : 'default';
    if (!enabled) return;

    const update = (x: number, y: number) => {
      const el = ref.current;
      if (el) {
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
      }
      ticking.current = false;
    };

    const onMove = (e: MouseEvent) => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => update(e.clientX, e.clientY));
    };

    document.addEventListener('mousemove', onMove, { passive: true });

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.body.style.cursor = 'default';
    };
  }, [enabled]);

  if (typeof window === 'undefined') return null;
  const isCoarse = window.matchMedia?.('(pointer: coarse)').matches ?? false;
  if (isCoarse) return null;
  if (!enabled) return null;

  return (
    <div
      ref={ref}
      className="fixed pointer-events-none z-[99999]"
      style={{ transform: 'translate(-50%, -50%)' }}
    >
      <div className="w-6 h-6 rounded-full border-2 border-yellow-500/60 bg-yellow-500/20 backdrop-blur-md flex items-center justify-center shadow-2xl">
        <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full shadow-lg" />
      </div>
    </div>
  );
}

/* ========== ANIME CARD ========== */
const AnimeCard = memo(function AnimeCard({
  anime,
  active,
  onSelect,
  onHover,
  onUnhover,
}: {
  anime: Anime;
  active: boolean;
  onSelect: () => void;
  onHover: () => void;
  onUnhover: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      onMouseEnter={onHover}
      onMouseLeave={onUnhover}
      className={`
        relative h-[45vh] md:h-[50vh] flex-shrink-0 overflow-hidden 
        border border-yellow-500/10 group transition-all duration-500 rounded-xl
        ${active
          ? 'w-[90vw] md:w-[420px] mx-2 md:mx-3 z-20 brightness-100 grayscale-0 shadow-2xl scale-[1.02]'
          : 'w-[70vw] md:w-[150px] mx-1 md:mx-1 grayscale brightness-[0.4] hover:brightness-[0.6]'
        }
      `}
    >
      <img
        src={anime.coverImageURL}
        alt={anime.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
        decoding="async"
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />
      <div
        className={`absolute bottom-0 left-0 p-4 md:p-6 transition-all duration-300 ${
          active
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 group-hover:opacity-80 group-hover:translate-y-0'
        }`}
      >
        <h2 className="text-xl md:text-2xl font-bold text-yellow-400 drop-shadow-2xl line-clamp-2 leading-tight">
          {anime.title}
        </h2>
        <p className="text-xs md:text-sm text-gray-300 line-clamp-2 mt-1.5 leading-relaxed">
          {anime.description}
        </p>
      </div>
    </div>
  );
});

/* ========== MAIN APP ========== */
export default function App() {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);

  const filteredAnime = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ANIME_LIST.filter((a) => {
      const matchCat = category === 'All' || a.category === category;
      const matchSearch = !q || a.title.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [category, search]);

  const openDetail = useCallback((anime: Anime) => {
    setSelectedAnime(anime);
    setHoveredId(null);
  }, []);

  const closeDetail = useCallback(() => {
    setSelectedAnime(null);
    setHoveredId(null);
  }, []);

  // Escape schließen + Body Scroll lock (verhindert janky scroll)
  useEffect(() => {
    if (!selectedAnime) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDetail();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [selectedAnime, closeDetail]);

  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-[#0a0a0a] via-[#030303] to-[#1a0a0a] text-white overflow-hidden">
      {/* Cursor IMMER sichtbar auf PC (auch im Modal). Auf Mobile automatisch aus. */}
      <Cursor enabled />

      {/* HEADER */}
      <header className="p-4 md:p-6 flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-yellow-500/20 bg-black/40 backdrop-blur-md sticky top-0 z-40">
        <h1 className="text-yellow-500 font-black text-xl md:text-2xl tracking-wider drop-shadow-lg">
          Goats of Anime
        </h1>

        <div className="flex gap-2 md:gap-4 overflow-x-auto pb-1 -mb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 md:px-3 md:py-1.5 border rounded-full text-xs md:text-sm whitespace-nowrap flex-shrink-0 transition-all duration-300 backdrop-blur-sm hover:scale-105 ${
                category === cat
                  ? 'border-yellow-500 text-yellow-400 bg-yellow-500/15 shadow-lg shadow-yellow-500/25'
                  : 'border-transparent text-gray-400 hover:text-yellow-300 hover:border-yellow-500/50'
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
          className="bg-black/60 border border-yellow-500/40 px-4 py-2.5 text-sm rounded-xl backdrop-blur-md w-full sm:w-72 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/40 transition-all duration-300 placeholder-gray-400"
        />
      </header>

      {/* MAIN RAIL (nimmt automatisch Resthöhe) */}
      <main
        onMouseLeave={() => setHoveredId(null)}
        className="flex-1 min-h-0 flex items-center gap-2 overflow-x-auto px-4 md:px-10 py-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-yellow-500/30 scrollbar-track-transparent"
      >
        {filteredAnime.map((anime) => (
          <AnimeCard
            key={anime.id}
            anime={anime}
            active={hoveredId === anime.id}
            onSelect={() => openDetail(anime)}
            onHover={() => setHoveredId(anime.id)}
            onUnhover={() => setHoveredId((cur) => (cur === anime.id ? null : cur))}
          />
        ))}

        {filteredAnime.length === 0 && (
          <div className="text-center w-full text-gray-500 py-20 text-lg flex flex-col items-center gap-4">
            <div className="text-5xl">😢</div>
            <div>No Anime Found</div>
          </div>
        )}
      </main>

      {/* DETAIL VIEW (Performance-friendly) */}
      {selectedAnime && (
        <div
          className="detail-modal fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4"
          onClick={closeDetail}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-6xl max-h-[95vh] bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] border-2 border-yellow-500/50 rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeDetail}
              className="absolute top-4 md:top-6 right-4 md:right-6 text-yellow-400 hover:text-yellow-300 text-3xl font-black z-10 p-3 rounded-2xl hover:bg-yellow-500/20 transition-all duration-200 shadow-xl hover:scale-105"
              aria-label="Close"
            >
              ×
            </button>

            <div className="p-6 md:p-10 max-h-[95vh] overflow-y-auto">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-yellow-400 mb-8 md:mb-10 drop-shadow-2xl text-center leading-tight tracking-tight">
                {selectedAnime.title}
              </h2>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-12 items-start">
                {/* Cover */}
                <div className="order-2 xl:order-1">
                  <div className="relative overflow-hidden rounded-2xl border-4 border-yellow-500/40 shadow-2xl">
                    <img
                      src={selectedAnime.coverImageURL}
                      alt={selectedAnime.title}
                      className="w-full aspect-[2/3] md:aspect-[3/4] object-cover"
                      loading="eager"
                      decoding="async"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>

                {/* Info + Comment */}
                <div className="order-1 xl:order-2 space-y-8">
                  {/* Description */}
                  <div className="space-y-3">
                    <h3 className="text-lg md:text-xl font-semibold text-yellow-300 tracking-wide">
                      Description
                    </h3>
                    <p className="text-sm md:text-base lg:text-lg text-gray-200 leading-relaxed">
                      {selectedAnime.description}
                    </p>
                  </div>

                  {/* Genres */}
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-yellow-300 tracking-wide mb-4">
                      Genres
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedAnime.genres.map((g) => (
                        <span
                          key={g}
                          className="px-4 py-2 border border-yellow-500/50 text-yellow-300 text-sm md:text-base rounded-xl bg-yellow-500/10 font-semibold hover:bg-yellow-500/20 transition-all duration-200"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* COMMENT SECTION */}
                  <div className="pt-8 border-t-2 border-yellow-500/30">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 rounded-2xl flex items-center justify-center font-black text-black text-xl md:text-2xl flex-shrink-0 shadow-2xl ring-4 ring-yellow-400/30">
                        ME
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg md:text-xl font-semibold text-yellow-300 mb-4 tracking-wide">
                          My Comment
                        </h3>

                        {selectedAnime.category === 'must watch' ? (
                          <div className="text-xl md:text-2xl lg:text-3xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 bg-clip-text text-transparent drop-shadow-2xl">
                            🔥 JUST PEAK CINEMA 🔥
                          </div>
                        ) : (
                          <div className="text-lg md:text-xl lg:text-2xl text-gray-100 font-medium italic bg-gradient-to-r from-gray-900/80 to-black/60 px-6 md:px-8 py-6 md:py-8 rounded-2xl border-2 border-gray-700/50 shadow-2xl">
                            {selectedAnime.comment || 'No notes yet...'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t-2 border-yellow-500/20">
                    {selectedAnime.trailerUrl && (
                      <button
                        onClick={() =>
                          window.open(selectedAnime.trailerUrl, '_blank', 'noopener,noreferrer')
                        }
                        className="flex-1 px-8 py-4 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 text-black font-black text-base md:text-lg rounded-2xl shadow-2xl transition-all duration-300 hover:brightness-110 hover:-translate-y-1"
                      >
                        ▶ Watch Trailer
                      </button>
                    )}

                    <button
                      onClick={closeDetail}
                      className="flex-1 px-8 py-4 border-2 border-yellow-500 text-yellow-400 font-semibold text-base md:text-lg rounded-2xl hover:bg-yellow-500/20 hover:border-yellow-400 hover:text-yellow-300 transition-all duration-200 shadow-xl"
                    >
                      Back to List
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
