import React, { useEffect, useRef, useState } from 'react';
import ReflexGame from '../games/ReflexGame';
import RufflePlayer from './RufflePlayer';

export default function GamePlayer({ game, onClose }) {
  const contentRef = useRef(null);
  const dragRef = useRef(null);
  const draggedRef = useRef(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [adultConfirmed, setAdultConfirmed] = useState(false);
  const [bubblePosition, setBubblePosition] = useState({ left: 16, top: 16 });

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape' && !document.fullscreenElement) onClose();
    };
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === contentRef.current);
    };

    window.addEventListener('keydown', handleEsc);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (document.fullscreenElement === contentRef.current) document.exitFullscreen?.().catch(() => {});
    };
  }, [onClose]);

  if (!game) return null;

  const toggleFullscreen = async () => {
    const element = contentRef.current;
    if (!element) return;

    try {
      if (document.fullscreenElement === element) {
        await document.exitFullscreen();
      } else if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else {
        setIsFullscreen((value) => !value);
      }
    } catch {
      setIsFullscreen((value) => !value);
    }
  };

  const handleBubblePointerDown = (event) => {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    dragRef.current = {
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
    };
    draggedRef.current = false;

    const handlePointerMove = (moveEvent) => {
      if (!dragRef.current) return;
      const size = 48;
      const left = Math.min(Math.max(8, moveEvent.clientX - dragRef.current.offsetX), Math.max(8, window.innerWidth - size - 8));
      const top = Math.min(Math.max(8, moveEvent.clientY - dragRef.current.offsetY), Math.max(8, window.innerHeight - size - 8));
      draggedRef.current = true;
      setBubblePosition({ left, top });
    };

    const handlePointerUp = () => {
      dragRef.current = null;
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  };

  const handleBubbleClick = (event) => {
    if (draggedRef.current) {
      event.preventDefault();
      draggedRef.current = false;
      return;
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        ref={contentRef}
        className={'modal-content game-window ' + (isFullscreen ? 'game-fullscreen' : '')}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="game-toolbar">
          <h2>{game.title}</h2>
          <div className="game-toolbar-actions">
            {game.kind !== 'external' && (
              <button className="game-action" onClick={toggleFullscreen} aria-label={isFullscreen ? 'Voltar ao modo janela' : 'Abrir em tela cheia'}>
                {isFullscreen ? 'Janela' : 'Tela cheia'}
              </button>
            )}
            {!isFullscreen && <button className="modal-close" onClick={onClose} aria-label="Fechar jogo">×</button>}
          </div>
        </div>

        {isFullscreen && (
          <button
            className="modal-close game-bubble"
            style={{ left: `${bubblePosition.left}px`, top: `${bubblePosition.top}px` }}
            onPointerDown={handleBubblePointerDown}
            onClick={handleBubbleClick}
            aria-label="Voltar para a central"
            title="Arraste para mover · clique para voltar"
          >
            ←
          </button>
        )}

        <div className="game-content-body">
          {game.ageRating === 18 && !adultConfirmed ? (
            <section className="age-gate" role="dialog" aria-modal="true" aria-labelledby="age-gate-title" aria-describedby="age-gate-description">
              <span className="age-gate-badge">+18</span>
              <h3 id="age-gate-title">Conteúdo para maiores de 18 anos</h3>
              <p id="age-gate-description">{game.title} contém conteúdo adulto. Confirme que você tem 18 anos ou mais para continuar.</p>
              <div className="age-gate-actions">
                <button className="game-action" onClick={onClose} autoFocus>Voltar ao catálogo</button>
                <button className="play-btn" onClick={() => setAdultConfirmed(true)}>Tenho 18 anos ou mais — continuar</button>
              </div>
            </section>
          ) : game.local ? (
            <ReflexGame />
          ) : game.kind === 'swf' ? (
            <RufflePlayer src={game.url} title={game.title} />
          ) : game.kind === 'external' ? (
            <div className="external-game-warning">
              <span className="external-game-warning-label">JOGO HOSPEDADO EXTERNAMENTE</span>
              <h3>{game.platform === 'webplayer' ? 'Este jogo exige Unity Web Player' : 'Minecraft Classic oficial'}</h3>
              <p>{game.warning || 'O jogo será aberto na página oficial em uma nova aba.'}</p>
              <a className="play-btn" href={game.url} target="_blank" rel="noreferrer noopener">Abrir {game.title} <span>↗</span></a>
            </div>
          ) : (
            <iframe
              src={game.url}
              title={game.title}
              className="game-frame"
              allow="autoplay; fullscreen; gamepad"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </div>
  );
}
