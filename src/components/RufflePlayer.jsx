import React, { useEffect, useRef, useState } from 'react';

export default function RufflePlayer({ src, title }) {
  const containerRef = useRef(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let player;
    let cancelled = false;

    const loadGame = async () => {
      if (!window.RufflePlayer) {
        setStatus('unavailable');
        return;
      }

      const ruffle = window.RufflePlayer.newest();
      player = ruffle.createPlayer();
      player.style.width = '100%';
      player.style.height = '100%';
      player.style.display = 'block';
      containerRef.current?.appendChild(player);

      try {
        await player.ruffle().load(src);
        if (!cancelled) setStatus('ready');
      } catch {
        if (!cancelled) setStatus('error');
      }
    };

    loadGame();

    return () => {
      cancelled = true;
      player?.remove();
    };
  }, [src]);

  return (
    <div className="ruffle-game" ref={containerRef}>
      {status !== 'ready' && (
        <div className="ruffle-status">
          {status === 'loading' && 'Carregando jogo Flash…'}
          {status === 'unavailable' && 'Ruffle não foi carregado.'}
          {status === 'error' && 'Não foi possível carregar este jogo SWF.'}
        </div>
      )}
      <span className="sr-only">{title}</span>
    </div>
  );
}
