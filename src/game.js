class WhackGame {
  constructor() {
    this.score = 0;
    this.best = parseInt(localStorage.getItem('whack-best') || '0');
    this.combo = 0;
    this.comboTimer = null;
    this.timeLeft = GAME_DURATION;
    this.speed = SPEEDS.normal;
    this.difficulty = 'normal';
    this.moles = [];
    this.running = false;
    this.countdownInterval = null;
    this.moleInterval = null;
    this.buildBoard();
    this.updateHUD();
    document.getElementById('best').textContent = this.best;
  }

  buildBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    for (let i = 0; i < HOLE_COUNT; i++) {
      const hole = document.createElement('div');
      hole.className = 'hole';
      hole.innerHTML = `<div class="mole">🐹</div>`;
      board.appendChild(hole);
      this.moles.push(new Mole(i, hole));
    }
  }

  setDifficulty(d) {
    this.difficulty = d;
    this.speed = SPEEDS[d];
  }

  start() {
    this.score = 0;
    this.combo = 0;
    this.timeLeft = GAME_DURATION;
    this.running = true;
    this.moles.forEach(m => m.hide());
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('end-screen').classList.add('hidden');
    this.updateHUD();
    this.startCountdown();
    this.startMoles();
  }

  startCountdown() {
    this.countdownInterval = setInterval(() => {
      this.timeLeft--;
      document.getElementById('timer').textContent = this.timeLeft;
      if (this.timeLeft <= 0) this.end();
    }, 1000);
  }

  startMoles() {
    const pop = () => {
      if (!this.running) return;
      const idle = this.moles.filter(m => !m.up);
      if (idle.length) {
        const m = idle[Math.floor(Math.random() * idle.length)];
        m.show(this.speed, (whacked) => this.onWhack(whacked));
      }
      const delay = this.speed.minDown + Math.random() * (this.speed.maxDown - this.speed.minDown);
      this.moleInterval = setTimeout(pop, delay);
    };
    pop();
  }

  onWhack(mole) {
    if (mole.type === '🔫') {
      // bomb - lose combo and points
      this.score = Math.max(0, this.score - 20);
      this.combo = 0;
      this.showPop(mole.el, '-20', '#e74c3c');
    } else {
      const base = POINTS[mole.type] || 10;
      this.combo++;
      clearTimeout(this.comboTimer);
      this.comboTimer = setTimeout(() => { this.combo = 0; this.updateHUD(); }, 2000);
      const earned = base * Math.max(1, this.combo);
      this.score += earned;
      this.showPop(mole.el, `+${earned}`, '#27ae60');
    }
    this.updateHUD();
  }

  showPop(el, text, color) {
    const pop = document.createElement('div');
    pop.className = 'score-pop';
    pop.textContent = text;
    pop.style.color = color;
    pop.style.left = '50%';
    pop.style.top = '10px';
    el.style.position = 'relative';
    el.appendChild(pop);
    setTimeout(() => pop.remove(), 800);
  }

  updateHUD() {
    document.getElementById('score').textContent = this.score;
    document.getElementById('timer').textContent = this.timeLeft;
    document.getElementById('combo').textContent = `x${Math.max(1, this.combo)}`;
  }

  end() {
    this.running = false;
    clearInterval(this.countdownInterval);
    clearTimeout(this.moleInterval);
    this.moles.forEach(m => m.hide());
    if (this.score > this.best) {
      this.best = this.score;
      localStorage.setItem('whack-best', this.best);
      document.getElementById('best').textContent = this.best;
    }
    document.getElementById('final-score').textContent =
      `Score: ${this.score} | Best: ${this.best}`;
    document.getElementById('end-screen').classList.remove('hidden');
  }
}