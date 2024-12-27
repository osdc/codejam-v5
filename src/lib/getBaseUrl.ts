export const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"; // dev SSR should use localhost
};
