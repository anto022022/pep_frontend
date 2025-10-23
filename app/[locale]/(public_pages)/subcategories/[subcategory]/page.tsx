import { ProductWrapperComponent } from "@/app/[locale]/_components/MarketComponents/Products/ProductWrapperComponent";
import {
  getImageUrl,
  parseCategoryString,
  toCamelCase,
} from "@/app/[locale]/_hooks/utility";

interface SubCategoryPageProps {
  params: Promise<{ subcategory: string; locale: string }>;
  searchParams: Promise<{ ref?: string }>;
}
export async function fetchSubCategory(slug: string) {
  console.log("slug", slug);
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL_AG || "https://api.sandbox.pepagora.org/"
    }get-subcategory-detail/${slug}`,
    {
      cache: "no-store", // Enable caching to avoid duplicate calls
    }
  );
  const data = await res.json();
  return data?.data;
}
export async function generateMetadata({ params }: SubCategoryPageProps) {
  const { subcategory } = await params;
  const { name, id } = parseCategoryString(subcategory);
  const camelName = toCamelCase(name);
  const subCategoryData = await fetchSubCategory(id);

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://sandbox.pepagora.org";

  const title = `${camelName} Manufacturers & Suppliers - Wholesaler & Exporters | Pepagora`;
  const description = `Explore a wide range of ${camelName} products from verified manufacturers, suppliers & exporters on Pepagora. Connect globally, compare prices & send enquiry!`;
  const canonicalUrl = `${baseUrl}/${(await params).locale}/sc/${subcategory}`;
  const ogImage =
    getImageUrl(subCategoryData?.image) ||
    `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTvmsx_MsGkKO1KHxFZ4rugYVXzGQ2zbmzgg&s`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${baseUrl}/en/sc/${subcategory}`,
        ta: `${baseUrl}/ta/sc/${subcategory}`,
        ar: `${baseUrl}/ar/sc/${subcategory}`,
        hi: `${baseUrl}/hi/sc/${subcategory}`,
        "x-default": `${baseUrl}/en/sc/${subcategory}`,
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
      title,
      description,
      images: [ogImage],
    },
    other: {
      "fb:app_id": "688881134183469",
    },
  };
}

export default async function SubCategoriesPage({
  params,
  searchParams,
}: SubCategoryPageProps) {
  const { subcategory } = await params;
  const { id } = parseCategoryString(subcategory);

  let subCatDetail: any = null;
  try {
    subCatDetail = await fetchSubCategory(id);
    if (!subCatDetail || !subCatDetail.name) throw new Error("Invalid data");
  } catch (error) {
    console.error("Failed to fetch subcategory:", error);
    // Handle error - you might want to redirect to 404 or show error page
  }

  return (
    <ProductWrapperComponent
      isProduct={false}
      categoryInfo={subCatDetail}
      breadcrumbData={{
        type: "sc",
        name: subCatDetail?.name,
        path: subcategory,
      }}
    />
  );
}
