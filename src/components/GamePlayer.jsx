import React, { useEffect, useRef, useState } from 'react';
import ReflexGame from '../games/ReflexGame';
import RufflePlayer from './RufflePlayer';

export default function GamePlayer({ game }) {
  const pageRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [adultConfirmed, setAdultConfirmed] = useState(false);
  const [fullscreenError, setFullscreenError] = useState('');

  useEffect(() => {
    const previousTitle = document.title;
    document.title = game.title + ' | Central da Sacanagem';
    const syncFullscreen = () => setIsFullscreen(document.fullscreenElement === pageRef.current);
    document.addEventListener('fullscreenchange', syncFullscreen);
    return () => {
      document.title = previousTitle;
      document.removeEventListener('fullscreenchange', syncFullscreen);
    };
  }, [game.title]);

  const toggleFullscreen = async () => {
    try {
      setFullscreenError('');
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (pageRef.current.requestFullscreen) await pageRef.current.requestFullscreen();
      else setFullscreenError('Tela cheia não está disponível neste navegador.');
    } catch {
      setFullscreenError('Não foi possível ativar a tela cheia.');
    }
  };

  return (
    <main className="game-page" ref={pageRef}>
      <header className="game-page-toolbar">
        <a className="game-action" href="/#catalogo">← Voltar ao catálogo</a>
        <h1>{game.title}</h1>
        {game.kind !== 'external' && <button className="game-action" onClick={toggleFullscreen}>{isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}</button>}
      </header>
      {fullscreenError && <p className="fullscreen-error" role="status">{fullscreenError}</p>}
      <div className="game-page-content">
        {game.ageRating === 18 && !adultConfirmed ? (
          <section className="age-gate" aria-labelledby="age-gate-title" aria-describedby="age-gate-description">
            <span className="age-gate-badge">+18</span>
            <h2 id="age-gate-title">Conteúdo para maiores de 18 anos</h2>
            <p id="age-gate-description">{game.title} contém conteúdo adulto. Confirme que você tem 18 anos ou mais para continuar.</p>
            <div className="age-gate-actions">
              <a className="game-action" href="/#catalogo" autoFocus>Voltar ao catálogo</a>
              <button className="play-btn" onClick={() => setAdultConfirmed(true)}>Tenho 18 anos ou mais — continuar</button>
            </div>
          </section>
        ) : game.local ? <ReflexGame />
          : game.kind === 'swf' ? <RufflePlayer src={game.url} title={game.title} />
          : game.kind === 'external' ? (
            <div className="external-game-warning">
              <span className="external-game-warning-label">JOGO HOSPEDADO EXTERNAMENTE</span>
              <h2>{game.title}</h2>
              <p>{game.warning || 'O jogo será aberto na página oficial em uma nova aba.'}</p>
              <a className="play-btn" href={game.url} target="_blank" rel="noreferrer noopener">Abrir {game.title} ↗</a>
            </div>
          ) : <iframe src={game.url} title={game.title} className="game-frame" allow="autoplay; fullscreen; gamepad" allowFullScreen />}
      </div>
    </main>
  );
}