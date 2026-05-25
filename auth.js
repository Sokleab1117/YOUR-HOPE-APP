/* ═══════════════════════════════════════════════════════════════════
   YOUR HOPE — auth.js
   Professional Backend Authentication Version
   ═══════════════════════════════════════════════════════════════════ */

const API_BASE = 'http://localhost:5001/api';

const SESSION_KEY = 'hope_session';
const TOKEN_KEY = 'hope_token';

//* ── SIGN UP ────────────────────────────────────────────────────── */
async function signUp() {

  currentAuthPage = 'signup';

  const fullName = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const confirmPwd = document.getElementById('signup-confirm').value;
  const termsChecked = document.getElementById('signup-terms').checked;

  // Clear messages
  document.getElementById('signup-error').innerHTML = '';
  document.getElementById('signup-success').innerHTML = '';

  // Validation
  if (!fullName || !email || !password || !confirmPwd) {
    showAuthError('Please fill in all fields');
    return;
  }

  if (!validateEmail(email)) {
    showAuthError('Please enter a valid email');
    return;
  }

  if (password.length < 6) {
    showAuthError('Password must be at least 6 characters');
    return;
  }

  if (password !== confirmPwd) {
    showAuthError('Passwords do not match');
    return;
  }

  if (!termsChecked) {
    showAuthError('Please agree to Terms of Service');
    return;
  }

  try {

    const response = await fetch(
      'http://localhost:5001/api/auth/signup',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          full_name: fullName,
          email: email,
          password: password
        })
      }
    );

    const data = await response.json();

    console.log(data);

    if (response.ok) {

      showAuthSuccess('Account created successfully!');

      setTimeout(() => {
        goToSignIn();
      }, 1000);

    } else {

      showAuthError(data.message || 'Signup failed');

    }

  } catch (error) {

    console.error(error);

    showAuthError('Cannot connect to backend');

  }
}

/* ── SIGN IN ────────────────────────────────────────────────────── */
async function logIn(email, password) {

  currentAuthPage = 'signin';

  email = email || document.getElementById('signin-email').value.trim();
  password = password || document.getElementById('signin-password').value;

  // Validation
  if (!email || !password) {
    showAuthError('Please enter email and password');
    return;
  }

  try {

    const response = await fetch(
      `${API_BASE}/auth/login`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          email,
          password
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {

      showAuthError(data.message || 'Login failed');
      return;

    }

    // Save JWT token
    localStorage.setItem(
      TOKEN_KEY,
      data.token
    );

    // Save session
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify(data.user)
    );

    showAuthSuccess('Login successful!');

    setTimeout(() => {
      showMainApp();
    }, 800);

  } catch (error) {

    console.error(error);

    showAuthError('Server error');

  }
}

/* ── SIGN OUT ────────────────────────────────────────────────────── */
function signOut() {

  const modal = document.getElementById('signout-modal');

  if (modal) {
    modal.style.display = 'flex';
  }
}

function confirmSignOut() {

  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(TOKEN_KEY);

  location.reload();
}

function cancelSignOut() {

  const modal = document.getElementById('signout-modal');

  if (modal) {
    modal.style.display = 'none';
  }
}

/* ── SESSION ────────────────────────────────────────────────────── */
function getSession() {

  const data = localStorage.getItem(SESSION_KEY);

  return data ? JSON.parse(data) : null;
}

function getToken() {

  return localStorage.getItem(TOKEN_KEY);
}

function isLoggedIn() {

  return getSession() !== null;
}

/* ── UI HELPERS ─────────────────────────────────────────────────── */
let currentAuthPage = 'signin';

function showAuthError(message) {

  const errorEl = document.getElementById(currentAuthPage + '-error');

  if (errorEl) {

    errorEl.textContent = message;
    errorEl.style.display = 'block';

    setTimeout(() => {
      errorEl.style.display = 'none';
    }, 3000);
  }
}

function showAuthSuccess(message) {

  const successEl = document.getElementById(currentAuthPage + '-success');

  if (successEl) {

    successEl.textContent = message;
    successEl.style.display = 'block';

    setTimeout(() => {
      successEl.style.display = 'none';
    }, 2000);
  }
}

function validateEmail(email) {

  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return re.test(email);
}

function togglePasswordVisibility(inputId) {

  const input = document.getElementById(inputId);

  if (input.type === 'password') {
    input.type = 'text';
  } else {
    input.type = 'password';
  }
}

/* ── PAGE SWITCHING ─────────────────────────────────────────────── */
function showPage(page) {

  currentAuthPage = page;

  document.querySelectorAll('[data-auth-page]').forEach(el => {
    el.style.display = 'none';
  });

  const pageEl = document.querySelector(`[data-auth-page="${page}"]`);

  if (pageEl) {
    pageEl.style.display = 'flex';
  }
}

function goToSignIn() {

  clearAuthForm('signin');
  showPage('signin');
}

function goToSignUp() {

  clearAuthForm('signup');
  showPage('signup');
}

function clearAuthForm(page) {

  const pageEl = document.querySelector(`[data-auth-page="${page}"]`);

  if (!pageEl) return;

  pageEl.querySelectorAll(
    'input[type="text"], input[type="email"], input[type="password"]'
  ).forEach(input => {
    input.value = '';
  });

  const errorEl = document.getElementById(page + '-error');

  if (errorEl) {
    errorEl.style.display = 'none';
  }

  const successEl = document.getElementById(page + '-success');

  if (successEl) {
    successEl.style.display = 'none';
  }
}

/* ── MAIN APP ───────────────────────────────────────────────────── */
function showMainApp() {

  const authContainer = document.getElementById('auth-container');
  const mainApp = document.querySelector('.app');

  if (authContainer) {
    authContainer.style.display = 'none';
  }

  if (mainApp) {
    mainApp.style.display = 'block';
  }

  isSignedUp = true;

  const session = getSession();

  if (session) {

    const nameEl = document.getElementById('user-name');

    if (nameEl) {
      nameEl.textContent = session.full_name || session.fullName;
    }
  }

  if (typeof goTab === 'function') {

    goTab('home');

  } else {

    document.addEventListener(
      'DOMContentLoaded',
      () => goTab('home')
    );
  }
}

/* ── INIT ───────────────────────────────────────────────────────── */
function initAuth() {

  if (isLoggedIn()) {

    if (typeof window !== 'undefined') {

      window.isSignedUp = true;

      const session = getSession();

      if (session) {
        window.userInfo = session;
      }
    }

    showMainApp();

  } else {

    showPage('signin');

  }
}

/* ── PAGE LOAD ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initAuth();
});