import React from 'react';

interface PlaylistPanelProps {
  title: string;
  thumbnailUrl: string;
  playlistUrl: string;
  channelName: string;
}

const PlaylistPanel: React.FC<PlaylistPanelProps> = ({ title, thumbnailUrl, playlistUrl, channelName }) => {
  return (
    <div className="bg-white/30 dark:bg-gray-800/30 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col backdrop-blur-sm">
      <img
        src={thumbnailUrl}
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6 flex flex-col flex-grow">
        <h2 className="text-xl font-semibold mb-1 text-brand-primary text-left">{title}</h2>
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-3 text-left">{channelName}</div>
        <div className="mt-auto flex justify-center">
          <a
            href={playlistUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-brand-primary hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 text-sm shadow focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            View Playlist
          </a>
        </div>
      </div>
    </div>
  );
};

export default PlaylistPanel; 