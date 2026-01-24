import { useMemo, useState } from "react";
import ImageGallery from "react-image-gallery";

type GlobModules = Record<string, unknown>;

type WorkGallerySectionProps = {
  handleLogoTap?: () => void;
};



function toGalleryItems(modules: GlobModules) {
  // modules is an object: { "/public/path/file.jpg": () => import(...) }
  return Object.keys(modules)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((path) => {
      // Vite returns URLs like "/images/gallery/nails/1.jpg"
      const url = path.replace("/public", "/src");
      return { original: url, thumbnail: url };
    });
}

export default function WorkGallerySection({
  handleLogoTap,
}: WorkGallerySectionProps)  {
  // Auto-load each folder
  const nailsMods = import.meta.glob("/src/images/gallery/nails/*.{jpg,jpeg,png,webp}", { eager: true });
  const interiorMods = import.meta.glob("/src/images/gallery/interior/*.{jpg,jpeg,png,webp}", { eager: true });
  const massageMods = import.meta.glob("/src/images/gallery/massage/*.{jpg,jpeg,png,webp}", { eager: true });
  const salonMods = import.meta.glob("/src/images/gallery/salon/*.{jpg,jpeg,png,webp}", { eager: true });
  const customerMods = import.meta.glob("/src/images/gallery/customer/*.{jpg,jpeg,png,webp}", { eager: true });
  const drinksMods = import.meta.glob("/src/images/gallery/drinks/*.{jpg,jpeg,png,webp}", { eager: true });

  const categories = useMemo(
    () => [
      { id: "nails", label: "Nails", images: toGalleryItems(nailsMods) },
      { id: "interior", label: "Interior", images: toGalleryItems(interiorMods) },
      { id: "massage", label: "Massage", images: toGalleryItems(massageMods) },
      { id: "salon", label: "Salon", images: toGalleryItems(salonMods) },
      { id: "customer", label: "Customer", images: toGalleryItems(customerMods) },
      { id: "drinks", label: "Drinks", images: toGalleryItems(drinksMods) },
    ],
    []
  );

  const [activeId, setActiveId] = useState(categories[0].id);
  const active = categories.find((c) => c.id === activeId) ?? categories[0];

  return (
    <div className="p-6 sm:p-10 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-3 sm:mb-4 text-center">Our Work Gallery</h2>
      <p className="text-secondary/80 mb-6 text-center max-w-2xl">
        Browse by category. Click any image to view it larger!
      </p>

      {/* Category buttons */}
      <div className="w-full max-w-4xl mb-6 flex flex-wrap justify-center gap-2">
        {categories.map((cat) => {
          const isActive = cat.id === activeId;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveId(cat.id)}
              className={[
                "px-4 py-2 rounded-full text-sm font-medium transition border",
                isActive
                  ? "bg-primary text-primary-foreground border-primary/40"
                  : "bg-background/40 text-foreground border-border hover:bg-background/70",
              ].join(" ")}
              aria-pressed={isActive}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      <div className="w-full sm:max-w-[900px] md:max-w-[1200px] lg:max-w-[1400px]" onClick={handleLogoTap}>
        {active.images.length ? (
          <ImageGallery
            items={active.images}
            showPlayButton={false}
            showFullscreenButton={true}
            thumbnailPosition="bottom"
            renderItem={(item) => (
              <div className="flex justify-center">
                <img
                  src={item.original}
                  alt=""
                  style={{
                    width: "100%",
                    height: "auto",
                    maxWidth: "clamp(300px, 85vw, 1400px)",
                    maxHeight: "clamp(400px, 80vh, 1200px)",
                    objectFit: "contain",
                    borderRadius: "8px",
                  }}
                />
              </div>
            )}
          />
        ) : (
          <div className="w-full rounded-xl border border-border p-10 text-center text-secondary/80">
            No images in this category yet.
          </div>
        )}
      </div>
    </div>
  );
}
