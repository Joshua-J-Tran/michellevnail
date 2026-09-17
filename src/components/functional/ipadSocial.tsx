import { QRCodeSVG } from "qrcode.react";

const socialLinks = [
  {
    name: "Facebook",
    url: "https://www.facebook.com/michellevnails.sugarland/",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/michellevnails.sugarland/",
  },
];

export default function IpadSocialLinks() {
  return (
    <div className="flex justify-center gap-6 mt-4">
      {socialLinks.map((item) => (
        <div
          key={item.name}
          className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white shadow-md border border-gray-100 transition-transform duration-300 hover:scale-105"
        >
          <div className="p-2 bg-secondary/10 rounded-xl">
            <QRCodeSVG
              value={item.url}
              size={120}
              level="H"
              includeMargin={false}
            />
          </div>
          <span className="text-sm font-medium text-secondary">
            {item.name}
          </span>
        </div>
      ))}
    </div>
  );
}
