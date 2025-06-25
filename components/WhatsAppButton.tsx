
import React from 'react';
import { WhatsAppIcon } from './icons'; // Assuming you have a WhatsAppIcon

const WhatsAppButton: React.FC = () => {
  const WHATSAPP_LINK = "https://chat.whatsapp.com/KTGVdxdO5nTBsy53eG4zOr"; // Updated WhatsApp link

  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="hidden lg:flex lg:fixed lg:top-5 lg:right-5 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 z-50"
      aria-label="Chat on WhatsApp"
    >
      <WhatsAppIcon className="w-6 h-6" />
    </a>
  );
};

export default WhatsAppButton;

// Note for positioning:
// The ScrollToTopButton is positioned at `fixed bottom-20 lg:bottom-5 right-5`.
// This WhatsApp button is now `hidden lg:flex lg:fixed lg:top-5 lg:right-5`.
// On mobile, WhatsApp button will be hidden.
// On desktop, ScrollToTop is bottom-right, WhatsApp is top-right.