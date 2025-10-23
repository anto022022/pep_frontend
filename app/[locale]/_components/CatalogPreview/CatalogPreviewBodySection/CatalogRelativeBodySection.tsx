import { useState, useEffect } from "react";
import { Carousel } from "primereact/carousel";

import { useGetOtherSuppliersBySubdomainQuery } from "@/app/[locale]/_store/apiReducer/catalogApi";
import { useTranslations } from "next-intl";
import SupplierCard from "@/app/[locale]/_components/Cards/SupplierCard";

interface CatalogRelativeBodySectionProps {
  subDomain: string;
  catalogCompanyData: any;
}

const CatalogRelativeBodySection = ({
  subDomain,
  catalogCompanyData,
}: CatalogRelativeBodySectionProps) => {
  const t = useTranslations("freeCatalog.catalog");

  const [page, setPage] = useState(1);
  const [apiResp, setApiResp] = useState<any>(null);
  const [suppliersList, setSuppliersList] = useState<any[]>([]);
  const limit = 10; // You can change this as per requirement

  const { data, isFetching, isError } = useGetOtherSuppliersBySubdomainQuery(
    {
      subDomain,
      page,
      limit,
    },
    {
      skip: !subDomain || !page,
      refetchOnMountOrArgChange: true,
    }
  );
  // Append new suppliers to the existing list
  useEffect(() => {
    if (!data?.data) return;

    const listData = data.data.listData || [];

    // Store pagination metadata
    setApiResp(data.data);

    if (listData.length > 0) {
      setSuppliersList((prev) => {
        // Remove duplicates based on _id
        const existingIds = new Set(prev.map((item) => item._id));
        const newItems = listData.filter((item) => !existingIds.has(item._id));
        return page === 1 ? newItems : [...prev, ...newItems];
      });
    }
  }, [data]);

  // Load more data when needed
  useEffect(() => {
    if (
      suppliersList.length > 0 &&
      !isFetching &&
      page < (apiResp?.pagination?.totalPages || 1)
    ) {
      setPage((prev) => prev + 1);
    }
  }, [suppliersList, isFetching, page, apiResp]);

  // Responsive options for the carousel
  const responsiveOptions = [
    {
      breakpoint: "1199px",
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: "767px",
      numVisible: 1,
      numScroll: 1,
    },
  ];

  // Template for each carousel item
  const productTemplate = (supplierData: any) => {
    return <SupplierCard supplier={supplierData} />;
  };

  return (
    <>
      {" "}
      {suppliersList?.length > 0 && (
        <div className="supplier-section">
          <div className="supplier-section-header">
            <h2>{t("relativeSuppliers.title")}</h2>
          </div>

          {isError && (
            <p className="error">{t("relativeSuppliers.loadError")}</p>
          )}

          {suppliersList.length > 0 && (
            <Carousel
              value={suppliersList}
              numScroll={1}
              numVisible={3}
              responsiveOptions={responsiveOptions}
              itemTemplate={productTemplate}
              className="supplier-carousel"
              showNavigators={true}
              showIndicators={false}
              circular={false}
              autoplayInterval={0}
            />
          )}

          {isFetching && suppliersList.length === 0 && (
            <div className="loading-state">
              <p>Loading suppliers...</p>
            </div>
          )}

          {/* Pagination buttons (for testing, replace with scroll-to-end later) */}
          {/* <div className="pagination-controls">
      <button
        disabled={page <= 1 || isFetching}
        onClick={() => setPage((prev) => prev - 1)}
      >
        Prev
      </button>
      <button
        disabled={
          isFetching || page >= (data?.data?.pagination?.totalPages || 1)
        }
        onClick={() => setPage((prev) => prev + 1)}
      >
        Next
      </button>
    </div> */}
        </div>
      )}
    </>
  );
};

export default CatalogRelativeBodySection;
