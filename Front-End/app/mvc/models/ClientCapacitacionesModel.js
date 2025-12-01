import { supabase } from './supabase/supabaseClient';
import { getCurrentUser } from './auth/auth';

export const ClientCapacitacionesModel = {

  async getAvailableCourses() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      const { data, error } = await supabase
        .from('courses')
        .select('id, date, description, registros, limite') 
        .gte('date', todayISO)
        .order('date', { ascending: true });

      if (error) throw error;

      const validCourses = (data || []).filter(course => {
        const occupied = course.registros || 0;
        const limit = course.limite || 0;
        return occupied < limit;
      });

      return { data: validCourses, error: null };
    } catch (err) {
      console.error("Error cargando cursos:", err);
      return { data: [], error: err.message };
    }
  },

  /**
   * Realiza todo el proceso de inscripción
   */
  async registerUserToCourse({ userId, courseId, userName, phone }) {
    try {
      const { error: updateError } = await supabase
        .from('users')
        .update({ number: phone, nombre: userName })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Crea la relación en user_course
      const { error: joinError } = await supabase
        .from('user_course')
        .insert({
          user_id: userId,
          course_id: courseId
        });

      if (joinError) {
        // Código de error de duplicado en Postgres
        if (joinError.code === '23505') throw new Error("Ya estás inscrito en esta capacitación.");
        throw joinError;
      }

      // Incrementar el contador (REGISTRO)
      const { error: rpcError } = await supabase.rpc('increment_course_registros', {
        course_id: courseId
      });

      if (rpcError) throw new Error("El cupo se llenó justo ahora o hubo un error al actualizar el contador.");

      return { success: true, error: null };

    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Obtiene el ID numérico del usuario actual en la tabla publica 'users'
   */
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
        authUser: user 
    };
  }
};
