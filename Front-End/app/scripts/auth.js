import { supabase } from './supabaseClient';

export async function loginUser(email, password) {
  // 1. Autenticación básica (Login en auth.users)
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // Si falla la contraseña o el correo, retornamos el error original
  if (error) {
    return { data: null, error };
  }

  // 2. Verificación de Rol en la tabla 'public.users'
  try {
    // IMPORTANTE: Usamos .schema('public') explícitamente.
    // Esto fuerza a Supabase a buscar en TU tabla y evita el conflicto
    // con la tabla interna auth.users, solucionando el error de schema.
    const { data: userProfile, error: profileError } = await supabase
      .schema('public') 
      .from('users')
      .select('rol')
      .eq('email', email)
      .single();

    // Si no se encuentra el perfil o la base de datos da error
    if (profileError || !userProfile) {
      console.log("Error perfil:", profileError);
      await supabase.auth.signOut(); // Cerramos sesión por seguridad
      return { 
        data: null, 
        error: { message: "No se pudo verificar el perfil del usuario." } 
      };
    }

    // 3. Validar Rol (Solo permitimos Rol 1 - Administrador)
    // Nota: Funciona tanto si rol es numérico como si fuera string '1'
    if (userProfile.rol != 1) {
      await supabase.auth.signOut(); // Expulsamos al usuario inmediatamente
      return { 
        data: null, 
        error: { message: "El usuario no es administrador." } 
      };
    }

    // 4. Si es admin, retornamos éxito
    return { data, error: null };

  } catch (err) {
    console.error("Error inesperado validando rol:", err);
    await supabase.auth.signOut();
    return { 
      data: null, 
      error: { message: "Error verificando permisos de administrador." } 
    };
  }
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
