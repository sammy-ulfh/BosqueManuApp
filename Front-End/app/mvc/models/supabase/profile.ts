import { supabase } from './supabaseClient';

export type UserProfile = {
  id?: string;
  nombre?: string | null;
  apellido?: string | null;
  email?: string | null;
};

export async function getUserProfileByAuthId(authId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, nombre, apellido, email')
      .eq('auth_id', authId)
      .single();

    if (error) {
      console.log('[profile] getUserProfileByAuthId error:', error);
      return null;
    }

    return data as UserProfile;
  } catch (err) {
    console.log('[profile] unexpected error:', err);
    return null;
  }
}
