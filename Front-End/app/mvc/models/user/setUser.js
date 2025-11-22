import { supabase } from '../supabase/supabaseClient'

export async function setUser({
  nombre,
  apellido,
  email,
  password,
  number,
  group_name,
  blood,
  allergies,
  medicines,
  contact
}) {
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    });
    if (authError) throw authError;

    const { data, error } = await supabase.from('users').insert([
      {
        auth_id: authData.user.id,
        nombre,
        apellido,
        email,
        number,
        group_name,
        blood,
        allergies,
        medicines,
        contact
      }
    ]).select();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

