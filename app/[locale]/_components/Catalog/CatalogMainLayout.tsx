/**
 * CatalogMainLayout (client)
 *
 * Author: Rahulkrishnan R
 * Created: September 19, 2025
 *
 * - Chooses mobile or desktop catalog view based on `useIsMobile` hook.
 * - Keeps the preview component available (commented out in original).
 *
 * Notes / suggestions:
 * - For faster initial loads consider code-splitting mobile/desktop with Next.js `dynamic()` imports.
 * - Add ARIA attributes where needed inside CatalogMobile / CatalogDesktop for better accessibility.
 * - If the layout grows, extract header/footer into separate components.
 */
"use client";
import React, { memo, useEffect, useState } from "react";

// Next Hooks
import { useParams } from "next/navigation";
// Hooks (alphabetical)
import useIsMobile from "@/app/[locale]/_hooks/useIsMobile";

// APIs
import { useGetCatalogDetailsWithDomainQuery } from "@/app/[locale]/_store/apiReducer/catalogApi";

// Components (alphabetical)
import CatalogDesktop from "@/app/[locale]/_components/Catalog/premium/CatalogDesktop";
import CatalogMobile from "@/app/[locale]/_components/Catalog/premium/CatalogMobile";
import CatalogPreviewView from "@/app/[locale]/_components/CatalogPreview/CatalogPreviewView";

// Styles (alphabetical / last)
import "@/app/[locale]/[sites]/premium_catalog_style.css";

const CatalogMainLayout: React.FC = () => {
  const params = useParams();
  const subDomain = params?.sites as string;
  // threshold (px) at which the layout switches — keep this in sync with CSS breakpoints
  const isMobile = useIsMobile(1200);

  // local states
  const [catalogData, setCatalogData] = useState<any>(null);
  console.log("catalogData::", catalogData);

  // API calls
  const { data: domainData, isLoading: isDomainLoading } =
    useGetCatalogDetailsWithDomainQuery(
      { subDomain },
      {
        skip: !subDomain,
        refetchOnMountOrArgChange: true,
      }
    );

  // SIde Effect section
  useEffect(() => {
    if (domainData?.data) {
      setCatalogData(domainData.data);
    }
  }, [domainData]);

  // Show loading state while API is loading
  if (isDomainLoading) {
    return (
      <div className="catalog-loading-container">
        <div className="catalog-loading-spinner">Loading catalog...</div>
      </div>
    );
  }

  // Render based on catalog type
  return (
    <>
      {catalogData?.catalogType === "premium" ? (
        isMobile ? (
          <CatalogMobile />
        ) : (
          <CatalogDesktop />
        )
      ) : (
        <CatalogPreviewView />
      )}
    </>
  );
};

export default memo(CatalogMainLayout);
