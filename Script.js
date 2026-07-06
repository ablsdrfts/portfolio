// =============================================
// MOBILE NAV TOGGLE
// =============================================
const toggle = document.querySelector('.nav__toggle');
const navLinks = document.querySelector('.nav__links');
if (toggle) {
  toggle.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '70px';
    navLinks.style.right = '24px';
    navLinks.style.background = 'rgba(10,15,30,0.95)';
    navLinks.style.border = '1px solid rgba(255,255,255,0.15)';
    navLinks.style.borderRadius = '12px';
    navLinks.style.padding = '1rem 1.4rem';
    navLinks.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
    navLinks.style.gap = '1rem';
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => { navLinks.style.display = 'none'; });
  });
}

// =============================================
// NAV SCROLL + ACTIVE HIGHLIGHT
// =============================================
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav__links a');
window.addEventListener('scroll', () => {
  document.querySelector('.nav').style.boxShadow = window.scrollY > 10 ? '0 4px 20px rgba(0,0,0,0.3)' : 'none';
  let current = '';
  sections.forEach(sec => { if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id'); });
  navAnchors.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? '#ffffff' : 'rgba(255,255,255,0.70)';
    a.style.fontWeight = a.getAttribute('href') === `#${current}` ? '700' : '400';
  });
});

// =============================================
// TYPING EFFECT — Hero name
// =============================================
const nameEl = document.querySelector('.hero__name');
if (nameEl) {
  const fullText = nameEl.textContent.trim();
  nameEl.textContent = '';
  nameEl.style.borderRight = '3px solid rgba(255,255,255,0.8)';
  nameEl.style.display = 'inline-block';
  nameEl.style.whiteSpace = 'nowrap';
  nameEl.style.overflow = 'hidden';
  let i = 0;
  const type = () => {
    if (i < fullText.length) { nameEl.textContent += fullText[i++]; setTimeout(type, 80); }
    else {
      let blinks = 0;
      const blink = setInterval(() => {
        nameEl.style.borderRight = blinks % 2 === 0 ? '3px solid transparent' : '3px solid rgba(255,255,255,0.8)';
        if (++blinks > 6) { clearInterval(blink); nameEl.style.borderRight = 'none'; }
      }, 400);
    }
  };
  setTimeout(type, 600);
}

// =============================================
// HERO PARTICLE ANIMATION — floating orbs + lines
// =============================================
(function heroParticles() {
  const canvas = document.getElementById('heroParticles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const count = 60;
  const particles = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    r: 1.5 + Math.random() * 2.5,
    alpha: 0.3 + Math.random() * 0.5,
    pulse: Math.random() * Math.PI * 2
  }));

  let mouseX = canvas.width / 2, mouseY = canvas.height / 2;
  canvas.parentElement.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      // Drift
      p.x += p.vx; p.y += p.vy;
      p.pulse += 0.02;
      if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      // Subtle mouse attraction
      const dx = mouseX - p.x, dy = mouseY - p.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 180) {
        p.x += dx * 0.0008;
        p.y += dy * 0.0008;
      }

      // Pulsing glow
      const size = p.r + Math.sin(p.pulse) * 0.8;
      const alpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));

      // Outer glow
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 3);
      g.addColorStop(0, `rgba(120,180,255,${alpha * 0.6})`);
      g.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(p.x, p.y, size * 3, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(160,210,255,${alpha})`;
      ctx.fill();
    });

    // Connection lines
    particles.forEach((a, i) => {
      particles.slice(i + 1).forEach(b => {
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 130) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(120,180,255,${0.18 * (1 - d / 130)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      });
    });

    requestAnimationFrame(draw);
  }
  draw();
})();
// =============================================
// SHOOTING STARS — Hero fullscreen
// =============================================
(function shootingStars() {
  const canvas = document.getElementById('heroParticles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function createStar() {
    const angle = (Math.random() * 30 + 10) * Math.PI / 180;
    const startX = Math.random() * canvas.width * 1.2 - canvas.width * 0.1;
    const startY = Math.random() * canvas.height * 0.5;
    const speed = 18 + Math.random() * 22;
    const length = 180 + Math.random() * 220;
    const width = 1.5 + Math.random() * 2;
    const hue = Math.random() < 0.6 ? '200,230,255' : '255,220,160';

    return {
      x: startX, y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      length, width,
      alpha: 0, hue,
      life: 0,
      maxLife: 55 + Math.random() * 30,
      trail: []
    };
  }

  let stars = [];
  let frameCount = 0;

  function drawStars() {
    frameCount++;

    // Spawn new star randomly
    if (frameCount % 90 === 0 && stars.length < 4) {
      stars.push(createStar());
    }

    stars = stars.filter(s => s.life < s.maxLife);

    stars.forEach(s => {
      s.life++;
      s.x += s.vx;
      s.y += s.vy;

      // Fade in then out
      if (s.life < 10) s.alpha = s.life / 10;
      else if (s.life > s.maxLife - 15) s.alpha = (s.maxLife - s.life) / 15;
      else s.alpha = 1;

      s.trail.push({ x: s.x, y: s.y });
      if (s.trail.length > 28) s.trail.shift();

      if (s.trail.length < 2) return;

      // Main streak
      const grad = ctx.createLinearGradient(
        s.trail[0].x, s.trail[0].y,
        s.x, s.y
      );
      grad.addColorStop(0, `rgba(${s.hue},0)`);
      grad.addColorStop(0.4, `rgba(${s.hue},${s.alpha * 0.3})`);
      grad.addColorStop(1, `rgba(255,255,255,${s.alpha})`);

      ctx.beginPath();
      ctx.moveTo(s.trail[0].x, s.trail[0].y);
      s.trail.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.strokeStyle = grad;
      ctx.lineWidth = s.width;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Bright head glow
      const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 14);
      glow.addColorStop(0, `rgba(255,255,255,${s.alpha * 0.9})`);
      glow.addColorStop(0.3, `rgba(${s.hue},${s.alpha * 0.5})`);
      glow.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(s.x, s.y, 14, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      // Sparkle burst at head
      for (let i = 0; i < 4; i++) {
        const sparkAngle = Math.random() * Math.PI * 2;
        const sparkDist = Math.random() * 8;
        ctx.beginPath();
        ctx.arc(
          s.x + Math.cos(sparkAngle) * sparkDist,
          s.y + Math.sin(sparkAngle) * sparkDist,
          0.8 + Math.random() * 1.2, 0, Math.PI * 2
        );
        ctx.fillStyle = `rgba(255,255,255,${s.alpha * 0.6 * Math.random()})`;
        ctx.fill();
      }

      // Side flare wings
      const perpX = -Math.sin(Math.atan2(s.vy, s.vx));
      const perpY = Math.cos(Math.atan2(s.vy, s.vx));
      [-1, 1].forEach(dir => {
        const flareGrad = ctx.createLinearGradient(
          s.x, s.y,
          s.x + perpX * dir * 20,
          s.y + perpY * dir * 20
        );
        flareGrad.addColorStop(0, `rgba(${s.hue},${s.alpha * 0.4})`);
        flareGrad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(
          s.x + perpX * dir * 20,
          s.y + perpY * dir * 20
        );
        ctx.strokeStyle = flareGrad;
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    });

    requestAnimationFrame(drawStars);
  }

  // Start after a short delay so page loads first
  setTimeout(drawStars, 1500);
})();
// =============================================
// ORBITAL NODES — cycle highlight
// =============================================
(function orbitCycle() {
  const nodes = document.querySelectorAll('.orbit-node');
  if (!nodes.length) return;
  let current = 0;

  function activate(idx) {
    nodes.forEach((n, i) => n.classList.toggle('active', i === idx));
    current = idx;
  }

  activate(0);
  setInterval(() => activate((current + 1) % nodes.length), 2200);

  // Click to highlight
  nodes.forEach((n, i) => n.addEventListener('click', () => activate(i)));
})();

// =============================================
// SCROLL REVEAL
// =============================================
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.skill-group, .contact-link').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = `opacity 0.6s ease ${i * 0.07}s, transform 0.6s ease ${i * 0.07}s`;
  revealObserver.observe(el);
});

// =============================================
// SKILL PILLS — staggered pop-in
// =============================================
const pillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.skill-pills span').forEach((pill, i) => {
      setTimeout(() => { pill.style.opacity = '1'; pill.style.transform = 'scale(1)'; }, i * 80);
    });
    pillObserver.unobserve(entry.target);
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-group').forEach(group => {
  group.querySelectorAll('.skill-pills span').forEach(pill => {
    pill.style.opacity = '0'; pill.style.transform = 'scale(0.7)';
    pill.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
  });
  pillObserver.observe(group);
});

// =============================================
// SECTION TITLE REVEAL
// =============================================
const titleObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.style.opacity = '1'; entry.target.style.transform = 'translateY(0)'; titleObserver.unobserve(entry.target); }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.section__title, .section__label').forEach(el => {
  el.style.opacity = '0'; el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  titleObserver.observe(el);
});

// =============================================
// STAT COUNTERS
// =============================================
document.querySelectorAll('.fact__num').forEach(el => {
  const val = parseInt(el.textContent);
  if (!isNaN(val)) { el.setAttribute('data-target', val); el.textContent = '0'; }
});
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.getAttribute('data-target'));
    if (isNaN(target)) return;
    let current = 0;
    const step = Math.ceil(target / 40);
    const tick = setInterval(() => { current = Math.min(current + step, target); el.textContent = current; if (current >= target) clearInterval(tick); }, 40);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.fact__num[data-target]').forEach(el => counterObserver.observe(el));

// =============================================
// LOGISTICS STATUS TRACKER
// =============================================
const heroContent = document.querySelector('.hero__content');
if (heroContent) {
  const tracker = document.createElement('div');
  tracker.style.cssText = `margin-top:1.5rem;display:inline-flex;align-items:center;gap:10px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.18);border-radius:100px;padding:8px 18px;font-size:0.82rem;font-weight:600;color:#ffffff;backdrop-filter:blur(8px);opacity:0;animation:fadeUp 1s 1.2s ease forwards;`;
  const statuses = ['📦 Skills: Loaded','🚚 Projects: In Transit','✅ Experiences: Delivered','📍 Location: Addis Ababa','🔗 Status: Available'];
  let idx = 0;
  tracker.textContent = statuses[0];
  setInterval(() => {
    tracker.style.opacity = '0'; tracker.style.transition = 'opacity 0.3s ease';
    setTimeout(() => { idx = (idx + 1) % statuses.length; tracker.textContent = statuses[idx]; tracker.style.opacity = '1'; }, 300);
  }, 2500);
  heroContent.appendChild(tracker);
}

