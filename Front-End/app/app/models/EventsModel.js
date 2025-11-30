import { supabase } from '../../scripts/supabaseClient';

export const EventsModel = {
  async createEvent({ description, date, limit }) {
    try {
      const { data, error } = await supabase
        .from('events') // Tabla events
        .insert([
          {
            description: description,
            date: date,
            limite: parseInt(limit),
            registros: 0
          }
        ])
        .select();

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      console.error("Error creating event:", error);
      return { success: false, error: error.message };
    }
  }
};
