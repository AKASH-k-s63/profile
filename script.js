/* =============================================
   AKASH K S — PORTFOLIO SCRIPT
   Vanilla JavaScript — No frameworks
   ============================================= */

'use strict';

// =============================================
// PARTICLE SYSTEM
// =============================================
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height, particles = [], animFrame;

  const PARTICLE_COUNT = 80;
  const COLORS = ['#00E5FF', '#7C3AED', '#00FF9D'];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(init = false) {
      this.x = Math.random() * width;
      this.y = init ? Math.random() * height : height + 10;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.4 + 0.1);
      this.radius = Math.random() * 1.5 + 0.3;
      this.alpha = Math.random() * 0.4 + 0.05;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.life = Math.random() * 200 + 100;
      this.age = 0;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.age++;
      if (this.age > this.life || this.y < -10) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      const fade = Math.min(1, this.age / 30, (this.life - this.age) / 30);
      ctx.globalAlpha = this.alpha * fade;
      ctx.fill();
    }
  }

  function initParticleList() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    ctx.globalAlpha = 1;
    animFrame = requestAnimationFrame(animate);
  }

  resize();
  initParticleList();
  animate();

  window.addEventListener('resize', () => {
    resize();
    initParticleList();
  });
})();

// =============================================
// NAVBAR
// =============================================
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobLinks = document.querySelectorAll('.mob-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  function toggleMenu() {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', toggleMenu);
  mobLinks.forEach(link => link.addEventListener('click', closeMenu));
})();

// =============================================
// ACTIVE NAV LINK ON SCROLL
// =============================================
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function setActive() {
    let current = '';
    const scrollY = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActive, { passive: true });
})();

// =============================================
// TYPEWRITER EFFECT
// =============================================
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    'scalable APIs',
    'microservices',
    'cloud systems',
    'automation pipelines',
    'intelligent workflows',
    'production-grade backends',
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let paused = false;

  function type() {
    const current = phrases[phraseIdx];

    if (!deleting) {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;

      if (charIdx === current.length) {
        paused = true;
        setTimeout(() => {
          paused = false;
          deleting = true;
          scheduleNext(50);
        }, 2000);
        return;
      }
    } else {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;

      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        scheduleNext(400);
        return;
      }
    }

    if (!paused) {
      scheduleNext(deleting ? 35 : 70);
    }
  }

  function scheduleNext(delay) {
    setTimeout(type, delay);
  }

  scheduleNext(800);
})();

// =============================================
// ANIMATED COUNTERS
// =============================================
(function initCounters() {
  const counters = document.querySelectorAll('.impact-num');

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(easeOut(progress) * target);
      el.textContent = value;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target;
      }
    }

    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(counter => observer.observe(counter));
})();

// =============================================
// SCROLL REVEAL
// =============================================
(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-up');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  elements.forEach(el => observer.observe(el));
})();

// =============================================
// BACK TO TOP
// =============================================
(function initBackTop() {
  const btn = document.getElementById('back-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// =============================================
// MOUSE PARALLAX — HERO AURORA
// =============================================
(function initParallax() {
  const auroras = document.querySelectorAll('.aurora-layer');
  if (!auroras.length) return;

  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  let rafId;

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    targetX = (e.clientX - cx) / cx;
    targetY = (e.clientY - cy) / cy;
  });

  function animateParallax() {
    currentX = lerp(currentX, targetX, 0.05);
    currentY = lerp(currentY, targetY, 0.05);

    auroras.forEach((el, i) => {
      const depth = (i + 1) * 12;
      el.style.transform = `translate(${currentX * depth}px, ${currentY * depth}px)`;
    });

    rafId = requestAnimationFrame(animateParallax);
  }

  animateParallax();
})();

// =============================================
// IMPACT BAR ANIMATION
// =============================================
(function initImpactBars() {
  const bars = document.querySelectorAll('.impact-fill, .fp-bar');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetWidth = el.style.getPropertyValue('--w');
          el.style.width = '0%';
          setTimeout(() => {
            el.style.width = targetWidth;
            el.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
          }, 200);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.3 }
  );

  bars.forEach(bar => observer.observe(bar));
})();

// =============================================
// CARD TILT EFFECT
// =============================================
(function initCardTilt() {
  const cards = document.querySelectorAll('.project-card, .arch-card, .bento-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -4;
      const rotateY = ((x - cx) / cx) * 4;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
    });
  });
})();

// =============================================
// SMOOTH SCROLL FOR ALL ANCHOR LINKS
// =============================================
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

// =============================================
// HERO INITIAL ANIMATION ON LOAD
// =============================================
(function initHeroEntrance() {
  const heroElements = document.querySelectorAll('.hero .reveal-up');

  heroElements.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, 300 + i * 120);
  });
})();

// =============================================
// BENTO GRID HOVER GLOW
// =============================================
(function initBentoGlow() {
  const grid = document.querySelector('.bento-grid');
  if (!grid) return;

  grid.addEventListener('mousemove', (e) => {
    const cards = grid.querySelectorAll('.bento-card');
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
})();

// =============================================
// TERMINAL CURSOR FLICKER
// =============================================
(function initCursorFlicker() {
  const logoBrackets = document.querySelectorAll('.logo-bracket');
  setInterval(() => {
    logoBrackets.forEach(b => {
      b.style.opacity = b.style.opacity === '0.3' ? '1' : '0.3';
    });
  }, 2500);
})();

// =============================================
// TIMELINE ITEM STAGGER
// =============================================
(function initTimelineStagger() {
  const items = document.querySelectorAll('.timeline-item');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = parseInt(entry.target.dataset.delay || '0');
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, idx * 150);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach(item => observer.observe(item));
})();

// =============================================
// SECTION ENTRY GLOW SWEEP
// =============================================
(function initSectionGlow() {
  const sections = document.querySelectorAll('section');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.setProperty('--section-progress', '1');
        }
      });
    },
    { threshold: 0.15 }
  );

  sections.forEach(s => observer.observe(s));
})();

// =============================================
// EVOLUTION NODE HOVER
// =============================================
(function initEvoNodes() {
  const nodes = document.querySelectorAll('.evo-node');
  nodes.forEach(node => {
    node.addEventListener('mouseenter', () => {
      nodes.forEach(n => n.style.opacity = '0.5');
      node.style.opacity = '1';
    });
    node.addEventListener('mouseleave', () => {
      nodes.forEach(n => n.style.opacity = '1');
    });
  });
})();
