/** Navigator.connection (Network Information API) is not in TS lib; feature-detect at runtime. */
type ConnectionLike = { saveData?: boolean; effectiveType?: string };

export function prefersLowBandwidth(): boolean {
  if (typeof navigator === "undefined") return false;
  const conn = (navigator as Navigator & { connection?: ConnectionLike }).connection;
  if (!conn) return false;
  if (conn.saveData === true) return true;
  const et = conn.effectiveType;
  if (et === "slow-2g" || et === "2g" || et === "3g") return true;
  return false;
}

/**
 * Decide whether to use video thumbnails on the homepage.
 * Returns false when motion should be reduced or connection is very slow / Save-Data is enabled.
 */
export function shouldUseVideoThumb(): boolean {
  if (typeof window === "undefined") return true;

  // Respect reduced motion preference
  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (prefersReducedMotion) return false;

  // Network Information API – feature-detect
  if (typeof navigator !== "undefined") {
    const conn = (navigator as Navigator & { connection?: ConnectionLike }).connection;
    if (conn) {
      if (conn.saveData === true) return false;
      const et = conn.effectiveType;
      if (et === "slow-2g" || et === "2g") return false;
    }
  }

  // Default: use video thumbnails
  return true;
}

/**
 * Whether heavy 3D (three/fiber/drei + GLB) is allowed.
 * Returns false for prefers-reduced-motion, Save-Data, or slow-2g/2g.
 */
export function shouldAllowHeavy3D(): boolean {
  if (typeof window === "undefined") return true;

  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (prefersReducedMotion) return false;

  if (typeof navigator !== "undefined") {
    const conn = (navigator as Navigator & { connection?: ConnectionLike }).connection;
    if (conn) {
      if (conn.saveData === true) return false;
      const et = conn.effectiveType;
      if (et === "slow-2g" || et === "2g") return false;
    }
  }

  return true;
}
