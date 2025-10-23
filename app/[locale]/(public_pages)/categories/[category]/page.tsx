import FeaturedSuppliers from "@/app/[locale]/(public_pages)/categories/(sections)/featured-suppliers";
// import Insights from "@/app/[locale]/(public_pages)/categories/(sections)/insights";
import OffersDiscounts from "@/app/[locale]/(public_pages)/categories/(sections)/offers-and-discounts";
import PostBuyingRequest from "@/app/[locale]/(public_pages)/categories/(sections)/post-buying-request";
import SubCategorySection from "@/app/[locale]/(public_pages)/categories/(sections)/subcategory-section";
// import TradeShow from "@/app/[locale]/(public_pages)/categories/(sections)/tradeshow";
import TrendingNowProducts from "@/app/[locale]/(public_pages)/categories/(sections)/trending-now-products";
import WhyBusiness from "@/app/[locale]/(public_pages)/categories/(sections)/why-business";
import BreadCrumbs from "@/app/[locale]/_components/Cards/Marketplace/BreadCrumbs";
import MobileMetaSetter from "@/app/[locale]/_components/Common/MobileMetaSetter";
// import SEOComponent from "@/app/[locale]/_components/SEO/SEOComponent";
// import { generateCategoryStructuredData } from "@/app/[locale]/_components/SEO/SEOHead";
import {
  getImageUrl,
  parseCategoryString,
  toCamelCase,
} from "@/app/[locale]/_hooks/utility";
import { updateBreadcrumbTrail } from "@/app/[locale]/_utility/breadcrumbTrail";
// import { serverFetcher } from "@/app/[locale]/_utility/fetcher";
import { redirect } from "next/navigation";

export async function fetchCategory(slug: string) {
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_URL_AG || "https://api.sandbox.pepagora.org/"
    }get-category-with-subcategories/${slug}`,
    {
      cache: "force-cache", // Enable caching to avoid duplicate calls
      next: { revalidate: 3600 }, // Revalidate every hour
    }
  );
  const data = await res.json();
  return data?.data;
}

export interface SubCategory {
  uniqueId: string;
  name: string;
  liveUrl: string;
  marketSize: string;
  annualGrowth: string;
  averageMargin: string;
  image: string;
}

export interface CategoryWithSubCategories {
  uniqueId: string;
  name: string;
  liveUrl: string;
  mappedChildren: SubCategory[];
  categoryImage?: string;
  iconImage?: string;
  seoContent?: {
    keywords: {
      head: string[];
      long_tail: string[];
      variants: string[];
    };
    by_lang: {
      [locale: string]: {
        intro_html: string;
        buyers_guide_html: string;
        faqs: Array<{
          question: string;
          answer_html: string;
        }>;
        llm_text: string;
        meta: {
          title: string;
          description: string;
        };
        schema: {
          breadcrumb_jsonld: any;
          faqpage_jsonld: any;
          itemlist_jsonld: any;
        };
        links_html: string;
      };
    };
  };
}

export async function generateMetadata({ params }: Props) {
  const { category } = await params;
  const { name, id } = parseCategoryString(category);
  const camelName = toCamelCase(name);

  const categoryData = await fetchCategory(id);

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://sandbox.pepagora.org";

  const title = `${camelName} Manufacturers, Suppliers –  Exporters & Wholesaler | Pepagora`;
  const description = `Find verified ${name} manufacturers, suppliers, exporters, and wholesalers on Pepagora. Source quality products and connect with trusted businesses across the globe.`;
  const canonicalUrl = `${baseUrl}/${(await params).locale}/c/${category}`;
  const ogImage =
    getImageUrl(categoryData?.image) ||
    `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTvmsx_MsGkKO1KHxFZ4rugYVXzGQ2zbmzgg&s`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        // en: `${baseUrl}/en/c/${name}`, // uncomment if you want explicit EN
        ta: `${baseUrl}/ta/c/${category}`,
        ar: `${baseUrl}/ar/c/${category}`,
        hi: `${baseUrl}/hi/c/${category}`,
        "x-default": `${baseUrl}/en/c/${category}`,
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

const page = async ({ params }: Props) => {
  const { category, locale } = await params;
  const { id } = parseCategoryString(category);
  let categoryData: CategoryWithSubCategories | null = null;
  try {
    categoryData = await fetchCategory(id);
    if (!categoryData || !categoryData.name) throw new Error("Invalid data");
  } catch (error) {
    console.error("Failed to fetch category:", error);
    redirect(`/${locale}/404`);
  }

  if (!categoryData) {
    redirect(`/${locale}/404`);
  }

  const { refQuery, breadCrumpData } = updateBreadcrumbTrail(undefined, {
    type: "c" as const,
    name: categoryData!.name,
    path: categoryData!.liveUrl,
  });

  return (
    <>
      {/* <SEOComponent
        title={`${categoryData.name} Manufacturers & Suppliers – ${categoryData.name} Exporters & Wholesaler | Pepagora`}
        description={`Find verified ${categoryData.name} manufacturers, suppliers, exporters, and wholesalers on Pepagora. Source quality products and connect with trusted businesses across the globe.`}
        keywords={`${categoryData.name}, manufacturers, suppliers, exporters, wholesalers, B2B marketplace, global trade, sourcing, procurement`}
        canonicalUrl={`/c/${categoryData.liveUrl}`}
        ogImage="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTvmsx_MsGkKO1KHxFZ4rugYVXzGQ2zbmzgg&s"
        ogType="website"
        structuredData={structuredData}
        categoryData={categoryData}
      /> */}
      <MobileMetaSetter title={categoryData?.name} path="/categories" />
      <BreadCrumbs data={breadCrumpData} />
      <div className="section-block-group">
        {/* SubCategory */}
        <SubCategorySection
          {...categoryData}
          refQuery={refQuery}
          seoContent={categoryData?.seoContent}
        />

        {/* Trending Now */}
        <TrendingNowProducts refQuery={refQuery} />

        {/* Featured Suppliers */}
        {/* <FeaturedSuppliers refQuery={refQuery} /> */}
        <FeaturedSuppliers />

        {/* Offers & Discounts */}
        <OffersDiscounts refQuery={refQuery} />

        {/* Post your needs */}
        <PostBuyingRequest refQuery={refQuery} />

        {/* Upcoming Tradeshows */}
        {/* <TradeShow refQuery={refQuery} /> */}

        {/* Insights */}
        {/* <Insights refQuery={refQuery} /> */}

        {/* Why Businesses */}
        <WhyBusiness refQuery={refQuery} />
      </div>
    </>
  );
};

export default page;
