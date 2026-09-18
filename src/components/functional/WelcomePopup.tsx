// import { useState, useEffect, useRef } from "react";

// const images = Object.keys(
//   import.meta.glob("/public/Popup/*.(png|jpg|JPG|jpeg|webp|gif)", {
//     eager: false,
//   }),
// ).map((path) => path.replace("/public", ""));

// export default function WelcomePopup() {
//   const [visible, setVisible] = useState(false);
//   const [current, setCurrent] = useState(0);
//   const touchStartX = useRef<number | null>(null);

//   useEffect(() => {
//     const timer = setTimeout(() => setVisible(true), 300);
//     return () => clearTimeout(timer);
//   }, []);

//   if (!visible || images.length === 0) return null;

//   const prev = () => setCurrent((i) => (i - 1 + images.length) % images.length);
//   const next = () => setCurrent((i) => (i + 1) % images.length);

//   const handleTouchStart = (e: React.TouchEvent) => {
//     touchStartX.current = e.touches[0].clientX;
//   };

//   const handleTouchEnd = (e: React.TouchEvent) => {
//     if (touchStartX.current === null) return;
//     const diff = touchStartX.current - e.changedTouches[0].clientX;
//     if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
//     touchStartX.current = null;
//   };

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
//       onClick={() => setVisible(false)}
//     >
//       <div
//         className="relative flex flex-col items-center justify-center"
//         onTouchStart={handleTouchStart}
//         onTouchEnd={handleTouchEnd}
//       >
//         {/* Main Image Container */}
//         <div
//           className="relative flex items-center justify-center w-[70vw] sm:w-[50vw] md:w-[40vw] lg:w-[30vw] h-[80vh]"
//           onClick={(e) => e.stopPropagation()}
//         >
//           {/* Close Button */}
//           <button
//             onClick={() => setVisible(false)}
//             className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 transition-colors text-white flex items-center justify-center shadow-md z-30"
//             aria-label="Close"
//           >
//             ✕
//           </button>

//           {images.map((src, i) => {
//             // Calculate wrapped offset for circular navigation
//             let offset = i - current;
//             if (offset < -1 && current === images.length - 1 && i === 0) {
//               offset = 1;
//             } else if (offset > 1 && current === 0 && i === images.length - 1) {
//               offset = -1;
//             }

//             if (Math.abs(offset) > 1) return null;

//             const isCurrent = offset === 0;

//             return (
//               <div
//                 key={src}
//                 onClick={() => !isCurrent && setCurrent(i)}
//                 className={`
//                   absolute transition-all duration-300 flex items-center justify-center
//                   ${
//                     isCurrent
//                       ? "opacity-100 blur-0 cursor-default z-10 max-h-[80vh] max-w-full"
//                       : `opacity-50 blur-sm cursor-pointer scale-90 z-0 max-h-[50vh]
//                          ${offset === -1 ? "-translate-x-[60%]" : "translate-x-[60%]"}`
//                   }
//                 `}
//               >
//                 <img
//                   src={src}
//                   alt={`Popup ${i + 1}`}
//                   className={`
//                     block object-contain rounded-2xl border-4 transition-all duration-300 max-h-[75vh] max-w-[70vw] sm:max-w-[50vw] md:max-w-[40vw] lg:max-w-[30vw] w-auto h-auto
//                     ${isCurrent ? "border-primary/80" : "border-primary/30"}
//                   `}
//                 />
//               </div>
//             );
//           })}
//         </div>

//         {/* Dots */}
//         {images.length > 1 && (
//           <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
//             {images.map((_, i) => (
//               <button
//                 key={i}
//                 onClick={() => setCurrent(i)}
//                 className={`w-2 h-2 rounded-full transition-colors ${
//                   i === current ? "bg-primary" : "bg-white/60"
//                 }`}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import { useState, useEffect, useRef } from "react";

const images = Object.keys(
  import.meta.glob("/public/Popup/*.(png|jpg|JPG|jpeg|webp|gif)", {
    eager: false,
  }),
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
        className="relative flex flex-col items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Main Image Container */}
        <div
          className="relative flex items-center justify-center w-[70vw] sm:w-[50vw] md:w-[40vw] lg:w-[30vw] h-[80vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={() => setVisible(false)}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 transition-colors text-white flex items-center justify-center shadow-md z-30"
            aria-label="Close"
          >
            ✕
          </button>

          {images.map((src, i) => {
            // Calculate wrapped offset for circular navigation
            let offset = i - current;
            if (offset < -1 && current === images.length - 1 && i === 0) {
              offset = 1;
            } else if (offset > 1 && current === 0 && i === images.length - 1) {
              offset = -1;
            }

            if (Math.abs(offset) > 1) return null;

            const isCurrent = offset === 0;

            return (
              <div
                key={src}
                onClick={() => !isCurrent && setCurrent(i)}
                className={`
                  absolute transition-all duration-300 flex items-center justify-center
                  ${
                    isCurrent
                      ? "opacity-100 blur-0 cursor-default z-10 max-h-[80vh] max-w-full"
                      : `opacity-50 blur-sm cursor-pointer scale-90 z-0 max-h-[50vh]
                         ${offset === -1 ? "-translate-x-[60%]" : "translate-x-[60%]"}`
                  }
                `}
              >
                <img
                  src={src}
                  alt={`Popup ${i + 1}`}
                  className="block object-contain rounded-2xl transition-all duration-300 max-h-[75vh] max-w-[70vw] sm:max-w-[50vw] md:max-w-[40vw] lg:max-w-[30vw] w-auto h-auto"
                />
              </div>
            );
          })}
        </div>

        {/* Dots */}
        {images.length > 1 && (
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === current ? "bg-primary" : "bg-white/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
