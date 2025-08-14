// ---------- Theme (Dark Mode Toggle) ----------
const darkBtn = document.getElementById('darkModeToggle');

function showSun() {
  const sun = darkBtn?.querySelector('.fa-sun');
  const moon = darkBtn?.querySelector('.fa-moon');
  if (sun && moon) { sun.style.display = 'inline-block'; moon.style.display = 'none'; }
}

function showMoon() {
  const sun = darkBtn?.querySelector('.fa-sun');
  const moon = darkBtn?.querySelector('.fa-moon');
  if (sun && moon) { sun.style.display = 'none'; moon.style.display = 'inline-block'; }
}

function applySavedTheme() {
  const saved = localStorage.getItem('theme'); // 'light' | 'dark'
  const isDark = saved === 'dark';
  document.body.classList.toggle('dark-mode', isDark);
  document.body.dataset.theme = isDark ? 'dark' : 'light';
  if (isDark) showSun(); else showMoon();
}

applySavedTheme();

darkBtn?.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark-mode');
  document.body.dataset.theme = isDark ? 'dark' : 'light';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  if (isDark) showSun(); else showMoon();
});

// ---------- Theme ----------
const themeBtn = document.getElementById('theme');
if (localStorage.getItem('theme')) {
  document.body.dataset.theme = localStorage.getItem('theme');
}
themeBtn?.addEventListener('click', () => {
  const t = document.body.dataset.theme === 'light' ? 'dark' : 'light';
  document.body.dataset.theme = t;
  localStorage.setItem('theme', t);
});

// ---------- Mobile Menu ----------
const menu = document.getElementById('menu');
const mobile = document.getElementById('mobile');
menu?.addEventListener('click', ()=>{
  mobile.style.display = mobile.style.display === 'block' ? 'none' : 'block';
});
mobile?.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=> mobile.style.display='none'));

// ---------- Smooth Scroll ----------
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id = a.getAttribute('href').slice(1);
    // If Contact tab, scroll to footer instead
    if (id === 'contact') {
      e.preventDefault();
      document.querySelector('footer').scrollIntoView({behavior:'smooth', block:'start'});
      history.replaceState(null, '', '#contact');
      return;
    }
    const el = document.getElementById(id);
    if(el){
      e.preventDefault();
      el.scrollIntoView({behavior:'smooth', block:'start'});
      history.replaceState(null, '', '#'+id);
    }
  });
});

// ---------- Back to top ----------
const toTop = document.getElementById('toTop');
const year = document.getElementById('year');
year.textContent = new Date().getFullYear();
const onScroll = ()=>{
  if (window.scrollY > 400) toTop.classList.add('show'); else toTop.classList.remove('show');
};
document.addEventListener('scroll', onScroll, {passive:true});
onScroll();

// ---------- CV Dialog ----------
const cvDialog = document.getElementById('cvDialog');
const openCV = document.getElementById('open-cv');
const openCVm = document.getElementById('open-cv-mobile');
const closeCV = document.getElementById('closeCV');
const openIt = (e)=>{ e && e.preventDefault(); cvDialog.showModal(); };
openCV && openCV.addEventListener('click', openIt);
openCVm && openCVm.addEventListener('click', openIt);
closeCV && closeCV.addEventListener('click', ()=>cvDialog.close());

// ---------- Reveal on scroll ----------
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){ entry.target.classList.add('visible'); io.unobserve(entry.target); }
  });
},{threshold:.25});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// ---------- Fancy Card Mouse Glow & Tilt ----------
document.querySelectorAll('.card').forEach(card=>{
  card.addEventListener('pointermove', (e)=>{
    const rect = card.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 100;
    card.style.setProperty('--mx', `${mx}%`);
  });
});
document.querySelectorAll('.tilt').forEach(card=>{
  card.addEventListener('mousemove', (e)=>{
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const rx = ((y - r.height/2) / r.height) * -6;
    const ry = ((x - r.width/2) / r.width) * 6;
    card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  card.addEventListener('mouseleave', ()=>{
    card.style.transform = '';
  });
});

// ---------- Contact Form → Google Sheets (Apps Script) ----------
// 1) Create a Google Sheet
// 2) Extensions → Apps Script, paste sample below, deploy as Web App (Anyone)
// 3) Replace the URL below with your deployed Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxIJAbInlbPfE6GkFBcAl81HfaRL50JLjcTYfZExooHtMuAvpcs5eAFfV8dCSjTCJPl_g/exec'; // <-- replace
const form = document.getElementById('contactForm');
const msg = document.getElementById('formMsg');

form?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  msg.textContent = 'Sending…';
  msg.className = 'form-msg';
  try{
    const data = new FormData(form);
    const res = await fetch(GOOGLE_SCRIPT_URL, { method:'POST', body:data, mode:'no-cors' });
    // With no-cors we assume success
    form.reset();
    msg.textContent = 'Thanks! Your message has been sent.';
    msg.classList.add('success');
  }catch(err){
    console.error(err);
    msg.textContent = 'Sorry, something went wrong. Please try again later.';
    msg.classList.add('error');
  }
});

/*
--------- Sample Google Apps Script (Code.gs) ---------
function doPost(e) {
  const sheet = SpreadsheetApp.openById('YOUR_SHEET_ID').getSheetByName('Sheet1');
  const d = new Date();
  const name = e.parameter.name || '';
  const email = e.parameter.email || '';
  const subject = e.parameter.subject || '';
  const message = e.parameter.message || '';
  sheet.appendRow([d, name, email, subject, message]);
  return ContentService.createTextOutput('OK').setMimeType(ContentService.MimeType.TEXT);
}
------------------------------------------------------
After saving:
- Deploy → New deployment → Type: Web app
- Execute as: Me
- Who has access: Anyone
- Copy the Web app URL and paste into GOOGLE_SCRIPT_URL above.
*/
