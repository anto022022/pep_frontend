import HomeWrapperComponent from "@/app/[locale]/(static_pages)/_components/HomeWrapperCompoenent";
import { HomePageSchema } from "@/app/[locale]/_models/SeoSchema";
// import { decodeCountryCookie } from "@/app/[locale]/_utility/decodeCookieUrl";
import { safeJsonLdStringify } from "@/app/[locale]/_utility/seoSchema";
import type { Metadata } from "next";
// import { cookies } from "next/headers";
import Script from "next/script";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // const cookieStore = await cookies();
  // const encodedCountry = cookieStore.get("cr_ctry")?.value;
  // const country = decodeCountryCookie("India", encodedCountry);

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://sandbox.pepagora.org";

  // const title = `Pepagora - ${country} Leading B2B Marketplace for Verified Manufacturers & Suppliers`;
  const title = `Pepagora – AI-Powered Global B2B Marketplace for SMEs`;
  // const description = `Find trusted Manufacturers, Suppliers, Exporters, Importers, Buyers, Wholesalers, and Trade Leads on Pepagora – ${country} leading online B2B marketplace. Source quality products from ${country}, and grow your business now.`;
  const description = `Discover Pepagora, the trusted AI-powered B2B marketplace. Connect with verified suppliers, buyers & partners worldwide. Grow your business with confidence.`;
  const canonicalUrl = `${baseUrl}/${(await params).locale}`;

  const ogImage = `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTvmsx_MsGkKO1KHxFZ4rugYVXzGQ2zbmzgg&s`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${baseUrl}/en`,
        ta: `${baseUrl}/ta`,
        ar: `${baseUrl}/ar`,
        hi: `${baseUrl}/hi`,
        "x-default": `${baseUrl}/en`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Pepagora",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "Pepagora Marketplace",
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
      images: [ogImage],
    },
    other: {
      "fb:app_id": "688881134183469",
    },
  };
}

export default function Page() {
  return (
    <>
      {/* <div
        dangerouslySetInnerHTML={{
          __html: ` <div>
              <h2>Injected HTML</h2>
              <script>
                alert("hacked");
              </script>
            </div>
          `,
        }}
      ></div> */}
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdStringify(HomePageSchema),
        }}
        strategy="afterInteractive"
      />
      <HomeWrapperComponent />
    </>
  );
}
