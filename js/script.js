/* =========================================
   JS interactions:
   - Dark mode (with localStorage)
   - Mobile menu toggle (mobile-only)
   - Lightbox gallery
   - Contact form validation / fake submit
   - Scroll reveal & hover parallax
   - Back-to-top button
   - CV dialog open/close
   ========================================= */

// Helper: select
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

/* ---------- Mobile Menu (only visible on mobile via CSS) ---------- */
(function initMobileMenu(){
  const btn = $('#menuBtn');
  const menu = $('#mobileMenu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', menu.classList.contains('open') ? 'true' : 'false');
  });
  // close when clicking a link
  $$('.m-link', menu).forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
})();

/* ---------- Lightbox Gallery ---------- */
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

/* ---------- Contact Form (to Google Sheets via Apps Script) ---------- */
(function initContactForm() {
  const form = document.querySelector('#contactForm');
  const msg  = document.querySelector('#formMsg');
  if (!form || !msg) return;

  // Replace with your actual Web App URL
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwIRneC14LAIol1r5C0xVuIMT2G1ucJZSEww0ktMVR72mxzW8GJ7Z0iiOzbvylhgOop/exec";

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = document.querySelector('#cName')?.value.trim();
    const email   = document.querySelector('#cEmail')?.value.trim();
    const subject = document.querySelector('#cSubject')?.value.trim();
    const message = document.querySelector('#cMessage')?.value.trim();

    if (!name || !email || !message) {
      msg.textContent = '⚠️ Please fill in your name, email, and message.';
      msg.className = 'form-msg error';
      return;
    }

    msg.textContent = '⏳ Sending…';
    msg.className = 'form-msg';

    try {
      const res = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message })
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const result = await res.json();
      if (result.result === "success") {
        msg.textContent = "✅ Message sent successfully!";
        msg.className = "form-msg success";
        form.reset();
      } else {
        throw new Error(result.message || "Unknown error from server");
      }
    } catch (err) {
      msg.textContent = "❌ Something went wrong. Please try again.";
      msg.className = "form-msg error";
      console.error("Form error:", err);
    }
  });
})();

/* ---------- Reveal on scroll ---------- */
(function initReveal(){
  const els = document.querySelectorAll('.reveal');  // ✅ fixed
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


/* ---------- Hover lighting for cards ---------- */
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
