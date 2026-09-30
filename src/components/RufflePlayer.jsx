import React from 'react';

export default function RufflePlayer({ src, title }) {
  return (
    <iframe
      key={src}
      src={`/ruffle-player.html?src=${encodeURIComponent(src)}`}
      title={title}
      className="game-frame"
      allow="autoplay; fullscreen"
      allowFullScreen
    />
  );
}
