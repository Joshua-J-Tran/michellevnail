/* import stuff here */
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import "react-image-gallery/styles/css/image-gallery.css";
// import ImageGallery from "react-image-gallery";
import WorkGallerySection from "@/components/functional/WorkGallerySection";
// import { getGalleryImages } from "@/components/functional/pullimage";
import SocialLinks from "@/components/functional/socials";
import ServiceList from "@/components/functional/service-list";
import TestimonialCarousel from "@/components/functional/TestimonialCarousel";
import WelcomePopup from "@/components/functional/WelcomePopup";
import { useEffect, useState } from "react";

function IpadPage() {
  // const images = getGalleryImages();

  const [_tapCount, setTapCount] = useState(0);

  useEffect(() => {
    const secret = ["l", "m", "a", "e"];
    let buffer: string[] = [];

    const handler = (e: KeyboardEvent) => {
      buffer.push(e.key.toLowerCase());
      buffer = buffer.slice(-secret.length); // keep last few keys
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // at top of component

  const [lastTap, setLastTap] = useState<number>(0);

  // tap logo 5x = ON, 10x = OFF, with a 1.5s reset window
  const handleLogoTap = () => {
    const now = Date.now();

    setTapCount((prev) => {
      const withinWindow = now - lastTap <= 1500; // 1.5s between taps counts toward the sequence
      const count = withinWindow ? prev + 1 : 1; // reset if too slow
      setLastTap(now);

      // keep counting, but avoid runaway growth
      return count > 10 ? 1 : count;
    });
  };

  return (
    <>
      <WelcomePopup />
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        

        {ServiceList()}



        {/* Footer */}
        <div className="py-12 px-4 sm:px-8 mt-10">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Contact Info */}
            <div className="flex flex-col items-center text-center">
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <p>MICHELLE V NAILS</p>
              <p>4645 Hwy 6 A, Sugar Land, TX 77478</p>
              <p>Call: (281) 242-1015</p>
              <p>Text: (281) 242-1015</p>
              <p>Email: michellevnails@gmail.com</p>
            </div>

            {/* Operating Hours */}
            <div className="flex flex-col items-center text-center">
              <h3 className="text-xl font-bold mb-4">Operating Hours</h3>
              <ul>
                <li>Mon – Sat: 9:00 AM – 7:00 PM</li>
                <li>Sun: 10:00 AM – 6:00 PM</li>
              </ul>
            </div>

            {/* Social Media */}
            <div className="flex flex-col items-center text-center">
              <h3 className="text-xl font-bold mb-4">Follow Us</h3>
              {SocialLinks()}
              <Button
                variant="outline"
                className="bg-primary text-secondary font-semibold hover:bg-primary-hover border-none shadow-[0_0_15px_rgba(212,175,55,0.4)] mt-6 transition-all"
              >
                <Link to="https://michellevnails8634.simplepos.us/">
                  Book Now!
                </Link>
              </Button>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} Michelle V Nails. All rights reserved.
          </div>
        </div>
      </div>
    </>
  );
}

export default IpadPage;
