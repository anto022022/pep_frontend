import { ProductWrapperComponent } from "@/app/[locale]/_components/MarketComponents/Products/ProductWrapperComponent";
interface SubCategoryPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ ref?: string }>;
}

export async function generateMetadata({ params }: SubCategoryPageProps) {
  const { locale } = await params;
  const domain = "https://pepagora.com";
  return {
    title: `Products | Pepagora`,
    description: `Browse top Products.`,
    alternates: {
      canonical: `${domain}/${locale}/products`,
    },
  };
}
export default async function ProductsPage() {
  return (
    <ProductWrapperComponent
      isProduct={true}
      breadcrumbData={{ type: "sc-2", name: "Products", path: "products" }}
    />
  );
}
