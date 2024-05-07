export const getBaseUrl = () => {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const assignRedirectUrl = ({
  goToPageUrl,
  redirectUrl,
  baseUrl = getBaseUrl(),
}: {
  goToPageUrl: string;
  redirectUrl: string;
  baseUrl?: string;
}): string => {
  const url = new URL(goToPageUrl, baseUrl);
  url.searchParams.set("redirectUrl", redirectUrl);
  return url.toString();
};

export const getRedirectUrlOrDefault = (url: string): string => {
  const redirectUrl = new URL(url).searchParams.get("redirectUrl");
  return redirectUrl ? redirectUrl : url;
};

export function getInitials(name: string): string {
  const parts: string[] = name.split(" ");
  const initials: string[] = parts.map((part) => part.charAt(0));
  return initials.join("").toUpperCase();
}
