// components/functional/TestimonialCarousel.tsx
import { useState, useEffect } from "react";
import { testimonialsData } from "./testimonialsData";

// ✅ Define type for each testimonial
interface Testimonial {
  name: string;
  text: string;
  rating: number;
  date: string;
}

// Fisher–Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function starMax(count: number): number {
  if (count <= 5) return 5;
  if (count <= 10) return 10;
  return count;
}

function StarRating({ count }: { count: number }) {
  const [showAll, setShowAll] = useState(false);
  const maxInline = 10;

  if (count <= maxInline) {
    return (
      <div className="flex justify-center mb-2">
        {Array.from({ length: starMax(count) }, (_, i) => (
          <span
            key={i}
            className={i < count ? "text-yellow-400" : "text-gray-300"}
          >
            ★
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="flex justify-center mb-2 relative">
      {Array.from({ length: maxInline }, (_, i) => (
        <span key={i} className="text-yellow-400">★</span>
      ))}
      <div
        className="ml-2 px-2 py-1 bg-gray-200 rounded cursor-pointer text-sm hover:bg-gray-300"
        onMouseEnter={() => setShowAll(true)}
        onMouseLeave={() => setShowAll(false)}
        onClick={() => setShowAll((prev) => !prev)}
      >
        +{count - maxInline} more
      </div>

      {showAll && (
        <div className="absolute top-full mt-2 bg-white shadow-lg p-2 rounded z-10 max-w-xs overflow-auto max-h-32">
          <div className="flex flex-wrap">
            {Array.from({ length: starMax(count) }, (_, i) => (
              <span key={i} className="text-yellow-400">★</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ReviewText({ text, maxLength = 75 }: { text: string; maxLength?: number }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > maxLength;

  if (!isLong) {
    return <p className="text-lg italic text-gray-700 mb-4">"{text}"</p>;
  }

  return (
    <p className="text-lg italic text-gray-700 mb-4">
      "{expanded ? text : `${text.slice(0, maxLength)}...`}"
      <button
        className="ml-2 text-black font-semibold"
        onClick={() => setExpanded((prev) => !prev)}
      >
        {expanded ? "Read less" : "Read more"}
      </button>
    </p>
  );
}

export default function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    setTestimonials(shuffleArray(testimonialsData as Testimonial[]));
  }, []);

  // ✅ safer for SSR: don’t access window in init
  const getItemsPerSlide = () => {
    if (typeof window === "undefined") return 1;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  };

  const [itemsPerSlide, setItemsPerSlide] = useState<number>(1);

  useEffect(() => {
    setItemsPerSlide(getItemsPerSlide());
    const handleResize = () => setItemsPerSlide(getItemsPerSlide());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalSlides = Math.ceil(testimonials.length / itemsPerSlide) || 1;

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % totalSlides);
    }, 4000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  const slides: Testimonial[][] = [];
  for (let i = 0; i < testimonials.length; i += itemsPerSlide) {
    slides.push(testimonials.slice(i, i + itemsPerSlide));
  }

  return (
    <div className="w-full overflow-hidden">
      <div
        className="flex transition-transform duration-700"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, slideIndex) => (
          <div
            key={slideIndex}
            className="min-w-full flex justify-center gap-4 items-end"
          >
            {slide.map((t, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm text-center"
              >
                <StarRating count={t.rating} />
                <ReviewText text={t.text} />
                <p className="font-semibold text-secondary">– {t.name}</p>
                <p className="font-semibold text-black italic">
                  📅 {t.date}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-3 w-3 rounded-full ${
              i === index ? "bg-black" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
