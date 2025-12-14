// Script/global.js (final clean version)
document.addEventListener('DOMContentLoaded', () => {
  const navLink = document.getElementById('loginBtn');
  if (!navLink) return;

  const loggedIn = localStorage.getItem('loggedIn') === 'true';
  const username = (localStorage.getItem('username') || '').trim();
  const fullName = (localStorage.getItem('fullName') || '').trim();

  // remove old logout if present (defensive)
  const oldLogout = document.getElementById('logoutLi');
  if (oldLogout) oldLogout.remove();

  if (loggedIn) {
    const showName = fullName || username || 'Profile';

    navLink.innerHTML = `${userSvg()}
      <span class="login-text">${escapeHtml(showName)} • Profile</span>`;

    navLink.href = 'profile.html';
    navLink.title = `${escapeHtml(showName)} — View profile`;
    navLink.setAttribute('aria-label', `${escapeHtml(showName)} profile`);
    navLink.setAttribute('role', 'link');
  } else {
    navLink.innerHTML = `${userSvg()}
      <span class="login-text">Login</span>`;

    navLink.href = 'login.html';
    navLink.title = "Login";
    navLink.setAttribute('aria-label', "Login");
    navLink.setAttribute('role', 'link');
  }
});

// --- helpers ---
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[m]));
}

function userSvg() {
  return `
    <svg width="16" height="16" viewBox="0 0 24 24"
      fill="currentColor" aria-hidden="true"
      style="vertical-align:middle;margin-right:6px;">
      <path d="M12 12c2.7 0 4.8-2.2 4.8-4.8S14.7 2.4 12 2.4
               7.2 4.6 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6
               1.6-9.6 4.8v1.6h19.2v-1.6c0-3.2-6.4-4.8-9.6-4.8z"/>
    </svg>`;
}

// available for other pages (profile logout button)
function doLogout() {
  localStorage.removeItem('loggedIn');
  localStorage.removeItem('username');
  localStorage.removeItem('fullName');
  localStorage.removeItem('email');

  window.location.href = 'home.html';
}

// globalSaveData.js

// Load cart from localStorage or create an empty one
// GLOBAL CART STORAGE
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}