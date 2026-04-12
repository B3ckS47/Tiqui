/* ============================================================
   TIQUI — auth.js
   Session-Verwaltung, Login, Logout, Auth-Guard
   ============================================================ */

import { supabase } from './supabase.js';

/* ---- Dynamischer Basis-Pfad (lokal + GitHub Pages) ---- */
function getBase() {
  if (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost') {
    return '/';
  }
  const parts = window.location.pathname.split('/');
  return parts[1] ? `/${parts[1]}/` : '/';
}

/* ---- Session abrufen ---- */
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/* ---- Aktuellen User abrufen ---- */
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

/* ---- Login ---- */
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

/* ---- Logout ---- */
export async function logout() {
  await supabase.auth.signOut();
  window.location.href = getBase() + 'pages/login.html';
}

/* ---- Auth-Guard ---- */
export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    window.location.href = getBase() + 'pages/login.html';
    return null;
  }
  return session;
}

/* ---- Admin-Guard ---- */
export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || !user.is_admin) {
    window.location.href = getBase() + 'pages/dashboard.html';
    return null;
  }
  return user;
}

/* ---- Redirect wenn bereits eingeloggt ---- */
export async function redirectIfLoggedIn() {
  const session = await getSession();
  if (session) {
    window.location.href = getBase() + 'pages/dashboard.html';
  }
}

/* ---- Auth-State-Listener ---- */
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
}
