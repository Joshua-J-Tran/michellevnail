// utils/getGalleryImages.ts
export function getGalleryImages() {
  const imageFiles = import.meta.glob<{
    default: string;
  }>("@/assets/gallery/*.{jpg,jpeg,png,gif}", { eager: true });

  return Object.values(imageFiles).map((module) => ({
    original: module.default,  // bundled URL string
    thumbnail: module.default,
  }));
}
