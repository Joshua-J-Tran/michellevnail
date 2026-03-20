import { FaFacebookF, FaInstagram } from "react-icons/fa";

export default function SocialLinks() {
  return (
    <div className="flex justify-center gap-4 mt-2">
      {/* Facebook */}
      <a
        href="https://www.facebook.com/michellevnails.sugarland/"
        target="_blank"
        rel="noopener noreferrer"
        className="
          p-3 rounded-full 
          bg-secondary/10 
          text-secondary 
          hover:bg-primary/20 
          hover:text-primary 
          hover:scale-110 
          hover:-translate-y-1 
          transition-all duration-300 
          shadow-sm
        "
      >
        <FaFacebookF size={20} />
      </a>

      {/* Instagram */}
      <a
        href="https://www.instagram.com/michellevnails.sugarland/"
        target="_blank"
        rel="noopener noreferrer"
        className="
          p-3 rounded-full 
          bg-secondary/10 
          text-secondary 
          hover:bg-primary/20 
          hover:text-primary 
          hover:scale-110 
          hover:-translate-y-1 
          transition-all duration-300 
          shadow-sm
        "
      >
        <FaInstagram size={20} />
      </a>
    </div>
  );
}
