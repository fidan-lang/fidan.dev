declare global {
  namespace App {
    interface PageData {
      host: "main" | "docs";
      canonicalUrl: string;
      pathname: string;
    }
  }
}

export {};
