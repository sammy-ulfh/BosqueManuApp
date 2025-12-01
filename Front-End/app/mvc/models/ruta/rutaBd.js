import { supabase } from "../supabase/supabaseClient";

// Obtener rutas por dificultad
export const getRoutesByDifficulty = async (difficulty) => {
  const { data, error } = await supabase
    .from("routes")
    .select("*")
    .eq("difficulty", difficulty);

  if (error) {
    console.error("Error al obtener rutas:", error);
    return [];
  }

  return data;
};

// Insertar una ruta nueva
export const addRoute = async (route) => {
  const { data, error } = await supabase
    .from("routes")
    .insert([route]);

  if (error) {
    console.error("Error al insertar ruta:", error);
    return null;
  }

  return data;
};

// Eliminar una ruta por ID
export const deleteRoute = async (id) => {
  const { data, error } = await supabase
    .from("routes")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error al eliminar ruta:", error);
    return null;
  }

  return data;
};
