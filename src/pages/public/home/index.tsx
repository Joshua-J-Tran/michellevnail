/* import stuff here */
import { Button } from '@/components/ui/button';
import { Link } from "react-router";
import "react-image-gallery/styles/css/image-gallery.css";
// import ImageGallery from "react-image-gallery";
import WorkGallerySection from '@/components/functional/WorkGallerySection';
// import { getGalleryImages } from "@/components/functional/pullimage";
import SocialLinks from "@/components/functional/socials"
import ServiceList from '@/components/functional/service-list';
import TestimonialCarousel from '@/components/functional/TestimonialCarousel';
import TestimonialCarousel_Joke from '@/components/functional/TestimonialCarousel_joke';
import ServiceList_joke from '@/components/functional/service-list_joke';
import { useEffect, useState } from "react";


function HomePage() {
    // const images = getGalleryImages();


    const [joke_mode, setJokeMode] = useState(false);
    const [_tapCount, setTapCount] = useState(0);

    useEffect(() => {
        const secret = ["j", "o", "k", "e"];
        let buffer: string[] = [];

        const handler = (e: KeyboardEvent) => {
            buffer.push(e.key.toLowerCase());
            buffer = buffer.slice(-secret.length); // keep last few keys
            if (buffer.join("") === secret.join("")) {
                setJokeMode(true);
            }
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    // at top of component

    const [lastTap, setLastTap] = useState<number>(0);

    // tap logo 5x = ON, 10x = OFF, with a 1.5s reset window
    const handleLogoTap = () => {
        const now = Date.now();

        setTapCount(prev => {
            const withinWindow = now - lastTap <= 1500;   // 1.5s between taps counts toward the sequence
            const count = withinWindow ? prev + 1 : 1;    // reset if too slow
            setLastTap(now);

            if (!joke_mode && count === 5) {
                setJokeMode(true);          // do NOT reset here so we can still reach 10
                return count;
            }

            if (joke_mode && count === 10) {
                setJokeMode(false);         // turn off at 10, then reset
                return 0;
            }

            // keep counting, but avoid runaway growth
            return count > 10 ? 1 : count;
        });
    };




    return (
        <div className="flex flex-col text-secondary">

            {/* Navbar */}
            <div className="flex flex-col sm:flex-row justify-between items-center px-6 sm:px-10 lg:px-20 py-6 gap-4 sm:gap-0">
                <h1 className="text-3xl font-bold text-center sm:text-left">
                    <strong className="text-slate-300">TULIP </strong>
                    <strong className="text-zinc-300">NAILS & SPA</strong>
                </h1>
                <Button variant="outline" className="bg-[#e6c36a] text-black font-semibold shadow-[0_0_10px_rgba(230,195,106,0.3)] hover:bg-[#ffdc7c] transition-all">
                    <Link to="/register">Book Now!</Link>
                </Button>
            </div>

            {/* Hero Section */}
            <div
                className="legend flex flex-col lg:grid lg:grid-cols-2 gap-6 sm:gap-10 items-center
                   px-4 sm:px-6 lg:px-20 py-10
                   legend sm:min-h-[70vh] lg:min-h-[80vh]"
            >
                {/* Left */}
                <div className="flex flex-col gap-3 text-center lg:text-left">
                    <h1 className="text-5xl sm:text-6xl font-bold text-[#e6c36a] drop-shadow-[0_0_10px_rgba(230,195,106,0.3)]">
                        Welcome to <strong className="text-slate-300">TULIP </strong>
                        <strong className="text-zinc-300">NAILS & SPA</strong>
                    </h1>
                    <p className="text-gray-700 text-sm sm:text-base font-semibold">
                        <p className="text-fuchsia-500 font-bold mt-2">
                        A First-class Luxury Exprience <br />
                        <strong className="text-[#e6c36a]">From</strong> the Best <br />
                        <strong className="text-[#e6c36a]">For</strong> the Best <br />
                        </p>
                    </p>
                    <Button className="w-max mx-auto lg:mx-0 mt-2 text-secondary bg-amber-100 hover:bg-amber-600 transition-colors font-bold">
                        <Link to="/register">Start Booking Today!</Link>
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
                <svg className="flex-1 h-12" viewBox="0 0 200 40" preserveAspectRatio="none">
                    <path d="M0 20 Q50 0 100 20 T200 20" fill="none" stroke="url(#gradientLeft)" strokeWidth="4" />
                    <defs>
                        <linearGradient id="gradientLeft" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#63d5f1ff" />
                            <stop offset="50%" stopColor="#107bf7ff" />
                            <stop offset="100%" stopColor="#1507e0ff" />
                        </linearGradient>
                    </defs>
                </svg>

                <img
                    src="/images/logo-a.png"
                    alt="Salon Logo"
                    className="h-32 sm:h-20 mx-4 sm:mx-8 rounded-full shadow-lg"
                />

                <svg className="flex-1 h-12" viewBox="0 0 200 40" preserveAspectRatio="none">
                    <path d="M0 20 Q50 40 100 20 T200 20" fill="none" stroke="url(#gradientRight)" strokeWidth="4" />
                    <defs>
                        <linearGradient id="gradientRight" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#1507e0ff" />
                            <stop offset="50%" stopColor="#107bf7ff" />
                            <stop offset="100%" stopColor="#63d5f1ff" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Menu Section 
            <div className="p-6 sm:p-10 flex flex-col items-center">
                <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 sm:mb-6 text-center">𓆰 Our Services</h2>
                <p className="text-secondary/90 mb-6 sm:mb-8 text-center text-xl sm:text-2xl max-w-2xl">
                    Take a look at what we have to offer.
                </p>

                <div className="flex flex-wrap justify-center gap-4 sm:gap-10">
                    <img
                        src="/images/menu.jpg"
                        alt="Our Menu"
                        className="w-full sm:w-[45%] max-w-[586px] h-auto object-contain rounded-lg shadow-lg"
                    />
                    <img
                        src="/images/menu.jpg"
                        alt="Our Menu"
                        className="w-full sm:w-[45%] max-w-[586px] h-auto object-contain rounded-lg shadow-lg"
                    />
                </div>
            </div>
            */}
            {/*}
            <div className="p-6 sm:p-10 flex flex-col items-center">
                <h2 className="text-6xl sm:text-7xl md:text-8xl font-bold mb-4 sm:mb-6 text-center">𓆰 Our Services</h2>
                <p className="text-secondary/90 mb-6 sm:mb-8 text-center text-xl sm:text-2xl max-w-2xl">
                    Take a look at what we have to offer.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 w-full max-w-7xl">
                    {[
                        { name: "Acrylic - Dip Powder", img: "/images/acrylic.jpg" },
                        { name: "Manicure", img: "/images/manicure.jpg" },
                        { name: "Pedicure", img: "/images/pedicure.jpg" },
                        { name: "Waxing", img: "/images/waxing.jpg" },
                        { name: "Princess Menu", img: "/images/princess-a.jpg" },
                        { name: "Additional Services", img: "/images/additional.jpg" },
                    ].map((service, index) => (
                        <div
                            key={index}
                            className="relative w-full overflow-hidden rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                        >
                            <img
                                src={service.img}
                                alt={service.name}
                                className="w-full h-64 object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-center py-2 font-bold text-lg">
                                {service.name}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            */}

            {(!joke_mode) && ServiceList()}
            {(joke_mode) && ServiceList_joke()}

            {/* Curvy Stylish Divider with Logo */}
            <div className="flex items-center mt-4 w-full max-w-[1400px] mx-auto px-4 sm:px-0">
                <svg className="flex-1 h-12" viewBox="0 0 200 40" preserveAspectRatio="none">
                    <path d="M0 20 Q50 0 100 20 T200 20" fill="none" stroke="url(#gradientLeft-2)" strokeWidth="4" />
                    <defs>
                        <linearGradient id="gradientLeft-2" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#f163b6ff" />
                            <stop offset="50%" stopColor="#f710aaff" />
                            <stop offset="100%" stopColor="#b507e0ff" />
                        </linearGradient>
                    </defs>
                </svg>

                <img
                    src="/images/logo-a.png"
                    alt="Salon Logo"
                    className="h-32 sm:h-20 mx-4 sm:mx-8 rounded-full shadow-lg"
                />

                <svg className="flex-1 h-12" viewBox="0 0 200 40" preserveAspectRatio="none">
                    <path d="M0 20 Q50 40 100 20 T200 20" fill="none" stroke="url(#gradientRight-2)" strokeWidth="4" />
                    <defs>
                        <linearGradient id="gradientRight-2" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#b507e0ff" />
                            <stop offset="50%" stopColor="#f710aaff" />
                            <stop offset="100%" stopColor="#f163b6ff" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>


            {/* What People Say Section */}
            <div className="p-6 sm:p-10 flex flex-col items-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-center text-fuchsia-700">We Appreciate You!</h2>
                <p className="text-xl sm:text-2xl md:text-3xl mb-6 sm:mb-8 text-center font-semibold">
                    Here is what our customers say about us.
                </p>
                {(!joke_mode) && <TestimonialCarousel />}
                {(joke_mode) && <TestimonialCarousel_Joke />}
            </div>




            {/* Footer */}
            <div className="bg-gray-900 text-white py-12 px-4 sm:px-8 mt-10">
                <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Contact Us</h3>
                        <p>RICH-NAILS Salon & Spa</p>
                        <p>3140 East Fort Lowell Street, Tucson, AZ 85716</p>
                        <p>Phone: (520) 203-7700</p>
                        <p>Email: info@richnails.com</p>
                    </div>

                    {/* Operating Hours */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Operating Hours</h3>
                        <ul>
                            <li>Mon – Fri: 9:30 AM – 7:00 PM</li>
                            <li>Sat: 9:30 AM – 6:00 PM</li>
                            <li>Sun: 11:00 AM – 5:00 PM</li>
                        </ul>
                    </div>

                    {/* Website Info */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Website-related Contacts</h3>
                        <p>Taivas WD</p>
                        <p>Email: taivaswd@gmail.com</p>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Follow Us</h3>
                        {SocialLinks()}
                        <Button variant="outline" className="text-secondary font-bold mt-6 w-full sm:w-auto">
                            <Link to="/register">Book Now!</Link>
                        </Button>
                    </div>

                </div>

                {/* Copyright */}
                <div className="mt-8 text-center text-gray-400 text-sm">
                    © {new Date().getFullYear()} Crystal Nails & Spa. All rights reserved.
                </div>
            </div>

        </div>
    );
}

export default HomePage;
