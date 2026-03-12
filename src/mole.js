class Mole {
  constructor(index, el) {
    this.index = index;
    this.el = el;
    this.moleEl = el.querySelector('.mole');
    this.up = false;
    this.whacked = false;
    this.timer = null;
    this.type = '🐹';
  }

  show(speed, onWhack) {
    this.whacked = false;
    this.type = this.randomType();
    this.moleEl.textContent = this.type;
    this.moleEl.classList.remove('whacked');
    this.moleEl.classList.add('up');
    this.up = true;

    this.el.onclick = () => {
      if (!this.up || this.whacked) return;
      this.whacked = true;
      this.moleEl.classList.add('whacked');
      clearTimeout(this.timer);
      setTimeout(() => {
        this.moleEl.classList.remove('up', 'whacked');
        this.up = false;
      }, 200);
      onWhack(this);
    };

    const duration = speed.minUp + Math.random() * (speed.maxUp - speed.minUp);
    this.timer = setTimeout(() => this.hide(), duration);
  }

  hide() {
    if (!this.up) return;
    this.moleEl.classList.remove('up');
    this.up = false;
    clearTimeout(this.timer);
  }

  randomType() {
    const r = Math.random();
    if (r < 0.05) return '🔫'; // bomb
    if (r < 0.15) return '👾'; // bonus
    if (r < 0.35) return '👹'; // fast
    return '🐹'; // normal
  }
}