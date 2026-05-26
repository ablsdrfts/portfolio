// =============================================
// FORM SUBMISSION
// =============================================
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const msg = document.getElementById('successMsg');

  btn.textContent = 'Sending…';
  btn.disabled = true;

  // Simulate async send — replace with real fetch/EmailJS etc.
  setTimeout(() => {
    btn.textContent = 'Send Message';
    btn.disabled = false;
    msg.classList.add('show');
    e.target.reset();
    setTimeout(() => msg.classList.remove('show'), 5000);
  }, 1200);
}

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
    navLinks.style.background = 'var(--cream)';
    navLinks.style.border = '1px solid var(--warm-2)';
    navLinks.style.borderRadius = '12px';
    navLinks.style.padding = '1rem 1.4rem';
    navLinks.style.boxShadow = '0 8px 24px rgba(176,125,86,0.15)';
    navLinks.style.gap = '1rem';
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.style.display = 'none';
    });
  });
}

// =============================================
// SCROLL — NAV SHADOW
// =============================================
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.nav');
  nav.style.boxShadow = window.scrollY > 10
    ? '0 4px 20px rgba(176,125,86,0.10)'
    : 'none';
});

// =============================================
// SCROLL REVEAL (simple, no lib)
// =============================================
const revealEls = document.querySelectorAll(
  '.project-card, .info-card, .skill-group, .contact-link'
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = `opacity 0.55s ease ${i * 0.06}s, transform 0.55s ease ${i * 0.06}s`;
  observer.observe(el);
});