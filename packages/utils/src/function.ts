import { StateCity, STATES } from "./states";

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

export function getEmailProviderLink(email: string) {
  const domainMatch = email.match(/@(.+)/);

  if (domainMatch && domainMatch.length > 1) {
    const domain = domainMatch[1];
    return `https://${domain}`;
  } else {
    return null;
  }
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: "accurate" | "normal";
  } = {},
) {
  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate" ? accurateSizes[i] ?? "Bytest" : sizes[i] ?? "Bytes"
  }`;
}

export function filterFilesForUpload(files: (File | string)[]): File[] {
  return files.filter((file) => file instanceof File) as File[];
}

export function separateMediaFilesAndUrls(arr: (File | string)[]): {
  mediaFiles: File[];
  mediaUrls: string[];
  hasFile: boolean;
} {
  let mediaFiles: File[] = [];
  let mediaUrls: string[] = [];
  let hasFile: boolean = false;

  arr.forEach((item) => {
    if (item instanceof File) {
      mediaFiles.push(item);
      hasFile = true;
    } else {
      mediaUrls.push(item);
    }
  });

  return {
    mediaFiles,
    mediaUrls,
    hasFile,
  };
}

export function getLgasByState({
  state,
  stateCities = STATES,
}: {
  state: string;
  stateCities?: StateCity[];
}): string[] | undefined {
  const foundState = stateCities.find(
    (city) => city.name.toLowerCase() === state.toLowerCase(),
  );
  return foundState ? foundState.lgas : undefined;
}
