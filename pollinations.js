// Pollinations AI Image Integration for Whack-a-Mole
const POLLINATIONS_TOKEN = 'sk_XAwK4NoIzJVceQNqn1SG22oDgJPkkMYA';
const POLLINATIONS_BASE = 'https://image.pollinations.ai/prompt/';

function getPollinationsUrl(prompt, width = 64, height = 64, seed = null) {
  const encoded = encodeURIComponent(prompt);
  let url = `${POLLINATIONS_BASE}${encoded}?width=${width}&height=${height}&nologo=true&token=${POLLINATIONS_TOKEN}`;
  if (seed !== null) url += `&seed=${seed}`;
  return url;
}

// Unique mole character art for each mole type
const moleArtPrompts = {
  normal: 'cute cartoon mole popping out of hole, chibi style, brown, small game sprite',
  golden: 'cute golden shiny mole, chibi cartoon sprite, sparkling, treasure mole, small icon',
  bomb:   'cartoon bomb mole, evil red eyes, small game sprite, angry expression, danger',
  boss:   'giant boss mole, cartoon villain, purple crown, menacing expression, game sprite'
};

const moleImages = {};

async function preloadMoleArt() {
  for (const [type, prompt] of Object.entries(moleArtPrompts)) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    await new Promise(resolve => {
      img.onload = resolve;
      img.onerror = resolve;
      img.src = getPollinationsUrl(prompt, 64, 64, type.length * 11);
    });
    moleImages[type] = img;
    console.log(`[Pollinations] Loaded mole art: ${type}`);
  }
  window.moleImages = moleImages;
}

// Load AI background for the game field
async function loadWhackBackground() {
  const prompt = 'cute cartoon garden background, green grass with mole holes, sunny sky, game background art';
  const img = new Image();
  img.crossOrigin = 'anonymous';
  await new Promise(resolve => {
    img.onload = resolve;
    img.onerror = resolve;
    img.src = getPollinationsUrl(prompt, 400, 500, 99);
  });
  if (img.complete && img.naturalWidth > 0) {
    document.body.style.backgroundImage = `url(${img.src})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
    console.log('[Pollinations] Loaded whack-a-mole background');
  }
}

preloadMoleArt();
loadWhackBackground();

window.moleImages = moleImages;
window.getPollinationsUrl = getPollinationsUrl;
