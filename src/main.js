window.addEventListener('DOMContentLoaded', () => {
  const game = new WhackGame();

  // difficulty buttons
  document.querySelectorAll('[data-speed]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-speed]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      game.setDifficulty(btn.dataset.speed);
    });
  });

  document.getElementById('start-btn').addEventListener('click', () => game.start());
  document.getElementById('play-again').addEventListener('click', () => {
    document.getElementById('end-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
  });
});