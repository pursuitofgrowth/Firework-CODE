const canvas = document.querySelector("#fireworkCanvas");
const ctx = canvas.getContext("2d");

// --- Configuration ---
const COLORS = ['#ff4081', '#40c4ff', '#ffeb3b', '#69f0a6', '#e040fb', '#ffffff'];
const GRAVITY = 0.05;
const FRICTION = 0.98;
const MAX_PARTICLES = 1000; // Total pool size for performance

// --- Global State ---
let activeParticles = [];
let particlePool = [];

// --- Setup ---
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Initialize the particle pool
function initializePool() {
    for (let i = 0; i < MAX_PARTICLES; i++) {
        particlePool.push({
            x: 0, y: 0,
            vx: 0, vy: 0,
            size: 0,
            color: '',
            alpha: 1,
            life: 0,
            isShell: false, // true for the main ascending particle
            isDead: true,
            t: null // GSAP timeline for lifetime/fading
        });
    }
}
initializePool();

// --- Particle Functions ---

function getNewParticle() {
    // Find the first dead particle in the pool and reactivate it
    for (let i = 0; i < particlePool.length; i++) {
        if (particlePool[i].isDead) {
            particlePool[i].isDead = false;
            return particlePool[i];
        }
    }
    // Fallback: If pool is full, return null (prevents lag from excessive creation)
    return null; 
}

function launchShell(startX, startY) {
    const p = getNewParticle();
    if (!p) return;

    // Reset and configure main shell particle
    p.x = startX;
    p.y = startY;
    p.vx = (Math.random() - 0.5) * 1.5; // Slight horizontal variance
    p.vy = -7 + -10 * Math.random(); // Strong upward velocity
    p.size = 2;
    p.color = 'rgba(255, 255, 255, 1)';
    p.alpha = 1;
    p.isShell = true;
    p.life = 100 + 50 * Math.random(); // Determines when it explodes

    // GSAP for fading the trail of the shell
    if (p.t) p.t.kill(); // Kill any existing timeline
    p.t = gsap.to(p, { duration: p.life / 100, alpha: 0.8, ease: "power1.out" });
}

function explode(p) {
    const explosionColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const numShrapnel = 50 + Math.floor(Math.random() * 50);

    for (let i = 0; i < numShrapnel; i++) {
        const s = getNewParticle();
        if (!s) continue;

        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 4;

        // Configure shrapnel particle
        s.x = p.x;
        s.y = p.y;
        s.vx = Math.cos(angle) * speed;
        s.vy = Math.sin(angle) * speed;
        s.size = 1 + Math.random() * 1.5;
        s.color = explosionColor;
        s.alpha = 1;
        s.isShell = false;
        
        // GSAP for fading the shrapnel over a short life
        const fadeDuration = 1.5 + Math.random() * 1;
        if (s.t) s.t.kill();
        s.t = gsap.to(s, { 
            duration: fadeDuration, 
            alpha: 0, 
            ease: "power1.out",
            onComplete: () => { s.isDead = true; } 
        });
    }
    // Kill the shell particle after explosion
    p.isDead = true;
    if (p.t) p.t.kill();
}

// --- Event Listener ---
canvas.addEventListener('click', (e) => {
    launchShell(e.clientX, e.clientY);
});

// --- Main Loop ---
gsap.ticker.add(render);

function updateParticles() {
    for (let i = 0; i < particlePool.length; i++) {
        const p = particlePool[i];

        if (p.isDead) continue;

        // Apply physics
        p.vy += GRAVITY;
        p.vx *= FRICTION;
        p.vy *= FRICTION;
        p.x += p.vx;
        p.y += p.vy;

        if (p.isShell) {
            // Shell explodes when its vertical velocity nears zero (apex)
            if (p.vy >= -1) { 
                explode(p);
            }
        }
    }
}

function drawParticles() {
    // 'lighter' composite operation makes colors blend and creates a glowing effect
    ctx.globalCompositeOperation = 'lighter';

    for (let i = 0; i < particlePool.length; i++) {
        const p = particlePool[i];

        if (p.isDead || p.alpha <= 0) continue;
        
        ctx.beginPath();
        // Use the particle's current alpha for opacity
        ctx.fillStyle = p.color.replace(/, 1\)/, `, ${p.alpha})`);
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function render() {
    // Fade the previous frame slightly to create trails
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // The low alpha creates the trail effect
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    updateParticles();
    drawParticles();
}