import { supabase } from '../../scripts/supabaseClient';

export const CapacitacionesModel = {
  async getUpcomingRegistrations() {
    try {
      const today = new Date().toISOString();

      const { data, error } = await supabase
        .from('user_course')
        .select(`
          course_id,
          user_id,
          users ( nombre, apellido, email ),
          courses!inner ( date, description )
        `)
        // Filtra por la fecha del CURSO mayor o igual a hoy
        .gte('courses.date', today)
        .order('date', { foreignTable: 'courses', ascending: true });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error("Error fetching capacitaciones:", error);
      return { data: [], error: error.message };
    }
  }
};
