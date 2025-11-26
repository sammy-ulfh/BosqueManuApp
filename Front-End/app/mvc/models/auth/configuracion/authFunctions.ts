import { supabase } from "@/mvc/models/supabase/supabaseClient";

export async function updatePassword(currentPassword: string, newPassword: string) {
  try {
    // obtener la sesion
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { error: new Error("No estás autenticado.") };

    const email = session.user?.email;
    if (!email) {
      return { error: new Error("No se pudo obtener el correo del usuario autenticado.") };
    }

    // Reautenticar con la contraseña actual
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email,
      password: currentPassword,
    });

    if (signInError) {
      return { error: new Error("La contraseña actual es incorrecta.") };
    }

    // Cambiar la contraseña
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) return { error: updateError };

    return { error: null };
  } catch (error: any) {
    return { error };
  }
}
