import { useState } from "react";
import { services } from "@/misc/service-hardcode";

interface ServiceOption {
  name: string;
  price: string;
}

interface Service {
  name: string;
  image: string;
  options: ServiceOption[];
}

export default function ServiceList() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  return (
    <div className="px-6 sm:px-10 py-12 flex flex-col items-center bg-background min-h-screen">
      {/* Header */}
      <h2
        className="text-5xl sm:text-6xl font-bold mb-4 text-center text-secondary"
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
      >
        𓆰 Our Services
      </h2>
      <p
        className="text-secondary/70 mb-10 text-center text-lg sm:text-xl max-w-xl"
        style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
      >
        Take a look at what we have to offer.
      </p>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-12 w-full max-w-xs">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <span className="text-primary text-lg">✦</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full max-w-7xl">
        {services.map((service, i) => (
          <div
            key={service.name}
            onClick={() => setSelectedService(service)}
            style={{ animationDelay: `${i * 80}ms` }}
            className="group cursor-pointer rounded-2xl overflow-hidden bg-background border border-border shadow-sm
                       hover:shadow-[0_8px_32px_rgba(255,119,130,0.18)] hover:-translate-y-1
                       transition-all duration-300 animate-fadeIn"
          >
            {/* Image */}
            <div className="relative overflow-hidden">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Subtle blush overlay on hover */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>

            {/* Card footer */}
            <div className="px-5 py-4 flex items-center justify-between border-t border-border/60">
              <h3
                className="text-secondary font-semibold text-lg leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                {service.name}
              </h3>
              {/* Arrow indicator */}
              <span
                className="text-primary opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1
                               transition-all duration-300 text-xl leading-none"
              >
                →
              </span>
            </div>

            {/* Bottom accent bar */}
            <div
              className="h-[3px] bg-gradient-to-r from-primary via-accent to-primary/40
                            scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
            />
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedService && (
        <div
          className="fixed inset-0 bg-secondary/30 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setSelectedService(null)}
        >
          <div
            className="relative rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden
                       border border-border bg-background"
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: "90vh" }}
          >
            {/* Modal header */}
            <div className="px-6 pt-6 pb-4 border-b border-border bg-gradient-to-br from-background to-accent/20">
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center
                           rounded-full text-secondary/50 hover:text-primary hover:bg-primary/10
                           transition-all duration-200 text-lg leading-none"
              >
                ✕
              </button>
              <h2
                className="text-3xl font-bold text-secondary pr-8"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                {selectedService.name}
              </h2>
              <div className="mt-2 h-[2px] w-12 bg-gradient-to-r from-primary to-accent rounded-full" />
            </div>

            {/* Modal body */}
            <div
              className="overflow-y-auto px-6 py-5"
              style={{ maxHeight: "60vh" }}
            >
              <ul className="space-y-1">
                {selectedService.options.map((option, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center py-3 border-b border-border/50 last:border-0
                               text-secondary/90 hover:text-secondary transition-colors duration-150"
                  >
                    <span
                      className="text-base"
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                      }}
                    >
                      {option.name}
                    </span>
                    <span className="font-semibold text-primary text-base ml-4 shrink-0">
                      {option.price}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Modal footer accent */}
            <div className="h-[3px] bg-gradient-to-r from-primary via-accent to-primary/40" />
          </div>
        </div>
      )}
    </div>
  );
}