// =============================================
// CURSOR GLOW
// =============================================
const cursor = document.createElement('div');
cursor.style.cssText = `position:fixed;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(176,125,86,0.08) 0%,transparent 70%);pointer-events:none;z-index:0;transform:translate(-50%,-50%);transition:left 0.15s ease,top 0.15s ease;`;
document.body.appendChild(cursor);
document.addEventListener('mousemove', e => { cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'; });

// =============================================
// PROJECT CARD CANVAS ANIMATIONS
// =============================================
function createCardCanvas(card, type) {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = `position:absolute;inset:0;width:100%;height:100%;border-radius:inherit;pointer-events:none;z-index:0;`;
  canvas.width = card.offsetWidth || 300;
  canvas.height = card.offsetHeight || 220;
  card.style.position = 'relative';
  card.style.overflow = 'hidden';
  card.insertBefore(canvas, card.firstChild);
  const ctx = canvas.getContext('2d');
  if (type === 'warehouse') drawWarehouse(ctx, canvas);
  if (type === 'data')      drawData(ctx, canvas);
  if (type === 'it')        drawNetwork(ctx, canvas);
  if (type === 'saas')      drawSaaS(ctx, canvas);
}

function drawWarehouse(ctx, canvas) {
  const boxes = Array.from({length:6}, (_, i) => ({
    x: i * 80 - 60, y: canvas.height * 0.55, w: 38, h: 32, speed: 0.7 + Math.random() * 0.4
  }));
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(255,180,80,0.6)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(0, canvas.height * 0.65); ctx.lineTo(canvas.width, canvas.height * 0.65); ctx.stroke();
    for (let i = 0; i < 12; i++) {
      ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(i*35, canvas.height*0.65); ctx.lineTo(i*35+18, canvas.height*0.65); ctx.stroke();
    }
    boxes.forEach(b => {
      b.x += b.speed; if (b.x > canvas.width + 50) b.x = -55;
      const g = ctx.createLinearGradient(b.x, b.y, b.x+b.w, b.y+b.h);
      g.addColorStop(0,'rgba(255,160,60,0.65)'); g.addColorStop(1,'rgba(180,100,30,0.45)');
      ctx.fillStyle = g; ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.strokeStyle = 'rgba(255,220,120,0.7)'; ctx.lineWidth = 1.2; ctx.strokeRect(b.x, b.y, b.w, b.h);
      ctx.beginPath();
      ctx.moveTo(b.x+6,b.y+6); ctx.lineTo(b.x+b.w-6,b.y+b.h-6);
      ctx.moveTo(b.x+b.w-6,b.y+6); ctx.lineTo(b.x+6,b.y+b.h-6);
      ctx.strokeStyle='rgba(255,255,255,0.4)'; ctx.stroke();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

function drawData(ctx, canvas) {
  const bars = [0.3,0.65,0.45,0.85,0.55,0.95,0.70,0.80].map((h,i) => ({
    target:h, current:0, x:14+i*34, w:22
  }));
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const baseY = canvas.height * 0.78;
    bars.forEach(b => {
      b.current = Math.min(b.current + 0.012, b.target);
      const h = b.current * canvas.height * 0.65;
      const g = ctx.createLinearGradient(0, baseY-h, 0, baseY);
      g.addColorStop(0,'rgba(80,200,255,0.85)'); g.addColorStop(1,'rgba(20,80,200,0.25)');
      ctx.fillStyle=g; ctx.fillRect(b.x, baseY-h, b.w, h);
      ctx.strokeStyle='rgba(120,220,255,0.5)'; ctx.lineWidth=1; ctx.strokeRect(b.x,baseY-h,b.w,h);
    });
    ctx.beginPath(); ctx.strokeStyle='rgba(100,230,255,0.9)'; ctx.lineWidth=2.5;
    bars.forEach((b,i) => {
      const x=b.x+b.w/2, y=baseY-b.current*canvas.height*0.65;
      i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
    });
    ctx.stroke();
    bars.forEach(b => {
      const h=b.current*canvas.height*0.65;
      ctx.beginPath(); ctx.arc(b.x+b.w/2, baseY-h, 4, 0, Math.PI*2);
      ctx.fillStyle='rgba(180,240,255,1)'; ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

function drawNetwork(ctx, canvas) {
  const nodes = Array.from({length:10}, () => ({
    x:Math.random()*canvas.width, y:Math.random()*canvas.height,
    vx:(Math.random()-0.5)*0.5, vy:(Math.random()-0.5)*0.5, r:3+Math.random()*3
  }));
  function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    nodes.forEach(n => {
      n.x+=n.vx; n.y+=n.vy;
      if(n.x<0||n.x>canvas.width) n.vx*=-1;
      if(n.y<0||n.y>canvas.height) n.vy*=-1;
    });
    nodes.forEach((a,i) => {
      nodes.slice(i+1).forEach(b => {
        const d=Math.hypot(a.x-b.x,a.y-b.y);
        if(d<130) {
          const g=ctx.createLinearGradient(a.x,a.y,b.x,b.y);
          g.addColorStop(0,`rgba(120,200,255,${0.6*(1-d/130)})`);
          g.addColorStop(1,`rgba(80,140,255,${0.3*(1-d/130)})`);
          ctx.beginPath(); ctx.strokeStyle=g; ctx.lineWidth=1.2;
          ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      });
      const pulse = 0.5+0.5*Math.sin(Date.now()*0.003+i);
      ctx.beginPath(); ctx.arc(a.x,a.y,a.r*1.8,0,Math.PI*2);
      ctx.fillStyle=`rgba(100,180,255,${0.15*pulse})`; ctx.fill();
      ctx.beginPath(); ctx.arc(a.x,a.y,a.r,0,Math.PI*2);
      ctx.fillStyle='rgba(160,220,255,0.95)'; ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

function drawSaaS(ctx, canvas) {
  const lines = Array.from({length:9}, (_,i) => ({
    y:18+i*22, w:30+Math.random()*150, alpha:0.25+Math.random()*0.5, speed:0.3+Math.random()*0.4
  }));
  const particles = Array.from({length:25}, () => ({
    x:Math.random()*canvas.width, y:Math.random()*canvas.height,
    r:1+Math.random()*2, vy:-0.35-Math.random()*0.4, alpha:Math.random()
  }));
  function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    lines.forEach(l => {
      l.w+=l.speed; if(l.w>canvas.width-10) l.w=20;
      const g=ctx.createLinearGradient(10,0,10+l.w,0);
      g.addColorStop(0,'rgba(120,255,160,0.8)'); g.addColorStop(1,'rgba(80,200,120,0.2)');
      ctx.fillStyle=g; ctx.fillRect(10, l.y, l.w, 3.5);
      ctx.fillStyle=`rgba(200,255,220,${l.alpha})`; ctx.fillRect(10,l.y,10,3.5);
    });
    particles.forEach(p => {
      p.y+=p.vy; p.alpha-=0.002;
      if(p.alpha<=0){ p.y=canvas.height; p.alpha=0.5+Math.random()*0.4; }
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(160,255,190,${p.alpha})`; ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

const cardAnimObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const card = entry.target;
    const tag = card.querySelector('.project-card__tag');
    if (!tag || card.dataset.animated) return;
    card.dataset.animated = 'true';
    const type = tag.textContent.trim().toLowerCase();
    if (type.includes('supply')||type.includes('warehouse')) createCardCanvas(card,'warehouse');
    else if (type.includes('data')) createCardCanvas(card,'data');
    else if (type.includes('it'))   createCardCanvas(card,'it');
    else if (type.includes('saas')) createCardCanvas(card,'saas');
    card.style.opacity = '1'; card.style.transform = 'translateY(0)';
    cardAnimObserver.unobserve(card);
  });
}, { threshold: 0.15 });

document.querySelectorAll('.project-card').forEach((card, i) => {
  card.style.opacity = '0'; card.style.transform = 'translateY(28px)';
  card.style.transition = `opacity 0.6s ease ${i*0.1}s, transform 0.6s ease ${i*0.1}s`;
  cardAnimObserver.observe(card);
});


// =============================================
// ACCURATE REVOLVING GLOBE — Ethiopia SVG data
// =============================================
(function buildGlobe() {
  const canvas = document.getElementById('globeCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W/2, cy = H/2, R = 400;

  // Africa removed

  // Accurate Ethiopia regions converted from real SVG border data
  const ethiopiaRegions = [
  [[42.274,9.006],[42.294,9.055],[42.280,9.106],[42.294,9.152],[42.282,9.211],[42.215,9.189],[42.154,9.209],[42.092,9.103],[42.104,9.046],[42.153,9.046],[42.190,9.028],[42.231,9.037]],
  [[42.367,9.561],[42.229,9.617],[42.047,9.462],[41.917,9.523],[41.824,9.485],[41.757,9.349],[41.822,9.316],[41.895,9.319],[41.948,9.307],[42.043,9.335],[42.148,9.351],[42.158,9.431],[42.173,9.463],[42.278,9.494],[42.348,9.550]],
  [[39.529,3.010],[39.600,3.108],[39.770,3.276],[39.833,3.409],[39.959,3.532],[40.187,3.646],[40.192,3.662],[40.208,3.659],[40.391,3.724],[40.408,3.751],[40.726,3.877],[40.871,3.848],[40.923,3.776],[41.005,3.740],[41.140,3.587],[41.343,3.566],[41.531,3.589],[41.654,3.597],[41.725,3.623],[41.861,3.574],[41.938,3.634],[41.949,3.699],[42.094,3.806],[42.247,3.833],[42.594,3.882],[42.857,3.938],[42.925,3.999],[42.972,4.139],[43.061,4.224],[43.373,4.406],[43.667,4.522],[43.871,4.570],[44.055,4.608],[44.211,4.598],[44.366,4.589],[44.522,4.580],[44.625,4.574],[44.781,4.564],[44.939,4.555],[45.047,4.655],[45.319,4.962],[45.545,5.218],[45.856,5.569],[46.085,5.819],[46.268,6.014],[46.451,6.208],[46.535,6.292],[46.645,6.402],[46.791,6.548],[46.937,6.694],[47.083,6.840],[47.229,6.986],[47.375,7.131],[47.521,7.277],[47.618,7.375],[47.763,7.521],[47.909,7.667],[47.864,7.764],[47.393,7.764],[47.006,7.764],[46.801,7.846],[46.549,7.934],[46.297,8.021],[46.045,8.109],[45.793,8.197],[45.541,8.285],[45.365,8.345],[45.100,8.435],[44.836,8.526],[44.571,8.616],[44.307,8.706],[44.050,8.794],[43.814,9.004],[43.633,9.169],[43.574,9.160],[43.432,9.256],[43.419,9.330],[43.367,9.400],[43.342,9.443],[43.296,9.465],[43.232,9.698],[43.130,9.757],[43.047,9.849],[43.008,9.949],[42.862,10.071],[42.802,10.297],[42.721,10.402],[42.673,10.515],[42.725,10.542],[42.754,10.623],[42.811,10.695],[42.837,10.746],[42.902,10.802],[42.937,10.877],[42.924,10.896],[42.886,10.880],[42.797,10.897],[42.736,10.976],[42.634,10.994],[42.439,10.917],[42.387,10.913],[42.323,10.904],[42.261,10.888],[42.177,10.896],[42.064,10.849],[41.973,10.836],[41.954,10.828],[41.942,10.845],[41.792,10.889],[41.764,10.874],[41.317,10.866],[41.267,10.811],[41.229,10.707],[41.108,10.564],[41.112,10.472],[40.977,9.850],[41.047,9.802],[40.851,9.602],[40.729,9.345],[40.729,9.277],[40.796,9.276],[40.940,9.257],[40.911,9.215],[40.823,9.221],[40.834,9.152],[40.893,9.130],[40.993,9.173],[41.025,9.181],[41.064,9.205],[41.152,9.248],[41.218,9.290],[41.295,9.337],[41.497,9.290],[41.572,9.330],[41.640,9.349],[41.690,9.310],[41.762,9.303],[41.788,9.477],[41.892,9.517],[42.021,9.472],[42.182,9.586],[42.328,9.605],[42.419,9.504],[42.481,9.357],[42.580,9.167],[42.618,9.028],[42.651,8.980],[42.670,8.893],[42.821,8.694],[42.891,8.601],[42.921,8.403],[42.940,8.328],[42.929,8.221],[42.817,8.160],[42.730,7.957],[42.630,7.959],[42.559,8.237],[42.352,8.329],[42.233,8.397],[42.058,8.219],[42.055,8.106],[41.966,7.946],[41.946,7.610],[41.979,7.510],[41.902,7.303],[41.910,7.204],[42.233,7.034],[42.248,6.911],[42.210,6.824],[42.208,6.776],[42.178,6.711],[42.165,6.700],[42.129,6.661],[42.112,6.613],[42.105,6.560],[42.105,6.518],[42.050,6.379],[42.023,6.331],[41.985,6.283],[41.934,6.256],[41.871,6.284],[41.761,6.223],[41.674,6.108],[41.484,6.242],[41.417,6.278],[41.195,6.388],[41.074,6.394],[40.945,6.246],[40.884,6.128],[40.894,6.012],[40.909,5.940],[40.898,5.861],[40.903,5.528],[40.948,5.382],[40.572,5.097],[40.520,5.079],[40.391,5.057],[40.293,5.048],[40.212,5.025],[40.076,5.072],[39.944,4.914],[39.825,4.590],[39.773,4.332],[39.573,3.882],[39.513,3.690],[39.523,3.605],[39.325,3.257],[39.120,3.147],[39.205,3.086],[39.321,3.102],[39.345,3.094],[39.491,3.060],[39.513,3.021]],
  [[38.854,8.891],[38.821,8.890],[38.805,8.905],[38.748,8.899],[38.701,8.855],[38.681,8.802],[38.690,8.777],[38.708,8.737],[38.728,8.709],[38.750,8.702],[38.789,8.658],[38.841,8.635],[38.872,8.674],[38.900,8.695],[38.903,8.746],[38.922,8.757],[38.932,8.793],[38.901,8.890]],
  [[36.319,8.741],[36.352,8.758],[36.325,8.799],[36.264,8.776],[36.269,8.757],[36.301,8.739],[36.088,8.846],[36.064,8.817],[36.056,8.772],[36.032,8.726],[36.035,8.685],[36.035,8.668],[36.063,8.650],[36.089,8.657],[36.109,8.660],[36.123,8.646],[36.184,8.682],[36.228,8.634],[36.228,8.609],[36.250,8.590],[36.262,8.610],[36.265,8.649],[36.238,8.691],[36.253,8.774],[36.215,8.775],[36.196,8.804],[36.207,8.821],[36.186,8.830],[36.147,8.832],[36.463,9.257],[36.521,9.303],[36.483,9.349],[36.428,9.336],[36.399,9.266],[36.435,9.163],[36.455,9.192],[35.789,11.991],[35.739,11.895],[35.567,11.748],[35.490,11.743],[35.389,11.736],[35.298,11.883],[35.269,11.877],[35.150,11.807],[35.082,11.736],[35.064,11.664],[35.077,11.560],[35.096,11.477],[34.977,11.138],[35.003,11.063],[34.946,10.837],[34.974,10.763],[34.884,10.678],[34.874,10.634],[34.838,10.619],[34.796,10.574],[34.776,10.585],[34.760,10.644],[34.598,10.779],[34.443,10.671],[34.302,10.445],[34.348,10.134],[34.337,10.037],[34.324,10.009],[34.304,9.937],[34.090,9.363],[34.152,9.022],[34.386,9.022],[34.420,9.078],[34.487,9.476],[34.571,9.499],[34.658,9.437],[34.828,9.552],[34.917,9.831],[34.898,9.880],[35.048,9.854],[35.058,9.785],[35.195,9.794],[35.281,9.783],[35.541,9.534],[35.769,9.318],[35.816,9.254],[35.827,9.170],[35.881,9.164],[35.950,9.158],[36.002,9.059],[36.055,9.048],[36.107,8.954],[36.293,9.310],[36.241,9.409],[36.143,9.524],[36.170,9.578],[36.160,9.723],[36.181,9.894],[36.260,9.926],[36.435,10.120],[36.506,10.195],[36.594,10.207],[36.562,10.087],[36.614,10.068],[36.670,10.130],[36.819,10.147],[36.999,10.074],[37.040,10.094],[37.070,10.170],[36.865,10.218],[36.798,10.229],[36.780,10.247],[36.738,10.240],[36.558,10.258],[36.546,10.315],[36.524,10.352],[36.440,10.328],[36.374,10.404],[36.416,10.660],[36.361,10.671],[36.335,10.635],[36.335,10.715],[36.363,10.804],[36.408,10.865],[36.512,10.982],[36.494,11.080],[36.485,11.142],[36.528,11.222],[36.453,11.338],[36.458,11.402],[36.410,11.520],[36.360,11.668],[36.334,11.741],[36.214,11.631],[36.155,11.626],[36.123,11.751],[36.059,11.847],[35.991,11.926],[35.953,11.957],[35.883,11.966],[35.861,11.987]],
  [[38.728,9.909],[38.845,9.969],[38.872,10.233],[38.512,10.233],[38.474,10.098],[38.451,10.081],[38.459,10.034],[38.421,9.990],[38.346,9.993],[38.299,9.981],[38.259,9.965],[38.224,9.917],[38.147,9.890],[37.949,9.783],[37.914,9.776],[37.891,9.747],[37.803,9.705],[37.771,9.705],[37.633,9.761],[37.589,9.820],[37.460,9.904],[37.377,9.913],[37.357,9.872],[37.332,9.885],[37.323,9.929],[37.298,9.960],[37.255,9.962],[37.234,9.968],[37.208,10.061],[37.205,10.127],[37.099,10.145],[37.050,10.113],[37.017,10.072],[36.874,10.124],[36.758,10.176],[36.635,10.072],[36.580,10.081],[36.560,10.105],[36.526,10.204],[36.450,10.140],[36.349,9.992],[36.201,9.895],[36.152,9.907],[36.159,9.603],[36.162,9.540],[36.173,9.491],[36.287,9.367],[36.253,9.151],[36.070,9.029],[36.012,9.046],[35.958,9.145],[35.920,9.161],[35.840,9.164],[35.818,9.241],[35.782,9.318],[35.677,9.363],[35.302,9.772],[35.242,9.787],[35.085,9.784],[35.046,9.828],[35.025,9.870],[34.903,9.846],[34.867,9.625],[34.685,9.422],[34.589,9.495],[34.512,9.491],[34.428,9.102],[34.401,9.041],[34.339,9.006],[34.120,8.722],[34.154,8.381],[34.196,8.356],[34.293,8.398],[34.463,8.261],[34.641,8.144],[34.728,8.054],[34.822,7.995],[34.899,7.956],[35.083,7.963],[35.080,7.913],[34.924,7.841],[34.973,7.801],[34.910,7.683],[34.915,7.547],[35.016,7.453],[35.041,7.360],[35.170,7.298],[35.132,7.249],[35.175,7.222],[35.220,7.211],[35.256,7.234],[35.287,7.290],[35.280,7.461],[35.364,7.539],[35.380,7.604],[35.415,7.609],[35.461,7.642],[35.513,7.648],[35.573,7.602],[35.632,7.574],[35.706,7.617],[35.766,7.632],[35.819,7.684],[35.804,7.733],[35.752,7.796],[35.811,7.856],[35.880,7.849],[35.929,7.725],[35.910,7.657],[35.901,7.581],[36.011,7.517],[36.069,7.414],[36.063,7.342],[36.166,7.299],[36.285,7.222],[36.376,7.193],[36.444,7.162],[36.516,7.159],[36.636,7.117],[36.897,6.967],[37.051,6.979],[37.192,6.996],[37.390,7.117],[37.419,7.149],[37.434,7.225],[37.437,7.427],[37.432,7.592],[37.461,7.666],[37.418,7.765],[37.537,7.775],[37.593,7.718],[37.643,7.743],[37.620,7.810],[37.629,7.995],[37.544,8.032],[37.505,8.059],[37.491,8.092],[37.525,8.186],[37.585,8.214],[37.630,8.147],[37.738,8.127],[37.790,8.134],[38.072,8.168],[38.284,8.195],[38.320,8.161],[38.334,8.088],[38.427,8.057],[38.478,8.167],[38.500,8.205],[38.548,8.239],[38.608,8.227],[38.692,8.152],[38.688,8.060],[38.707,7.959],[38.710,7.887],[38.664,7.910],[38.628,8.031],[38.607,7.945],[38.628,7.868],[38.631,7.759],[38.540,7.605],[38.473,7.507],[38.447,7.430],[38.454,7.277],[38.406,7.247],[38.359,7.206],[38.313,7.128],[38.284,7.050],[38.104,6.904],[38.099,6.809],[38.178,6.767],[38.326,6.850],[38.381,6.889],[38.479,6.852],[38.579,6.833],[38.667,6.762],[38.664,6.509],[38.707,6.472],[38.888,6.389],[38.977,6.365],[39.101,6.254],[39.129,6.169],[39.143,6.007],[39.119,5.943],[39.159,5.860],[38.970,5.894],[38.944,5.955],[38.886,6.048],[38.792,6.113],[38.725,6.116],[38.603,6.148],[38.477,6.120],[38.463,5.945],[38.431,5.889],[38.384,5.811],[38.321,5.713],[38.350,5.666],[38.416,5.609],[38.302,5.555],[38.239,5.580],[38.113,5.852],[38.157,5.863],[38.217,5.892],[38.203,5.978],[38.295,6.056],[38.282,6.171],[38.224,6.171],[38.166,6.197],[38.095,6.245],[38.046,6.288],[37.986,6.281],[37.926,6.305],[37.845,6.220],[37.862,6.092],[37.860,5.946],[37.804,5.845],[37.811,5.717],[37.874,5.688],[38.005,5.616],[38.040,5.498],[38.090,5.451],[38.112,5.389],[37.985,5.329],[37.977,5.227],[37.948,5.076],[37.927,5.010],[37.924,4.917],[37.866,4.914],[37.780,4.957],[37.689,4.978],[37.647,4.932],[37.480,4.850],[37.351,4.835],[37.253,4.870],[37.118,4.855],[36.995,4.851],[36.898,4.616],[36.926,4.517],[36.900,4.376],[36.762,4.163],[36.738,4.108],[36.672,4.071],[36.927,4.055],[37.049,4.001],[37.092,3.970],[37.110,3.948],[37.124,3.919],[37.190,3.881],[37.499,3.677],[37.775,3.493],[38.001,3.344],[38.060,3.264],[38.126,3.226],[38.201,3.235],[38.470,3.215],[38.521,3.253],[38.539,3.263],[38.567,3.229],[38.598,3.218],[38.620,3.221],[38.685,3.207],[38.685,3.236],[38.746,3.172],[38.946,3.124],[39.019,3.125],[39.102,3.135],[39.120,3.147],[39.325,3.257],[39.523,3.605],[39.513,3.690],[39.573,3.882],[39.773,4.332],[39.825,4.590],[39.944,4.914],[40.076,5.072],[40.212,5.025],[40.293,5.048],[40.391,5.057],[40.520,5.079],[40.572,5.097],[40.948,5.382],[40.903,5.528],[40.898,5.861],[40.909,5.940],[40.894,6.012],[40.884,6.128],[40.945,6.246],[41.074,6.394],[41.195,6.388],[41.417,6.278],[41.484,6.242],[41.674,6.108],[41.761,6.223],[41.871,6.284],[41.934,6.256],[41.985,6.283],[42.023,6.331],[42.050,6.379],[42.105,6.518],[42.105,6.560],[42.112,6.613],[42.129,6.661],[42.165,6.700],[42.178,6.711],[42.208,6.776],[42.210,6.824],[42.248,6.911],[42.233,7.034],[41.910,7.204],[41.902,7.303],[41.979,7.510],[41.946,7.610],[41.966,7.946],[42.055,8.106],[42.058,8.219],[42.233,8.397],[42.352,8.329],[42.559,8.237],[42.630,7.959],[42.730,7.957],[42.817,8.160],[42.929,8.221],[42.940,8.328],[42.921,8.403],[42.891,8.601],[42.821,8.694],[42.670,8.893],[42.651,8.980],[42.618,9.028],[42.580,9.167],[42.481,9.357],[42.419,9.504],[42.348,9.550],[42.278,9.494],[42.173,9.463],[42.158,9.431],[42.148,9.351],[42.043,9.335],[41.948,9.307],[41.895,9.319],[41.822,9.316],[41.737,9.298],[41.676,9.331],[41.615,9.346],[41.536,9.298],[41.420,9.318],[41.256,9.327],[41.197,9.273],[41.104,9.230],[41.046,9.188],[41.014,9.181],[40.961,9.152],[40.872,9.129],[40.825,9.174],[40.841,9.224],[40.936,9.222],[40.892,9.286],[40.740,9.276],[40.725,9.276],[40.667,9.229],[40.518,9.192],[40.430,9.099],[40.286,8.903],[40.273,8.849],[40.213,8.778],[40.125,8.689],[40.045,8.672],[40.051,8.808],[39.978,8.835],[39.955,8.868],[39.936,8.949],[39.835,8.954],[39.783,8.675],[39.615,8.596],[39.521,8.570],[39.440,8.632],[39.349,8.582],[39.303,8.659],[39.301,8.756],[39.396,8.965],[39.302,9.010],[39.276,9.112],[39.322,9.121],[39.470,9.170],[39.533,9.163],[39.471,9.260],[39.398,9.277],[39.293,9.395],[38.946,9.558],[38.832,9.680],[38.821,9.791],[38.781,9.837],[38.690,9.886],[36.435,9.163],[36.399,9.266],[36.428,9.336],[36.483,9.349],[36.521,9.303],[36.463,9.257],[36.455,9.192],[36.435,9.163],[38.843,8.910],[38.879,8.893],[38.931,8.814],[38.924,8.768],[38.913,8.744],[38.885,8.734],[38.887,8.671],[38.852,8.650],[38.801,8.649],[38.761,8.693],[38.735,8.706],[38.711,8.729],[38.697,8.769],[38.688,8.792],[38.686,8.827],[38.734,8.894],[38.799,8.909],[38.816,8.887],[36.240,8.723],[36.256,8.663],[36.251,8.628],[36.269,8.587],[36.235,8.598],[36.230,8.625],[36.194,8.667],[36.145,8.646],[36.114,8.657],[36.094,8.657],[36.065,8.655],[36.042,8.660],[36.034,8.683],[36.037,8.700],[36.039,8.751],[36.064,8.798],[36.072,8.845],[36.147,8.832],[36.186,8.830],[36.207,8.821],[36.196,8.804],[36.215,8.775],[36.253,8.774],[36.283,8.749],[36.261,8.770],[36.313,8.806],[36.359,8.768],[36.331,8.745],[42.282,9.211],[42.294,9.152],[42.280,9.106],[42.294,9.055],[42.274,9.006],[42.217,9.040],[42.176,9.027],[42.144,9.051],[42.089,9.049],[42.102,9.131],[42.171,9.208],[42.237,9.197]],
  [[34.899,7.956],[34.822,7.995],[34.728,8.054],[34.641,8.144],[34.463,8.261],[34.293,8.398],[34.196,8.356],[34.154,8.381],[34.113,8.347],[33.973,8.219],[33.863,8.209],[33.820,8.190],[33.764,8.150],[33.674,8.220],[33.608,8.245],[33.559,8.240],[33.507,8.261],[33.503,8.244],[33.415,8.238],[33.384,8.220],[33.229,8.216],[33.225,8.199],[33.192,8.181],[33.189,8.151],[33.186,8.135],[33.194,8.112],[33.187,8.073],[33.208,8.043],[33.229,8.019],[33.204,8.003],[33.191,7.971],[33.207,7.941],[33.200,7.900],[33.140,7.876],[33.129,7.852],[33.054,7.764],[33.039,7.725],[33.029,7.708],[33.037,7.613],[33.067,7.577],[33.081,7.558],[33.143,7.543],[33.187,7.561],[33.256,7.543],[33.296,7.507],[33.382,7.476],[33.459,7.507],[33.511,7.494],[33.549,7.474],[33.595,7.441],[33.698,7.426],[33.752,7.396],[33.844,7.309],[33.905,7.286],[34.053,7.091],[34.063,6.986],[34.155,6.899],[34.204,6.903],[34.218,6.831],[34.299,6.797],[34.374,6.784],[34.498,6.813],[34.592,6.762],[34.685,6.743],[34.761,6.774],[34.843,6.833],[34.970,6.838],[35.028,6.864],[35.088,6.900],[35.157,6.856],[35.247,6.871],[35.353,6.867],[35.348,6.920],[35.350,6.963],[35.364,7.015],[35.367,7.057],[35.381,7.172],[35.286,7.240],[35.288,7.267],[35.236,7.223],[35.213,7.209],[35.145,7.223],[35.148,7.268],[35.157,7.311],[35.033,7.381],[34.983,7.487],[34.894,7.592],[34.973,7.776],[34.924,7.816],[34.969,7.861],[35.106,7.925],[35.029,7.970]],
  [[38.700,7.865],[38.707,7.935],[38.701,8.045],[38.695,8.128],[38.671,8.195],[38.570,8.244],[38.522,8.229],[38.481,8.175],[38.457,8.082],[38.349,8.049],[38.324,8.153],[38.301,8.183],[38.208,8.185],[37.858,8.118],[37.753,8.128],[37.652,8.147],[37.604,8.195],[37.541,8.204],[37.495,8.121],[37.502,8.064],[37.529,8.039],[37.628,8.007],[37.616,7.830],[37.643,7.759],[37.613,7.723],[37.557,7.732],[37.480,7.782],[37.454,7.695],[37.438,7.611],[37.429,7.466],[37.461,7.334],[37.423,7.197],[37.403,7.112],[37.258,7.049],[37.131,6.974],[36.942,6.962],[36.807,6.999],[36.538,7.152],[36.453,7.161],[36.394,7.180],[36.346,7.199],[36.205,7.274],[36.070,7.322],[36.071,7.398],[36.023,7.502],[35.962,7.542],[35.881,7.620],[35.929,7.700],[35.893,7.838],[35.835,7.857],[35.775,7.833],[35.769,7.757],[35.826,7.702],[35.781,7.643],[35.726,7.624],[35.654,7.584],[35.584,7.585],[35.556,7.646],[35.476,7.642],[35.439,7.625],[35.386,7.606],[35.368,7.559],[35.297,7.475],[35.268,7.382],[35.286,7.240],[35.381,7.172],[35.367,7.057],[35.364,7.015],[35.350,6.963],[35.348,6.920],[35.353,6.867],[35.247,6.871],[35.157,6.856],[35.088,6.900],[35.028,6.864],[34.970,6.838],[34.843,6.833],[34.761,6.774],[34.685,6.743],[34.592,6.762],[34.498,6.813],[34.374,6.784],[34.299,6.797],[34.218,6.831],[34.229,6.786],[34.253,6.764],[34.303,6.709],[34.320,6.697],[34.535,6.602],[34.547,6.548],[34.534,6.537],[34.541,6.516],[34.577,6.459],[34.658,6.449],[34.737,6.372],[34.766,6.311],[34.807,6.151],[34.862,6.032],[34.903,5.888],[34.957,5.799],[34.991,5.702],[34.979,5.656],[35.000,5.614],[34.997,5.576],[35.007,5.529],[35.111,5.322],[35.246,5.220],[35.297,5.155],[35.275,5.121],[35.311,5.046],[35.368,5.023],[35.453,5.100],[35.513,5.101],[35.597,5.047],[35.663,5.054],[35.773,5.009],[35.805,4.938],[35.821,4.854],[35.822,4.788],[35.775,4.508],[35.944,4.265],[35.960,4.203],[35.964,4.151],[36.042,4.090],[36.215,4.085],[36.270,4.087],[36.487,4.080],[36.666,4.072],[36.719,4.095],[36.748,4.121],[36.828,4.281],[36.933,4.489],[36.897,4.593],[36.966,4.814],[37.042,4.867],[37.238,4.870],[37.309,4.860],[37.427,4.830],[37.623,4.921],[37.672,4.964],[37.732,4.977],[37.847,4.931],[37.910,4.903],[37.933,4.960],[37.935,5.051],[37.976,5.173],[37.968,5.317],[38.097,5.372],[38.109,5.439],[38.050,5.476],[38.010,5.591],[37.974,5.645],[37.818,5.702],[37.802,5.819],[37.841,5.906],[37.881,6.054],[37.826,6.176],[37.909,6.305],[37.955,6.282],[38.024,6.291],[38.076,6.257],[38.147,6.215],[38.204,6.165],[38.264,6.176],[38.321,6.094],[38.219,6.016],[38.220,5.917],[38.180,5.860],[38.121,5.875],[38.116,5.802],[38.281,5.550],[38.344,5.559],[38.409,5.632],[38.318,5.705],[38.351,5.748],[38.409,5.872],[38.461,5.915],[38.457,6.085],[38.562,6.149],[38.719,6.117],[38.789,6.120],[38.811,6.084],[38.915,6.009],[38.970,5.900],[39.061,5.847],[39.136,5.899],[39.128,5.987],[39.153,6.076],[39.117,6.235],[38.988,6.351],[38.936,6.385],[38.740,6.461],[38.672,6.498],[38.690,6.702],[38.605,6.837],[38.512,6.831],[38.413,6.868],[38.335,6.866],[38.270,6.788],[38.116,6.791],[38.097,6.868],[38.147,6.960],[38.304,7.107],[38.352,7.182],[38.380,7.235],[38.445,7.262],[38.444,7.380],[38.467,7.486],[38.519,7.563],[38.617,7.717],[38.643,7.789],[38.615,7.919],[38.569,8.011],[38.656,7.927],[38.700,7.865]],
  [[40.379,14.421],[40.219,14.537],[40.062,14.545],[40.017,14.545],[40.010,14.515],[40.002,14.470],[39.988,14.456],[39.846,14.474],[39.727,14.443],[39.693,14.400],[39.793,14.379],[39.719,14.259],[39.737,14.234],[39.786,14.219],[39.756,14.153],[39.797,14.161],[39.820,14.109],[39.817,14.037],[39.841,14.004],[39.846,13.929],[39.830,13.746],[39.848,13.611],[39.773,13.597],[39.766,13.446],[39.746,13.287],[39.758,13.251],[39.788,13.225],[39.813,13.130],[39.832,13.099],[39.803,13.049],[39.794,12.976],[39.786,12.911],[39.811,12.863],[39.869,12.846],[39.917,12.753],[39.884,12.625],[39.817,12.504],[39.830,12.401],[39.830,12.331],[39.788,12.244],[39.787,12.207],[39.827,12.093],[39.826,12.052],[39.855,11.994],[39.857,11.933],[39.875,11.896],[39.908,11.866],[39.908,11.715],[39.982,11.608],[40.012,11.587],[40.034,11.487],[40.094,11.332],[40.123,11.236],[40.197,11.121],[40.216,11.016],[40.217,10.942],[40.179,10.810],[40.177,10.726],[40.140,10.627],[40.189,10.547],[40.179,10.447],[40.203,10.358],[40.181,10.294],[40.149,10.094],[40.155,10.011],[40.149,9.955],[40.090,9.967],[40.025,9.948],[40.029,9.882],[40.102,9.831],[40.102,9.746],[40.038,9.649],[40.050,9.611],[40.001,9.569],[39.880,9.541],[39.913,9.336],[39.836,9.235],[39.834,9.185],[39.884,9.167],[39.892,9.041],[39.889,8.961],[39.943,8.933],[39.964,8.856],[39.975,8.815],[40.069,8.787],[40.051,8.649],[40.145,8.710],[40.240,8.795],[40.275,8.872],[40.349,8.967],[40.457,9.133],[40.553,9.208],[40.694,9.245],[40.747,9.421],[40.906,9.666],[41.038,9.816],[40.968,9.876],[41.112,10.501],[41.117,10.585],[41.258,10.755],[41.276,10.837],[41.717,10.863],[41.781,10.884],[41.787,10.896],[41.813,11.173],[41.775,11.465],[41.834,11.674],[41.897,11.715],[41.923,11.740],[41.962,11.770],[42.123,12.025],[42.166,12.063],[42.345,12.358],[42.276,12.609],[42.107,12.799],[41.920,12.951],[41.776,13.226],[41.556,13.422],[41.217,13.658],[40.963,14.054],[40.729,14.249],[40.505,14.324]],
  [[37.915,15.000],[37.745,14.577],[37.589,14.189],[37.549,14.202],[37.540,14.256],[37.512,14.272],[37.488,14.315],[37.436,14.377],[37.419,14.421],[37.399,14.461],[37.318,14.551],[37.208,14.542],[37.130,14.489],[37.118,14.421],[37.096,14.368],[37.058,14.359],[37.029,14.344],[37.003,14.353],[36.971,14.388],[36.840,14.417],[36.746,14.405],[36.672,14.399],[36.606,14.380],[36.569,14.344],[36.456,14.033],[36.479,13.927],[36.477,13.817],[36.579,13.640],[36.840,13.489],[36.938,13.418],[37.090,13.409],[37.164,13.455],[37.242,13.457],[37.314,13.405],[37.510,13.388],[37.694,13.476],[37.743,13.586],[37.916,13.577],[38.095,13.506],[38.145,13.544],[38.247,13.550],[38.425,13.572],[38.460,13.622],[38.498,13.615],[38.479,13.501],[38.593,13.528],[38.699,13.526],[38.722,13.441],[38.770,13.402],[39.026,13.107],[39.032,13.037],[39.070,13.009],[39.249,13.023],[39.269,12.935],[39.288,12.792],[39.217,12.581],[39.272,12.335],[39.314,12.265],[39.399,12.270],[39.558,12.296],[39.568,12.235],[39.654,12.271],[39.771,12.284],[39.830,12.331],[39.830,12.401],[39.817,12.504],[39.884,12.625],[39.917,12.753],[39.869,12.846],[39.811,12.863],[39.786,12.911],[39.794,12.976],[39.803,13.049],[39.832,13.099],[39.813,13.130],[39.788,13.225],[39.758,13.251],[39.746,13.287],[39.766,13.446],[39.773,13.597],[39.848,13.611],[39.830,13.746],[39.846,13.929],[39.841,14.004],[39.817,14.037],[39.820,14.109],[39.797,14.161],[39.756,14.153],[39.786,14.219],[39.737,14.234],[39.719,14.259],[39.793,14.379],[39.693,14.400],[39.727,14.443],[39.846,14.474],[39.988,14.456],[40.002,14.470],[40.010,14.515],[40.017,14.545],[39.986,14.547],[39.917,14.518],[39.822,14.591],[39.748,14.598],[39.624,14.608],[39.592,14.643],[39.540,14.668],[39.473,14.601],[39.318,14.586],[39.258,14.533],[39.183,14.660],[39.132,14.724],[39.071,14.749],[39.021,14.744],[39.018,14.687],[38.942,14.634],[38.846,14.585],[38.749,14.553],[38.693,14.562],[38.517,14.509],[38.451,14.508],[38.426,14.550],[38.349,14.601],[38.320,14.676],[38.291,14.704],[38.272,14.753],[38.253,14.787],[38.157,14.785],[38.022,14.842],[38.014,14.870],[37.988,14.885],[37.982,14.903],[37.978,14.922],[37.945,14.966]],
  [[37.077,13.400],[36.920,13.425],[36.730,13.596],[36.562,13.640],[36.464,13.827],[36.415,13.640],[36.160,13.040],[36.173,12.994],[36.149,12.954],[36.162,12.871],[36.147,12.712],[36.096,12.692],[36.074,12.705],[35.752,12.662],[35.711,12.646],[35.701,12.610],[35.686,12.577],[35.649,12.568],[35.441,12.203],[35.426,12.146],[35.384,12.117],[35.349,12.001],[35.283,11.931],[35.271,11.907],[35.364,11.759],[35.434,11.724],[35.547,11.745],[35.613,11.792],[35.782,11.986],[35.861,11.987],[35.883,11.966],[35.953,11.957],[35.991,11.926],[36.059,11.847],[36.123,11.751],[36.155,11.626],[36.214,11.631],[36.334,11.741],[36.360,11.668],[36.410,11.520],[36.458,11.402],[36.453,11.338],[36.528,11.222],[36.485,11.142],[36.494,11.080],[36.512,10.982],[36.408,10.865],[36.363,10.804],[36.335,10.715],[36.335,10.635],[36.361,10.671],[36.416,10.660],[36.374,10.404],[36.440,10.328],[36.524,10.352],[36.546,10.315],[36.558,10.258],[36.738,10.240],[36.780,10.247],[36.798,10.229],[36.865,10.218],[37.070,10.170],[37.137,10.127],[37.223,10.091],[37.210,9.994],[37.250,9.961],[37.281,9.964],[37.321,9.941],[37.327,9.894],[37.347,9.871],[37.372,9.900],[37.426,9.914],[37.569,9.849],[37.618,9.779],[37.743,9.690],[37.795,9.707],[37.820,9.706],[37.909,9.770],[37.931,9.782],[38.005,9.821],[38.216,9.911],[38.251,9.945],[38.270,9.975],[38.336,9.994],[38.395,9.986],[38.457,10.022],[38.452,10.066],[38.465,10.091],[38.507,10.223],[38.756,10.253],[38.888,10.180],[38.766,9.918],[38.690,9.886],[38.781,9.837],[38.821,9.791],[38.832,9.680],[38.946,9.558],[39.293,9.395],[39.398,9.277],[39.471,9.260],[39.533,9.163],[39.470,9.170],[39.322,9.121],[39.276,9.112],[39.302,9.010],[39.396,8.965],[39.301,8.756],[39.303,8.659],[39.349,8.582],[39.440,8.632],[39.521,8.570],[39.615,8.596],[39.783,8.675],[39.835,8.954],[39.919,9.089],[39.871,9.174],[39.819,9.202],[39.858,9.251],[39.920,9.388],[39.877,9.583],[40.040,9.569],[40.043,9.623],[40.065,9.685],[40.110,9.769],[40.082,9.846],[40.017,9.900],[40.042,9.962],[40.111,9.963],[40.156,9.962],[40.149,10.038],[40.168,10.143],[40.187,10.315],[40.203,10.365],[40.179,10.473],[40.183,10.560],[40.140,10.651],[40.188,10.754],[40.153,10.838],[40.221,10.960],[40.213,11.066],[40.157,11.197],[40.092,11.270],[40.086,11.389],[40.025,11.510],[40.009,11.594],[39.961,11.626],[39.902,11.736],[39.906,11.871],[39.870,11.904],[39.856,11.947],[39.851,12.010],[39.825,12.065],[39.819,12.122],[39.786,12.222],[39.804,12.294],[39.665,12.274],[39.562,12.219],[39.567,12.280],[39.402,12.294],[39.323,12.263],[39.283,12.306],[39.257,12.474],[39.215,12.653],[39.281,12.897],[39.258,13.002],[39.121,13.010],[39.039,13.022],[39.025,13.087],[38.994,13.173],[38.729,13.422],[38.702,13.518],[38.608,13.532],[38.485,13.496],[38.506,13.597],[38.477,13.630],[38.440,13.589],[38.305,13.548],[38.161,13.561],[38.116,13.517],[38.049,13.508],[37.766,13.604],[37.709,13.492],[37.540,13.394],[37.323,13.397],[37.272,13.444],[37.185,13.460],[37.102,13.422]],
];

  const addisLon = 38.7, addisLat = 20;
  let rotLon = -55;
  let spinning = true;
  const targetLon = -38.7;

  function toRad(d) { return d * Math.PI / 180; }

  function project(lon, lat, rotDeg) {
    const lam = toRad(lon + rotDeg);
    const phi = toRad(lat);
    const x = R * Math.cos(phi) * Math.sin(lam);
    const y = -R * Math.sin(phi);
    const z = R * Math.cos(phi) * Math.cos(lam);
    return { x: cx+x, y: cy+y, z };
  }

  function drawRegion(points, rotDeg) {
    ctx.beginPath();
    let first = true;
    points.forEach(([lon, lat]) => {
      const p = project(lon, lat, rotDeg);
      if (p.z <= 0) { first = true; return; }
      first ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      first = false;
    });
    ctx.closePath();
  }

  function drawGlobe() {
    ctx.clearRect(0, 0, W, H);

    // Ocean gradient
    const grad = ctx.createRadialGradient(cx-30, cy-30, 20, cx, cy, R);
    grad.addColorStop(0, 'rgba(60,130,230,0.70)');
    grad.addColorStop(0.6,'rgba(20,70,170,0.55)');
    grad.addColorStop(1, 'rgba(5,20,80,0.60)');
    ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2);
    ctx.fillStyle = grad; ctx.fill();
    ctx.strokeStyle = 'rgba(100,170,255,0.4)'; ctx.lineWidth = 1.5; ctx.stroke();

    // Grid
    for (let lat=-75; lat<=75; lat+=15) {
      ctx.beginPath(); let f=true;
      for (let lon=-180; lon<=180; lon+=4) {
        const p=project(lon,lat,rotLon);
        if(p.z<=0){f=true;continue;}
        f?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y); f=false;
      }
      ctx.strokeStyle='rgba(180,220,255,0.13)'; ctx.lineWidth=0.5; ctx.stroke();
    }
    for (let lon=-180; lon<=180; lon+=15) {
      ctx.beginPath(); let f=true;
      for (let lat=-90; lat<=90; lat+=4) {
        const p=project(lon,lat,rotLon);
        if(p.z<=0){f=true;continue;}
        f?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y); f=false;
      }
      ctx.strokeStyle='rgba(180,220,255,0.13)'; ctx.lineWidth=0.5; ctx.stroke();
    }

   // Africa outline (gap around Ethiopia area)
   // Tropic lines — subtle named latitude markers
const tropics = [
  { lat: 23.5, label: 'Tropic of Cancer', color: 'rgba(255,200,100,0.25)' },
  { lat: -23.5, label: 'Tropic of Capricorn', color: 'rgba(100,200,255,0.25)' },
  { lat: 0, label: 'Equator', color: 'rgba(255,255,255,0.20)' },
];
tropics.forEach(({ lat, color }) => {
  ctx.beginPath(); let f = true;
  for (let lon = -180; lon <= 180; lon += 3) {
    const p = project(lon, lat, rotLon);
    if (p.z <= 0) { f = true; continue; }
    f ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
    f = false;
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.2;
  ctx.setLineDash([4, 6]);
  ctx.stroke();
  ctx.setLineDash([]);
});

// Ocean shimmer dots — scattered across visible hemisphere
for (let lat = -80; lat <= 80; lat += 18) {
  for (let lon = -180; lon <= 180; lon += 22) {
    // Skip Ethiopia region
    if (lon > 33 && lon < 48 && lat > 3 && lat < 15) continue;
    const p = project(lon, lat, rotLon);
    if (p.z <= 0) continue;
    const shimmer = 0.3 + 0.4 * Math.sin(Date.now() * 0.001 + lon * 0.3 + lat * 0.2);
    ctx.beginPath();
    ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(180,230,255,${shimmer * 0.5})`;
    ctx.fill();
  }
}

// Other continents — all except Africa area
const continents = [
  [[-168,72],[-140,70],[-120,74],[-85,74],[-65,68],[-52,55],[-56,47],[-70,43],[-76,35],[-80,25],[-88,16],[-78,8],[-104,20],[-110,24],[-118,32],[-120,38],[-124,48],[-130,54],[-140,58],[-152,60],[-160,60],[-168,64],[-168,72]],
  [[-80,12],[-72,12],[-60,8],[-50,4],[-50,-5],[-36,-5],[-36,-18],[-42,-24],[-44,-30],[-52,-34],[-58,-38],[-62,-52],[-68,-56],[-74,-50],[-72,-42],[-76,-30],[-72,-18],[-76,-8],[-80,0],[-80,12]],
  [[0,52],[8,58],[10,62],[14,66],[20,70],[28,72],[30,68],[26,60],[30,58],[24,58],[18,58],[14,56],[10,56],[4,52],[0,52]],
  [[26,72],[40,72],[60,74],[80,74],[100,72],[120,70],[140,72],[160,68],[170,64],[170,56],[160,50],[150,44],[140,38],[130,32],[120,26],[110,20],[100,12],[92,8],[80,10],[72,20],[60,24],[52,30],[44,36],[36,42],[30,46],[26,50],[26,72]],
  [[114,-22],[120,-20],[130,-12],[136,-12],[140,-16],[148,-18],[152,-24],[152,-30],[148,-38],[144,-38],[136,-36],[130,-32],[122,-34],[114,-30],[114,-22]],
];
continents.forEach(pts => {
  ctx.beginPath(); let f = true;
  pts.forEach(([lon, lat]) => {
    const p = project(lon, lat, rotLon);
    if (p.z <= 0) { f = true; return; }
    f ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
    f = false;
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(80,180,100,0.18)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(120,220,140,0.38)';
  ctx.lineWidth = 0.8;
  ctx.stroke();
});
    // Ethiopia — all 11 accurate regions from SVG
    const ethCenter = project(addisLon, addisLat, rotLon);
    if (ethCenter.z > 0) {
      ethiopiaRegions.forEach(region => {
  ctx.beginPath();
  let first = true;
  region.forEach(([lon, lat]) => {
    const p = project(lon, lat, rotLon);
    if (p.z <= 0) { first = true; return; }
    // Scale Ethiopia from its center (addisLon, addisLat)
    const center = project(addisLon, addisLat, rotLon);
    const scale = 1.75;
    const sx = center.x + (p.x - center.x) * scale;
    const sy = center.y + (p.y - center.y) * scale;
    first ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
    first = false;
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(255,150,50,0.55)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,210,90,0.90)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
});


    }

    // Atmosphere rim
    const rim=ctx.createRadialGradient(cx,cy,R-6,cx,cy,R+16);
    rim.addColorStop(0,'rgba(100,180,255,0.12)');
    rim.addColorStop(1,'transparent');
    ctx.beginPath(); ctx.arc(cx,cy,R+16,0,Math.PI*2);
    ctx.fillStyle=rim; ctx.fill();

    // Spin with easing toward Ethiopia
    rotLon += 0.9; // Rotation speed
if (rotLon >= 360) rotLon -= 360;
    requestAnimationFrame(drawGlobe);
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ drawGlobe(); obs.unobserve(canvas); } });
  }, { threshold: 0.2 });
  obs.observe(canvas);
})();