// Reuse existing user_routes helpers to avoid needing a separate table
import { startUserRoute, finishUserRoute } from './rutaBd';

/**
 * Start a route tracking session using the existing `user_routes` table.
 * Delegates to `startUserRoute` and returns its result.
 */
export async function startRouteTracking(routeId) {
  try {
    const res = await startUserRoute(routeId);
    if (res?.error) {
      console.error('[routeTracking] startUserRoute error', res.error);
      return { error: res.error };
    }
    // startUserRoute returns { data } where data.id is the session id
    return { data: res.data };
  } catch (err) {
    console.error('[routeTracking] Unexpected error delegating to startUserRoute', err?.stack || err);
    return { error: err };
  }
}

/**
 * Finish a route tracking session using the existing `user_routes` helpers.
 * Delegates to `finishUserRoute`. This current implementation deletes the session
 * (per `rutaBd.js`), so it returns success or error accordingly.
 */
export async function finishRouteTracking(trackingId) {
  try {
    if (!trackingId) {
      const msg = '[routeTracking] finishRouteTracking called without trackingId';
      console.error(msg);
      return { error: msg };
    }

    const res = await finishUserRoute(trackingId);
    if (res?.error) {
      console.error('[routeTracking] finishUserRoute error', res.error);
      return { error: res.error };
    }

    return { data: res };
  } catch (err) {
    console.error('[routeTracking] Unexpected error delegating to finishUserRoute', err?.stack || err);
    return { error: err };
  }
}
