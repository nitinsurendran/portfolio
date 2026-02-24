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
