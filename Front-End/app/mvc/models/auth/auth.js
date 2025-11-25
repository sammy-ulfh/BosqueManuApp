import { supabase } from '@/mvc/models/supabase/supabaseClient';

export async function loginUser(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}


/**
 * Sign out
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Get current session
 */
export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

/**
 * Actualizar contraseña con el código de recuperación
 */
export async function updatePassword(password) {
  const { data, error } = await supabase.auth.updateUser({
    password: password,
  });
  return { data, error };
}
