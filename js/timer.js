// Cronômetro com pausa
class Timer {
  constructor(onTick) { this.onTick = onTick; this.seconds = 0; this.id = null; }
  start() { if (this.id) return; this.id = setInterval(() => { this.seconds++; this.onTick(this.seconds); }, 1000); }
  stop() { if (this.id) { clearInterval(this.id); this.id = null; } }
  reset(seconds = 0) { this.stop(); this.seconds = seconds; this.onTick(this.seconds); }
  get running() { return !!this.id; }
  static fmt(s) { return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`; }
}
