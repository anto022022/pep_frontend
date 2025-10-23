import BreadCrumbs from "@/app/[locale]/_components/Cards/Marketplace/BreadCrumbs";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import vector from "../../../../../public/img/icons/buildings.svg";
import global from "../../../../../public/img/icons/global.svg";
import breifCase from "../../../../../public/img/icons/security-user.svg";
import box from "../../../../../public/img/icons/verify.svg";

import "@/app/[locale]/[sites]/catalog_style.css";
import Buttons from "@/app/[locale]/_components/Buttons/Buttons";
import CatalogContactFlowSection from "@/app/[locale]/_components/CatalogPreview/CatalogPreviewBodySection/CatalogContactFlowSection";
import CatalogPreviewCompanySection from "@/app/[locale]/_components/CatalogPreview/CatalogPreviewBodySection/CatalogPreviewCompanySection";
import CatalogPreviewEnquirySection from "@/app/[locale]/_components/CatalogPreview/CatalogPreviewBodySection/CatalogPreviewEnquirySection";
import CatalogProductListPreview from "@/app/[locale]/_components/CatalogPreview/CatalogPreviewBodySection/CatalogProductPreviewSection";
import CatalogRelativeBodySection from "@/app/[locale]/_components/CatalogPreview/CatalogPreviewBodySection/CatalogRelativeBodySection";
import { SalesProductListInterface } from "@/app/[locale]/_interface/SalesProductInterface";
import {
  useGetBusinessDetailsPublicQuery,
  useGetCatalogDetailsWithDomainQuery,
  useGetCatalogProductsListPublicQuery,
  useGetProductGroupBySubdomainQuery,
  useUpdateCatalogImpressionsMutation,
} from "@/app/[locale]/_store/apiReducer/catalogApi";
import { getBusinessTypeLabel } from "@/app/[locale]/_utility/businessTypeUtils";
import truBasic from "@/public/img/TruBasic.svg";
import { useTranslations } from "next-intl";
import { redirect, useParams, usePathname } from "next/navigation";
interface Group {
  _id: string;
  groupName: string;
}
const CatalogPreviewBodySection = () => {
  const t = useTranslations("freeCatalog.catalog");
  const h = useTranslations("freeCatalog");
  const pathname = usePathname();
  const row = 10;
  const params = useParams();
  const subDomain = params?.sites as string;
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(t("tabs.products"));
  const [catalogData, setCatalogData] = useState<any>(null);
  const [catalogCompanyData, setCatalogCompanyData] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [activeGroup, setActiveGroup] = useState("");
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [groupData, setGroupData] = useState<Group[]>([]);
  const productRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const [queryParams, setQueryParams] = useState<SalesProductListInterface>({
    sortBy: "",
    sortOrder: 0,
    page: 1,
    limit: row,
    searchQuery: "",
    itemStatus: "",
  });

  const { data, isLoading, isFetching } = useGetCatalogProductsListPublicQuery(
    { ...queryParams, subdomain: subDomain, groupId: activeGroup },
    {
      skip: !subDomain,
      refetchOnMountOrArgChange: true,
    }
  );

  const { data: domainData, isLoading: isDomainLoading } =
    useGetCatalogDetailsWithDomainQuery(
      { subDomain },
      {
        skip: !subDomain,
        refetchOnMountOrArgChange: true,
      }
    );
  const { data: productGroupData, isLoading: isProductGroupLoading } =
    useGetProductGroupBySubdomainQuery(
      { subDomain },
      {
        skip: !subDomain,
        refetchOnMountOrArgChange: true,
      }
    );
  const { data: businessApiData, isLoading: isBusinessApiLoading } =
    useGetBusinessDetailsPublicQuery(
      { subdomain: subDomain },
      {
        skip: !subDomain,
        refetchOnMountOrArgChange: true,
      }
    );
  const [updateCatalogImpressions] = useUpdateCatalogImpressionsMutation();
  useEffect(() => {
    if (productGroupData?.data) {
      setGroupData(productGroupData.data);
    }
  }, [productGroupData]);

  useEffect(() => {
    if (businessApiData?.data) {
      setCatalogCompanyData(businessApiData.data);
    }
  }, [businessApiData]);
  useEffect(() => {
    if (domainData?.data) {
      setCatalogData(domainData.data);
    }
  }, [domainData]);

  useEffect(() => {
    const allLoaded = !isBusinessApiLoading && !isDomainLoading;
    const isDataMissing =
      allLoaded && (!businessApiData?.data || !domainData?.data);

    if (isDataMissing) {
      redirect(`/${params.locale}/404`);
    }
  }, [
    businessApiData,
    domainData,
    isBusinessApiLoading,
    isDomainLoading,
    params.locale,
  ]);

  // Handle products data update
  useEffect(() => {
    if (data?.data?.listData?.result) {
      const newProducts = data.data.listData.result;
      const totalPages = data.data.listData.totalPages;
      const currentPage = data.data.listData.currentPage;
      const totalListCount = data.data.listData.totalListCount;

      if (queryParams.page === 1) {
        // First page or reset - replace all products
        setAllProducts(newProducts);
      } else {
        // Subsequent pages - append to existing products, filtering out duplicates
        setAllProducts((prev) => {
          const existingIds = new Set(prev.map((product) => product._id));
          const uniqueNewProducts = newProducts.filter(
            (product) => !existingIds.has(product._id)
          );
          const totalAfterMerge = [...prev, ...uniqueNewProducts];
          return totalAfterMerge;
        });
      }

      // Check if there are more products to load
      const hasMore = currentPage < totalPages && totalListCount >= 10;
      setHasMoreProducts(hasMore);
    }
  }, [data, queryParams.page, activeGroup]);

  // useEffect(() => {
  //   // Check for scroll target after component mounts and data is loaded
  //   const scrollTarget = sessionStorage.getItem("scrollTarget");
  //   if (scrollTarget && catalogData && catalogCompanyData) {
  //     // Delay to ensure all components are rendered
  //     setTimeout(() => {
  //       scrollToSection(scrollTarget);
  //       sessionStorage.removeItem("scrollTarget"); // Clean up
  //     }, 500); // Increased delay to ensure all content is loaded
  //   }
  // }, [catalogData, catalogCompanyData]);
  useEffect(() => {
    const scrollToHash = () => {
      if (typeof window === "undefined") return;
      const hash = window.location.hash.replace("#", "");
      if (!hash) return;

      // Delay to ensure DOM is ready after hydration / route change
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        // Sync tab index
        if (hash === "products") setActiveIndex(0);
        if (hash === "profile") setActiveIndex(1);
        if (hash === "contacts") setActiveIndex(2);
      }, 100); // small delay fixes refresh + client routing
    };

    // Run on mount
    scrollToHash();

    // Run on hash changes (when user clicks tabs or types in URL)
    window.addEventListener("hashchange", scrollToHash);

    // Run again when path changes (important for Next.js client-side routing)
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, [pathname]); // 👈 rerun on route change

  const handleTabClick = (index: number, hash: string) => {
    setActiveIndex(index);
    window.location.hash = hash; // updates URL and triggers scroll
  };
  async function handleImpression() {
    await updateCatalogImpressions({ subdomain: subDomain });
  }

  const scrollToSection = (tab: string) => {
    setActiveTab(tab);
    const sectionRefs: {
      [key: string]: React.RefObject<HTMLDivElement | null>;
    } = {
      products: productRef,
      profile: profileRef,
      contacts: contactRef,
      // Also handle capitalized versions for backward compatibility
      Products: productRef,
      Profile: profileRef,
      Contacts: contactRef,
    };

    const targetRef = sectionRefs[tab];
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth", block: "start" });

      // Also update the active tab based on the scroll target
      if (tab.toLowerCase() === "products" || tab === "Products") {
        setActiveTab(t("tabs.products"));
      } else if (tab.toLowerCase() === "profile" || tab === "Profile") {
        setActiveTab(t("tabs.profile"));
      } else if (tab.toLowerCase() === "contacts" || tab === "Contacts") {
        setActiveTab(t("tabs.contacts"));
      }
    }
    // else {
    //   console.log("Target ref not found for:", tab);
    // }
  };

  const handleLoadMoreProducts = () => {
    if (!isFetching && hasMoreProducts) {
      handleImpression();
      setQueryParams((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  };

  const handleFilterChange = (filters: Partial<SalesProductListInterface>) => {
    setQueryParams((prev) => ({
      ...prev,
      ...filters,
      page: 1, // Reset to first page when filters change
    }));
    setAllProducts([]); // Clear existing products when filters change
    setHasMoreProducts(true); // Reset hasMore state when filters change
  };

  const tabs = [t("tabs.products"), t("tabs.profile"), t("tabs.contacts")];
  const catalogOwnersCard = [
    {
      img: breifCase,
      businessName: h("homepage.fields.ownerName.label"),
      businessDesc: h("homepage.fields.ownerName.label"),
      value: catalogData?.ownerName,
    },
    {
      img: box,
      businessName: h("homepage.fields.businessType.label"),
      businessDesc: h("homepage.fields.businessType.label"),
      value: getBusinessTypeLabel(catalogData?.businessType, h),
    },
    {
      img: global,
      businessName: h("homepage.fields.businessTypeSpecific.label"),
      businessDesc: h("homepage.businessTypeSpecific.options.manufacturer"),
      value: Array.isArray(catalogData?.businessTypeSpecific)
        ? catalogData.businessTypeSpecific.join(", ")
        : catalogData?.businessTypeSpecific || t("productList.notAvailable"),
    },
    {
      img: vector,
      businessName: h("homepage.fields.industry.label"),
      businessDesc: t("footer.apparelFashion"),
      value: catalogData?.industry?.name,
    },
  ];

  const breadCrumpData = [
    {
      type: "c" as const,
      // name: t("breadcrumb.suppliers"),
      name: "Catalog",
      path: "/",
      encryptedRef: "",
    },
  ];

  const logoSrc = businessApiData?.data?.companyLogo?.src
    ? `${businessApiData.data.companyLogo.src}`
    : null;
  const handleActiveGroup = (id: string) => {
    const shallowCopy = { ...queryParams };
    (shallowCopy.page = 1), (shallowCopy.limit = row);
    setQueryParams(shallowCopy);
    setActiveGroup(id);
    handleImpression();
    return;
  };
  function yearsFromCurrentYear(input: unknown): number {
    const currentYear = new Date().getFullYear();

    let year: number;

    // Handle number input
    if (typeof input === "number" && Number.isFinite(input)) {
      year = Math.trunc(input);
    }
    // Handle string input (e.g., "2020")
    else if (typeof input === "string" && /^[+-]?\d+$/.test(input.trim())) {
      year = Number(input.trim());
    }
    // Handle Date input
    else if (input instanceof Date && !Number.isNaN(input.getTime())) {
      year = input.getFullYear();
    }
    // Invalid input
    else {
      return 0;
    }

    return currentYear - year;
  }

  return (
    <div className="p-w-main page-container category-page-main p-catalog-main-page">
      {catalogData && catalogCompanyData ? (
        <>
          {/* <div className="catalog-subclass"> */}
          <BreadCrumbs data={breadCrumpData} />
          <div className="catalog-previewbody-section">
            <div className="main-previewbody-left">
              <div className="catalog-owners-detail-card-preview catalog-main-profile-preview">
                <div className="catalog-owners-detail-card-preview-header">
                  <div className="catalog-owners-logo-preview">
                    {logoSrc && (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BUCKET_URL}${logoSrc}`}
                        alt={t("companySection.catalogOwnerLogoAlt")}
                        className="catalog-home-page-log"
                        width={100}
                        height={100}
                      />
                    )}
                  </div>
                  <div className="catalog-owners-detail-preview">
                    <h5>{catalogCompanyData?.businessName}</h5>
                    <div
                      className="company-meta-badge"
                      style={{ marginTop: "10px" }}
                    >
                      <div className="c-m-b-item verify-img">
                        <Image
                          src={truBasic}
                          width={78}
                          height={15}
                          alt="basic"
                          sizes="100vw"
                          className="img-contain"
                        ></Image>
                      </div>

                      {/* <div className="c-m-b-item rating-item">
                        <StarIcon />
                        <span className="c-m-b-i-txt">{"4.8/5"}</span>
                      </div> */}

                      <div className="c-m-b-item">
                        <Image
                          src={`https://flagcdn.com/w320/${catalogCompanyData?.businessLocation?.code.toLowerCase()}.png`}
                          width={19}
                          height={12}
                          alt={
                            catalogCompanyData?.businessLocation?.code.toLowerCase() ??
                            ""
                          }
                          sizes="100vw"
                        />
                        <span className="c-m-b-i-country">
                          {catalogCompanyData?.businessLocation?.code ?? " "}
                        </span>
                      </div>
                      {catalogCompanyData?.yearOfEstablishment > 0 && (
                        <div className="c-m-b-item">
                          <span className="c-m-b-i-txt txt-grey">
                            {yearsFromCurrentYear(
                              catalogCompanyData?.yearOfEstablishment
                            )}{" "}
                            yrs
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Years */}
                    <div className="btn-sub d-none-767">
                      <button
                        className="catalog-owners-btn"
                        onClick={() => {
                          setActiveIndex(2);
                          scrollToSection("contacts");
                        }}
                      >
                        {t("actions.contactSuppliers")}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="catalog-owners-desc-preview">
                  {catalogOwnersCard.map((item, index) => (
                    <div className="catalog-desc-cards" key={index}>
                      <Image
                        src={item.img}
                        alt={item.businessName}
                        width={24}
                        height={24}
                      />
                      <p className="catalog-desc-cards-title">
                        {item.businessName}
                      </p>
                      {item.businessDesc && (
                        <p className="catalog-desc-cards-value">{item.value}</p>
                      )}
                    </div>
                  ))}
                </div>
                <div className="btn-sub d-flex-767">
                  <button
                    className="catalog-owners-btn"
                    onClick={() => {
                      setActiveIndex(2);
                      scrollToSection("contacts");
                    }}
                  >
                    {t("actions.contactSuppliers")}
                  </button>
                </div>
              </div>
              <div className="catalog-product-nav">
                <div className="catalog-product-left">
                  <div className="tabs-block">
                    <Buttons
                      className={`btn-outline ${
                        activeIndex == 0 ? "active" : ""
                      }`}
                      text={t("tabs.products")}
                      onClick={() => {
                        setActiveIndex(0);
                        scrollToSection("products");
                        handleTabClick(0, "products");
                      }}
                    />
                    <Buttons
                      className={`btn-outline ${
                        activeIndex == 1 ? "active" : ""
                      }`}
                      text={t("tabs.profile")}
                      onClick={() => {
                        setActiveIndex(1);
                        scrollToSection("profile");
                        handleTabClick(1, "profile");
                      }}
                    />
                    <Buttons
                      className={`btn-outline ${
                        activeIndex == 2 ? "active" : ""
                      }`}
                      text={t("tabs.contacts")}
                      onClick={() => {
                        setActiveIndex(2);
                        scrollToSection("contacts");
                        handleTabClick(2, "contacts");
                      }}
                    />
                  </div>
                  {/* <ul>
                    {tabs.map((tab) => (
                      <li
                        key={tab}
                        className={activeTab === tab ? "active" : ""}
                        onClick={() => scrollToSection(tab)}
                      >
                        {tab}
                      </li>
                    ))}
                  </ul> */}
                </div>
              </div>
              {/* Body Section */}
              {/* <div ref={productRef} style={{ marginBottom: "24px" }}> */}
              <div ref={productRef} id="products">
                <CatalogProductListPreview
                  data={{
                    data: {
                      ...data,
                      data: {
                        ...data?.data,
                        listData: {
                          ...data?.data?.listData,
                          result: allProducts,
                        },
                      },
                    },

                    isLoading: isLoading && queryParams.page === 1, // Only show loading on first page
                    groupItems: groupData,
                    activeGroup: activeGroup,
                    handleActiveGroup: handleActiveGroup,
                  }}
                  onFilterChange={handleFilterChange}
                />
              </div>
              {hasMoreProducts && (
                <div className="ct-loader">
                  <button
                    className="ct-loadmore-btn"
                    onClick={handleLoadMoreProducts}
                    disabled={isFetching}
                  >
                    {isFetching
                      ? t("common.loading")
                      : t("productList.loadMore")}
                  </button>
                </div>
              )}

              {/* <div ref={profileRef} style={{ marginBottom: "40px" }}> */}
              <div
                className="catalog-owners-detail-card-preview comp-sections"
                ref={profileRef}
                id="profile"
              >
                <CatalogPreviewCompanySection
                  catalogCompanyData={catalogCompanyData}
                />
              </div>
              {/* <div ref={contactRef} style={{ marginBottom: "40px" }}> */}
              <div
                className="catalog-owners-detail-card-preview comp-sections mb"
                ref={contactRef}
                id="contacts"
              >
                <CatalogPreviewEnquirySection
                  data={domainData?.data?._id}
                  subDomain={subDomain}
                />
              </div>
            </div>
          </div>
          <CatalogRelativeBodySection
            subDomain={catalogData?.subDomain}
            catalogCompanyData={catalogCompanyData}
          />
          <CatalogContactFlowSection />
          {/* </div> */}
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default CatalogPreviewBodySection;
