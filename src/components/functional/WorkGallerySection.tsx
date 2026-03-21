import { useMemo, useState } from "react";
import ImageGallery from "react-image-gallery";

type GlobModules = Record<string, unknown>;

type WorkGallerySectionProps = {
  handleLogoTap?: () => void;
};

function toGalleryItems(modules: GlobModules) {
  return Object.keys(modules)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((path) => {
      // path is likely something like '/public/images/...jpg' or './public/...jpg'
      // Strip leading '.' or '/public' to get root-relative URL
      let url = path
        .replace(/^\./, "") // remove leading . if present
        .replace(/^\/public/, "") // remove /public prefix
        .replace(/^\/src/, ""); // remove /public prefix

      // Ensure it starts with /
      if (!url.startsWith("/")) url = "/" + url;

      return { original: url, thumbnail: url };
    });
}

export default function WorkGallerySection({
  handleLogoTap,
}: WorkGallerySectionProps) {
  // Auto-load each folder
  const manicureMods = import.meta.glob(
    "/public/images/gallery/manicure/*.{jpg,jpeg,png,webp}",
    { eager: true },
  );
  const interiorMods = import.meta.glob(
    "/public/images/gallery/interior/*.{jpg,jpeg,png,webp}",
    { eager: true },
  );
  const pedicureMods = import.meta.glob(
    "/public/images/gallery/pedicure/*.{jpg,jpeg,png,webp}",
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
        id: "manicure",
        label: "Manicure",
        images: toGalleryItems(manicureMods),
      },
      {
        id: "pedicure",
        label: "Pedicure",
        images: toGalleryItems(pedicureMods),
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
        Browse by category. Click any image to view it larger!
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
                    ? "bg-background text-primary" // cream bg, blush text = "selected"
                    : "bg-primary text-primary-foreground hover:bg-primary-hover", // solid blush = default
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
            renderItem={(item) => (
              <div className="flex justify-center">
                <img
                  src={item.original}
                  alt=""
                  style={{
                    width: "100%",
                    height: "auto",
                    color: "red",
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
          <div className="w-full rounded-xl border border-border p-10 text-center text-secondary/80 text-secondary">
            No images in this category yet.
          </div>
        )}
      </div>
    </div>
  );
}
