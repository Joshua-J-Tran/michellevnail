/* import stuff here */
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import "react-image-gallery/styles/css/image-gallery.css";
import SocialLinks from "@/components/functional/socials";
import ServiceList from "@/components/functional/service-list";
import WelcomePopup from "@/components/functional/WelcomePopup";

function IpadPage() {
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
