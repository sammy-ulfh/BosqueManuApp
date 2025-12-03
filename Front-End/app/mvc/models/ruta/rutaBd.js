import { supabase } from "../supabase/supabaseClient";

export async function startUserRoute(route_id) {
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    console.log("No user logged in");
    return { error: "User not logged in" };
  }

  const { data, error } = await supabase
    .from("user_routes")
    .insert({
      user_id: user.id,
      route_id,
      status: "in_progress",
    })
    .select()
    .single();

  if (error) {
    console.log("Error starting route:", error);
    return { error };
  }

  return { data };
}

export async function finishUserRoute(routeSessionId) {
  try {
    const finished_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("user_routes")
      .update({ status: "completed", end_time: finished_at })
      .eq("id", routeSessionId)
      .select()
      .single();

    if (error) {
      console.log("Error finishing route:", error);
      return { error };
    }

    return { data };
  } catch (err) {
    console.log("Unexpected error finishing route:", err);
    return { error: err };
  }
}
