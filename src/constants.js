const HOLE_COUNT = 9;
const GAME_DURATION = 30;
const SPEEDS = {
  easy:   { minUp: 1200, maxUp: 2200, minDown: 800,  maxDown: 1400 },
  normal: { minUp: 700,  maxUp: 1500, minDown: 500,  maxDown: 900  },
  hard:   { minUp: 400,  maxUp: 900,  minDown: 300,  maxDown: 600  }
};
const MOLE_EMOJIS = ['🐹','👹','👾','🔫'];
const POINTS = { '🐹': 10, '👹': 20, '👾': 30, '🔫': 5 };