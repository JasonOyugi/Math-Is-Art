(() => {
  const scene = document.getElementById('scene');
  const canvas = document.getElementById('backgroundCanvas');
  if (!scene || !canvas || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
  if (!ctx) return;

  const fromHex = hex => [0, 2, 4].map(i => parseInt(hex.slice(i + 1, i + 3), 16));
  const color = values => `rgb(${values.map(value => Math.round(value)).join(' ')})`;
  const blend = (a, b, amount) => a.map((value, i) => value * (1 - amount) + b[i] * amount);
  const field = fromHex('#efa4b8');
  const disc = fromHex('#f69235');
  let nextField = [...field];
  let nextDisc = [...disc];
  let width = 0;
  let height = 0;
  let cursor = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, force: 0, targetForce: 0 };
  let firstFrame = true;
  let lastFrame = 0;

  function resize() {
    const rect = scene.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    const ratio = Math.min(devicePixelRatio || 1, 1);
    canvas.width = Math.max(1, Math.round(width * ratio));
    canvas.height = Math.max(1, Math.round(height * ratio));
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }
  new ResizeObserver(resize).observe(scene);
  resize();

  scene.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    const rect = scene.getBoundingClientRect();
    cursor.targetX = event.clientX - rect.left;
    cursor.targetY = event.clientY - rect.top;
    cursor.targetForce = 1;
  }, { passive: true });
  scene.addEventListener('pointerleave', () => { cursor.targetForce = 0; });

  window.mathArtBackground = {
    setPalette(fieldHex, discHex) {
      nextField = fromHex(fieldHex);
      nextDisc = fromHex(discHex);
    }
  };

  function warpedCircle(cx, cy, baseRadius, time, wave, dentSize) {
    const cursorDistance = Math.hypot(cursor.x - cx, cursor.y - cy);
    const cursorAngle = Math.atan2(cursor.y - cy, cursor.x - cx);
    const proximity = Math.exp(-Math.pow((cursorDistance - baseRadius) / 220, 2));
    ctx.beginPath();
    for (let step = 0; step <= 160; step++) {
      const angle = step / 160 * Math.PI * 2;
      const difference = Math.atan2(Math.sin(angle - cursorAngle), Math.cos(angle - cursorAngle));
      const nearPointer = Math.exp(-Math.pow(difference * baseRadius / 140, 2));
      const current = Math.sin(angle * 5 + time * 0.5) * wave
        + Math.sin(angle * 11 - time * 0.36) * wave * 0.43;
      const radius = baseRadius + current + dentSize * nearPointer * proximity * cursor.force;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      if (step === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }

  function draw(time) {
    const cx = width * 0.5;
    const cy = height * 0.51;
    const outer = (width < 700
      ? Math.max(width * 0.92, height * 0.62)
      : Math.max(width * 0.53, height * 0.94)) + Math.sin(time * 0.23) * 17;
    const middle = outer * 0.79 + Math.sin(time * 0.30) * 15;
    const inner = outer * 0.52 + Math.sin(time * 0.42 - 0.8) * 23;

    const fieldGradient = ctx.createLinearGradient(0, 0, width, height);
    fieldGradient.addColorStop(0, color(blend(field, [255, 217, 187], 0.17)));
    fieldGradient.addColorStop(0.55, color(field));
    fieldGradient.addColorStop(1, color(blend(field, [112, 48, 121], 0.13)));
    ctx.fillStyle = fieldGradient;
    ctx.fillRect(0, 0, width, height);

    const outerGradient = ctx.createRadialGradient(cx - outer * 0.3, cy - outer * 0.4, outer * 0.05, cx, cy, outer);
    outerGradient.addColorStop(0, color(blend(disc, [255, 235, 171], 0.24)));
    outerGradient.addColorStop(0.7, color(disc));
    outerGradient.addColorStop(1, color(blend(disc, [204, 65, 109], 0.16)));
    warpedCircle(cx, cy, outer, time, 4.5, 0);
    ctx.fillStyle = outerGradient;
    ctx.fill();

    warpedCircle(cx, cy, middle, time, 6.5, 46);
    ctx.fillStyle = color(blend(field, [255, 240, 218], 0.045));
    ctx.fill();

    const innerGradient = ctx.createRadialGradient(cx - inner * 0.25, cy - inner * 0.3, 0, cx, cy, inner);
    innerGradient.addColorStop(0, color(blend(disc, [255, 240, 180], 0.27)));
    innerGradient.addColorStop(1, color(blend(disc, [243, 97, 88], 0.08)));
    warpedCircle(cx, cy, inner, time, 9, -93);
    ctx.fillStyle = innerGradient;
    ctx.fill();

    for (let i = 0; i < 2; i++) {
      const phase = (time * 0.10 + i * 0.5) % 1;
      const radius = inner + phase * (middle - inner);
      warpedCircle(cx, cy, radius, time, 5, -22);
      ctx.strokeStyle = `rgba(255, 242, 217, ${0.28 * (1 - phase)})`;
      ctx.lineWidth = 2 + 6 * (1 - phase);
      ctx.stroke();
    }

    if (cursor.force > 0.02) {
      const ripple = (time * 50) % 100;
      ctx.beginPath();
      ctx.arc(cursor.x, cursor.y, 18 + ripple, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 246, 232, ${cursor.force * 0.18 * (1 - ripple / 100)})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  function frame(now) {
    requestAnimationFrame(frame);
    if (document.hidden || now - lastFrame < 33) return;
    lastFrame = now;
    for (let i = 0; i < 3; i++) {
      field[i] += (nextField[i] - field[i]) * 0.065;
      disc[i] += (nextDisc[i] - disc[i]) * 0.065;
    }
    cursor.x += (cursor.targetX - cursor.x) * 0.17;
    cursor.y += (cursor.targetY - cursor.y) * 0.17;
    cursor.force += (cursor.targetForce - cursor.force) * 0.085;
    draw(now / 1000);
    if (firstFrame) {
      firstFrame = false;
      scene.classList.add('has-live-background');
    }
  }
  requestAnimationFrame(frame);
})();
