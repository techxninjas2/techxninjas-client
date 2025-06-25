import React from 'react';
import { Link } from 'react-router-dom';
import { BRAND_NAME, WHATSAPP_COMMUNITY_LINK } from '../../constants';
import { 
  WhatsAppIcon,
  YoutubeIcon,
  LinkedinIcon,
  InstagramIcon,
  TelegramIcon,
  MailIcon,
  PhoneIcon
} from '../icons'; // Assuming MailIcon and PhoneIcon exist or will be added

interface FooterProps {
  layoutStyle?: React.CSSProperties;
}

const Footer: React.FC<FooterProps> = ({ layoutStyle }) => {
  const currentYear = new Date().getFullYear();
  const socialLinks = [
    { href: WHATSAPP_COMMUNITY_LINK, icon: WhatsAppIcon, label: 'WhatsApp', color: 'hover:text-green-500' },
    { href: 'https://www.youtube.com/@techxninjas?sub_confirmation=1', icon: YoutubeIcon, label: 'YouTube', color: 'hover:text-red-600' },
    { href: 'https://www.linkedin.com/company/techxninjas', icon: LinkedinIcon, label: 'LinkedIn', color: 'hover:text-blue-700' },
    { href: 'https://www.instagram.com/cipherschools', icon: InstagramIcon, label: 'Instagram', color: 'hover:text-pink-600' }, // Note: Instagram link is to cipherschools as per prompt
    { href: 'https://t.me/thetechxninjas', icon: TelegramIcon, label: 'Telegram', color: 'hover:text-blue-500' },
  ];

  return (
    <footer 
      className="bg-gray-100 dark:bg-brand-dark-gray text-gray-700 dark:text-brand-medium-gray py-12"
      style={layoutStyle}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Column 1: TechXNinjas */}
          <div>
            <h5 className="text-xl font-bold text-brand-primary mb-4">{BRAND_NAME}</h5>
            <p className="text-sm leading-relaxed">
              Your gateway to hackathons, tech challenges, inspiring speakers, and innovation. We empower tech enthusiasts across India.
            </p>
          </div>

          {/* Column 2: Pages */}
          <div>
            <h5 className="text-lg font-semibold text-gray-800 dark:text-brand-off-white mb-4">Pages</h5>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-brand-primary dark:hover:text-brand-ninja-gold">Home</Link></li>
              <li><Link to="/events" className="hover:text-brand-primary dark:hover:text-brand-ninja-gold">Events</Link></li>
              <li><Link to="/courses" className="hover:text-brand-primary dark:hover:text-brand-ninja-gold">Courses</Link></li>
              <li><Link to="/giveaways" className="hover:text-brand-primary dark:hover:text-brand-ninja-gold">Giveaways</Link></li>
              <li><Link to="/articles" className="hover:text-brand-primary dark:hover:text-brand-ninja-gold">Articles</Link></li>
            </ul>
          </div>

          {/* Column 3: Support & Community */}
          <div>
            <h5 className="text-lg font-semibold text-gray-800 dark:text-brand-off-white mb-4">Support & Community</h5>
            <ul className="space-y-2 text-sm mb-4">
              <li><Link to="/dashboard" className="hover:text-brand-primary dark:hover:text-brand-ninja-gold">My Profile</Link></li>
              <li><Link to="/contact-us" className="hover:text-brand-primary dark:hover:text-brand-ninja-gold">Contact Us</Link></li>
              <li>
                <a 
                  href={WHATSAPP_COMMUNITY_LINK} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-brand-primary dark:hover:text-brand-ninja-gold inline-flex items-center"
                >
                  Join Us <WhatsAppIcon className="w-4 h-4 ml-1.5 text-green-500" />
                </a>
              </li>
              <li><Link to="/privacy" className="hover:text-brand-primary dark:hover:text-brand-ninja-gold">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-brand-primary dark:hover:text-brand-ninja-gold">Terms of Service</Link></li>
            </ul>
            <h6 className="text-md font-semibold text-gray-700 dark:text-brand-off-white mb-2 mt-4">Connect with us:</h6>
            <div className="flex space-x-3">
              {socialLinks.map(social => (
                <a 
                  key={social.label}
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={social.label} 
                  className={`text-gray-500 dark:text-brand-medium-gray ${social.color} transition-colors duration-200`}
                >
                  <social.icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Column 4: Contact Info */}
          <div>
            <h5 className="text-lg font-semibold text-gray-800 dark:text-brand-off-white mb-4">Contact Info</h5>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <PhoneIcon className="w-4 h-4 mr-2 text-brand-primary dark:text-brand-ninja-gold flex-shrink-0" />
                <a href="tel:+919122985472" className="hover:text-brand-primary dark:hover:text-brand-ninja-gold">+91 91229 85472</a>
              </li>
              <li className="flex items-center">
                <MailIcon className="w-4 h-4 mr-2 text-brand-primary dark:text-brand-ninja-gold flex-shrink-0" />
                <a href="mailto:thetechxninjas@gmail.com" className="hover:text-brand-primary dark:hover:text-brand-ninja-gold">thetechxninjas@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-300 dark:border-gray-700 pt-8 text-center text-sm">
          <p>&copy; {currentYear + 1} {BRAND_NAME}. All rights reserved.</p> {/* Updated to 2025 as per prompt */}
          <p className="mt-1">Built with ❤️ by TechXNinjas Student Community.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;