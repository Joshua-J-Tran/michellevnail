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
import { useEffect, useState } from "react";

function HomePage() {
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
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center moontime-header px-6 sm:px-10 lg:px-20 py-6 gap-4 sm:gap-0">
        {/* Left group: logo + title together */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <img
            src="/images/logo-a.png"
            alt="Salon Logo"
            className="h-24 sm:h-10 mx-1 sm:mx-2 rounded-full"
          />
          <h1 className="text-4xl font-bold text-center sm:text-left text-secondary">
            MICHELLE V NAILS
          </h1>
          <p className="block sm:hidden mt-0 text-lg font-bold text-secondary tracking-wide">
            Nails & Spa Experience
          </p>
        </div>

        {/* Right: Book Now button */}
        <Button
          variant="outline"
          className="hidden sm:flex bg-primary text-secondary font-semibold hover:bg-primary-hover border-none shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all"
        >
          <Link to="https://michellevnails8634.simplepos.us/">Book Now!</Link>
        </Button>
        <Button className="block sm:hidden w-max mx-auto lg:mx-0 mt-0 text-secondary bg-primary hover:bg-primary-hover transition-colors font-bold">
          <Link to="https://michellevnails8634.simplepos.us/">
            Start Booking Today!
          </Link>
        </Button>
      </div>

      {/* Hero Section */}
      <div
        className="legend flex flex-col lg:grid lg:grid-cols-1 gap-6 sm:gap-10 items-center
                   px-4 sm:px-6 lg:px-20 py-10
                   legend sm:min-h-[70vh] lg:min-h-[80vh]"
      >
        {/* Left */}
        <div className="flex flex-col gap-3 text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-secondary drop-shadow-md">
            <span className="block ">Welcome to</span>{" "}
            <span className="block sm:mt-2">
              <strong className="bg-gradient-to-r from-[#ff7782] via-[#ffb347] to-[#ff7782] bg-clip-text text-transparent">
                MICHELLE V NAILS
              </strong>
            </span>
          </h1>

          <p className="hidden sm:flex mt-4 sm:mt-2 text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-secondary tracking-wide">
            Nails & Spa Experience
            <br />
          </p>
          <Button className="hidden sm:flex w-max mx-auto lg:mx-0 mt-2 text-secondary bg-primary hover:bg-primary-hover transition-colors font-bold">
            <Link to="https://michellevnails8634.simplepos.us/">
              Start Booking Today!
            </Link>
          </Button>
        </div>

        {/* Right 
                <div className="flex justify-center items-center mt-6 lg:mt-0 cursor-pointer" onClick={handleLogoTap}>
                    <img
                        src="/placeholder/logo.png"
                        className="h-64 sm:h-80 md:h-96 object-contain rounded-lg"
                        alt="/placeholder/placeholder1.png"
                    />
                </div>
                */}
      </div>

      {/* REDACTED Image Gallery Section 
            <div className="p-6 sm:p-10 flex flex-col items-center">
                <h2 className="text-3xl font-bold mb-4 sm:mb-6 text-center">Our Work Gallery</h2>
                <p className="text-secondary/80 mb-6 sm:mb-8 text-center max-w-2xl">
                    Take a look at some of our recent nail designs and styles.
                    Click any image to view it larger!
                </p>

                <div className="w-full sm:max-w-[900px] md:max-w-[1200px] lg:max-w-[1400px]" onClick={handleLogoTap}>
                    <ImageGallery
                        items={images}
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
                                        borderRadius: "8px"
                                    }}
                                />
                            </div>
                        )}
                    />
                </div>
            </div>
            */}

      {/* Updated image Gallery Section */}
      <WorkGallerySection handleLogoTap={handleLogoTap} />

      {/* Curvy Stylish Divider with Logo */}
      <div className="flex items-center mt-4 w-full max-w-[1400px] mx-auto px-4 sm:px-0">
        <svg
          className="flex-1 h-12"
          viewBox="0 0 200 40"
          preserveAspectRatio="none"
        >
          <path
            d="M0 20 Q50 0 100 20 T200 20"
            fill="none"
            stroke="url(#gradientLeft)"
            strokeWidth="4"
          />
          <defs>
            <linearGradient id="gradientLeft">
              <stop offset="0%" stopColor="bg-primary" />
              <stop offset="100%" stopColor="#111111" />
            </linearGradient>
          </defs>
        </svg>

        <img
          src="/images/logo-a.png"
          alt="Salon Logo"
          className="h-64 sm:h-40 mx-4 sm:mx-8 rounded-full shadow-lg"
        />

        <svg
          className="flex-1 h-12"
          viewBox="0 0 200 40"
          preserveAspectRatio="none"
        >
          <path
            d="M0 20 Q50 40 100 20 T200 20"
            fill="none"
            stroke="url(#gradientRight)"
            strokeWidth="4"
          />
          <defs>
            <linearGradient id="gradientRight">
              <stop offset="0%" stopColor="bg-primary" />
              <stop offset="100%" stopColor="#111111" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {ServiceList()}

      {/* Curvy Stylish Divider with Logo */}
      <div className="flex items-center mt-4 w-full max-w-[1400px] mx-auto px-4 sm:px-0">
        <svg
          className="flex-1 h-12"
          viewBox="0 0 200 40"
          preserveAspectRatio="none"
        >
          <path
            d="M0 20 Q50 0 100 20 T200 20"
            fill="none"
            stroke="url(#gradientLeft-2)"
            strokeWidth="4"
          />
          <defs>
            <linearGradient id="gradientLeft-2">
              <stop offset="0%" stopColor="bg-primary" />
              <stop offset="100%" stopColor="#111111" />
            </linearGradient>
          </defs>
        </svg>

        <img
          src="/images/logo-a.png"
          alt="Salon Logo"
          className="h-64 sm:h-40 mx-4 sm:mx-8 rounded-full shadow-lg"
        />

        <svg
          className="flex-1 h-12"
          viewBox="0 0 200 40"
          preserveAspectRatio="none"
        >
          <path
            d="M0 20 Q50 40 100 20 T200 20"
            fill="none"
            stroke="url(#gradientRight-2)"
            strokeWidth="4"
          />
          <defs>
            <linearGradient id="gradientRight-2">
              <stop offset="0%" stopColor="bg-primary" />
              <stop offset="100%" stopColor="#111111" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* What People Say Section */}
      <div className="p-6 sm:p-10 flex flex-col items-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-center text-secondary">
          Nails & Spa Experience
        </h2>
        <p className="text-xl sm:text-2xl md:text-3xl mb-6 sm:mb-8 text-center font-semibold text-secondary">
          Here is what our customers say about us.
        </p>
        {<TestimonialCarousel />}
      </div>

      {/* Footer */}
      <div className="py-12 px-4 sm:px-8 mt-10">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Contact Info */}
          <div className="flex flex-col items-center text-center">
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <p>MICHELLE V NAILS</p>
            <p>4645 Hwy 6 A, Sugar Land, TX 77478</p>
            <p>☏: (281) 242-1015</p>
            <p>🕻 (Text Only): (713) 282-1475</p>
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
  );
}

export default HomePage;
