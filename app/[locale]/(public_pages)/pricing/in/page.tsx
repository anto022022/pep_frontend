import PricingComponent from "@/app/[locale]/(public_pages)/pricing/PricingComponent";
import "../../../../../public/s/css/pricing.css";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.pepagora.com";
  const path = `${baseUrl}/${locale || "en"}/pricing`;

  const title = "Flexible Pricing Plans for B2B Buyers & Sellers | Pepagora";
  const description = "Choose from affordable pricing plans designed for businesses of all sizes. Get maximum value, connect with global buyers & suppliers, and boost your B2B growth.";

  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: {
        en: `${baseUrl}/en/pricing`,
        ta: `${baseUrl}/ta/pricing`,
        ar: `${baseUrl}/ar/pricing`,
        hi: `${baseUrl}/hi/pricing`,
        "x-default": `${baseUrl}/en/pricing`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/en/pricing`,
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

export default function PricingPage() {
  return (
    <div className="p-l-m-t-body">
      <PricingComponent countryId="IN" />
    </div>
  );
}
