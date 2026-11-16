(() => {
  const page = document.getElementById('arithmetic');
  const canvas = document.getElementById('pixelTrail');
  if (!page || !canvas || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  const cell = 13;
  const ripples = [];
  let width = 0;
  let height = 0;
  let frame = 0;
  let lastPoint = null;
  let lastSpawn = 0;

  function resize() {
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    width = page.clientWidth;
    height = page.offsetHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }
  new ResizeObserver(resize).observe(page);
  resize();

  const noise = (x, y, seed) => {
    const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;
    return n - Math.floor(n);
  };

  function draw(now) {
    ctx.clearRect(0, 0, width, height);
    for (let index = ripples.length - 1; index >= 0; index--) {
      const ripple = ripples[index];
      const progress = (now - ripple.born) / ripple.life;
      if (progress >= 1) { ripples.splice(index, 1); continue; }
      const radius = 8 + 112 * (1 - Math.pow(1 - progress, 2));
      const reach = radius + 12;
      const left = Math.max(0, Math.floor((ripple.x - reach) / cell));
      const right = Math.min(Math.ceil(width / cell), Math.ceil((ripple.x + reach) / cell));
      const top = Math.max(0, Math.floor((ripple.y - reach) / cell));
      const bottom = Math.min(Math.ceil(height / cell), Math.ceil((ripple.y + reach) / cell));
      for (let y = top; y <= bottom; y++) {
        for (let x = left; x <= right; x++) {
          const px = x * cell + cell / 2;
          const py = y * cell + cell / 2;
          const distance = Math.hypot(px - ripple.x, py - ripple.y);
          if (Math.abs(distance - radius) > 10) continue;
          const chance = noise(x, y, ripple.seed);
          if (chance < progress * .58) continue;
          const edge = 1 - Math.abs(distance - radius) / 10;
          const opacity = (1 - progress) * edge * (.4 + chance * .8);
          const size = 4 + Math.round(chance * 5);
          const drift = progress * (chance - .5) * 15;
          ctx.fillStyle = chance > .83
            ? `rgba(186,83,25,${opacity * .62})`
            : `rgba(246,146,53,${opacity})`;
          ctx.fillRect(Math.round(px - size / 2 + drift), Math.round(py - size / 2 - drift), size, size);
        }
      }
    }
    frame = ripples.length ? requestAnimationFrame(draw) : 0;
  }

  page.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    const rect = page.getBoundingClientRect();
    const point = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    const now = performance.now();
    const distance = lastPoint ? Math.hypot(point.x - lastPoint.x, point.y - lastPoint.y) : Infinity;
    if (distance < 17 && now - lastSpawn < 55) return;
    const steps = lastPoint && distance < 250 ? Math.min(5, Math.ceil(distance / 36)) : 1;
    for (let step = 1; step <= steps; step++) {
      const amount = step / steps;
      ripples.push({
        x: lastPoint ? lastPoint.x + (point.x - lastPoint.x) * amount : point.x,
        y: lastPoint ? lastPoint.y + (point.y - lastPoint.y) * amount : point.y,
        born: now,
        life: 1200 + Math.random() * 250,
        seed: Math.random() * 1000
      });
    }
    if (ripples.length > 18) ripples.splice(0, ripples.length - 18);
    lastPoint = point;
    lastSpawn = now;
    if (!frame) frame = requestAnimationFrame(draw);
  }, { passive: true });
  page.addEventListener('pointerleave', () => { lastPoint = null; });
})();
