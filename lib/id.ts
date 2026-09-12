// crypto.randomUUID() is only exposed in secure contexts (HTTPS or
// localhost). Mobile Safari treats a plain http://<lan-ip>:3000 dev URL as
// insecure, so the function is undefined there — this falls back to a
// manually built UUID v4 string in that case.
export function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
