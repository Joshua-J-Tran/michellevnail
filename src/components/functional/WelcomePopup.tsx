import { useState, useEffect } from "react";

export default function WelcomePopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={() => setVisible(false)}
    >
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => setVisible(false)}
          className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-background/80 hover:bg-secondary/80 transition-colors text-secondary hover:text-gray-900 flex items-center justify-center shadow-md"
          aria-label="Close"
        >
          ✕
        </button>

        <img
          src="/placeholder/logo.png"
          alt="Michelle V Nails Logo"
          className="h-130 sm:h-170 object-contain rounded-2xl border-3 border-primary/80"
        />
      </div>
    </div>
  );
}
