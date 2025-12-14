// Script/profile.js (updated — shows Full Name & Email after login)
document.addEventListener('DOMContentLoaded', () => {
  const profileDiv = document.getElementById('profileInfo');
  const btnLogout = document.getElementById('btnLogout');
  const btnHome = document.getElementById('btnHome');

  const loggedIn = localStorage.getItem('loggedIn') === 'true';
  const username = (localStorage.getItem('username') || '').trim();

  if (!loggedIn || !username) {
    alert('Please log in first.');
    window.location.href = 'login.html';
    return;
  }

  // get accounts data and try to find the user's record
  const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
  const account = accounts.find(acc => (acc.username || '').toLowerCase() === username.toLowerCase());

  // normalize/full fallback (handle both fullName and fullname keys)
  const fullName = account?.fullName || account?.fullname || localStorage.getItem('fullName') || '';
  const email = account?.email || localStorage.getItem('email') || '';

  const html = [];

  html.push(`
    <div>
      <strong>Username</strong>
      <div>${escapeHtml(username)}</div>
    </div>
  `);

  html.push(`
    <div>
      <strong>Full Name</strong>
      <div>${fullName ? escapeHtml(fullName) : '<em>Not provided</em>'}</div>
    </div>
  `);

  html.push(`
    <div>
      <strong>Email</strong>
      <div>${email ? escapeHtml(email) : '<em>Not provided</em>'}</div>
    </div>
  `);

  // masked password (we don't show actual password)
  html.push(`
    <div>
      <strong>Password</strong>
      <div>********</div>
    </div>
  `);

  profileDiv.innerHTML = html.join('');

  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('username');
      // optional: keep fullName/email/accounts or remove as you prefer
      window.location.href = 'home.html';
    });
  }

  if (btnHome) {
    btnHome.addEventListener('click', () => {
      window.location.href = 'home.html';
    });
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, s => ({
      '&':'&amp;',
      '<':'&lt;',
      '>':'&gt;',
      '"':'&quot;',
      "'":'&#39;'
    }[s]));
  }
});