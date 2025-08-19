/* =========================================
   JS interactions
   ========================================= */

const $ = (q, c = document) => c.querySelector(q);
const $$ = (q, c = document) => Array.from(c.querySelectorAll(q));

/* ---------- Dark Mode ---------- */
(function initDarkMode(){
  const btn = $('#darkModeToggle');
  const pref = localStorage.getItem('darkMode');
  if (pref === 'enabled') document.body.classList.add('dark-mode');
  if (btn) {
    const setIcon = () => {
      btn.innerHTML = document.body.classList.contains('dark-mode')
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
    };
    setIcon();
    btn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      localStorage.setItem('darkMode', document.body.classList.contains('dark-mode') ? 'enabled' : 'disabled');
      setIcon();
    });
  }
})();

/* ---------- Mobile Menu ---------- */
(function initMobileMenu(){
  const btn = $('#menuBtn');
  const menu = $('#mobileMenu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', menu.classList.contains('open') ? 'true' : 'false');
  });
  $$('.m-link', menu).forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
})();

/* ---------- Lightbox ---------- */
(function initLightbox(){
  const items = $$('#gallery .g-item a');
  if (!items.length) return;
  const overlay = $('#lightbox');
  const img = $('#lbImg');
  const cap = $('#lbCap');
  const closeBtn = $('#lbClose');
  const prevBtn = $('#lbPrev');
  const nextBtn = $('#lbNext');
  let index = 0;

  const open = (i) => {
    index = i;
    const a = items[index];
    img.src = a.getAttribute('href');
    img.alt = a.getAttribute('data-caption') || '';
    cap.textContent = a.getAttribute('data-caption') || '';
    overlay.classList.remove('hidden');
  };
  const close = () => overlay.classList.add('hidden');
  const prev = () => open((index - 1 + items.length) % items.length);
  const next = () => open((index + 1) % items.length);

  items.forEach((a, i) => {
    a.addEventListener('click', (e) => { e.preventDefault(); open(i); });
  });
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);
  document.addEventListener('keydown', (e) => {
    if (overlay.classList.contains('hidden')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });
})();

/* ---------- Contact Form (Google Sheets) ---------- */
(function () {
  "use strict";
  const form = document.getElementById("contactForm");
  const msgBox = document.getElementById("formMsg");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name    = document.getElementById("cName")?.value.trim() || "";
    const email   = document.getElementById("cEmail")?.value.trim() || "";
    const subject = document.getElementById("cSubject")?.value.trim() || "";
    const message = document.getElementById("cMessage")?.value.trim() || "";

    if (!name || !email || !message) {
      msgBox.textContent = "Please complete all required fields.";
      msgBox.className = "form-msg error";
      return;
    }

    const scriptURL = "https://script.google.com/macros/s/AKfycbwPYeoXPLUNTGfTuJj6nSCihD350ElHF7YeYDdFf3Rl84clEDg50OEi-5avb8WIQSdniA/exec";

    const body = new URLSearchParams({ name, email, subject, message });

    fetch(scriptURL, { method: "POST", body })
      .then(async (res) => {
        const text = await res.text();
        let json;
        try { json = JSON.parse(text); } catch { json = { result: "error", message: text }; }

        if (!res.ok || json.result !== "success") {
          throw new Error(`${res.status} ${res.statusText} - ${json.message || text}`);
        }

        msgBox.textContent = "Message sent successfully!";
        msgBox.className = "form-msg success";
        form.reset();
      })
      .catch((err) => {
        console.error("Error!", err);
        msgBox.textContent = "There was an error sending your message. Please try again.";
        msgBox.className = "form-msg error";
      });
  });
})();

/* ---------- Reveal on scroll ---------- */
(function initReveal(){
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || !els.length) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('visible');
        io.unobserve(en.target);
      }
    });
  }, {threshold: .1});
  els.forEach(el => io.observe(el));
})();

/* ---------- Hover Glow ---------- */
(function hoverGlow(){
  $$('.card').forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      card.style.setProperty('--mx', `${x}%`);
    });
  });
})();

/* ---------- Back to Top ---------- */
(function backToTop(){
  const btn = $('#toTop');
  if (!btn) return;
  const toggle = () => btn.classList[window.scrollY > 600 ? 'add' : 'remove']('show');
  toggle();
  window.addEventListener('scroll', toggle);
})();

/* ---------- CV Dialog ---------- */
(function cvDialog(){
  const dialog = $('#cvDialog');
  const openBtn = $('#openCV');
  const openMobile = $('#openCVMobile');
  const closeBtn = $('#closeCV');

  if (!dialog) return;
  const open = () => { if (typeof dialog.showModal === 'function') dialog.showModal(); else window.open('MY CV_0.1.pdf', '_blank'); };
  const close = () => dialog.close();

  openBtn && openBtn.addEventListener('click', open);
  openMobile && openMobile.addEventListener('click', (e)=>{ e.preventDefault(); open(); $('#mobileMenu')?.classList.remove('open'); });
  closeBtn && closeBtn.addEventListener('click', close);
})();

/* ---------- Footer Year ---------- */
(function year(){
  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();
})();
