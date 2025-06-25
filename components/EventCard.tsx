
import React from 'react';
import { Event } from '../types';
import { ExternalLinkIcon } from './icons';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col">
      <img 
        src={event.imageUrl || `https://picsum.photos/seed/${event.id}/400/200`} 
        alt={event.title} 
        className="w-full h-48 object-cover" 
      />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold mb-2 text-brand-primary">{event.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          Organized by: <span className="font-medium">{event.organizer}</span>
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Mode: <span className="font-medium capitalize">{event.mode}</span>
        </p>
        <div className="mb-4">
          {event.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block bg-ninja-gold bg-opacity-20 text-ninja-gold text-xs font-semibold mr-2 mb-2 px-2.5 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex-grow">{event.description.substring(0, 100)}...</p>
        <div className="mt-auto">
             <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Deadline: <span className="font-medium">{new Date(event.deadline).toLocaleDateString()}</span>
            </div>
            <a
                href={event.registrationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center bg-brand-primary hover:bg-ninja-gold text-white font-semibold py-2 px-4 rounded-lg transition duration-300 text-sm"
            >
                Register Now <ExternalLinkIcon className="w-4 h-4 ml-2" />
            </a>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
