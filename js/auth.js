/* ============================================================
   TIQUI — auth.js
   Session-Verwaltung, Login, Logout, Auth-Guard
   ============================================================ */

import { supabase } from './supabase.js';

/* ---- Session abrufen ---- */
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/* ---- Aktuellen User abrufen (inkl. Profil aus public.users) ---- */
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

/* ---- Login mit E-Mail & Passwort ---- */
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

/* ---- Logout ---- */
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  window.location.href = '/pages/login.html';
}

/* ---- Auth-Guard: Nicht eingeloggte User zur Login-Seite schicken ---- */
export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    window.location.href = '/pages/login.html';
    return null;
  }
  return session;
}

/* ---- Admin-Guard: Nicht-Admins zur Dashboard-Seite schicken ---- */
export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || !user.is_admin) {
    window.location.href = '/pages/dashboard.html';
    return null;
  }
  return user;
}

/* ---- Redirect wenn bereits eingeloggt (für Login/Register-Seiten) ---- */
export async function redirectIfLoggedIn() {
  const session = await getSession();
  if (session) {
    window.location.href = '/pages/dashboard.html';
  }
}

/* ---- Auth-State-Listener (für Echtzeit-Reaktion auf Session-Änderungen) ---- */
export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
}
