/* ============================================================
   TIQUI — auth.js
   Authentifizierung, Session-Management, Guards
   ============================================================ */

import { supabase } from './supabase.js';

/* Basis-URL ermitteln — funktioniert lokal und auf GitHub Pages */
function getBase() {
  const path = window.location.pathname;
  // GitHub Pages: /Tiqui/pages/... → base ist /Tiqui/
  const match = path.match(/^(\/[^/]+\/)/);
  if (match && match[1] !== '/') {
    // Prüfen ob es wirklich ein Repo-Unterordner ist (nicht localhost root)
    const loc = window.location.hostname;
    if (loc.includes('github.io')) return match[1];
  }
  // Lokal: Live Server unter 127.0.0.1:5500
  return '/';
}

function goTo(page) {
  window.location.href = getBase() + page;
}

/* ---- Login ---- */
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

/* ---- Session holen ---- */
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/* ---- Auth Guard: Nur eingeloggte User ---- */
export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    goTo('pages/login.html');
    return null;
  }
  return session;
}

/* ---- Redirect wenn bereits eingeloggt ---- */
export async function redirectIfLoggedIn() {
  const session = await getSession();
  if (session) {
    goTo('pages/dashboard.html');
  }
}

/* ---- Aktuellen User aus DB holen ---- */
export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (error) return null;
  return data;
}

/* ---- Logout ---- */
export async function logout() {
  await supabase.auth.signOut();
  goTo('pages/login.html');
}
