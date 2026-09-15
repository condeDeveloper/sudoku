// Orquestração
class Game {
  constructor() {
    Render.init();
    this.timer = new Timer(s => Render.time(s));
    this.level = 'easy';
    this.notesMode = false;
    this.selected = -1;
    bindInput(this);
    const saved = Storage.load();
    if (saved && !saved.done) this.resume(saved); else this.newGame();
    document.addEventListener('visibilitychange', () => { if (document.hidden && this.state === 'playing') this.togglePause(); });
  }

  setLevel(level) {
    this.level = level;
    document.querySelectorAll('#levels button').forEach(b => b.classList.toggle('active', b.dataset.level === level));
    this.newGame();
  }

  newGame() {
    const { puzzle, solution } = Generator.puzzle(LEVELS[this.level].givens);
    this.board = new Board(puzzle, solution);
    this.mistakes = 0; this.hints = HINTS; this.selected = -1; this.state = 'playing';
    this.timer.reset(0); this.timer.start();
    Render.hideOverlay(); Render.paused(false);
    this.refresh();
    this.save();
  }

  resume(s) {
    this.level = s.level;
    document.querySelectorAll('#levels button').forEach(b => b.classList.toggle('active', b.dataset.level === s.level));
    this.board = Board.from(s.board);
    this.mistakes = s.mistakes; this.hints = s.hints; this.state = 'playing';
    this.timer.reset(s.seconds); this.timer.start();
    this.refresh();
  }

  save(done = false) {
    Storage.save({ level: this.level, board: this.board.serialize(), mistakes: this.mistakes, hints: this.hints, seconds: this.timer.seconds, done });
  }

  refresh() {
    Render.draw(this.board, this.selected);
    Render.mistakesText(this.mistakes);
    Render.hints(this.hints);
    Render.notesMode(this.notesMode);
    Render.undoEnabled(this.board.history.length > 0);
    Render.bestText(this.level);
  }

  select(i) { if (this.state !== 'playing') return; this.selected = i; this.refresh(); }
  moveSel(d) {
    if (this.selected < 0) return this.select(0);
    const n = this.selected + d;
    if (d === -1 && this.selected % 9 === 0) return;
    if (d === 1 && this.selected % 9 === 8) return;
    if (n >= 0 && n < 81) this.select(n);
  }

  enter(v) {
    if (this.state !== 'playing' || this.selected < 0) return;
    const i = this.selected;
    if (this.notesMode) { this.board.toggleNote(i, v); this.refresh(); this.save(); return; }
    const r = this.board.set(i, v);
    if (r === 'given' || r === 'same') return;
    Render.pop(i);
    if (r === 'wrong') {
      this.mistakes++;
      if (this.mistakes >= MAX_MISTAKES) { this.refresh(); return this.lose(); }
    }
    this.refresh();
    if (this.board.complete()) return this.win();
    this.save();
  }

  erase() { if (this.state !== 'playing' || this.selected < 0) return; this.board.erase(this.selected); this.refresh(); this.save(); }
  undo() { if (this.state !== 'playing') return; if (this.board.undo()) { this.refresh(); this.save(); } }
  toggleNotes() { this.notesMode = !this.notesMode; Render.notesMode(this.notesMode); }

  hint() {
    if (this.state !== 'playing' || this.hints <= 0) return;
    const i = this.board.hintCell();
    if (i < 0) return;
    this.hints--;
    this.board.snapshot();
    this.board.values[i] = this.board.solution[i];
    this.board.notes[i].clear();
    this.selected = i;
    Render.pop(i);
    this.refresh();
    if (this.board.complete()) return this.win();
    this.save();
  }

  togglePause() {
    if (this.state === 'playing') { this.state = 'paused'; this.timer.stop(); Render.paused(true); Render.showOverlay('Pausado', Timer.fmt(this.timer.seconds), 'Continuar'); }
    else if (this.state === 'paused') { this.state = 'playing'; this.timer.start(); Render.paused(false); Render.hideOverlay(); }
  }

  overlayAction() {
    if (this.state === 'paused') return this.togglePause();
    this.newGame();
  }

  win() {
    this.state = 'won'; this.timer.stop();
    const rec = Storage.record(this.level, this.timer.seconds);
    Storage.clear();
    Render.bestText(this.level);
    Render.showOverlay('Resolvido! 🎉', `${LEVELS[this.level].label} em ${Timer.fmt(this.timer.seconds)} com ${this.mistakes} erro(s).${rec ? ' Novo recorde!' : ''}`);
  }
  lose() {
    this.state = 'lost'; this.timer.stop();
    Storage.clear();
    Render.showOverlay('Três erros', 'A partida terminou. Tente de novo!');
  }
}

window.addEventListener('DOMContentLoaded', () => { window.game = new Game(); });
