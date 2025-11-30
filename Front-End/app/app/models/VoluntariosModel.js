import { supabase } from '../../scripts/supabaseClient';

export const VoluntariosModel = {
  async getVolunteers() {
    try {
      const { data, error } = await supabase
        .from('user_events')
        .select(`
          user_id,
          event_id,
          users ( nombre, apellido, email ),
          events ( date, description )
        `)
        // los más recientes primero
        .order('date', { foreignTable: 'events', ascending: false });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error("Error fetching voluntarios:", error);
      return { data: [], error: error.message };
    }
  }
};
