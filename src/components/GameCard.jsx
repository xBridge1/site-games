import React from 'react';

export default function GameCard({ game, onPlay, onToggleFav, isFav }) {
  return (
    <div className="card" onClick={() => onPlay(game)}>
      <div className="card-img">{game.emoji || '🎮'}</div>
      <button
        className={'fav-btn ' + (isFav ? 'active' : '')}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFav(game.id);
        }}
      >
        {isFav ? '❤️' : '🤍'}
      </button>
      <div className="card-body">
        <div className="card-title">{game.title}</div>
        <div className="card-meta">
          <span>{game.category}</span>
          <span>⭐ {game.rating}</span>
        </div>
        <div className="card-desc">{game.description}</div>
        <div className="card-meta">
          <span>🎮 {game.plays} plays</span>
        </div>
        <button
          className="play-btn"
          onClick={(e) => {
            e.stopPropagation();
            onPlay(game);
          }}
        >
          Jogar
        </button>
      </div>
    </div>
  );
}