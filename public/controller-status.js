(() => {
  const panel = document.getElementById('controller-panel');
  const status = document.getElementById('controller-status');
  const list = document.getElementById('controller-list');
  const test = document.getElementById('controller-test');
  let deviceSignature = '';

  function update() {
    if (!window.isSecureContext || typeof navigator.getGamepads !== 'function') {
      status.textContent = 'Detecção indisponível';
      test.textContent = 'Use HTTPS (ou localhost) e um navegador com suporte a controles. O teclado continua disponível.';
      return;
    }
    let pads;
    try {
      pads = Array.from(navigator.getGamepads()).filter(pad => pad?.connected);
    } catch {
      status.textContent = 'Acesso ao controle bloqueado';
      list.replaceChildren();
      test.textContent = 'O navegador bloqueou a leitura dos controles. Verifique as permissões do site.';
      return;
    }
    const signature = JSON.stringify(pads.map(pad => [pad.index, pad.id, pad.mapping]));
    if (signature !== deviceSignature) {
      deviceSignature = signature;
      status.textContent = pads.length ? `${pads.length} controle(s) detectado(s)` : 'Nenhum controle detectado';
      list.replaceChildren(...pads.map(pad => {
        const item = document.createElement('li');
        item.textContent = `${pad.id} — ${pad.mapping === 'standard' ? 'mapeamento padrão' : 'mapeamento personalizado; confira os botões no emulador'}`;
        return item;
      }));
    }
    if (!panel.open) return;
    const inputs = pads.map(pad => {
      const buttons = pad.buttons.flatMap((button, index) => button.pressed ? [index + 1] : []);
      const axes = pad.axes.map((value, index) => Math.abs(value) > 0.15 ? `${index + 1}: ${value.toFixed(2)}` : '').filter(Boolean);
      return `${pad.id}: botões ${buttons.join(', ') || 'nenhum'}; eixos ${axes.join(', ') || 'em repouso'}`;
    });
    const text = inputs.join(' | ') || 'Pressione um botão do controle conectado para permitir a detecção.';
    if (test.textContent !== text) test.textContent = text;
  }

  update();
  window.addEventListener('gamepadconnected', update);
  window.addEventListener('gamepaddisconnected', update);
  panel.addEventListener('toggle', update);
  let timer;
  const start = () => {
    clearInterval(timer);
    update();
    timer = setInterval(() => { if (!document.hidden) update(); }, 150);
  };
  start();
  window.addEventListener('pageshow', start);
  window.addEventListener('pagehide', () => clearInterval(timer));
})();
