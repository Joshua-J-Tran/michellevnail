import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

export default function SocialLinks() {
    return (
        <div className="flex gap-4 mt-2">
            <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-gray-200 rounded-full text-blue-600 hover:bg-blue-100 hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-md"
            >
                <FaFacebookF size={20} />
            </a>
            <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-gray-200 rounded-full text-pink-500 hover:bg-pink-100 hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-md"
            >
                <FaInstagram size={20} />
            </a>
            <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-gray-200 rounded-full text-sky-500 hover:bg-sky-100 hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-md"
            >
                <FaTwitter size={20} />
            </a>
        </div>
    );
}
