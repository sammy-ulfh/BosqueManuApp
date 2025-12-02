import { supabase } from "../../scripts/supabaseClient";

export const DonationsModel = {
  async getAllDonations() {
    try {
      const { data, error } = await supabase
        .from("donaciones")
        .select(`
          id,
          amount,
          created_at,
          email,
          user_id,
          users(name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data.map((d) => ({
        id: d.id,
        donor: d.users?.name || d.email || "Donador anónimo",
        amount: Number(d.amount),
        date: new Date(d.created_at).toISOString().split("T")[0],
        method: "Tarjeta",
      }));
    } catch (err) {
      console.log("Error fetching donations:", err);
      return [];
    }
  }
};
