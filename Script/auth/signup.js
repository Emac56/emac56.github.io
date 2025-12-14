// Script/signup.js (robust & compatible)
// - flexible button/form detection
// - Enter-key support
// - disables UI while hashing
// - stores accounts with { fullName, email, username, passwordHash }
// - sets localStorage.justSignedUp so login can prefill if desired

document.addEventListener('DOMContentLoaded', () => {
  // find signup trigger: prefer #signupBtn, fallback to .signup-button, fallback to form submit
  const btn =
    document.getElementById('signupBtn') ||
    document.querySelector('.signup-button');

  const form = document.querySelector('form') || null;

  // helper to read fields (works even if form wrapper not present)
  function readFields() {
    return {
      fullName: (document.getElementById('fullName')?.value || '').trim(),
      email: (document.getElementById('email')?.value || '').trim(),
      username: (document.getElementById('newUser')?.value || '').trim(),
      password: (document.getElementById('newPass')?.value || ''),
      confirm: (document.getElementById('confirmPass')?.value || '')
    };
  }

  // prefer form submit if available, otherwise listen to button click
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await handleSignup();
    });
  } else if (btn) {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      await handleSignup();
    });
  } else {
    // fallback: listen for Enter on inputs
    ['fullName', 'email', 'newUser', 'newPass', 'confirmPass'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') {
          ev.preventDefault();
          handleSignup();
        }
      });
    });
  }

  async function handleSignup() {
    // disable UI while working
    const trigger = btn || document.querySelector('button[type="submit"]');
    const origText = trigger?.textContent || '';
    if (trigger) {
      try { trigger.disabled = true; } catch (e) {}
      if (trigger) trigger.textContent = 'Creating...';
    }

    try {
      const { fullName, email, username, password, confirm } = readFields();

      // Basic validations
      if (!fullName) { alert('Please enter your full name.'); return; }
      if (!validateEmail(email)) { alert('Please enter a valid email address.'); return; }
      if (!username) { alert('Please choose a username.'); return; }
      if (password.length < 6) { alert('Password must be at least 6 characters.'); return; }
      if (password !== confirm) { alert('Passwords do not match.'); return; }

      // Load accounts array
      const accounts = JSON.parse(localStorage.getItem('accounts')) || [];

      // Case-insensitive duplicate check
      const usernameLower = username.toLowerCase();
      const emailLower = email.toLowerCase();
      const exists = accounts.some(acc =>
        (acc.username || '').toLowerCase() === usernameLower ||
        (acc.email || '').toLowerCase() === emailLower
      );
      if (exists) {
        alert('Username or email already taken. Choose another.');
        return;
      }

      // Hash password
      const passwordHash = await hashString(password);

      // Push new account
      accounts.push({
        fullName,
        email,
        username,
        passwordHash
      });
      localStorage.setItem('accounts', JSON.stringify(accounts));

      // optional: mark justSignedUp (useful to prefill login)
      try { localStorage.setItem('justSignedUp', username); } catch (e) {}

      alert('Account created successfully! Please log in.');
      window.location.href = 'login.html';
    } finally {
      // restore UI
      if (trigger) {
        try { trigger.disabled = false; } catch (e) {}
        if (trigger) trigger.textContent = origText;
      }
    }
  }

  // simple email validation
  function validateEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  // SHA-256 hash helper (returns hex)
  async function hashString(str) {
    if (!window.crypto || !crypto.subtle) {
      throw new Error('Web Crypto API not available');
    }
    const enc = new TextEncoder();
    const data = enc.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
});