// components/functional/TestimonialGallery.jsx
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Jessica P.",
    rating: 9,
    text: "Absolutely amazing service! My nails have never looked better.",
  },
  {
    name: "Michael L.",
    rating: 8,
    text: "Great attention to detail and friendly staff.",
  },
  {
    name: "Sophia R.",
    rating: 555,
    text: "Beautiful salon with a relaxing vibe. Highly recommend!",
  },
  {
    name: "Emily K.",
    rating: 4,
    text: "They listened to exactly what I wanted and nailed it!",
  },
];

function starMax(count : number) {
    if (count <= 5) {
        return 5;
    } else if (count <= 10) {
        return 10;
    }
    return count
}

function StarRating({ count } : { count: number }) {
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

export default function TestimonialGallery() {
  const [index, setIndex] = useState(0);

  const prevSlide = () => {
    setIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full max-w-4xl mx-auto relative">
      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-white shadow rounded-full hover:bg-gray-100"
      >
        <ChevronLeft />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-white shadow rounded-full hover:bg-gray-100"
      >
        <ChevronRight />
      </button>

      {/* Testimonial Card */}
      <div className="p-6 bg-white rounded-xl shadow-lg text-center transition-all duration-300">
        <StarRating count={testimonials[index].rating} />
        <p className="text-lg italic text-gray-700 mb-4">
          "{testimonials[index].text}"
        </p>
        <p className="font-semibold text-secondary">
          – {testimonials[index].name}
        </p>
      </div>
    </div>
  );
}
