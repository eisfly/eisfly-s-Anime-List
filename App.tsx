import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ANIME_LIST, CATEGORIES } from './constants';
import { Anime } from './types';

/* ========== THEMED SCROLLBAR CLASSES (Tailwind Scrollbar Plugin vorausgesetzt) ========== */
const SCROLLBAR_X =
  'scrollbar-thin scrollbar-thumb-yellow-500/40 scrollbar-track-yellow-500/10 hover:scrollbar-thumb-yellow-400/60';
const SCROLLBAR_Y =
  'scrollbar-thin scrollbar-thumb-yellow-500/35 scrollbar-track-yellow-500/10 hover:scrollbar-thumb-yellow-400/55';

/* ========== CUSTOM CURSOR (PIXELGENAU, NUR PC/MAUS) ========== */
function Cursor({ enabled = true }: { enabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const ticking = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Touch/Handy: kein Custom Cursor
    const isCoarse = window.matchMedia?.('(pointer: coarse)').matches ?? false;
    if (isCoarse) return;

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
      style={{
        transform: 'translate(-50%, -50%)',
        willChange: 'transform,left,top',
      }}
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
