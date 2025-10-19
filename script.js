// script.js - menu mobile, reveal, forms, avis (localStorage), date footer

// -------------------------------
// Menu mobile
// -------------------------------
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', (!expanded).toString());
    if (!navLinks) return;
    navLinks.style.display = navLinks.style.display === 'flex' ? '' : 'flex';
  });
}

// Fermer le menu sur clic d’un lien
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    if (window.innerWidth <= 700 && navLinks) {
      navLinks.style.display = '';
      if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

// -------------------------------
// Défilement fluide
// -------------------------------
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// -------------------------------
// Animation "reveal" au scroll
// -------------------------------
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// -------------------------------
// Année dynamique dans le footer
// -------------------------------
const yearSpan = document.getElementById('year');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

// -------------------------------
// Gestion des avis (localStorage)
// -------------------------------
const AVIS_KEY = 'codea_avis_vitrine';

function getAvis() {
  try {
    return JSON.parse(localStorage.getItem(AVIS_KEY)) || [];
  } catch (e) {
    return [];
  }
}
function saveAvis(list) { localStorage.setItem(AVIS_KEY, JSON.stringify(list)); }

function escapeHTML(str = '') {
  return String(str).replace(/[&<>"']/g, m => (
    { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[m]
  ));
}

function renderAvisList() {
  const list = getAvis();
  const container = document.getElementById('avis-liste');
  if (!container) return;
  if (list.length === 0) {
    container.innerHTML = '<div class="muted small">Aucun avis pour l’instant — soyez le premier !</div>';
    return;
  }
  container.innerHTML = list.map(a => `
    <div class="avis" role="article">
      <p class="texte">"${escapeHTML(a.message)}"</p>
      <div class="auteur">
        <img src="https://i.pravatar.cc/60?u=${encodeURIComponent(a.prenom)}" alt="Avatar de ${escapeHTML(a.prenom)}">
        <div>
          <h4>${escapeHTML(a.prenom)}</h4>
          <p class="muted small">${'⭐'.repeat(Number(a.note))} • <span class="muted">${new Date(a.date).toLocaleDateString()}</span></p>
        </div>
      </div>
    </div>
  `).join('');
}

// Avis par défaut
(function initDefaultAvis(){
  const cur = getAvis();
  if (cur.length === 0) {
    saveAvis([{
      prenom: 'Claire',
      note: 5,
      message: 'Très bonne communication et site livré rapidement. Parfait pour notre association !',
      date: new Date().toISOString()
    }]);
  }
  renderAvisList();
})();

// Ajout d’un avis
const avisForm = document.getElementById('avis-form');
if (avisForm) {
  avisForm.addEventListener('submit', function(e){
    e.preventDefault();
    const prenom = document.getElementById('prenom').value.trim();
    const note = document.getElementById('note').value;
    const message = document.getElementById('message').value.trim();
    const info = document.getElementById('avis-info');
    if (!prenom || !note || !message) {
      info && (info.textContent = 'Veuillez remplir tous les champs.');
      return;
    }
    const newAvis = { prenom, note, message, date: new Date().toISOString() };
    const list = getAvis();
    list.unshift(newAvis);
    saveAvis(list);
    renderAvisList();
    this.reset();
    info && (info.textContent = 'Merci pour votre avis !');
    setTimeout(()=> info && (info.textContent = ''), 4000);
  });
}

const clearAvisBtn = document.getElementById('clear-avis');
if (clearAvisBtn) {
  clearAvisBtn.addEventListener('click', () => {
    if (confirm('Supprimer tous les avis stockés localement ?')) {
      localStorage.removeItem(AVIS_KEY);
      renderAvisList();
    }
  });
}

// -------------------------------
// Formulaire de contact (sans backend)
// -------------------------------
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e){
    e.preventDefault();
    const nom = document.getElementById('contact-nom').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const msg = document.getElementById('contact-message').value.trim();
    const info = document.getElementById('contact-info');
    if (!nom || !email || !msg) {
      info && (info.textContent = 'Veuillez remplir tous les champs.');
      return;
    }
    info && (info.textContent = 'Merci ! Votre message a bien été pris en compte — nous vous répondrons rapidement.');
    this.reset();
    setTimeout(()=> info && (info.textContent = ''), 6000);
  });
}

// -------------------------------
// Email global (affiché partout)
// -------------------------------
const EMAIL = "codea.development@gmail.com";

// Remplace tous les liens mailto dynamiques
document.querySelectorAll(".email-link").forEach(el => {
  el.href = `mailto:${EMAIL}`;
  el.textContent = EMAIL;
});

// Pour les éléments texte sans lien
document.querySelectorAll(".email-text").forEach(el => {
  el.textContent = EMAIL;
});
// --------------------
// Email global CODEA
// --------------------
document.querySelectorAll('.email-link').forEach(el => {
  el.href = 'mailto:codea.development@gmail.com';
  el.textContent = 'codea.development@gmail.com';
});




