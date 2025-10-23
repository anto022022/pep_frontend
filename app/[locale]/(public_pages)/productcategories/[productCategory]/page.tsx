import { ProductWrapperComponent } from "@/app/[locale]/_components/MarketComponents/Products/ProductWrapperComponent";
import {
  getImageUrl,
  parseCategoryString,
  toCamelCase,
} from "@/app/[locale]/_hooks/utility";

interface ProductCategoryPageProps {
  params: Promise<{ productCategory: string; locale: string }>;
  searchParams: Promise<{ ref?: string }>;
}

export interface ProductCategoryData {
  name: string;
  totalProductsCount: number;
}

export async function fetchProductCategory(slug: string) {
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL_AG || "https://api.sandbox.pepagora.org/"
    }get-product-category-detail/${slug}`,
    {
      cache: "no-store", // Enable caching to avoid duplicate calls
    }
  );
  const data = await res.json();
  return data?.data;
}

export async function generateMetadata({ params }: ProductCategoryPageProps) {
  const { productCategory } = await params;
  const { name, id } = parseCategoryString(productCategory);
  const camelName = toCamelCase(name);
  const productCategoryData = await fetchProductCategory(id);

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://sandbox.pepagora.org";

  const title = `${camelName} Manufacturers & Suppliers - Wholesaler & Exporters | Pepagora`;
  const description = `Explore a wide range of ${camelName} products from verified manufacturers, suppliers & exporters on Pepagora. Connect globally, compare prices & send enquiry!`;
  const canonicalUrl = `${baseUrl}/${
    (await params).locale
  }/pc/${productCategory}`;
  const ogImage =
    getImageUrl(productCategoryData?.image) ||
    `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTvmsx_MsGkKO1KHxFZ4rugYVXzGQ2zbmzgg&s`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${baseUrl}/en/pc/${productCategory}`,
        ta: `${baseUrl}/ta/pc/${productCategory}`,
        ar: `${baseUrl}/ar/pc/${productCategory}`,
        hi: `${baseUrl}/hi/pc/${productCategory}`,
        "x-default": `${baseUrl}/en/pc/${productCategory}`,
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

export default async function ProductCategoriesPage({
  params,
}: ProductCategoryPageProps) {
  const { productCategory } = await params;
  const { id } = parseCategoryString(productCategory);
  let productCategoryData: ProductCategoryData | null = null;
  try {
    productCategoryData = await fetchProductCategory(id);
    if (!productCategoryData || !productCategoryData?.name) {
      throw new Error("Product category not found");
    }
  } catch (error) {
    console.error("Error fetching product category data:", error);
  }

  return (
    <ProductWrapperComponent
      isProduct={false}
      categoryInfo={productCategoryData}
      breadcrumbData={{
        type: "pc",
        name: productCategoryData?.name || "Product Category",
        path: productCategory,
      }}
    />
  );
}
