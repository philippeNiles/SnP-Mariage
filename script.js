// ===== CONFIGURATION =====
// Collez ici l'URL de votre Google Apps Script (voir LISEZ-MOI.md, étape 1).
// Tant que c'est vide, le formulaire fonctionne en mode démo (rien n'est enregistré).
const RSVP_URL = "";

// Date et heure de la cérémonie (pour le compte à rebours).
const WEDDING_DATE = new Date("2027-06-12T15:00:00-04:00");
// ==========================

// Navigation
const nav = document.getElementById("nav");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

window.addEventListener("scroll", () => nav.classList.toggle("scrolled", window.scrollY > 20), { passive: true });
navToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", open);
});
navLinks.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

// Compte à rebours
function updateCountdown() {
  const diff = WEDDING_DATE - new Date();
  const el = document.getElementById("countdown");
  if (diff <= 0) {
    el.innerHTML = '<div><span>C\'est aujourd\'hui!</span></div>';
    return;
  }
  const mins = Math.floor(diff / 60000);
  el.querySelector('[data-unit="days"]').textContent = Math.floor(mins / 1440);
  el.querySelector('[data-unit="hours"]').textContent = Math.floor((mins % 1440) / 60);
  el.querySelector('[data-unit="minutes"]').textContent = mins % 60;
}
updateCountdown();
setInterval(updateCountdown, 30000);

// Apparition douce des sections
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".section > *").forEach((el) => {
  el.classList.add("reveal");
  observer.observe(el);
});

// RSVP
const form = document.getElementById("rsvpForm");
const whenYes = form.querySelector(".when-yes");
const whenPlusOne = form.querySelector(".when-plus-one");
const errorEl = document.getElementById("formError");
const submitBtn = document.getElementById("submitBtn");
const thanks = document.getElementById("rsvpThanks");

form.addEventListener("change", () => {
  const attending = form.presence.value === "Oui";
  whenYes.hidden = !attending;
  whenPlusOne.hidden = !(attending && form.accompagne.value === "Oui");
});

function showError(msg, field) {
  errorEl.textContent = msg;
  errorEl.hidden = false;
  if (field) {
    field.classList.add("invalid");
    field.focus();
  }
}

form.addEventListener("input", (e) => {
  e.target.classList.remove("invalid");
  errorEl.hidden = true;
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorEl.hidden = true;

  const nom = form.nom.value.trim();
  const courriel = form.courriel.value.trim();
  const presence = form.presence.value;
  const plusOne = presence === "Oui" && form.accompagne.value === "Oui";

  if (!nom) return showError("Merci d'indiquer votre nom.", form.nom);
  if (!/^\S+@\S+\.\S+$/.test(courriel)) return showError("Merci d'indiquer un courriel valide.", form.courriel);
  if (!presence) return showError("Merci de nous dire si vous serez présent(e).");
  if (plusOne && !form.nomAccompagnateur.value.trim()) {
    return showError("Merci d'indiquer le nom de la personne qui vous accompagne.", form.nomAccompagnateur);
  }

  const data = {
    nom,
    courriel,
    presence,
    nombre: presence === "Oui" ? (plusOne ? 2 : 1) : 0,
    restrictions: presence === "Oui" ? form.restrictions.value.trim() : "",
    accompagnateur: plusOne ? form.nomAccompagnateur.value.trim() : "",
    restrictionsAccompagnateur: plusOne ? form.restrictionsAccompagnateur.value.trim() : "",
    message: form.message.value.trim(),
    website: form.website.value,
  };

  submitBtn.disabled = true;
  submitBtn.textContent = "Envoi en cours…";

  try {
    if (RSVP_URL) {
      // Apps Script ne renvoie pas les en-têtes CORS : on envoie en "no-cors".
      await fetch(RSVP_URL, { method: "POST", mode: "no-cors", body: new URLSearchParams(data) });
    } else {
      console.info("Mode démo — réponse non enregistrée :", data);
      await new Promise((r) => setTimeout(r, 600));
    }
    showThanks(data);
  } catch (err) {
    showError("Oups, l'envoi n'a pas fonctionné. Vérifiez votre connexion et réessayez.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Envoyer ma réponse";
  }
});

function showThanks(data) {
  const prenom = data.nom.split(" ")[0];
  document.getElementById("thanksTitle").textContent = `Merci, ${prenom}!`;
  document.getElementById("thanksText").textContent = data.presence === "Oui"
    ? (data.accompagnateur
        ? `Nous avons hâte de célébrer avec vous et ${data.accompagnateur}!`
        : "Nous avons hâte de célébrer avec vous!")
    : "Vous allez nous manquer. Merci de nous avoir prévenus.";
  form.hidden = true;
  thanks.hidden = false;
  thanks.focus();
}

document.getElementById("rsvpAgain").addEventListener("click", () => {
  thanks.hidden = true;
  form.hidden = false;
  form.nom.focus();
});
