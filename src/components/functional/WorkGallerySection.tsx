import { useMemo, useState, useRef, useCallback } from "react";
import ImageGallery from "react-image-gallery";

type GlobModules = Record<string, unknown>;

type WorkGallerySectionProps = {
  handleLogoTap?: () => void;
};

function toGalleryItems(modules: GlobModules) {
  return Object.keys(modules)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((path) => {
      let url = path
        .replace(/^\./, "")
        .replace(/^\/public/, "")
        .replace(/^\/src/, "");

      if (!url.startsWith("/")) url = "/" + url;

      return { original: url, thumbnail: url };
    });
}

// ─── Pinch-to-zoom image component ───────────────────────────────────────────
function ZoomableImage({ src }: { src: string }) {
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  // Pointer tracking refs
  const pointers = useRef<Map<number, PointerEvent>>(new Map());
  const lastPinchDist = useRef<number | null>(null);
  const lastMidpoint = useRef<{ x: number; y: number } | null>(null);
  const isDragging = useRef(false);
  const lastDragPos = useRef<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const clampTranslate = useCallback((tx: number, ty: number, s: number) => {
    if (!containerRef.current) return { x: tx, y: ty };
    const rect = containerRef.current.getBoundingClientRect();
    const maxX = (rect.width * (s - 1)) / 2;
    const maxY = (rect.height * (s - 1)) / 2;
    return {
      x: Math.min(maxX, Math.max(-maxX, tx)),
      y: Math.min(maxY, Math.max(-maxY, ty)),
    };
  }, []);

  const getDistance = (a: PointerEvent, b: PointerEvent) => {
    const dx = a.clientX - b.clientX;
    const dy = a.clientY - b.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getMidpoint = (a: PointerEvent, b: PointerEvent) => ({
    x: (a.clientX + b.clientX) / 2,
    y: (a.clientY + b.clientY) / 2,
  });

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, e.nativeEvent);

    if (pointers.current.size === 1) {
      isDragging.current = true;
      lastDragPos.current = { x: e.clientX, y: e.clientY };
    }
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      pointers.current.set(e.pointerId, e.nativeEvent);
      const pts = Array.from(pointers.current.values());

      if (pts.length === 2) {
        // ── Pinch zoom ──
        isDragging.current = false;
        const dist = getDistance(pts[0], pts[1]);
        const mid = getMidpoint(pts[0], pts[1]);

        if (lastPinchDist.current !== null && lastMidpoint.current !== null) {
          const ratio = dist / lastPinchDist.current;
          const dmx = mid.x - lastMidpoint.current.x;
          const dmy = mid.y - lastMidpoint.current.y;

          setScale((prev) => {
            const next = Math.min(Math.max(prev * ratio, 1), 5);
            return next;
          });

          setTranslate((prev) => {
            const raw = { x: prev.x + dmx, y: prev.y + dmy };
            return clampTranslate(raw.x, raw.y, scale);
          });
        }

        lastPinchDist.current = dist;
        lastMidpoint.current = mid;
      } else if (pts.length === 1 && isDragging.current && scale > 1) {
        // ── Pan when zoomed ──
        if (lastDragPos.current) {
          const dx = e.clientX - lastDragPos.current.x;
          const dy = e.clientY - lastDragPos.current.y;
          setTranslate((prev) => {
            const raw = { x: prev.x + dx, y: prev.y + dy };
            return clampTranslate(raw.x, raw.y, scale);
          });
        }
        lastDragPos.current = { x: e.clientX, y: e.clientY };
      }
    },
    [scale, clampTranslate],
  );

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);

    if (pointers.current.size < 2) {
      lastPinchDist.current = null;
      lastMidpoint.current = null;
    }
    if (pointers.current.size === 0) {
      isDragging.current = false;
      lastDragPos.current = null;

      // Snap back if scale returned to ~1
      setScale((prev) => {
        if (prev < 1.05) {
          setTranslate({ x: 0, y: 0 });
          return 1;
        }
        return prev;
      });
    }
  }, []);

  const onDoubleClick = useCallback(() => {
    setScale((prev) => {
      if (prev > 1) {
        setTranslate({ x: 0, y: 0 });
        return 1;
      }
      return 2.5;
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex justify-center overflow-hidden"
      style={{ touchAction: scale > 1 ? "none" : "pan-y" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <img
        src={src}
        alt=""
        onDoubleClick={onDoubleClick}
        draggable={false}
        style={{
          width: "100%",
          height: "auto",
          maxWidth: "clamp(300px, 85vw, 1400px)",
          maxHeight: "clamp(400px, 80vh, 1200px)",
          objectFit: "contain",
          borderRadius: "8px",
          transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
          transition:
            pointers.current.size > 0 ? "none" : "transform 0.25s ease",
          userSelect: "none",
          cursor: scale > 1 ? "grab" : "zoom-in",
        }}
      />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function WorkGallerySection({
  handleLogoTap,
}: WorkGallerySectionProps) {
  const artisanEscapeMods = import.meta.glob(
    "/public/images/gallery/artisan/*.{jpg,jpeg,png,webp,gif}",
    { eager: true },
  );
  const manicureMods = import.meta.glob(
    "/public/images/gallery/manicure/*.{jpg,jpeg,png,webp,gif}",
    { eager: true },
  );
  const interiorMods = import.meta.glob(
    "/public/images/gallery/interior/*.{jpg,jpeg,png,webp}",
    { eager: true },
  );
  const pedicureMods = import.meta.glob(
    "/public/images/gallery/pedicure/*.{jpg,jpeg,png,webp,gif}",
    { eager: true },
  );
  const specialMods = import.meta.glob(
    "/public/images/gallery/special/*.{jpg,jpeg,png,webp}",
    { eager: true },
  );
  const lashMods = import.meta.glob(
    "/public/images/gallery/lash/*.{jpg,jpeg,png,webp}",
    { eager: true },
  );
  const drinksMods = import.meta.glob(
    "/public/images/gallery/drinks/*.{jpg,jpeg,png,webp}",
    { eager: true },
  );
  const menuMods = import.meta.glob(
    "/public/images/gallery/menu/*.{jpg,jpeg,png,webp}",
    { eager: true },
  );
  const artMods = import.meta.glob(
    "/public/images/gallery/art/*.{jpg,jpeg,png,webp}",
    { eager: true },
  );
  const customerMods = import.meta.glob(
    "/public/images/gallery/customer/*.{jpg,jpeg,png,webp}",
    { eager: true },
  );
  const littleMods = import.meta.glob(
    "/public/images/gallery/little/*.{jpg,jpeg,png,webp}",
    { eager: true },
  );

  const categories = useMemo(
    () => [
      {
        id: "special",
        label: "Special of the month",
        images: toGalleryItems(specialMods),
      },
      {
        id: "artisan",
        label: "Artisan escape",
        images: toGalleryItems(artisanEscapeMods),
      },
      {
        id: "pedicure",
        label: "Pedicure",
        images: toGalleryItems(pedicureMods),
      },
      {
        id: "manicure",
        label: "Manicure",
        images: toGalleryItems(manicureMods),
      },
      { id: "art", label: "Nail Arts", images: toGalleryItems(artMods) },
      {
        id: "little",
        label: "Little Princess",
        images: toGalleryItems(littleMods),
      },
      { id: "lash", label: "Lash & Beauty", images: toGalleryItems(lashMods) },
      {
        id: "interior",
        label: "Interior",
        images: toGalleryItems(interiorMods),
      },
      {
        id: "customer",
        label: "Customer Experiences",
        images: toGalleryItems(customerMods),
      },
      {
        id: "drinks",
        label: "Complimentary Beverages",
        images: toGalleryItems(drinksMods),
      },
      { id: "menus", label: "Menu", images: toGalleryItems(menuMods) },
    ],
    [],
  );

  const [activeId, setActiveId] = useState(categories[0].id);
  const active = categories.find((c) => c.id === activeId) ?? categories[0];

  return (
    <div className="p-6 sm:p-10 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-3 sm:mb-4 text-center text-secondary">
        Our Work Gallery
      </h2>
      <p className="text-secondary/80 mb-6 text-center max-w-2xl text-secondary">
        Browse by category. Pinch to zoom · Double-tap to reset · Click for
        fullscreen!
      </p>

      {/* Category buttons */}
      <div className="w-full max-w-4xl mb-6 flex flex-wrap justify-center gap-3 sm:gap-4">
        {categories.map((cat) => {
          const isActive = cat.id === activeId;
          return (
            <div
              key={cat.id}
              className={[
                "rounded-full p-[2px] transition-all duration-300",
                isActive
                  ? "bg-gradient-to-r from-primary-hover via-accent to-primary shadow-[0_0_20px_rgba(255,119,130,0.4)]"
                  : "bg-gradient-to-r from-primary via-accent to-primary-hover",
              ].join(" ")}
            >
              <button
                type="button"
                onClick={() => setActiveId(cat.id)}
                className={[
                  "block px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-250",
                  "hover:scale-[1.03] active:scale-[0.97]",
                  isActive
                    ? "bg-background text-primary"
                    : "bg-primary text-primary-foreground hover:bg-primary-hover",
                ].join(" ")}
                aria-pressed={isActive}
              >
                {cat.label}
              </button>
            </div>
          );
        })}
      </div>

      <div
        className="w-full sm:max-w-[900px] md:max-w-[1200px] lg:max-w-[1400px]"
        onClick={handleLogoTap}
      >
        {active.images.length ? (
          <ImageGallery
            items={active.images}
            showPlayButton={false}
            showFullscreenButton={true}
            thumbnailPosition="bottom"
            renderItem={(item) => <ZoomableImage src={item.original} />}
          />
        ) : (
          <div className="w-full rounded-xl border border-border p-10 text-center text-secondary/80 text-secondary">
            No images in this category yet.
          </div>
        )}
      </div>
    </div>
  );
}
