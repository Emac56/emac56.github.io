// Script/login.js (aligned to your login.html)
// - detects the FIRST .login-button = Login button
// - compares hashed password
// - loads username/fullName/email correctly

document.addEventListener("DOMContentLoaded", () => {

  // get first login button ONLY (hindi yung sign up / home)
  const btn = document.querySelector(".login-button");
  if (!btn) return;

  btn.addEventListener("click", async (e) => {
    e.preventDefault();

    const username = (document.getElementById("username")?.value || "").trim();
    const password = (document.getElementById("password")?.value || "");

    if (!username || !password) {
      alert("Please enter username and password.");
      return;
    }

    const accounts = JSON.parse(localStorage.getItem("accounts")) || [];

    if (accounts.length === 0) {
      alert("No account found. Please sign up first.");
      window.location.href = "signup.html";
      return;
    }

    // find account
    const idx = accounts.findIndex(
      acc => (acc.username || "").toLowerCase() === username.toLowerCase()
    );

    if (idx === -1) {
      alert("Username not found. Please sign up first.");
      return;
    }

    const account = accounts[idx];

    // check hashed password
    const enteredHash = await hashString(password);

    if (account.passwordHash) {
      if (enteredHash !== account.passwordHash) {
        alert("Incorrect password.");
        return;
      }
    } else {
      // old accounts (plaintext)
      if (account.password !== password) {
        alert("Incorrect password.");
        return;
      }

      // migrate account to hashing
      account.passwordHash = enteredHash;
      delete account.password;
      accounts[idx] = account;
      localStorage.setItem("accounts", JSON.stringify(accounts));
    }

    // save login session
    
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("username", account.username);
    if (account.fullName) localStorage.setItem("fullName", account.fullName);
    if (account.email) localStorage.setItem("email", account.email);

    window.location.href = "home.html";
  });

  // SHA-256 hashing
  async function hashString(str) {
    const data = new TextEncoder().encode(str);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, "0")).join("");
  }
});