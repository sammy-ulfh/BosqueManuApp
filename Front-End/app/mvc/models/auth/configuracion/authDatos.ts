import { supabase } from "../../supabase/supabaseClient";

//ACTUALIZAR USUARIO (EDITAR DATOS)
export async function actualizarUsuario(auth_id: string, updates: any) {
  try {
    const { error } = await supabase
      .from("users")
      .update(updates)
      .eq("auth_id", auth_id);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error) {
    return { success: false, error };
  }
}
export async function obtenerUsuarios() {
  try {
    const { data, error } = await supabase
      .from("users")
      .select(
        "id, nombre, apellido, email, group_name, blood, allergies, medicines, contact, number"
      );

    if (error) throw error;

    return data;
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
  }
}
