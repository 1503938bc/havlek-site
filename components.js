/**
 * Shared nav + footer injection.
 * Each page sets:
 *   <html data-root=".">          (root pages)
 *   <html data-root="..">         (blog/ pages)
 *   <body data-page="services">   (active nav item)
 */
(function () {
  const R    = document.documentElement.dataset.root || '.';
  const page = document.body.dataset.page || '';

  const navLinks = [
    { id: 'ai-services',   label: 'AI Services',   href: `${R}/services.html` },
    { id: 'portfolio',     label: 'Portfolio',      href: `${R}/portfolio.html` },
    { id: 'testimonials',  label: 'Testimonials',   href: `${R}/testimonials.html` },
    { id: 'blog',          label: 'Blog',           href: `${R}/blog.html` },
    { id: 'about',         label: 'About',          href: `${R}/about.html` },
  ];

  function navItem({ id, label, href }) {
    const active = (page === id) ? ' is-active' : '';
    return `<li><a href="${href}" data-nav="${id}" class="${active}">${label}</a></li>`;
  }

  const NAV = `
<div class="site-chrome" id="siteChrome">
  <div class="topbar">
    <div class="container">
      <div class="topbar-inner">
        <span><span class="coral-pill"><span class="pulse"></span> AI integration services now available</span></span>
        <span style="display:flex;gap:24px;">
          <span>Web · Mobile · E-Commerce · AI</span>
          <span><b>Vancouver, Canada</b></span>
        </span>
        <span><a class="topbar-link" href="${R}/contact.html">Book free audit →</a></span>
      </div>
    </div>
  </div>
  <div class="nav">
    <div class="container">
      <div class="nav-inner">
        <a href="${R}/index.html" class="brand">
          <img src="${R}/images/logo-trans.png" alt="Havlek" class="brand-logo-img" />
        </a>
        <nav aria-label="Main navigation">
          <ul class="nav-links">${navLinks.map(navItem).join('')}</ul>
        </nav>
        <div class="nav-side">
          <a href="${R}/contact.html" class="btn btn-outline">Contact</a>
          <a href="${R}/contact.html" class="btn btn-primary">Free AI Audit</a>
        </div>
        <button class="nav-toggle" aria-label="Toggle menu" onclick="toggleMobileMenu()">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
    <div class="nav-mobile" id="navMobile">
      ${navLinks.map(({ label, href }) => `<a href="${href}" onclick="toggleMobileMenu()">${label}</a>`).join('')}
      <a href="${R}/contact.html" onclick="toggleMobileMenu()">Contact</a>
      <a href="${R}/contact.html" class="btn btn-primary" onclick="toggleMobileMenu()">Free AI Audit</a>
    </div>
  </div>
</div>`;

  const FOOTER = `
<footer class="footer" role="contentinfo">
  <div class="container">
    <div class="footer-inner">
      <div class="footer-brand">
        <a href="${R}/index.html" class="brand footer-brand-logo">
          <img src="${R}/images/logo-trans.png" alt="Havlek" class="brand-logo-img brand-logo-invert" />
        </a>
        <p>AI solutions & digital innovation for businesses worldwide.<br/>Hong Marketing Inc. — Vancouver, BC, Canada.</p>
        <p style="margin-top:10px;font-size:11px;opacity:.4;">info@havlek.ca</p>
      </div>
      <div class="fl-col">
        <h4>AI Services</h4>
        <a href="${R}/services.html#ai-strategy">AI Strategy & Audit</a>
        <a href="${R}/services.html#chatbots">Chatbots & Agents</a>
        <a href="${R}/services.html#automation">Process Automation</a>
        <a href="${R}/services.html#integration">AI Integration</a>
        <a href="${R}/services.html#analytics">Analytics & Insights</a>
      </div>
      <div class="fl-col">
        <h4>Solutions</h4>
        <a href="${R}/services.html#ecommerce">E-Commerce</a>
        <a href="${R}/services.html#web">Web Development</a>
        <a href="${R}/services.html#mobile">Mobile Apps</a>
        <a href="${R}/services.html#cloud">Cloud Infrastructure</a>
        <a href="${R}/services.html#marketing">Digital Marketing</a>
      </div>
      <div class="fl-col">
        <h4>Company</h4>
        <a href="${R}/about.html">About Havlek</a>
        <a href="${R}/portfolio.html">Portfolio</a>
        <a href="${R}/photo-to-video/">Photo to Video — our iOS app</a>
        <a href="${R}/testimonials.html">Testimonials</a>
        <a href="${R}/blog.html">Blog</a>
        <a href="${R}/contact.html">Contact Us</a>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <div class="container">
      <span>© ${new Date().getFullYear()} Hong Marketing Inc. (DBA Havlek). All rights reserved.</span>
      <span>Surrey / Vancouver, BC · Canada</span>
    </div>
  </div>
</footer>`;

  // Inject into placeholders
  const navEl    = document.getElementById('site-nav');
  const footerEl = document.getElementById('site-footer');
  if (navEl)    navEl.innerHTML    = NAV;
  if (footerEl) footerEl.innerHTML = FOOTER;

  // Scroll behaviour (condensed glass pill)
  const chrome = () => document.getElementById('siteChrome');
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const c = chrome(); if (!c) return;
    const y = window.scrollY;
    c.classList.toggle('is-condensed', y > 60);
    c.classList.toggle('is-hidden',    y > lastY && y > 200);
    lastY = y;
  }, { passive: true });

  // Mobile menu
  window.toggleMobileMenu = function () {
    const m = document.getElementById('navMobile');
    if (m) m.classList.toggle('open');
  };

  // Close mobile menu on outside click
  document.addEventListener('click', e => {
    const c = chrome();
    const m = document.getElementById('navMobile');
    if (c && m && !c.contains(e.target)) m.classList.remove('open');
  });

  // Smooth anchor scroll (offset for fixed nav)
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href*="#"]');
    if (!a) return;
    const [pagePart, hash] = a.getAttribute('href').split('#');
    if (!hash) return;
    // Only smooth-scroll if same page or empty page part
    const samePage = !pagePart || pagePart === '' || window.location.pathname.endsWith(pagePart);
    if (!samePage) return;
    const el = document.getElementById(hash);
    if (!el) return;
    e.preventDefault();
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
  });

  // Scroll-reveal
  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('is-visible'), (entry.target.dataset.delay || 0));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('[data-reveal]').forEach((el, i) => {
    el.dataset.delay = (i % 4) * 80;
    observer.observe(el);
  });
})();
