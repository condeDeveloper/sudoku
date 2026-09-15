// Estado da partida: valores, anotações, erros e histórico
class Board {
  constructor(puzzle, solution) {
    this.puzzle = puzzle;          // pistas (0 = vazio)
    this.solution = solution;
    this.values = puzzle.slice();  // valores atuais
    this.notes = Array.from({ length: 81 }, () => new Set());
    this.history = [];
  }

  static from(saved) {
    const b = new Board(saved.puzzle, saved.solution);
    b.values = saved.values;
    b.notes = saved.notes.map(a => new Set(a));
    return b;
  }
  serialize() { return { puzzle: this.puzzle, solution: this.solution, values: this.values, notes: this.notes.map(s => [...s]) }; }

  isGiven(i) { return this.puzzle[i] !== 0; }

  snapshot() {
    this.history.push({ values: this.values.slice(), notes: this.notes.map(s => new Set(s)) });
    if (this.history.length > 50) this.history.shift();
  }
  undo() {
    const h = this.history.pop();
    if (!h) return false;
    this.values = h.values; this.notes = h.notes;
    return true;
  }

  // Coloca um valor. Retorna 'given' | 'same' | 'ok' | 'wrong'
  set(i, v) {
    if (this.isGiven(i)) return 'given';
    if (this.values[i] === v) return 'same';
    this.snapshot();
    this.values[i] = v;
    this.notes[i].clear();
    // remove anotações do mesmo número nas células relacionadas
    for (const j of Solver.peers[i]) this.notes[j].delete(v);
    return v === this.solution[i] ? 'ok' : 'wrong';
  }

  toggleNote(i, v) {
    if (this.isGiven(i) || this.values[i]) return;
    this.snapshot();
    this.notes[i].has(v) ? this.notes[i].delete(v) : this.notes[i].add(v);
  }

  erase(i) {
    if (this.isGiven(i)) return;
    if (!this.values[i] && !this.notes[i].size) return;
    this.snapshot();
    this.values[i] = 0; this.notes[i].clear();
  }

  // Erros atuais: valores diferentes da solução
  errors() { return this.values.map((v, i) => v && v !== this.solution[i] ? i : -1).filter(i => i >= 0); }
  complete() { return this.values.every((v, i) => v === this.solution[i]); }
  countOf(v) { return this.values.filter(x => x === v).length; }

  // Célula vazia (ou errada) aleatória para dica
  hintCell() {
    const c = this.values.map((v, i) => (v !== this.solution[i] ? i : -1)).filter(i => i >= 0);
    return c.length ? c[Math.floor(Math.random() * c.length)] : -1;
  }
}
