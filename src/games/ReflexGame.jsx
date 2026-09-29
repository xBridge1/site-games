import React, { useState, useEffect, useRef } from 'react';

export default function ReflexGame() {
  const [state, setState] = useState('waiting');
  const [startTime, setStartTime] = useState(0);
  const [reaction, setReaction] = useState(null);
  const [best, setBest] = useState(() => {
    const saved = localStorage.getItem('reflex-best');
    return saved ? Number(saved) : null;
  });
  const timeoutRef = useRef(null);

  const start = () => {
    setState('waiting');
    setReaction(null);
    const delay = Math.floor(Math.random() * 3000) + 1500;
    timeoutRef.current = setTimeout(() => {
      setState('ready');
      setStartTime(Date.now());
    }, delay);
  };

  const handleClick = () => {
    if (state === 'waiting') {
      clearTimeout(timeoutRef.current);
      setState('result');
      setReaction('Muito cedo!');
      return;
    }
    if (state === 'ready') {
      const time = Date.now() - startTime;
      setReaction(time);
      setState('result');
      if (best === null || time < best) {
        setBest(time);
        localStorage.setItem('reflex-best', time);
      }
    }
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <div className="reflex-game">
      <h3>Teste de Reflexo</h3>
      <p style={{ marginBottom: '20px', color: '#aaa' }}>
        Clique quando a caixa ficar verde!
      </p>
      <div
        className={'reflex-box reflex-' + state}
        onClick={handleClick}
      >
        {state === 'waiting' && 'Aguarde...'}
        {state === 'ready' && 'CLIQUE AGORA!'}
        {state === 'result' && (typeof reaction === 'number' ? reaction + 'ms' : reaction)}
      </div>
      {(state === 'result' || state === 'waiting') && (
        <div style={{ marginTop: '20px' }}>
          <button
            className="play-btn"
            style={{ width: 'auto', padding: '10px 30px' }}
            onClick={start}
          >
            {state === 'result' ? 'Jogar de novo' : 'Iniciar'}
          </button>
        </div>
      )}
      <div className="best-time">
        {best !== null ? 'Melhor tempo: ' + best + 'ms' : 'Nenhum recorde ainda'}
      </div>
    </div>
  );
}
