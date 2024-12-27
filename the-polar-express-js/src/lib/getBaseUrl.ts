export const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.NODE_ENV === "production") {
    return "https://jiit-lost-and-found.vercel.app"; // Replace with your actual URL
  }
  return process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"; // dev SSR should use localhost
};
