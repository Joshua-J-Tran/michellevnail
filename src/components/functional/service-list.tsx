import { useState } from "react";
import { services } from "@/misc/service-hardcode";

// Define the type for a service
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
        <div className="p-6 sm:p-10 flex flex-col items-center">
            <h2 className="text-6xl font-bold mb-8 text-center text-white">
  𓆰Our Services
</h2>
            <p className="text-secondary/90 mb-6 sm:mb-8 text-center text-xl sm:text-2xl max-w-2xl text-white">
                Take a look at what we have to offer.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 w-full max-w-7xl">
  {services.map((service) => (
    <div
      key={service.name}
      onClick={() => setSelectedService(service)}
      className={[
        // Outer card: gradient border + padding for thickness
        "relative cursor-pointer rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-2xl hover:scale-105 duration-300",
        "bg-gradient-to-br from-gold via-gold-dark to-near-black p-[3px]",  // gold → black fade; adjust direction/thickness as needed
      ].join(" ")}
    >
      {/* Inner content wrapper: covers gradient to make it look like a border */}
      <div className="relative bg-near-black/95 rounded-[calc(0.75rem-3px)] overflow-hidden h-full flex flex-col">
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-64 object-cover"
        />
        <div className="p-4 text-center relative">
          {/* Name overlay – moved inside inner div for proper positioning */}
          <h1 className=" text-white font-bold text-lg py-2 mt-2 rounded">
            {service.name}
          </h1>
        </div>
      </div>
    </div>
  ))}
</div>

            {/* Crystal Modal */}
            {selectedService && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
                    <div
                        className="relative rounded-2xl shadow-2xl p-6 w-full max-w-md animate-scaleUp border border-white/40 backdrop-blur-3xl overflow-hidden"
                        style={{
                            background: `
                                linear-gradient(135deg, rgba(133, 126, 126, 0.15), rgba(180, 149, 149, 0.15)),
                                url('/patterns/chrysanthemum.svg')
                            `,
                            backgroundSize: "200px",
                            backgroundRepeat: "repeat",
                            backgroundPosition: "center",
                            maxHeight: "90vh",
                        }}
                    >
                        {/* Scrollable content */}
                        <div className="overflow-y-auto max-h-[80vh] pr-2">
                            <button
                                onClick={() => setSelectedService(null)}
                                className="absolute top-2 right-3 text-white hover:text-red-300 text-2xl"
                            >
                                ✕
                            </button>
                            <h2 className="text-3xl font-bold mb-8 text-center text-white drop-shadow-lg">
                                {selectedService.name}
                            </h2>
                            <ul className="space-y-3">
                                {selectedService.options.map((option, index) => (
                                    <li
                                        key={index}
                                        className="flex justify-between text-lg border-b border-white/30 pb-2 text-white/90"
                                    >
                                        <span>{option.name}</span>
                                        <span className="font-semibold">{option.price}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
