export type HostKind = "main" | "docs";

export function detectHost(hostname: string): HostKind {
  return hostname.toLowerCase().startsWith("docs.") ? "docs" : "main";
}

export function isLocalHost(hostname: string): boolean {
  const normalized = hostname.toLowerCase();
  return (
    normalized.startsWith("localhost") || normalized.startsWith("127.0.0.1")
  );
}

export function docsCanonical(pathname: string, search = ""): string {
  const clean = pathname === "/" ? "" : pathname;
  return `https://docs.fidan.dev${clean}${search}`;
}

export function mainCanonical(pathname: string, search = ""): string {
  const clean = pathname === "/" ? "" : pathname;
  return `https://fidan.dev${clean}${search}`;
}
