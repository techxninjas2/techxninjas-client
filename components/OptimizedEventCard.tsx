import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Users, MapPin, ExternalLink, Star, Wifi, WifiOff, Globe } from 'lucide-react';
import { TechEvent, EventMode, EventStatus } from '../types';
import LazyImage from './LazyImage';
import { getOptimizedImageUrl } from '../utils/imageOptimization';

interface OptimizedEventCardProps {
  event: TechEvent;
}

const OptimizedEventCard: React.FC<OptimizedEventCardProps> = memo(({ event }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getModeIcon = (mode: EventMode) => {
    switch (mode) {
      case EventMode.ONLINE:
        return <Wifi className="w-3 h-3" />;
      case EventMode.OFFLINE:
        return <WifiOff className="w-3 h-3" />;
      case EventMode.HYBRID:
        return <Globe className="w-3 h-3" />;
      default:
        return <Globe className="w-3 h-3" />;
    }
  };

  const getModeColor = (mode: EventMode) => {
    switch (mode) {
      case EventMode.ONLINE:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case EventMode.OFFLINE:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case EventMode.HYBRID:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusBadge = (status: EventStatus) => {
    switch (status) {
      case EventStatus.UPCOMING:
        return <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs font-medium px-2 py-0.5 rounded-full">Upcoming</span>;
      case EventStatus.ONGOING:
        return <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-medium px-2 py-0.5 rounded-full">Ongoing</span>;
      case EventStatus.PAST:
        return <span className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 text-xs font-medium px-2 py-0.5 rounded-full">Past Event</span>;
      case EventStatus.CANCELLED:
        return <span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs font-medium px-2 py-0.5 rounded-full">Cancelled</span>;
      default:
        return null;
    }
  };

  const isRegistrationClosed = event.status === EventStatus.PAST || 
    event.status === EventStatus.CANCELLED || 
    new Date() > new Date(event.registration_end_date);

  const optimizedImageUrl = event.image_url 
    ? getOptimizedImageUrl(event.image_url, 400, 200)
    : `https://picsum.photos/seed/${event.id}/400/200`;

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
      <div className="relative h-32 sm:h-40">
        <LazyImage
          src={optimizedImageUrl}
          alt={event.title}
          className="w-full h-full"
        />
        
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {event.is_featured && (
            <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-1.5 py-0.5 rounded-full flex items-center">
              <Star className="w-2.5 h-2.5 mr-0.5" />
              Featured
            </span>
          )}
          <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full flex items-center ${getModeColor(event.mode)}`}>
            {getModeIcon(event.mode)}
            <span className="ml-0.5 capitalize">{event.mode}</span>
          </span>
        </div>

        <div className="absolute top-2 right-2">
          {getStatusBadge(event.status)}
        </div>
      </div>

      <div className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-bold mb-2 text-brand-dark-gray dark:text-white line-clamp-2">
          {event.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-3 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-1.5 mb-3">
          <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="w-3 h-3 mr-1.5 text-brand-primary flex-shrink-0" />
            <span className="truncate">
              {formatDate(event.start_date)}
              {event.end_date && event.start_date !== event.end_date && 
                ` - ${formatDate(event.end_date)}`
              }
            </span>
          </div>
          
          <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-3 h-3 mr-1.5 text-brand-primary flex-shrink-0" />
            <span>{formatTime(event.start_date)}</span>
          </div>

          <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <Users className="w-3 h-3 mr-1.5 text-brand-primary flex-shrink-0" />
            <span>
              {event.current_participants || 0} participants
              {event.max_participants && ` / ${event.max_participants} max`}
            </span>
          </div>

          {event.location && (
            <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="w-3 h-3 mr-1.5 text-brand-primary flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          )}

          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">Registration ends:</span> {formatDate(event.registration_end_date)}
          </div>
        </div>

        {event.tags && event.tags.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {event.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="bg-brand-primary bg-opacity-10 text-brand-primary dark:bg-brand-ninja-gold dark:bg-opacity-10 dark:text-brand-ninja-gold text-xs font-medium px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {event.tags.length > 2 && (
                <span className="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 text-xs font-medium px-2 py-0.5 rounded-full">
                  +{event.tags.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="mt-4">
          <Link
            to={`/events/${event.slug}`}
            className="w-full inline-flex items-center justify-center bg-brand-primary hover:bg-brand-ninja-gold text-white font-semibold py-2 px-3 rounded-lg transition duration-300 text-sm"
          >
            Learn more
            <ExternalLink className="w-3 h-3 ml-1" />
          </Link>
        </div>
      </div>
    </article>
  );
});

OptimizedEventCard.displayName = 'OptimizedEventCard';

export default OptimizedEventCard;