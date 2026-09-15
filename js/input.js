// Teclado, cliques e botões
function bindInput(game) {
  Render.board.addEventListener('click', e => {
    const el = e.target.closest('.cell');
    if (el) game.select(Number(el.dataset.i));
  });

  Render.numpad.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (b) game.enter(Number(b.dataset.v));
  });

  window.addEventListener('keydown', e => {
    if (e.ctrlKey && e.code === 'KeyZ') { e.preventDefault(); return game.undo(); }
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const n = Number(e.key);
    if (n >= 1 && n <= 9) return game.enter(n);
    switch (e.code) {
      case 'Backspace': case 'Delete': case 'Digit0': game.erase(); break;
      case 'ArrowUp': e.preventDefault(); game.moveSel(-9); break;
      case 'ArrowDown': e.preventDefault(); game.moveSel(9); break;
      case 'ArrowLeft': e.preventDefault(); game.moveSel(-1); break;
      case 'ArrowRight': e.preventDefault(); game.moveSel(1); break;
      case 'KeyN': game.toggleNotes(); break;
      case 'KeyH': game.hint(); break;
      case 'KeyP': case 'Space': e.preventDefault(); game.togglePause(); break;
    }
  });

  document.getElementById('undo').addEventListener('click', () => game.undo());
  document.getElementById('erase').addEventListener('click', () => game.erase());
  document.getElementById('notes').addEventListener('click', () => game.toggleNotes());
  document.getElementById('hint').addEventListener('click', () => game.hint());
  document.getElementById('pause').addEventListener('click', () => game.togglePause());
  document.getElementById('new').addEventListener('click', () => game.newGame());
  document.getElementById('overlay-btn').addEventListener('click', () => game.overlayAction());
  document.querySelectorAll('#levels button').forEach(b => b.addEventListener('click', () => game.setLevel(b.dataset.level)));
}
