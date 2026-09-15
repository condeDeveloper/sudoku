// Gera um puzzle com solução única e o número aproximado de pistas do nível
const Generator = {
  full() {
    const g = Array(81).fill(0);
    Solver.solve(g, true);
    return g;
  },

  // Remove células em ordem aleatória enquanto a solução continuar única
  puzzle(givensTarget) {
    const solution = this.full();
    const puzzle = solution.slice();
    const order = [...Array(81).keys()].sort(() => Math.random() - 0.5);
    let givens = 81;
    for (const i of order) {
      if (givens <= givensTarget) break;
      const backup = puzzle[i];
      puzzle[i] = 0;
      if (Solver.count(puzzle.slice(), 2) !== 1) puzzle[i] = backup;
      else givens--;
    }
    return { puzzle, solution, givens };
  },
};
