/* =============================================
   JULIANA QUINTAS | FONOAUDIOLOGIA
   JavaScript Principal — script.js
   ============================================= */

'use strict';

/* ============================================
   1. SCROLL REVEAL (Intersection Observer)
   ============================================ */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Uma vez revelado, para de observar (performance)
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  }
);

revealElements.forEach((el) => revealObserver.observe(el));

/* ============================================
   2. HEADER — STICKY COM EFEITO SCROLL
   ============================================ */
const header = document.getElementById('header');

const handleHeaderScroll = () => {
  if (window.scrollY > 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
};

window.addEventListener('scroll', handleHeaderScroll, { passive: true });
handleHeaderScroll(); // Executa ao carregar

/* ============================================
   3. MENU MOBILE — TOGGLE
   ============================================ */
const navToggle = document.getElementById('navToggle');
const navList = document.getElementById('navList');

// Cria overlay dinâmico
const overlay = document.createElement('div');
overlay.classList.add('nav__overlay');
document.body.appendChild(overlay);

const openMenu = () => {
  navList.classList.add('open');
  navToggle.classList.add('open');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  navToggle.setAttribute('aria-expanded', 'true');
};

const closeMenu = () => {
  navList.classList.remove('open');
  navToggle.classList.remove('open');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
  navToggle.setAttribute('aria-expanded', 'false');
};

navToggle.addEventListener('click', () => {
  if (navList.classList.contains('open')) {
    closeMenu();
  } else {
    openMenu();
  }
});

overlay.addEventListener('click', closeMenu);

// Fecha menu ao clicar em link de navegação
navList.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

// Fecha com ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navList.classList.contains('open')) {
    closeMenu();
  }
});

/* ============================================
   4. SMOOTH SCROLL — LINKS DE ANCORAGEM
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const headerHeight = header.offsetHeight;
    const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 8;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth',
    });
  });
});

/* ============================================
   5. LINK ATIVO NO MENU (SCROLL SPY)
   ============================================ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');

const spyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  },
  {
    threshold: 0.3,
    rootMargin: '-80px 0px -60% 0px',
  }
);

sections.forEach((section) => spyObserver.observe(section));

// CSS para link ativo injetado dinamicamente
const activeStyle = document.createElement('style');
activeStyle.textContent = `
  .nav__link.active {
    color: var(--primary);
    background: var(--primary-pale);
  }
`;
document.head.appendChild(activeStyle);

/* ============================================
   6. ANIMAÇÃO COUNTER — HERO STATS
   ============================================ */
const statNumbers = document.querySelectorAll('.stat__number');

const animateCounter = (element) => {
  const rawText = element.textContent.trim();
  const hasPlus = rawText.includes('+');
  const hasDot = rawText.includes('.');
  const target = parseFloat(rawText.replace(/[^0-9.]/g, ''));

  if (isNaN(target)) return;

  const duration = 1800;
  const start = performance.now();

  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);

    // Easing: easeOutCubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = eased * target;

    if (hasDot) {
      element.textContent = current.toFixed(1) + (hasPlus ? '+' : '');
    } else {
      element.textContent = Math.floor(current) + (hasPlus ? '+' : '');
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = rawText; // Restaura valor original exato
    }
  };

  requestAnimationFrame(update);
};

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

statNumbers.forEach((stat) => counterObserver.observe(stat));

/* ============================================
   7. CARDS — EFEITO TILT SUAVE (MOUSE)
   ============================================ */
const cards = document.querySelectorAll('.card');

const isTouchDevice = () =>
  'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (!isTouchDevice()) {
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `translateY(-6px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
      setTimeout(() => {
        card.style.transition = '';
      }, 500);
    });
  });
}

/* ============================================
   8. WHATSAPP FLOAT — APARECE APÓS SCROLL
   ============================================ */
const whatsappFloat = document.querySelector('.whatsapp-float');

const handleWhatsappVisibility = () => {
  if (window.scrollY > 300) {
    whatsappFloat.style.opacity = '1';
    whatsappFloat.style.transform = '';
    whatsappFloat.style.pointerEvents = 'all';
  } else {
    whatsappFloat.style.opacity = '0';
    whatsappFloat.style.transform = 'scale(0.8)';
    whatsappFloat.style.pointerEvents = 'none';
  }
};

// Estado inicial invisível
whatsappFloat.style.opacity = '0';
whatsappFloat.style.transform = 'scale(0.8)';
whatsappFloat.style.pointerEvents = 'none';
whatsappFloat.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';

window.addEventListener('scroll', handleWhatsappVisibility, { passive: true });

/* ============================================
   9. LAZY LOAD — IFRAME DO GOOGLE MAPS
   ============================================ */
const mapIframe = document.querySelector('.map-wrapper iframe');

if (mapIframe) {
  const mapObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const src = mapIframe.getAttribute('src');
          if (src && !mapIframe.src) {
            mapIframe.src = src;
          }
          mapObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  mapObserver.observe(mapIframe);
}

/* ============================================
   10. PARALLAX SUAVE — SHAPES DO HERO
   ============================================ */
const heroShapes = document.querySelectorAll('.shape');
let ticking = false;

const handleParallax = () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      heroShapes.forEach((shape, i) => {
        const speed = (i + 1) * 0.08;
        shape.style.transform = `translateY(${scrollY * speed}px)`;
      });
      ticking = false;
    });
    ticking = true;
  }
};

// Só ativa parallax em telas maiores (performance)
if (window.innerWidth > 768) {
  window.addEventListener('scroll', handleParallax, { passive: true });
}

/* ============================================
   11. INICIALIZAÇÃO
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Dispara reveal para elementos já visíveis no carregamento
  setTimeout(() => {
    const firstVisible = document.querySelectorAll('.hero .reveal');
    firstVisible.forEach((el) => el.classList.add('revealed'));
  }, 100);
});

console.log('%c🩺 Juliana Quintas | Fonoaudiologia', 'color:#7BACA8;font-size:16px;font-weight:bold;');
console.log('%cClínica Fonoaudiológica Comunica — CRFa 1-13490', 'color:#94A3B8;font-size:11px;');
