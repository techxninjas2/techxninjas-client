import React from "react";
import { Link } from "react-router-dom";
import { BRAND_NAME, WHATSAPP_COMMUNITY_LINK } from "../../constants";
import {
  WhatsAppIcon,
  YoutubeIcon,
  LinkedinIcon,
  InstagramIcon,
  TelegramIcon,
  MailIcon,
  PhoneIcon,
} from "../icons"; // Assuming MailIcon and PhoneIcon exist or will be added

interface FooterProps {
  layoutStyle?: React.CSSProperties;
}

const Footer: React.FC<FooterProps> = ({ layoutStyle }) => {
  const currentYear = new Date().getFullYear();
  const socialLinks = [
    {
      href: WHATSAPP_COMMUNITY_LINK,
      icon: WhatsAppIcon,
      label: "WhatsApp",
      color: "hover:text-green-500",
    },
    {
      href: "https://www.youtube.com/@techxninjas?sub_confirmation=1",
      icon: YoutubeIcon,
      label: "YouTube",
      color: "hover:text-red-600",
    },
    {
      href: "https://www.linkedin.com/company/techxninjas",
      icon: LinkedinIcon,
      label: "LinkedIn",
      color: "hover:text-blue-700",
    },
    {
      href: "https://www.instagram.com/cipherschools",
      icon: InstagramIcon,
      label: "Instagram",
      color: "hover:text-pink-600",
    }, // Note: Instagram link is to cipherschools as per prompt
    {
      href: "https://t.me/thetechxninjas",
      icon: TelegramIcon,
      label: "Telegram",
      color: "hover:text-blue-500",
    },
  ];

  return (
    <footer
      className="bg-gray-100 dark:bg-brand-dark-gray text-gray-700 dark:text-brand-medium-gray py-12"
      style={layoutStyle}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center sm:justify-between gap-8 mb-10 text-sm text-gray-600 dark:text-gray-300">
          {/* Column 1: TechXNinjas */}
          <div className="w-[200px] flex-shrink-0 text-center sm:text-left">
            <h5 className="text-xl font-bold text-brand-primary mb-4">
              {BRAND_NAME}
            </h5>
            <p className="text-sm leading-relaxed">
              Your gateway to hackathons, tech challenges, inspiring speakers,
              and innovation. We empower tech enthusiasts across India.
            </p>
          </div>

          {/* Column 2: Pages */}
          <div className="w-[200px] flex-shrink-0 text-center sm:text-left">
            <h5 className="text-lg font-semibold text-gray-800 dark:text-brand-off-white mb-4">
              Pages
            </h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="hover:text-brand-primary dark:hover:text-brand-ninja-gold"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className="hover:text-brand-primary dark:hover:text-brand-ninja-gold"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  to="/courses"
                  className="hover:text-brand-primary dark:hover:text-brand-ninja-gold"
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  to="/giveaways"
                  className="hover:text-brand-primary dark:hover:text-brand-ninja-gold"
                >
                  Giveaways
                </Link>
              </li>
              <li>
                <Link
                  to="/articles"
                  className="hover:text-brand-primary dark:hover:text-brand-ninja-gold"
                >
                  Articles
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support & Community */}
          <div className="w-[200px] flex-shrink-0 text-center sm:text-left">
            <h5 className="text-lg font-semibold text-gray-800 dark:text-brand-off-white mb-4">
              Support & Community
            </h5>
            <ul className="space-y-2 text-sm mb-4">
              <li>
                <Link
                  to="/dashboard"
                  className="hover:text-brand-primary dark:hover:text-brand-ninja-gold"
                >
                  My Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/contact-us"
                  className="hover:text-brand-primary dark:hover:text-brand-ninja-gold"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <a
                  href={WHATSAPP_COMMUNITY_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-primary dark:hover:text-brand-ninja-gold inline-flex items-center justify-center sm:justify-start"
                >
                  Join Us{" "}
                  <WhatsAppIcon className="w-4 h-4 ml-1.5 text-green-500" />
                </a>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-brand-primary dark:hover:text-brand-ninja-gold"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-brand-primary dark:hover:text-brand-ninja-gold"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="w-[200px] flex-shrink-0 text-center sm:text-left">
            <h5 className="text-lg font-semibold text-gray-800 dark:text-brand-off-white mb-4">
              Contact Info
            </h5>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-center sm:justify-start">
                <PhoneIcon className="w-4 h-4 mr-2 text-brand-primary dark:text-brand-ninja-gold flex-shrink-0" />
                <a
                  href="tel:+919122985472"
                  className="hover:text-brand-primary dark:hover:text-brand-ninja-gold"
                >
                  +91 91229 85472
                </a>
              </li>
              <li className="flex items-center justify-center sm:justify-start">
                <MailIcon className="w-4 h-4 mr-2 text-brand-primary dark:text-brand-ninja-gold flex-shrink-0" />
                <a
                  href="mailto:thetechxninjas@gmail.com"
                  className="hover:text-brand-primary dark:hover:text-brand-ninja-gold"
                >
                  thetechxninjas@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5: Connect With Us */}
          <div className="w-[200px] flex-shrink-0 text-center sm:text-left">
            <h5 className="text-lg font-semibold text-gray-800 dark:text-brand-off-white mb-4">
              Connect with us
            </h5>
            <ul className="space-y-3">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center sm:justify-start transition-colors duration-200"
                  >
                    <social.icon className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-300 group-hover:text-brand-primary dark:group-hover:text-brand-ninja-gold transition-colors duration-200" />
                    <span className="text-gray-600 dark:text-gray-300 group-hover:text-brand-primary dark:group-hover:text-brand-ninja-gold transition-colors duration-200">
                      {social.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center gap-1 pt-2 mt-[-20px] text-sm text-center">
          <p>
            &copy; {currentYear} {BRAND_NAME}. All rights reserved.
          </p>
          <p>Built with ❤️ by TechXNinjas Student Community.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
