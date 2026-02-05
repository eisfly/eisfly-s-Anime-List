      {/* DETAIL VIEW */}
      {selectedAnime && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 md:p-10"
          onClick={() => setSelectedAnime(null)} // Klick auf den Hintergrund schließt
        >
          <div
            className="relative w-full max-w-5xl bg-[#050505] border border-yellow-500/30 rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()} // Klick IN der Box NICHT schließen
          >
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
