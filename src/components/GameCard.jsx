import React from 'react';

export default function GameCard({ game, onPlay, onToggleFav, isFav }) {
  const theme = game.id === 'doom' ? 'doom' : String(game.id).includes('last') ? 'survival' : game.category === 'Corrida' || game.category === 'Esporte' ? 'racing' : game.id === 'papas-pizzeria' ? 'pizza' : game.id === 'pac-man' ? 'arcade' : 'classic';
  const format = game.id === 'doom' ? 'DOS' : game.kind === 'swf' ? 'FLASH' : 'WEB';
  return (
    <article className={'card theme-' + theme}>
      <div className="card-art"><button className="art-play" onClick={() => onPlay(game)} aria-label={'Jogar ' + game.title}><span className="art-grid" aria-hidden="true" /><span className="art-word" aria-hidden="true">{game.id === 'doom' ? 'DOOM' : game.emoji || '✦'}</span><span className="art-caption" aria-hidden="true">{game.title}</span></button><span className="format-tag">{format}</span><button className={'fav-btn ' + (isFav ? 'active' : '')} onClick={() => onToggleFav(game.id)} aria-pressed={isFav} aria-label={(isFav ? 'Remover ' : 'Adicionar ') + game.title + (isFav ? ' dos favoritos' : ' aos favoritos')}>{isFav ? '♥' : '♡'}</button></div>
      <div className="card-body"><span className="card-category">{game.category}</span><h3>{game.title}</h3><p>{game.description}</p><button className="play-btn" onClick={() => onPlay(game)}>Jogar agora <span>↗</span></button></div>
    </article>
  );
}