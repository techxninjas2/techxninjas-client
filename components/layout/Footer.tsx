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
} from "../icons";

interface FooterProps {
  layoutStyle?: React.CSSProperties;
}

const Footer: React.FC<FooterProps> = ({ layoutStyle }) => {
  const currentYear = new Date().getFullYear();
  const socialLinks = [
    { href: WHATSAPP_COMMUNITY_LINK, icon: WhatsAppIcon, label: "WhatsApp" },
    {
      href: "https://www.youtube.com/@techxninjas?sub_confirmation=1",
      icon: YoutubeIcon,
      label: "YouTube",
    },
    {
      href: "https://www.linkedin.com/company/techxninjas",
      icon: LinkedinIcon,
      label: "LinkedIn",
    },
    {
      href: "https://www.instagram.com/cipherschools",
      icon: InstagramIcon,
      label: "Instagram",
    },
    { href: "https://t.me/thetechxninjas", icon: TelegramIcon, label: "Telegram" },
  ];

  return (
    <footer
      className="relative bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 
                 dark:from-brand-dark-gray dark:via-gray-900 dark:to-brand-dark-gray
                 text-gray-700 dark:text-brand-medium-gray mt-10 rounded-t-2xl shadow-inner"
      style={layoutStyle}
    >
      <div className="container mx-auto px-6 py-12">
        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 mb-10 text-sm">
          {/* Column 1 */}
          <div>
            <h5 className="text-2xl font-bold text-brand-primary mb-4">{BRAND_NAME}</h5>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              Your gateway to hackathons, tech challenges, inspiring speakers,
              and innovation. We empower tech enthusiasts across India.
            </p>
          </div>

          {/* Column 2 */}
          <div>
            <h5 className="text-lg font-semibold text-gray-800 dark:text-brand-off-white mb-4">
              Pages
            </h5>
            <ul className="space-y-2 text-sm">
              {["Home", "Events", "Courses", "Giveaways", "Articles"].map((page, i) => (
                <li key={i}>
                  <Link
                    to={page === "Home" ? "/" : `/${page.toLowerCase()}`}
                    className="hover:text-brand-primary dark:hover:text-brand-ninja-gold transition-colors"
                  >
                    {page}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h5 className="text-lg font-semibold text-gray-800 dark:text-brand-off-white mb-4">
              Support & Community
            </h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/dashboard"
                  className="hover:text-brand-primary dark:hover:text-brand-ninja-gold transition-colors"
                >
                  My Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/contact-us"
                  className="hover:text-brand-primary dark:hover:text-brand-ninja-gold transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <a
                  href={WHATSAPP_COMMUNITY_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-primary dark:hover:text-brand-ninja-gold inline-flex items-center transition-colors"
                >
                  Join Us <WhatsAppIcon className="w-4 h-4 ml-1.5 text-green-500" />
                </a>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-brand-primary dark:hover:text-brand-ninja-gold transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-brand-primary dark:hover:text-brand-ninja-gold transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h5 className="text-lg font-semibold text-gray-800 dark:text-brand-off-white mb-4">
              Contact Info
            </h5>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <PhoneIcon className="w-4 h-4 mr-2 text-brand-primary dark:text-brand-ninja-gold" />
                <a
                  href="tel:+919122985472"
                  className="hover:text-brand-primary dark:hover:text-brand-ninja-gold transition-colors"
                >
                  +91 91229 85472
                </a>
              </li>
              <li className="flex items-center">
                <MailIcon className="w-4 h-4 mr-2 text-brand-primary dark:text-brand-ninja-gold" />
                <a
                  href="mailto:thetechxninjas@gmail.com"
                  className="hover:text-brand-primary dark:hover:text-brand-ninja-gold transition-colors"
                >
                  thetechxninjas@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5 */}
          <div>
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
                    className="group flex items-center transition-transform duration-200 hover:translate-x-1"
                  >
                    <social.icon className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-300 group-hover:text-brand-primary dark:group-hover:text-brand-ninja-gold" />
                    <span className="text-gray-600 dark:text-gray-300 group-hover:text-brand-primary dark:group-hover:text-brand-ninja-gold">
                      {social.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center gap-1 pt-4 text-sm text-center">
          <p>&copy; {currentYear} {BRAND_NAME}. All rights reserved.</p>
          <p className="text-gray-500 dark:text-gray-400">
            Built with ❤️ by TechXNinjas Student Community.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
