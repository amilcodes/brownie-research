(() => {
  'use strict';
  document.querySelector('#current-year').textContent = String(new Date().getFullYear());

  const canvas = document.querySelector('#point-cloud');
  const context = canvas.getContext('2d');
  const toggle = document.querySelector('#motion-toggle');
  if (!context) { toggle.hidden = true; return; }
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduceMotion.matches;
  let visible = true;
  let width = 0, height = 0, frame = 0, time = .65, last = 0;
  let pointerX = 0, pointerY = 0, targetX = 0, targetY = 0;
  let seed = 48;
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const points = [];
  // A deterministic shell of points. This is a geometric study, not model data.
  for (let i = 0; i < 1700; i++) {
    const z = 1 - 2 * (i + .5) / 1700;
    const phi = Math.acos(z), theta = i * Math.PI * (3 - Math.sqrt(5));
    const band = 1 + .13 * Math.sin(theta * 3 + phi * 4);
    const radius = .87 * band + random() * .08;
    points.push([Math.cos(theta) * Math.sin(phi) * radius, Math.sin(theta) * Math.sin(phi) * radius, z * radius, random()]);
  }
  const vertices = [];
  for (let i = 0; i < 16; i++) vertices.push([i & 1 ? 1 : -1, i & 2 ? 1 : -1, i & 4 ? 1 : -1, i & 8 ? 1 : -1]);
  const edges = [];
  for (let i = 0; i < 16; i++) for (let j = i + 1; j < 16; j++) { const n = i ^ j; if ((n & (n - 1)) === 0) edges.push([i,j]); }
  function project(x, y, z, scale) {
    const a = time * .14 + pointerX * .2, b = -.22 + pointerY * .15;
    const xx = x * Math.cos(a) + z * Math.sin(a), zz = -x * Math.sin(a) + z * Math.cos(a);
    const yy = y * Math.cos(b) - zz * Math.sin(b), depth = y * Math.sin(b) + zz * Math.cos(b);
    const perspective = 3.8 / (3.8 + depth);
    return [width * .5 + xx * scale * perspective, height * .5 + yy * scale * perspective + 7, depth, perspective];
  }
  function draw() {
    context.clearRect(0, 0, width, height);
    const scale = Math.min(width * .355, height * .36);
    // Quiet coordinate grid, with no gradients or blur.
    context.fillStyle = 'rgba(197,161,125,.18)';
    for (let x = 20; x < width - 12; x += 23) for (let y = 54; y < height - 44; y += 23) context.fillRect(x, y, .8, .8);
    const projected = points.map(p => { const q = project(p[0], p[1], p[2], scale); q.push(p[3]); return q; }).sort((a,b) => b[2] - a[2]);
    for (const p of projected) {
      const opacity = .17 + (1.2 - p[2]) * .2;
      context.fillStyle = `rgba(197,161,125,${opacity})`;
      const r = (.6 + p[4] * .45) * p[3];
      context.fillRect(Math.round(p[0]), Math.round(p[1]), r * 1.6, r * 1.6);
    }
    const tesseract = vertices.map(p => {
      const angle = .18 + time * .09;
      const x = p[0] * Math.cos(angle) - p[3] * Math.sin(angle);
      const w = p[0] * Math.sin(angle) + p[3] * Math.cos(angle);
      const perspective = 1.7 / (3 - w * .45);
      return project(x * perspective, p[1] * perspective, p[2] * perspective, scale * .89);
    });
    context.strokeStyle = 'rgba(245,242,233,.32)'; context.lineWidth = .7;
    for (const [a,b] of edges) { context.beginPath(); context.moveTo(tesseract[a][0],tesseract[a][1]); context.lineTo(tesseract[b][0],tesseract[b][1]); context.stroke(); }
    context.fillStyle = '#d6b28e';
    for (const p of tesseract) context.fillRect(p[0] - 1.65, p[1] - 1.65, 3.3, 3.3);
  }
  function animate(stamp) {
    frame = 0;
    if (paused || !visible || document.hidden) return;
    if (last) time += Math.min((stamp - last) / 1000, .05);
    last = stamp;
    pointerX += (targetX - pointerX) * .04; pointerY += (targetY - pointerY) * .04;
    draw(); frame = requestAnimationFrame(animate);
  }
  function start() { if (!frame && !paused && visible && !document.hidden) { last = 0; frame = requestAnimationFrame(animate); } }
  function stop() { cancelAnimationFrame(frame); frame = 0; last = 0; }
  function syncToggle() {
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.setAttribute('aria-label', paused ? 'Play point cloud animation' : 'Pause point cloud animation');
    toggle.textContent = paused ? 'Play' : 'Pause';
  }
  toggle.addEventListener('click', () => { paused = !paused; syncToggle(); if (paused) stop(); else start(); });
  reduceMotion.addEventListener('change', event => { paused = event.matches; syncToggle(); if (paused) { stop(); draw(); } else start(); });
  canvas.addEventListener('pointermove', event => { const r = canvas.getBoundingClientRect(); targetX = (event.clientX - r.left) / r.width - .5; targetY = (event.clientY - r.top) / r.height - .5; });
  canvas.addEventListener('pointerleave', () => { targetX = targetY = 0; });
  new ResizeObserver(() => {
    const bounds = canvas.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = bounds.width; height = bounds.height;
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    context.setTransform(dpr,0,0,dpr,0,0); draw();
  }).observe(canvas);
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (visible) start(); else stop(); }).observe(canvas);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else start(); });
  syncToggle(); start();
})();
