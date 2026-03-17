// Whack-a-Mole - Enhanced Phase 2
const HOLES = 9;
const MOLE_TYPES = {
  normal: { emoji:'🐹', points:10,  color:'#8B4513', chance:0.65 },
  golden: { emoji:'🥇', points:50,  color:'#ffd700', chance:0.15 },
  bomb:   { emoji:'💣', points:-30, color:'#ff4500', chance:0.12 },
  boss:   { emoji:'👿', points:100, color:'#9b59b6', chance:0.08 }
};

let holes, score, highScore, lives, timeLeft, combo, comboTimer;
let gameInterval, countdownInterval, moleTimers = [];
let isRunning = false;
let bossActive = false;
let bossHP = 3;

function initGame() {
  score = 0; lives = 3; timeLeft = 45; combo = 0; bossActive = false;
  highScore = parseInt(localStorage.getItem('wamHS')) || 0;
  holes = Array.from({length: HOLES}, (_, i) => ({ mole: null, el: document.querySelector(`.hole[data-i="${i}"]`) }));
  updateUI();
  moleTimers.forEach(clearTimeout);
  moleTimers = [];
}

function startGame() {
  initGame();
  isRunning = true;
  document.getElementById('startBtn').disabled = true;
  document.getElementById('game-over').classList.add('hidden');
  scheduleMoles();
  countdownInterval = setInterval(() => {
    timeLeft--;
    updateUI();
    if (timeLeft <= 0) endGame();
  }, 1000);
}

function getSpeed() {
  const elapsed = 45 - timeLeft;
  return Math.max(400, 1200 - elapsed * 15);
}

function pickMoleType() {
  const r = Math.random();
  let acc = 0;
  for (const [type, data] of Object.entries(MOLE_TYPES)) {
    acc += data.chance;
    if (r < acc) return type;
  }
  return 'normal';
}

function scheduleMoles() {
  if (!isRunning) return;
  const delay = getSpeed();
  const available = holes.map((h,i)=>i).filter(i=>!holes[i].mole);
  if (available.length > 0) {
    const holeIndex = available[Math.floor(Math.random() * available.length)];
    const type = pickMoleType();
    showMole(holeIndex, type, delay);
  }
  const nextSchedule = delay * 0.6 + Math.random() * delay * 0.4;
  moleTimers.push(setTimeout(scheduleMoles, nextSchedule));
}

function showMole(holeIndex, type, duration) {
  const h = holes[holeIndex];
  const data = MOLE_TYPES[type];
  h.mole = type;
  const el = h.el;
  el.querySelector('.mole-emoji').textContent = data.emoji;
  el.querySelector('.mole-emoji').style.filter = type === 'boss' ? 'drop-shadow(0 0 8px #9b59b6)' : type === 'golden' ? 'drop-shadow(0 0 6px #ffd700)' : 'none';
  el.classList.add('active', `mole-${type}`);
  const timer = setTimeout(() => {
    if (h.mole === type) {
      h.mole = null;
      el.classList.remove('active', `mole-${type}`);
      if (type === 'normal' || type === 'golden') {
        combo = 0;
        if (isRunning && type !== 'bomb') showMissEffect(holeIndex);
      }
    }
  }, duration * 1.2);
  moleTimers.push(timer);
}

function whack(holeIndex) {
  if (!isRunning) return;
  const h = holes[holeIndex];
  if (!h.mole) return;
  const type = h.mole;
  const data = MOLE_TYPES[type];
  h.mole = null;
  h.el.classList.remove('active', `mole-${type}`);
  h.el.classList.add('whacked');
  setTimeout(() => h.el.classList.remove('whacked'), 300);

  if (type === 'bomb') {
    lives = Math.max(0, lives - 1);
    showEffect(holeIndex, '💥 BOOM!', '#ff4500');
    if (lives <= 0) endGame();
  } else if (type === 'boss') {
    bossHP--;
    showEffect(holeIndex, `💫 Boss HP: ${bossHP}`, '#9b59b6');
    if (bossHP <= 0) { score += 300; bossActive = false; bossHP = 3; }
    else return; // boss not fully defeated
  } else {
    combo++;
    const multiplier = combo > 1 ? combo : 1;
    const pts = data.points * multiplier;
    score += pts;
    clearTimeout(comboTimer);
    comboTimer = setTimeout(() => { combo = 0; }, 1500);
    showEffect(holeIndex, `+${pts}${combo > 1 ? ' x'+combo : ''}`, type === 'golden' ? '#ffd700' : '#4ecca3');
  }
  if (score > highScore) { highScore = score; localStorage.setItem('wamHS', highScore); }
  updateUI();
}

function showEffect(holeIndex, text, color) {
  const h = holes[holeIndex];
  const rect = h.el.getBoundingClientRect();
  const el = document.createElement('div');
  el.textContent = text;
  el.style.cssText = `position:fixed;left:${rect.left + rect.width/2}px;top:${rect.top}px;transform:translate(-50%,-50%);color:${color};font-weight:bold;font-size:16px;pointer-events:none;animation:floatUp 0.9s ease-out forwards;z-index:999;`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 900);
}

function showMissEffect(holeIndex) {
  const h = holes[holeIndex];
  h.el.classList.add('miss');
  setTimeout(() => h.el.classList.remove('miss'), 400);
}

function updateUI() {
  document.getElementById('score').textContent = score;
  document.getElementById('high-score').textContent = highScore;
  document.getElementById('time').textContent = timeLeft;
  document.getElementById('lives').textContent = '❤️'.repeat(lives) + '🖤'.repeat(3 - lives);
  document.getElementById('combo').textContent = combo > 1 ? `🔥 Combo x${combo}` : '';
}

function endGame() {
  isRunning = false;
  clearInterval(countdownInterval);
  moleTimers.forEach(clearTimeout);
  holes.forEach((h, i) => { h.mole = null; h.el.classList.remove('active','mole-normal','mole-golden','mole-bomb','mole-boss'); });
  document.getElementById('final-score').textContent = score;
  document.getElementById('game-over').classList.remove('hidden');
  document.getElementById('startBtn').disabled = false;
}

document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('restartBtn').addEventListener('click', startGame);
