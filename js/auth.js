/* ============================================================
   TIQUI — auth.js
   Authentifizierung, Session-Management, Guards
   ============================================================ */

import { supabase } from './supabase.js';

/* Basis-URL ermitteln — funktioniert lokal und auf GitHub Pages */
function getBase() {
  const path = window.location.pathname;
  // Finde den Repo-Root: alles bis einschließlich 'Tiqui/' oder letzter Slash am Root
  const match = path.match(/^(.*?\/(?:Tiqui\/))/i);
  return match ? match[1] : '/';
}

function goTo(page) {
  window.location.href = getBase() + page;
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
