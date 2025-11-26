import { supabase } from "@/mvc/models/supabase/supabaseClient";

// Validación de contraseña (igual que en signup)
function validatePassword(pwd: string) {
  const minLength = /.{8,}/;
  const upper = /[A-Z]/;
  const lower = /[a-z]/;
  const number = /[0-9]/;
  const special = /[^A-Za-z0-9]/;

  return (
    minLength.test(pwd) &&
    upper.test(pwd) &&
    lower.test(pwd) &&
    number.test(pwd) &&
    special.test(pwd)
  );
}

export async function updatePassword(currentPassword: string, newPassword: string) {
  try {
    // Validar nueva contraseña
    if (!validatePassword(newPassword)) {
      return { error: new Error("La nueva contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.") };
    }

    // obtener la sesión
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
