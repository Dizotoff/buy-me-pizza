const NEXT_PUBLIC_POSTHOG = process.env.NEXT_PUBLIC_POSTHOG;

if (!NEXT_PUBLIC_POSTHOG) {
  throw new Error("NEXT_PUBLIC_POSTHOG is not defined");
}
export const posthogId = process.env.NEXT_PUBLIC_POSTHOG;
export const posthogConfig = {
  api_host: "https://app.posthog.com",
};
