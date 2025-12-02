// Deprecated helper - replaced by local modal banner. Keep noop exports to avoid import errors.
export function subscribe(_cb: (v: boolean) => void) {
  // no-op, return unsubscribe
  return () => {};
}

export function showBanner() {
  // no-op
}

export function hideBanner() {
  // no-op
}

export function isBannerVisible() {
  return false;
}

export default { subscribe, showBanner, hideBanner, isBannerVisible };
