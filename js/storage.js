// Partida salva e melhores tempos por nível
const Storage = {
  save(state) { try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (_) {} },
  load() { try { return JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch (_) { return null; } },
  clear() { try { localStorage.removeItem(SAVE_KEY); } catch (_) {} },

  bests() { try { return JSON.parse(localStorage.getItem(BEST_KEY) || '{}'); } catch (_) { return {}; } },
  best(level) { return this.bests()[level] || null; },
  record(level, seconds) {
    const all = this.bests();
    if (all[level] && all[level] <= seconds) return false;
    all[level] = seconds;
    try { localStorage.setItem(BEST_KEY, JSON.stringify(all)); } catch (_) {}
    return true;
  },
};
