import { useState, useEffect, useRef } from "react";

const images = Object.keys(
  import.meta.glob("/public/Popup/*.(png|jpg|jpeg|webp|gif)", { eager: false }),
).map((path) => path.replace("/public", ""));

export default function WelcomePopup() {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  if (!visible || images.length === 0) return null;

  const prev = () => setCurrent((i) => (i - 1 + images.length) % images.length);
  const next = () => setCurrent((i) => (i + 1) % images.length);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={() => setVisible(false)}
    >
      <div
        className="relative flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Image strip */}
        <div className="relative flex items-center justify-center w-[70vw] sm:w-[50vw] md:w-[40vw] lg:w-[30vw] h-[80vh]">
          {/* Close - anchored to top-right of image container */}
          <button
            onClick={() => setVisible(false)}
            className="absolute top-0 right-0 w-8 h-8 rounded-full bg-accent-foreground/80 hover:bg-secondary/80 transition-colors text-secondary hover:text-gray-900 flex items-center justify-center shadow-md z-20"
            aria-label="Close"
          >
            ✕
          </button>
          {images.map((src, i) => {
            const offset = i - current;
            if (Math.abs(offset) > 1) return null;

            const isCurrent = offset === 0;

            return (
              <img
                key={src}
                src={src}
                alt={`Popup ${i + 1}`}
                onClick={() => !isCurrent && setCurrent(i)}
                className={`
          object-contain rounded-2xl border-3 transition-all duration-300 absolute
          ${
            isCurrent
              ? "w-full max-h-[80vh] border-primary/80 opacity-100 blur-0 cursor-default z-10"
              : `w-[25vw] sm:w-[18vw] md:w-[14vw] max-h-[50vh] border-primary/30 opacity-50 blur-sm cursor-pointer scale-90 z-0
               ${offset === -1 ? "right-full mr-0" : "left-full ml-0"}`
          }
        `}
              />
            );
          })}
        </div>

        {/* Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-0 -translate-x-8 w-10 h-10 rounded-full bg-accent-foreground/80 hover:bg-secondary/80 transition-colors text-secondary flex items-center justify-center shadow-md text-lg z-10"
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="absolute right-0 translate-x-8 w-10 h-10 rounded-full bg-accent-foreground/80 hover:bg-secondary/80 transition-colors text-secondary flex items-center justify-center shadow-md text-lg z-10"
              aria-label="Next"
            >
              ›
            </button>
          </>
        )}

        {/* Dots */}
        {images.length > 1 && (
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-colors ${i === current ? "bg-primary" : "bg-white/60"}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
