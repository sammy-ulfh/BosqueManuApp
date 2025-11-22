import { supabase } from '../user/supabaseClient';
import { AuthError } from '@supabase/supabase-js';

export async function loginUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}


/**
 * Sign out
 */
export async function signOut(): Promise<{ error: AuthError | null }> {
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
export async function updatePassword(password: string) {
  const { data, error } = await supabase.auth.updateUser({
    password: password,
  });
  return { data, error };
}
