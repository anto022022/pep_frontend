import ProductDetailPage from "@/app/[locale]/_components/MarketComponents/ProductDetailPage/ProductDetailPage";
import {
  parseCategoryString,
  toCamelCase,
} from "@/app/[locale]/_hooks/utility";
import { decodeCountryCookie } from "@/app/[locale]/_utility/decodeCookieUrl";
import { cookies } from "next/headers";

type Props = {
  params: Promise<{ product: string; locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { product } = await params;
  const { name } = parseCategoryString(product);
  const camelName = toCamelCase(name);

  // Use location data from cookies (set by layout)
  const cookieStore = await cookies();
  const countryCookie = cookieStore.get("cr_ctry")?.value;
  const country = decodeCountryCookie("", countryCookie);

  const cityCookie = cookieStore.get("cr_cty")?.value;
  const city = decodeCountryCookie("", cityCookie);

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://sandbox.pepagora.org";
  const canonicalUrl = `${baseUrl}/${(await params).locale}/p/${product}`;

  // Handle cases where location data might be missing
  const locationText =
    city && country
      ? `in ${city}, ${country}`
      : city
      ? `in ${city}`
      : country
      ? `in ${country}`
      : "";

  const title = `${camelName} Manufacturer – Supplier, Wholesaler and Exporters  ${locationText} | Pepagora`;
  const description = `Find ${camelName} Manufacturer – Supplier, Wholesaler and Exporters  ${locationText}. Enquiry Now!`;
  const ogImage = `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTvmsx_MsGkKO1KHxFZ4rugYVXzGQ2zbmzgg&s`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${baseUrl}/en/p/${product}`,
        ta: `${baseUrl}/ta/p/${product}`,
        ar: `${baseUrl}/ar/p/${product}`,
        hi: `${baseUrl}/hi/p/${product}`,
        "x-default": `${baseUrl}/en/p/${product}`,
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
          alt: name,
        },
      ],
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      site: "@pepagora",
      title: `${title}`,
      description,
      images: [ogImage],
    },
    // Optional: Facebook App ID
    other: {
      "fb:app_id": "688881134183469",
    },
  };
}

export default async function ProductPage({ params }: Props) {
  // const productSlug = (await params).product;
  // const productData = { name: "this is a product" };
  const { product } = await params;

  // let productData: PreviewData & UserInfoAddition;
  const { id } = parseCategoryString(product);
  // try {
  //   const response = await serverFetcher(`markets/live-product/${id}`);
  //   productData = response.data;
  //   if (!productData || !productData.productName)
  //     throw new Error("Invalid data");
  // } catch (error) {
  //   // handle fallback or 404
  //   console.error("Failed to fetch category:", error);
  //   return <>Something went wrong..</>;
  // }

  return <ProductDetailPage id={id} />;
}
