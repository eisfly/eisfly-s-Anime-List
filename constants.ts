import React, { useState, useMemo, useRef, useEffect, useCallback, memo } from 'react';
import { ANIME_LIST, CATEGORIES } from './constants';
import { Anime } from './types';

/* =========================
   THEMED SCROLLBAR + SEARCH + SELECT CSS
========================= */
const ThemedStyles = () => (
  <style>{`
    /* ===== Scrollbars ===== */
    .themed-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: rgba(234,179,8,0.55) rgba(234,179,8,0.10);
    }
    .themed-scrollbar::-webkit-scrollbar { width: 10px; height: 10px; }
    .themed-scrollbar::-webkit-scrollbar-track {
      background: rgba(234,179,8,0.10);
      border-radius: 999px;
    }
    .themed-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(234,179,8,0.40);
      border-radius: 999px;
      border: 2px solid rgba(0,0,0,0.60);
    }
    .themed-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(234,179,8,0.62); }

    .themed-scrollbar-sm {
      scrollbar-width: thin;
      scrollbar-color: rgba(234,179,8,0.48) rgba(234,179,8,0.08);
    }
    .themed-scrollbar-sm::-webkit-scrollbar { width: 8px; height: 8px; }
    .themed-scrollbar-sm::-webkit-scrollbar-track {
      background: rgba(234,179,8,0.08);
      border-radius: 999px;
    }
    .themed-scrollbar-sm::-webkit-scrollbar-thumb {
      background: rgba(234,179,8,0.34);
      border-radius: 999px;
      border: 2px solid rgba(0,0,0,0.65);
    }
    .themed-scrollbar-sm::-webkit-scrollbar-thumb:hover { background: rgba(234,179,8,0.55); }

    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    .scroll-snap-align-center { scroll-snap-align: center; }
    .kinetic-rail { scroll-snap-type: x mandatory; scroll-behavior: smooth; }

    /* ===== Themed Search ===== */
    .search-shell {
      position: relative;
      border-radius: 18px;
      padding: 1px;
      background: radial-gradient(120% 120% at 20% 0%, rgba(234,179,8,0.35), transparent 55%),
                  linear-gradient(90deg, rgba(234,179,8,0.30), rgba(234,179,8,0.06), rgba(234,179,8,0.30));
      box-shadow: 0 18px 60px rgba(0,0,0,0.45);
    }
    .search-inner {
      border-radius: 17px;
      background: linear-gradient(180deg, rgba(0,0,0,0.40), rgba(0,0,0,0.20));
      border: 1px solid rgba(255,255,255,0.06);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
    }
    .search-input {
      width: 100%;
      outline: none;
      background: transparent;
      color: rgba(255,255,255,0.88);
    }
    .search-input::placeholder {
      color: rgba(234,179,8,0.28);
      letter-spacing: 0.10em;
    }
    .search-shell:focus-within {
      background: radial-gradient(120% 120% at 20% 0%, rgba(234,179,8,0.50), transparent 55%),
                  linear-gradient(90deg, rgba(234,179,8,0.55), rgba(234,179,8,0.10), rgba(234,179,8,0.55));
      box-shadow: 0 22px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(234,179,8,0.20), 0 0 40px rgba(234,179,8,0.18);
    }
    .search-shell:focus-within .search-inner {
      border-color: rgba(234,179,8,0.22);
    }
    .search-kbd {
      border: 1px solid rgba(234,179,8,0.18);
      background: rgba(234,179,8,0.08);
      color: rgba(234,179,8,0.75);
    }

    /* ===== Themed Select (Genre Filter) ===== */
    .select-shell {
      position: relative;
      border-radius: 18px;
      padding: 1px;
      background: radial-gradient(120% 120% at 20% 0%, rgba(234,179,8,0.28), transparent 55%),
                  linear-gradient(90deg, rgba(234,179,8,0.26), rgba(234,179,8,0.05), rgba(234,179,8,0.26));
      box-shadow: 0 18px 60px rgba(0,0,0,0.35);
    }
    .select-inner {
      border-radius: 17px;
      background: linear-gradient(180deg, rgba(0,0,0,0.38), rgba(0,0,0,0.18));
      border: 1px solid rgba(255,255,255,0.06);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
    }
    .genre-select {
      width: 100%;
      outline: none;
      background: transparent;
      color: rgba(255,255,255,0.88);
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
    }
    .genre-select option {
      background: #0a0a0a;
      color: rgba(255,255,255,0.9);
    }
  `}</style>
);

