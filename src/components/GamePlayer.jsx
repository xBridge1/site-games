import React, { useEffect, useRef, useState } from 'react';
import ReflexGame from '../games/ReflexGame';
import RufflePlayer from './RufflePlayer';

export default function GamePlayer({ game, onClose }) {
  const contentRef = useRef(null);
  const dragRef = useRef(null);
  const draggedRef = useRef(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
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
            <button className="game-action" onClick={toggleFullscreen} aria-label={isFullscreen ? 'Voltar ao modo janela' : 'Abrir em tela cheia'}>
              {isFullscreen ? 'Janela' : 'Tela cheia'}
            </button>
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
          {game.local ? (
            <ReflexGame />
          ) : game.kind === 'swf' ? (
            <RufflePlayer src={game.url} title={game.title} />
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
