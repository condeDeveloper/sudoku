// Resolvedor por backtracking. Grade = array de 81 números (0 = vazio).
const Solver = {
  box(i) { const r = Math.floor(i / 9), c = i % 9; return Math.floor(r / 3) * 3 + Math.floor(c / 3); },

  // Índices relacionados (mesma linha, coluna ou bloco) de cada célula, pré-calculados
  peers: (() => {
    const out = [];
    for (let i = 0; i < 81; i++) {
      const r = Math.floor(i / 9), c = i % 9, b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
      const set = new Set();
      for (let j = 0; j < 81; j++) {
        if (j === i) continue;
        const rj = Math.floor(j / 9), cj = j % 9, bj = Math.floor(rj / 3) * 3 + Math.floor(cj / 3);
        if (rj === r || cj === c || bj === b) set.add(j);
      }
      out.push([...set]);
    }
    return out;
  })(),

  candidates(grid, i) {
    const used = new Set(this.peers[i].map(j => grid[j]));
    const out = [];
    for (let v = 1; v <= 9; v++) if (!used.has(v)) out.push(v);
    return out;
  },

  // Célula vazia com menos candidatos (heurística MRV)
  pick(grid) {
    let best = -1, bestC = null;
    for (let i = 0; i < 81; i++) {
      if (grid[i]) continue;
      const c = this.candidates(grid, i);
      if (c.length === 0) return { i, c };
      if (!bestC || c.length < bestC.length) { best = i; bestC = c; if (c.length === 1) break; }
    }
    return best < 0 ? null : { i: best, c: bestC };
  },

  // Resolve in place. Retorna true se conseguiu.
  solve(grid, shuffle = false) {
    const p = this.pick(grid);
    if (!p) return true;
    const cands = shuffle ? p.c.sort(() => Math.random() - 0.5) : p.c;
    for (const v of cands) {
      grid[p.i] = v;
      if (this.solve(grid, shuffle)) return true;
    }
    grid[p.i] = 0;
    return false;
  },

  // Conta soluções até o limite (2 basta para saber se é única)
  count(grid, limit = 2) {
    const p = this.pick(grid);
    if (!p) return 1;
    let n = 0;
    for (const v of p.c) {
      grid[p.i] = v;
      n += this.count(grid, limit - n);
      if (n >= limit) break;
    }
    grid[p.i] = 0;
    return n;
  },

  valid(grid, i, v) { return !this.peers[i].some(j => grid[j] === v); },
};