/* =========================
   CURSOR
========================= */
const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const visibleOnce = useRef(false);

  useEffect(() => {
    const isTouchDevice =
      'ontouchstart' in window ||
      (navigator?.maxTouchPoints ?? 0) > 0 ||
      window.matchMedia?.('(pointer: coarse)')?.matches;

    if (isTouchDevice) return;

    document.body.style.cursor = 'none';

    const moveCursor = (e: MouseEvent) => {
      const el = cursorRef.current;
      if (!el) return;

      if (!visibleOnce.current) {
        visibleOnce.current = true;
        el.style.opacity = '1';
      }

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
        transition: 'opacity 180ms ease',
        willChange: 'left, top',
      }}
    >
      <div className="w-8 h-8 rounded-full border border-yellow-500/35 bg-yellow-500/10 backdrop-blur-md shadow-[0_0_24px_rgba(234,179,8,0.18)] flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_12px_rgba(255,215,0,0.85)]" />
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
          kinetic-card relative h-[50vh] md:h-[46vh] flex-shrink-0 cursor-none overflow-hidden
          border border-yellow-500/10 transition-all duration-700
          rounded-3xl
          ${isHovered
            ? 'w-[86vw] md:w-[440px] mx-1.5 md:mx-3 z-20 shadow-[0_0_60px_rgba(0,0,0,0.85)] brightness-100 grayscale-0'
            : 'w-[128px] md:w-[160px] mx-1 grayscale brightness-[0.42] hover:brightness-[0.65]'}
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
              isHovered ? 'scale-[1.07]' : 'scale-100'
            }`}
          />
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity duration-500 ${
              isHovered ? 'opacity-95' : 'opacity-75'
            }`}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(234,179,8,0.18),transparent_55%)] opacity-70" />
        </div>

        <div
          className={`absolute inset-0 rounded-3xl ring-1 ring-yellow-500/10 transition-all duration-500 ${
            isHovered ? 'ring-yellow-500/25' : ''
          }`}
        />

        <div
          className={`absolute bottom-0 left-0 w-full px-5 pb-5 pt-10 transition-all duration-300 pointer-events-none ${
            isHovered ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'
          }`}
        >
          <h3 className="text-xs md:text-sm font-extrabold tracking-wide text-yellow-500/55 line-clamp-2">
            {anime.title}
          </h3>
        </div>

        <div
          className={`absolute inset-0 flex flex-col justify-end p-6 md:p-7 transition-all duration-500 pointer-events-none ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {anime.genres.slice(0, 2).map((g) => (
                <span
                  key={g}
                  className="text-[10px] md:text-[11px] px-2.5 py-1 rounded-full border border-yellow-500/18 bg-black/35 text-yellow-100/90 font-semibold tracking-wide"
                >
                  {g}
                </span>
              ))}
            </div>

            <h2 className="text-xl md:text-2xl font-black leading-tight tracking-tight text-white line-clamp-2">
              {anime.title}
            </h2>

            <p className="text-[11px] md:text-[12px] text-gray-200/70 max-w-xs leading-relaxed line-clamp-2">
              {anime.description}
            </p>

            <div className="flex items-center gap-3 text-[10px] font-bold tracking-wider text-yellow-400/80 uppercase">
              <span className="text-white/60">{anime.releaseYear}</span>
              <div className="w-1.5 h-1.5 bg-yellow-500/50 rounded-sm rotate-45" />
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
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isChanging, setIsChanging] = useState(false);

  const MY_COMMENT_PLACEHOLDER =
    '📝 My Comment: (hier kommt später dein Kommentar rein — z.B. warum der Anime ein GOAT ist)';

  const railRef = useRef<HTMLDivElement>(null);

  // ✅ Wichtig: Keys überall als string -> verhindert Hover/Active Bugs
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const getAnimeKey = useCallback((a: Anime) => String(a.id), []);

  // ✅ Ziel: Charlotte NUR im Filter "Good Anime"
  const GOOD_ANIME_KEY = useMemo(() => {
    const exact = CATEGORIES.find((c) => c === 'Good Anime');
    if (exact) return exact;

    const lower = CATEGORIES.find((c) => c.toLowerCase() === 'good anime');
    if (lower) return lower;

    const alt = CATEGORIES.find((c) => c.toLowerCase().includes('good') && c.toLowerCase().includes('anime'));
    return alt ?? 'Good Anime';
  }, []);

  // ✅ Charlotte Objekt (Category = Good Anime)
  const CHARLOTTE: Anime = useMemo(
    () =>
      ({
        id: 'charlotte',
        title: 'Charlotte',
        description:
          'A boy discovers his supernatural ability—and gets pulled into a secret war between gifted teenagers. Emotional, weird, and worth the ride.',
        coverImageURL:
          'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=1200&q=60',
        genres: ['Drama', 'Supernatural', 'School', 'Comedy'],
        releaseYear: 2015,
        status: 'Finished',
        category: GOOD_ANIME_KEY,
      } as Anime),
    [GOOD_ANIME_KEY]
  );

  // ✅ Active list: Charlotte wird NUR hinzugefügt, wenn Good Anime aktiv ist
  const ACTIVE_LIST: Anime[] = useMemo(() => {
    const base = ANIME_LIST;

    if (selectedCategory !== GOOD_ANIME_KEY) return base;

    const existsByTitle = base.some((a) => a.title.trim().toLowerCase() === 'charlotte');
    const existsById = base.some((a) => String(a.id).trim().toLowerCase() === 'charlotte');

    return existsByTitle || existsById ? base : [...base, CHARLOTTE];
  }, [selectedCategory, GOOD_ANIME_KEY, CHARLOTTE]);

  // ✅ Genre Dropdown: aus der aktuell aktiven Liste (inkl. Charlotte wenn Good Anime aktiv)
  const ALL_GENRES = useMemo(() => {
    const set = new Set<string>();
    ACTIVE_LIST.forEach((a) => a.genres.forEach((g) => set.add(g)));
    return ['All', ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [ACTIVE_LIST]);

  // ✅ Wenn Genre nach Category-Wechsel nicht mehr existiert -> reset
  useEffect(() => {
    if (selectedGenre === 'All') return;
    if (!ALL_GENRES.includes(selectedGenre)) setSelectedGenre('All');
  }, [ALL_GENRES, selectedGenre]);

  // ✅ Final Filter: Category + Search + Genre
  const filteredAnime = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return ACTIVE_LIST.filter((a) => {
      const matchCat = selectedCategory === 'All' || a.category === selectedCategory;
      const matchSearch = q === '' || a.title.toLowerCase().includes(q);
      const matchGenre = selectedGenre === 'All' || a.genres.includes(selectedGenre);
      return matchCat && matchSearch && matchGenre;
    });
  }, [ACTIVE_LIST, selectedCategory, searchQuery, selectedGenre]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (window.innerWidth < 768) return;
      if (selectedAnime || isChanging) return;

      let foundId: string | null = null;
      for (const [id, el] of Object.entries(cardRefs.current)) {
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

  // ✅ Mobile observer: nach render starten (refs sind dann vorhanden)
  useEffect(() => {
    if (window.innerWidth >= 768) return;

    const root = railRef.current;
    if (!root) return;

    let observer: IntersectionObserver | null = null;
    let raf = 0;

    raf = requestAnimationFrame(() => {
      observer = new IntersectionObserver(
        (entries) => {
          let best: { id: string; ratio: number } | null = null;

          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const id = entry.target.getAttribute('data-id');
            if (!id) continue;

            const ratio = entry.intersectionRatio ?? 0;
            if (!best || ratio > best.ratio) best = { id, ratio };
          }

          if (best) setHoveredId(best.id);
        },
        { root, threshold: [0.5, 0.6, 0.7], rootMargin: '0px -40% 0px -40%' }
      );

      Object.values(cardRefs.current).forEach((el) => el && observer!.observe(el));
    });

    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, [filteredAnime]);

  const handleCategoryChange = useCallback(
    (cat: string) => {
      if (cat === selectedCategory || isChanging) return;
      setIsChanging(true);
      setHoveredId(null);

      setTimeout(() => {
        setSelectedCategory(cat);
        setIsChanging(false);
        railRef.current?.scrollTo({ left: 0, behavior: 'auto' });
      }, 280);
    },
    [selectedCategory, isChanging]
  );

  const closeFocus = useCallback(() => setSelectedAnime(null), []);

  // ✅ Trailer Button bleibt (Daten müssen keinen trailerUrl haben)
  const openExternalTrailer = (anime: Anime) => {
    const query = encodeURIComponent(anime.title + ' official trailer anime');
    window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank', 'noopener,noreferrer');
  };

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
    <div className="relative h-screen w-screen text-white overflow-hidden select-none bg-[#050505]">
      <ThemedStyles />
      <Cursor />

      {/* BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#070707] via-[#040404] to-[#0b0708]" />
        <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[130vw] h-[75vh] rounded-full blur-[120px] opacity-[0.18] bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.55),transparent_60%)]" />
        <div className="absolute -bottom-40 -right-40 w-[70vw] h-[65vh] blur-[150px] opacity-[0.12] bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.45),transparent_60%)]" />
        <div className="absolute -bottom-52 -left-52 w-[70vw] h-[65vh] blur-[160px] opacity-[0.10] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.35),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(90deg,transparent,rgba(234,179,8,0.35),transparent)]" />
      </div>

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-[1920px] px-4 md:px-10 pt-4 md:pt-6">
          <div className="bg-black/55 backdrop-blur-xl border border-yellow-500/12 rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.55)]">
            <div className="px-4 md:px-6 py-4 md:py-5">
              <div className="grid grid-cols-1 lg:grid-cols-[auto,1fr,260px,360px] gap-4 md:gap-5 items-center">
                {/* Brand */}
                <div className="min-w-0">
                  <h1 className="text-base md:text-lg font-black tracking-tight text-yellow-400 whitespace-nowrap">
                    EISFLY´S ARCHIVE
                  </h1>
                  <p className="text-[10px] md:text-[11px] font-semibold tracking-wide text-white/35">
                    Archive Record
                  </p>
                </div>

                {/* Category Filters */}
                <div className="w-full min-w-0">
                  <div className="themed-scrollbar-sm overflow-x-auto px-1 py-1">
                    <div className="flex gap-2.5 md:gap-3.5 min-w-max">
                      {CATEGORIES.map((cat) => {
                        const active = selectedCategory === cat;
                        return (
                          <button
                            key={cat}
                            onClick={() => handleCategoryChange(cat)}
                            className={`
                              px-4 md:px-4.5 py-2 md:py-2.5 rounded-full
                              text-[12px] md:text-[13px] font-semibold tracking-wide
                              transition-all duration-300 border
                              ${active
                                ? 'bg-yellow-500/18 border-yellow-400/35 text-yellow-200 shadow-[0_0_20px_rgba(234,179,8,0.16)]'
                                : 'bg-white/5 border-white/10 text-white/55 hover:text-white hover:bg-white/8 hover:border-yellow-500/25'}
                            `}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Genre Filter */}
                <div className="w-full lg:w-[260px] min-w-0">
                  <div className="select-shell">
                    <div className="select-inner flex items-center gap-3 px-3 py-2.5">
                      <div className="w-9 h-9 rounded-xl bg-yellow-500/10 border border-yellow-500/15 flex items-center justify-center text-yellow-300 shadow-[0_0_18px_rgba(234,179,8,0.10)]">
                        🎭
                      </div>

                      <select
                        value={selectedGenre}
                        onChange={(e) => setSelectedGenre(e.target.value)}
                        className="genre-select text-[14px] font-semibold tracking-wide"
                        aria-label="Filter by genre"
                      >
                        {ALL_GENRES.map((g) => (
                          <option key={g} value={g}>
                            {g === 'All' ? 'All Genres' : g}
                          </option>
                        ))}
                      </select>

                      <div className="pointer-events-none text-yellow-400/60 pr-1">▾</div>
                    </div>
                  </div>
                </div>

                {/* Search */}
                <div className="w-full lg:w-[360px] min-w-0">
                  <div className="search-shell">
                    <div className="search-inner flex items-center gap-3 px-3 py-2.5">
                      <div className="w-9 h-9 rounded-xl bg-yellow-500/10 border border-yellow-500/15 flex items-center justify-center text-yellow-300 shadow-[0_0_18px_rgba(234,179,8,0.12)]">
                        ⌕
                      </div>

                      <input
                        type="text"
                        placeholder="SEARCHING..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input text-[14px] font-semibold tracking-wide"
                      />

                      <div className="hidden lg:flex items-center gap-2">
                        <span className="search-kbd text-[11px] font-bold rounded-lg px-2 py-1">Enter</span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-2 text-[11px] text-white/28 hidden md:block">
                    Tip: type a title to filter instantly ✨
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* RAIL */}
      {!selectedAnime && (
        <main
          ref={railRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={`
            kinetic-rail themed-scrollbar relative h-full flex items-center
            px-6 md:px-24 lg:px-56 gap-2 md:gap-3 overflow-x-auto
            pt-28 md:pt-28
            transition-all duration-[650ms]
            ${isChanging ? 'opacity-0 scale-[0.99] blur-md translate-y-3' : 'opacity-100 scale-100 blur-0 translate-y-0'}
          `}
        >
          {filteredAnime.length === 0 ? (
            <div className="w-full text-center py-20">
              <h2 className="text-2xl md:text-4xl font-black text-white/10 tracking-widest uppercase">
                No results
              </h2>
            </div>
          ) : (
            filteredAnime.map((anime) => {
              const key = getAnimeKey(anime);
              return (
                <div key={key} data-id={key} className="scroll-snap-align-center">
                  <AnimeCard
                    anime={anime}
                    isHovered={hoveredId === key}
                    onClick={() => {
                      if (window.innerWidth < 768 && hoveredId !== key) {
                        setHoveredId(key);
                      } else {
                        setSelectedAnime(anime);
                      }
                    }}
                    cardRef={(el) => {
                      cardRefs.current[key] = el;
                    }}
                  />
                </div>
              );
            })
          )}
        </main>
      )}

      {/* MODAL */}
      {selectedAnime && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-0 md:p-8 lg:p-14">
          <div className="absolute inset-0 bg-black/85" onClick={closeFocus} aria-hidden="true" />

          <div
            className="
              relative w-full max-w-6xl h-full md:h-[82vh]
              bg-white/5 backdrop-blur-xl
              border border-yellow-500/15
              rounded-none md:rounded-[28px]
              overflow-hidden
              flex flex-col lg:flex-row
              shadow-[0_30px_120px_rgba(0,0,0,0.75)]
            "
            role="dialog"
            aria-modal="true"
          >
            {/* Left Cover */}
            <div className="lg:w-[42%] h-[40%] lg:h-full relative overflow-hidden">
              <img
                src={selectedAnime.coverImageURL}
                alt={selectedAnime.title}
                className="w-full h-full object-cover object-top"
                decoding="async"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent lg:hidden" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/60 hidden lg:block" />

              <button
                onClick={closeFocus}
                className="
                  absolute top-4 left-4 md:top-6 md:left-6
                  w-11 h-11 rounded-2xl
                  border border-white/15 bg-black/30 backdrop-blur-md
                  flex items-center justify-center
                  hover:bg-yellow-500 hover:text-black hover:border-yellow-400/30
                  transition-all duration-300 z-50
                "
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Right Content */}
            <div className="themed-scrollbar flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto">
              <div className="rounded-2xl border border-yellow-500/15 bg-yellow-500/8 px-4 py-3 mb-5">
                <p className="text-[12px] md:text-[13px] font-semibold text-yellow-200/90">
                  {MY_COMMENT_PLACEHOLDER}
                </p>
              </div>

              <h2 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4">
                {selectedAnime.title}
              </h2>

              <div className="bg-black/25 border border-white/10 rounded-2xl p-4 md:p-5 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-white/70">Genres</p>
                  <p className="text-xs text-white/35">{selectedAnime.genres.length}</p>
                </div>
                <div className="themed-scrollbar-sm overflow-x-auto pb-2 -mb-2">
                  <div className="flex gap-2.5 min-w-max">
                    {selectedAnime.genres.map((g) => (
                      <span
                        key={g}
                        className="
                          px-3.5 py-1.5 rounded-full
                          border border-yellow-500/18
                          bg-yellow-500/10
                          text-[12px] font-semibold text-yellow-100/90
                          hover:bg-yellow-500/18
                          transition-all duration-200
                        "
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 md:gap-5 mb-6">
                <div className="rounded-2xl border border-white/10 bg-black/25 p-4 md:p-5">
                  <p className="text-xs text-white/40 font-semibold tracking-wide mb-1">Release</p>
                  <p className="text-xl md:text-2xl font-black text-yellow-300">{selectedAnime.releaseYear}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/25 p-4 md:p-5">
                  <p className="text-xs text-white/40 font-semibold tracking-wide mb-1">Status</p>
                  <p className="text-xl md:text-2xl font-black text-yellow-300 uppercase">{selectedAnime.status}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/25 p-4 md:p-6 mb-7">
                <p className="text-sm font-semibold text-white/70 mb-2">Description</p>
                <p className="text-sm md:text-base text-white/70 leading-relaxed">
                  “{selectedAnime.description}”
                </p>
              </div>

              {/* Buttons (Trailer bleibt drin) */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  className="
                    flex-1 rounded-2xl py-3.5 px-6
                    bg-yellow-500 text-black font-black text-sm
                    hover:bg-yellow-400 transition-all duration-200
                    shadow-[0_12px_40px_rgba(234,179,8,0.18)]
                  "
                  onClick={() =>
                    window.open(
                      `https://myanimelist.net/search/all?q=${encodeURIComponent(selectedAnime.title)}`,
                      '_blank',
                      'noopener,noreferrer'
                    )
                  }
                >
                  Explore
                </button>

                <button
                  className="
                    flex-1 rounded-2xl py-3.5 px-6
                    border border-yellow-500/35 bg-white/5 text-yellow-200 font-black text-sm
                    hover:bg-yellow-500 hover:text-black hover:border-yellow-400/30
                    transition-all duration-200
                  "
                  onClick={() => openExternalTrailer(selectedAnime)}
                >
                  Trailer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 md:p-10 flex justify-between items-end pointer-events-none z-40">
        <div />
        <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-white/10 bg-black/35 backdrop-blur-xl px-4 py-2">
          <div className="flex gap-2 items-center">
            {CATEGORIES.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                  CATEGORIES.indexOf(selectedCategory) === i
                    ? 'bg-yellow-400 shadow-[0_0_12px_rgba(234,179,8,0.9)] scale-125'
                    : 'bg-white/15'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-white/35 font-semibold tracking-wide">Archive</span>
        </div>
      </footer>
    </div>
  );
}
