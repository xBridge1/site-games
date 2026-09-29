import React, { useEffect, useRef, useState } from 'react';
import ReflexGame from '../games/ReflexGame';
import RufflePlayer from './RufflePlayer';

export default function GamePlayer({ game, onClose }) {
  const contentRef = useRef(null);
  const dragRef = useRef(null);
  const draggedRef = useRef(false);
  const [bubblePosition, setBubblePosition] = useState({ left: 16, top: 16 });
  const isStandaloneGame = ['html', 'swf'].includes(game?.kind);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (!isStandaloneGame || !contentRef.current) return undefined;

    const element = contentRef.current;
    const enterFullscreen = async () => {
      try {
        if (!document.fullscreenElement && element.requestFullscreen) {
          await element.requestFullscreen();
        }
      } catch {
        // Alguns navegadores bloqueiam fullscreen automático; o CSS continua em 100vh.
      }
    };

    enterFullscreen();

    return () => {
      if (document.fullscreenElement === element && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, [isStandaloneGame]);

  if (!game) return null;

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
      const left = Math.min(
        Math.max(8, moveEvent.clientX - dragRef.current.offsetX),
        Math.max(8, window.innerWidth - size - 8)
      );
      const top = Math.min(
        Math.max(8, moveEvent.clientY - dragRef.current.offsetY),
        Math.max(8, window.innerHeight - size - 8)
      );

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
    <div className={'modal-overlay ' + (isStandaloneGame ? 'html-game-overlay' : '')} onClick={onClose}>
      <div
        ref={contentRef}
        className={'modal-content ' + (isStandaloneGame ? 'html-game-content' : '')}
        onClick={(e) => e.stopPropagation()}
      >
        {isStandaloneGame ? (
          <button
            className="modal-close html-game-bubble"
            style={{ left: `${bubblePosition.left}px`, top: `${bubblePosition.top}px` }}
            onPointerDown={handleBubblePointerDown}
            onClick={handleBubbleClick}
            aria-label="Voltar para a central"
            title="Arraste para mover · clique para voltar"
          >
            ←
          </button>
        ) : (
          <button className="modal-close" onClick={onClose} aria-label="Fechar jogo">×</button>
        )}

        <div className={'modal-body ' + (isStandaloneGame ? 'html-game-body' : '')}>
          {!isStandaloneGame && <h2 style={{ marginBottom: '15px' }}>{game.title}</h2>}
          {game.local ? (
            <ReflexGame />
          ) : game.kind === 'swf' ? (
            <RufflePlayer src={game.url} title={game.title} />
          ) : (
            <iframe
              src={game.url}
              title={game.title}
              className={isStandaloneGame ? 'html-game-frame' : undefined}
              style={isStandaloneGame ? undefined : { width: '100%', height: '500px', border: 'none', borderRadius: '8px' }}
              allow="autoplay; fullscreen; gamepad"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </div>
  );
}
