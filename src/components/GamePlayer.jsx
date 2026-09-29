import React, { useEffect } from 'react';
import ReflexGame from '../games/ReflexGame';

export default function GamePlayer({ game, onClose }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!game) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-body">
          <h2 style={{ marginBottom: '15px' }}>{game.title}</h2>
          {game.local ? (
            <ReflexGame />
          ) : (
            <iframe
              src={game.url}
              title={game.title}
              style={{ width: '100%', height: '500px', border: 'none', borderRadius: '8px' }}
              allowFullScreen
            />
          )}
        </div>
      </div>
    </div>
  );
}
