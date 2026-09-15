// DOM
const Render = {
  init() {
    this.board = document.getElementById('board');
    this.timer = document.getElementById('timer');
    this.mistakes = document.getElementById('mistakes');
    this.best = document.getElementById('best');
    this.hintsLeft = document.getElementById('hints-left');
    this.numpad = document.getElementById('numpad');
    this.overlay = document.getElementById('overlay');
    this.cells = [];
    for (let i = 0; i < 81; i++) {
      const el = document.createElement('div');
      el.className = 'cell';
      el.dataset.i = i;
      if (i % 9 === 2 || i % 9 === 5) el.classList.add('br');
      if (Math.floor(i / 9) === 2 || Math.floor(i / 9) === 5) el.classList.add('bb');
      this.board.appendChild(el);
      this.cells.push(el);
    }
    for (let v = 1; v <= 9; v++) {
      const b = document.createElement('button');
      b.dataset.v = v;
      b.innerHTML = `${v}<small></small>`;
      this.numpad.appendChild(b);
    }
  },

  draw(board, selected) {
    const errors = new Set(board.errors());
    const selVal = selected >= 0 ? board.values[selected] : 0;
    const related = selected >= 0 ? new Set(Solver.peers[selected]) : new Set();
    board.values.forEach((v, i) => {
      const el = this.cells[i];
      el.className = 'cell' + (i % 9 === 2 || i % 9 === 5 ? ' br' : '') + (Math.floor(i / 9) === 2 || Math.floor(i / 9) === 5 ? ' bb' : '');
      if (board.isGiven(i)) el.classList.add('given');
      if (related.has(i)) el.classList.add('rel');
      if (selVal && v === selVal) el.classList.add('same');
      if (i === selected) el.classList.add('sel');
      if (errors.has(i)) el.classList.add('error');
      if (v) { el.textContent = v; }
      else if (board.notes[i].size) {
        el.innerHTML = '<div class="notes">' + [1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<span>${board.notes[i].has(n) ? n : ''}</span>`).join('') + '</div>';
      } else el.textContent = '';
    });
    // contador no teclado numérico
    this.numpad.querySelectorAll('button').forEach(b => {
      const v = Number(b.dataset.v), left = 9 - board.countOf(v);
      b.querySelector('small').textContent = left > 0 ? left : '';
      b.classList.toggle('done', left <= 0);
    });
  },

  pop(i) { const el = this.cells[i]; el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); },
  time(s) { this.timer.textContent = Timer.fmt(s); },
  mistakesText(n) { this.mistakes.textContent = `Erros: ${n}/${MAX_MISTAKES}`; },
  hints(n) { this.hintsLeft.textContent = n; document.getElementById('hint').disabled = n <= 0; },
  notesMode(on) { document.getElementById('notes').classList.toggle('on', on); },
  undoEnabled(on) { document.getElementById('undo').disabled = !on; },
  paused(on) { this.board.classList.toggle('paused', on); document.getElementById('pause').textContent = on ? '▶' : '⏸'; },
  bestText(level) {
    const b = Storage.best(level);
    this.best.textContent = b ? `Melhor tempo (${LEVELS[level].label}): ${Timer.fmt(b)}` : `Sem recorde em ${LEVELS[level].label} ainda`;
  },
  showOverlay(title, text, btn = 'Novo jogo') {
    document.getElementById('overlay-title').textContent = title;
    document.getElementById('overlay-text').textContent = text;
    document.getElementById('overlay-btn').textContent = btn;
    this.overlay.classList.remove('hidden');
  },
  hideOverlay() { this.overlay.classList.add('hidden'); },
};
