import type { Metadata } from "next";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.pepagora.com";
  const path = `${baseUrl}/${locale || "en"}/authenticate`;

  const title = "Supplier & Buyer Authentication | Secure B2B Marketplace";
  const description = "Verify your business identity on Pepagora for a trusted B2B experience. Protect your brand, increase credibility, and trade securely with global partners.";

  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: {
        en: `${baseUrl}/en/authenticate`,
        ta: `${baseUrl}/ta/authenticate`,
        ar: `${baseUrl}/ar/authenticate`,
        hi: `${baseUrl}/hi/authenticate`,
        "x-default": `${baseUrl}/en/authenticate`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/en/authenticate`,
      siteName: "Pepagora",
      images: [
        {
          url: "/images/pepagora-logo.svg",
          width: 1200,
          height: 630,
          alt: "Pepagora",
        },
      ],
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      site: "@pepagora",
      title,
      description,
    },
    other: {
      "fb:app_id": "688881134183469",
    },
  };
}

export default async function AuthLayout({ children }: Props) {
  return children;
}


