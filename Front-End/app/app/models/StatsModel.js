import { supabase } from '../../scripts/supabaseClient';

export const StatsModel = {
  async getDashboardStats() {
    try {
      const usersPromise = supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .or('rol.neq.1,rol.is.null'); 

      const coursesPromise = supabase
        .from('user_course')
        .select('*', { count: 'exact', head: true });
      
      const volunteersPromise = supabase
        .from('user_events')
        .select('*', { count: 'exact', head: true });
      
      const donationsPromise = supabase
        .from('donaciones')
        .select('amount');

      const [usersRes, coursesRes, volunteersRes, donationsRes] = await Promise.all([
        usersPromise,
        coursesPromise,
        volunteersPromise,
        donationsPromise
      ]);

      if (usersRes.error) throw usersRes.error;
      if (coursesRes.error) throw coursesRes.error;
      if (volunteersRes.error) throw volunteersRes.error;
      if (donationsRes.error) throw donationsRes.error;

      const totalMoney = donationsRes.data.reduce((sum, item) => sum + Number(item.amount || 0), 0);

      return {
        users: usersRes.count || 0,
        courses: coursesRes.count || 0,
        volunteers: volunteersRes.count || 0,
        money: totalMoney,
        error: null
      };

    } catch (error) {
      console.error("StatsModel Error:", error);
      return { users: 0, courses: 0, volunteers: 0, money: 0, error: error.message };
    }
  }
};
