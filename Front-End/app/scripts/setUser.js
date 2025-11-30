import { supabase } from './supabaseClient'

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

    if (!authData?.user) {
        throw new Error("El usuario fue creado, pero no se devolvió la sesión.");
    }

    const { data, error } = await supabase.from('users').insert([
      {
        auth_id: authData.user.id,
        rol: 1,
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
    console.error("Error en setUser:", error);
    return { data: null, error };
  }
}
