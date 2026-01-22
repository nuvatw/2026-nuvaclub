'use client';

interface VideoHeroProps {
  videoId?: string;
  title?: string;
}

export function VideoHero({
  videoId = 'dLRdaUda8Ho',
  title,
}: VideoHeroProps) {
  return (
    <section className="relative w-full h-[50vh] min-h-[400px] max-h-[600px] overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <iframe
          className="w-full h-[150%] -translate-y-[16%] object-cover scale-110"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&playsinline=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3`}
          title="Shop Hero Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          style={{ pointerEvents: 'none' }}
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[var(--shop-bg)] z-10" />

      {/* Content Overlay */}
      {title && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <h1 className="text-[8rem] sm:text-[12rem] md:text-[16rem] font-bold text-white/90 tracking-tight select-none">
            {title}
          </h1>
        </div>
      )}
    </section>
  );
}
