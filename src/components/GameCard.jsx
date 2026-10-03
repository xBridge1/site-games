import React from 'react';

export default function GameCard({ game, onToggleFav, isFav }) {
  const theme = game.id === 'doom'
    ? 'doom'
    : String(game.id).includes('last')
      ? 'survival'
      : game.category === 'Corrida' || game.category === 'Esporte'
        ? 'racing'
        : game.id === 'papas-pizzeria'
          ? 'pizza'
          : game.id === 'pac-man'
            ? 'arcade'
            : 'classic';
  const format = game.platform === 'dos'
    ? 'DOS'
    : game.platform === 'gba'
      ? 'GBA'
      : game.platform === 'gbc'
        ? 'GBC'
        : game.platform === 'webplayer'
          ? 'WEB PLAYER'
        : game.platform === 'lan'
          ? 'LAN'
    : game.kind === 'swf'
      ? 'FLASH'
      : 'WEB';

  return (
    <article className={'card theme-' + theme}>
      <div className="card-art">
        <a className="art-play" href={`/?jogo=${encodeURIComponent(game.id)}`} aria-label={'Jogar ' + game.title}>
          <span className="art-grid" aria-hidden="true" />
          <span className="art-word">{game.title}</span>
        </a>
        <span className="format-tag">{format}{game.ageRating === 18 ? ' · +18' : ''}</span>
        <button
          className={'fav-btn ' + (isFav ? 'active' : '')}
          onClick={() => onToggleFav(game.id)}
          aria-pressed={isFav}
          aria-label={(isFav ? 'Remover ' : 'Adicionar ') + game.title + (isFav ? ' dos favoritos' : ' aos favoritos')}
        >
          {isFav ? '♥' : '♡'}
        </button>
      </div>
      <div className="card-body">
        <span className="card-category">{game.category}</span>
        <h3>{game.title}</h3>
        <p>{game.description}</p>
        <a className="play-btn" href={`/?jogo=${encodeURIComponent(game.id)}`}>Jogar agora <span>↗</span></a>
      </div>
    </article>
  );
}
