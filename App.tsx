import React, { useState, useMemo, useRef, useEffect, useCallback, memo } from 'react';
import { ANIME_LIST, CATEGORIES } from './constants';
import { Anime } from './types';

/* =============================
   Custom Cursor (Optimiert)
============================= */

const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const moveCursor = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
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
      <div className="w-5 h-5 rounded-full border border-yellow-500/60 flex items-center justify-center bg-yellow-500/10">
        <div className="w-1 h-1 bg-yellow-400 rounded-full shadow-[0_0_8px_#FFD700]" />
      </div>
    </div>
  );
};

/* =============================
   Anime Card (Optimiert)
============================= */

type CardProps = {
  anime: Anime;
  active: boolean;
  onSelect: () => void;
  registerRef: (el: HTMLDivElement | null) => void;
};

const AnimeCard = memo(({ anime, active, onSelect, registerRef }: CardProps) => {
  return (
    <div
      ref={registerRef}
      onClick={onSelect}
      className={`
        kinetic-card relative h-[50vh] md:h-[45vh] flex-shrink-0 
        overflow-hidden border border-yellow-500/10 group transition-all duration-700
        ${active ? 'w-[420px] z-20 brightness-100' : 'w-[150px] brightness-[0.5]'}
      `}
    >
      <img
        src={anime.coverImageURL}
        alt={anime.title}
        className="w-full h-full object-cover"
        loading="lazy"
      />

      <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90">
        <h3 className="text-yellow-400 font-bold text-sm truncate">
          {anime.title}
        </h3>
      </div>
    </div>
  );
});

/* =============================
   MAIN APP
============================= */

export default function App() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const filteredAnime = useMemo(() => {
    return ANIME_LIST.filter(a => {
      const matchCat = category === "All" || a.category === category;
      const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [category, search]);

  /* Hover Logic */
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    let newActive: string | null = null;

    for (const [id, el] of Object.entries(cardRefs.current)) {
      if (!el) continue;

      const rect = el.getBoundingClientRect();

      if (e.clientX >= rect.left && e.clientX <= rect.right) {
        newActive = id;
        break;
      }
    }

    if (newActive !== activeId) {
      setActiveId(newActive);
    }
  }, [activeId]);

  return (
    <div className="h-screen w-screen bg-black text-white overflow-hidden">

      <Cursor />

      {/* HEADER */}
      <header className="p-4 flex gap-4 items-center bg-black/80 border-b border-yellow-500/10">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Anime..."
          className="bg-black border border-yellow-500/20 p-2 text-yellow-400"
        />

        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`
              px-3 py-1 text-sm
              ${category === cat ? 'text-yellow-400' : 'text-gray-500'}
            `}
          >
            {cat}
          </button>
        ))}
      </header>

      {/* LIST */}
      <main
        onMouseMove={handleMouseMove}
        className="flex items-center gap-2 overflow-x-auto h-full px-10"
      >
        {filteredAnime.map(anime => (
          <AnimeCard
            key={anime.id}
            anime={anime}
            active={activeId === anime.id}
            onSelect={() => setActiveId(anime.id)}
            registerRef={(el) => (cardRefs.current[anime.id] = el)}
          />
        ))}
      </main>
    </div>
  );
}
