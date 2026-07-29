const particleCanvas = document.getElementById('particles');
const pctx = particleCanvas.getContext('2d');
let particles = [];
let gravityPoints = [];

function resizeCanvas(){
  particleCanvas.width = window.innerWidth;
  particleCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function makeParticles(){
  const count = Math.floor((window.innerWidth * window.innerHeight) / 12000);
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * particleCanvas.width,
    y: Math.random() * particleCanvas.height,
    r: Math.random() * 1.8 + 0.6,
    vx: (Math.random() - 0.5) * 0.15,
    vy: (Math.random() - 0.5) * 0.15,
    ix: 0,
    iy: 0,
    a: Math.random() * 0.5 + 0.3
  }));
}
makeParticles();
window.addEventListener('resize', makeParticles);

particleCanvas.addEventListener('mousedown', (e) => {
  const rect = particleCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if(e.button === 0){
    const radius = 220;
    particles.forEach(p => {
      const dx = p.x - x, dy = p.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
      if(dist < radius){
        const force = ((radius - dist) / radius) * 6;
        p.ix += (dx / dist) * force;
        p.iy += (dy / dist) * force;
      }
    });
  }else if(e.button === 2){
    gravityPoints.push({ x, y, createdAt: performance.now() });
  }
});

particleCanvas.addEventListener('contextmenu', (e) => e.preventDefault());

function tickParticles(){
  const now = performance.now();
  gravityPoints = gravityPoints.filter(g => now - g.createdAt < 5000);

  pctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

  gravityPoints.forEach(g => {
    const life = 1 - (now - g.createdAt) / 5000;
    pctx.beginPath();
    pctx.arc(g.x, g.y, 5 + (1 - life) * 14, 0, Math.PI * 2);
    pctx.fillStyle = `rgba(125,211,252,${life * 0.35})`;
    pctx.fill();
  });

  particles.forEach(p => {
    gravityPoints.forEach(g => {
      const dx = g.x - p.x, dy = g.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
      const pull = Math.min(0.35, 40 / (dist * dist) * 60);
      p.ix += (dx / dist) * pull;
      p.iy += (dy / dist) * pull;
    });

    p.ix *= 0.94;
    p.iy *= 0.94;

    p.x += p.vx + p.ix;
    p.y += p.vy + p.iy;

    if(p.x < 0) p.x = particleCanvas.width;
    if(p.x > particleCanvas.width) p.x = 0;
    if(p.y < 0) p.y = particleCanvas.height;
    if(p.y > particleCanvas.height) p.y = 0;

    pctx.beginPath();
    pctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    pctx.fillStyle = `rgba(125,211,252,${p.a})`;
    pctx.fill();
  });

  requestAnimationFrame(tickParticles);
}
tickParticles();
