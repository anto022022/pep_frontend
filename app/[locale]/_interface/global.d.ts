export {};

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
    gtag?: (...args: any[]) => void;
  }

  type Props = {
    params: Promise<{ category: string; locale: string }>;
  };
}
