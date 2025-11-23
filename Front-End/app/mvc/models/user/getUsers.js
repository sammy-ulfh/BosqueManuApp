import { supabase } from '@/mvc/models/supabase/supabaseClient';

export async function obtenerUsuarios() {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, nombre, apellido, email, group_name, blood, allergies, medicines, contact, number');

    if (error) throw error;

    console.log('Usuarios:', users);
    return users;
  } catch (err) {
    console.error('Error al obtener usuarios:', err.message);
  }
}

