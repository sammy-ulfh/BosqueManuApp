import { supabase } from './supabase/supabaseClient';
import { getCurrentUser } from './auth/auth';

export const ClientVoluntariosModel = {
  /**
   * Obtiene eventos futuros con cupo disponible.
   */
  async getAvailableEvents() {
    try {
      const now = new Date().toISOString();

      const { data, error } = await supabase
        .from('events')
        .select('id, date, description, registros, limite')
        .gt('date', now)
        .lt('registros', 14) 
        .order('date', { ascending: true });

      if (error) throw error;

      return { data: data || [], error: null };
    } catch (error) {
      console.error("Error cargando eventos:", error.message);
      return { data: [], error: error.message };
    }
  },

  async registerUserToEvent({ userId, eventId, userName, phone }) {
    try {
      const { error: updateError } = await supabase
        .from('users')
        .update({ number: phone, nombre: userName })
        .eq('id', userId);

      if (updateError) throw updateError;

      const { error: joinError } = await supabase
        .from('user_events')
        .insert({
          user_id: userId,
          event_id: eventId
        });

      if (joinError) {
        if (joinError.code === '23505') throw new Error("Ya estás registrado en este evento.");
        throw joinError;
      }

      const { error: rpcError } = await supabase.rpc('increment_event_registros', {
        event_id: eventId
      });

      if (rpcError) throw new Error("Hubo un error al actualizar el contador de registros.");

      return { success: true, error: null };

    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async getPublicUserId() {
    const { user } = await getCurrentUser();
    if (!user) return null;

    const { data } = await supabase
        .from('users')
        .select('id, nombre')
        .eq('auth_id', user.id)
        .single();
    
    return { 
        publicId: data?.id, 
        authName: user.user_metadata.full_name || data?.nombre || "",
    };
  }
};
