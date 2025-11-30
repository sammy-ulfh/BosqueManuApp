import { supabase } from '../../scripts/supabaseClient';

export const CoursesModel = {
  async createCourse({ description, date, limit }) {
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert([
          {
            description: description,
            date: date,
            limite: parseInt(limit),
            registros: 0 // Inicia con 0 inscritos
          }
        ])
        .select();

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      console.error("Error creating course:", error);
      return { success: false, error: error.message };
    }
  }
};
