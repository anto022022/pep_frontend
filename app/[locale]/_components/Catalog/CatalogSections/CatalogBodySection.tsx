import Buttons from "@/app/[locale]/_components/Buttons/Buttons";
import CatalogPreviewCompanySection from "@/app/[locale]/_components/CatalogPreview/CatalogPreviewBodySection/CatalogPreviewCompanySection";
import CatalogPreviewEnquirySection from "@/app/[locale]/_components/CatalogPreview/CatalogPreviewBodySection/CatalogPreviewEnquirySection";
import CatalogProductListPreview from "@/app/[locale]/_components/CatalogPreview/CatalogPreviewBodySection/CatalogProductPreviewSection";
import { SalesProductListInterface } from "@/app/[locale]/_interface/SalesProductInterface";
import {
  useGetBusinessDetailsQuery,
  useGetCatalogDetailsQuery,
  useGetCatalogDetailsWithDomainQuery,
  useGetCatalogProductsListQuery,
} from "@/app/[locale]/_store/apiReducer/catalogApi";
import { setDomain } from "@/app/[locale]/_store/reducers/location_store";
import { getBusinessTypeLabel } from "@/app/[locale]/_utility/businessTypeUtils";
import "@/app/[locale]/catlog.css";
import analyticsUp from "@/public/img/icons/analytics-up.svg";
import analyticsStar from "@/public/img/icons/cursor-magic-selection-02.svg";
import eyeIcon from "@/public/img/icons/eye.svg";
import shareIcon from "@/public/img/icons/share.svg";
import truBasic from "@/public/img/TruBasic.svg";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import vector from "../../../../../assets/img/buildings.png";
import global from "../../../../../assets/img/global.png";
import breifCase from "../../../../../assets/img/security-user.png";
import box from "../../../../../assets/img/verify.png";

type CatalogBodySectionProps = {
  onOpenSidebar: () => void;
};

const CatalogBodySection = ({ onOpenSidebar }: CatalogBodySectionProps) => {
  const dispatch = useDispatch();
  const t = useTranslations("freeCatalog.catalog");
  const h = useTranslations("freeCatalog");
  const router = useRouter();
  const { locale } = useParams();
  const row = 7;
  const [queryParams] = useState<SalesProductListInterface>({
    sortBy: "",
    sortOrder: 0,
    page: 1,
    limit: row,
    searchQuery: "",
    itemStatus: "",
  });
  const params = useParams();
  const subDomain = params?.sites as string;
  const [catalogData, setCatalogData] = useState<any>(null);
  const [catalogCompanyData, setCatalogCompanyData] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { data: catalogProductsData, isLoading } =
    useGetCatalogProductsListQuery(queryParams, {
      refetchOnMountOrArgChange: true,
    });

  const { data: apiData } = useGetCatalogDetailsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const { data: businessApiData } = useGetBusinessDetailsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const { data: domainData } = useGetCatalogDetailsWithDomainQuery(
    { subDomain },
    {
      skip: !subDomain,
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    if (apiData) {
      const { data } = apiData;
      if (data) {
        setCatalogData(data);
        dispatch(setDomain(data.subDomain));
      }
    }
  }, [apiData]);

  useEffect(() => {
    if (businessApiData) {
      const { data } = businessApiData;
      if (data) {
        setCatalogCompanyData(data);
      }
    }
  }, [businessApiData]);

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

  const handleTabClick = (index: number) => {
    setActiveIndex(index);
  };
  const handleClick = () => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const subDomain = catalogData?.subDomain;
    let url = `${baseUrl}/${subDomain}`;
    url = url.replace(/\/app/g, "").replace(/undefined/g, "");

    // Remove any accidental double slashes (except in https://)
    url = url.replace(/([^:]\/)\/+/g, "$1");
    // router.push(url);
    window.open(url, "_blank");
  };

  const logoSrc = businessApiData?.data?.companyLogo?.src
    ? `${businessApiData.data.companyLogo.src}`
    : null;

  function formatISOToDMY(isoDate: string): string {
    const dateObj = new Date(isoDate);
    const day = String(dateObj.getUTCDate()).padStart(2, "0");
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = dateObj.getUTCFullYear();
    return `${day}-${month}-${year}`;
  }
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
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t("actions.shareTitle"),
          text: t("actions.shareText"),
          url: `${process.env.NEXT_PUBLIC_SITE_URL ||
            "https://sandbox.pepagora.org"
            }/${locale}/${catalogData?.subDomain}`,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      alert(t("actions.shareNotSupported"));
    }
  };
  const addBrowserBookmark = () => {
    const url = window.location.href; // current page
    const title = document.title; // page title

    try {
      // Internet Explorer support
      if (
        (window as any).external &&
        "AddFavorite" in (window as any).external
      ) {
        (window as any).external.AddFavorite(url, title);
        return;
      }

      // Firefox support (older versions)
      if ((window as any).sidebar && (window as any).sidebar.addPanel) {
        (window as any).sidebar.addPanel(title, url, "");
        return;
      }

      // Chrome/Edge - try to trigger bookmark dialog
      if ((window as any).chrome && (window as any).chrome.bookmarks) {
        (window as any).chrome.bookmarks.create({
          title: title,
          url: url,
        });
        return;
      }

      // Safari - try to add bookmark
      if ((window as any).safari && (window as any).safari.pushNotification) {
        // Safari doesn't have a direct bookmark API, fall back to instructions
        showBookmarkInstructions();
        return;
      }

      // For modern browsers that don't support direct bookmarking
      // Try to create a bookmark link and trigger download
      createBookmarkFile(title, url);
    } catch (error) {
      console.error("Error in bookmark function:", error);
      showBookmarkInstructions();
    }
  };

  const createBookmarkFile = (title: string, url: string) => {
    try {
      // Create HTML bookmark content
      const bookmarkContent = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
    <DT><A HREF="${url}" ADD_DATE="${Math.floor(
        Date.now() / 1000
      )}">${title}</A>
</DL><p>`;

      // Create blob and download
      const blob = new Blob([bookmarkContent], { type: "text/html" });
      const downloadUrl = URL.createObjectURL(blob);

      // Create temporary link and trigger download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      URL.revokeObjectURL(downloadUrl);

      // Show success message
      alert(
        `Bookmark file "${title}.html" has been downloaded. You can import it into your browser.`
      );
    } catch (error) {
      console.error("Error creating bookmark file:", error);
      showBookmarkInstructions();
    }
  };

  const showBookmarkInstructions = () => {
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    const shortcut = isMac ? "Cmd+D" : "Ctrl+D";
    alert(`Press ${shortcut} to bookmark this page.`);
  };
  return (
    <div className="p-w-main page-container category-page-main p-catalog-main-page-create ">
      {/* <BreadCrumbs data={breadCrumpData} /> */}
      <div className="catalog-body-section">
        <div className="main-body-left">
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
                    onClick={() => handleTabClick(2)}
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
                onClick={() => handleTabClick(2)}
              >
                {t("actions.contactSuppliers")}
              </button>
            </div>
          </div>
          <div className="catalog-product-nav">
            <div className="catalog-product-left">
              <div className="tabs-block">
                <div className="tabs-block-left">
                  {" "}
                  <Buttons
                    className={`btn-outline ${activeIndex == 0 ? "active" : ""
                      }`}
                    text={t("tabs.products")}
                    onClick={() => handleTabClick(0)}
                  />
                  <Buttons
                    className={`btn-outline ${activeIndex == 1 ? "active" : ""
                      }`}
                    text={t("tabs.profile")}
                    onClick={() => handleTabClick(1)}
                  />
                  <Buttons
                    className={`btn-outline ${activeIndex == 2 ? "active" : ""
                      }`}
                    text={t("tabs.contacts")}
                    onClick={() => handleTabClick(2)}
                  />
                </div>
                <div className="tabs-block-right">
                  {/* <div className="btns-wrapper" onClick={addBrowserBookmark}>
                    <div className="share-btn">{t("actions.wishlist")}</div>
                    <Image
                      src={heartIcon}
                      alt={"wishlist"}
                      width={24}
                      height={24}
                    />
                  </div> */}
                  <div className="btns-wrapper" onClick={handleShare}>
                    <div className="share-btn">{t("actions.share")}</div>
                    <Image
                      src={shareIcon}
                      alt={"share"}
                      width={24}
                      height={24}
                    />
                  </div>
                </div>
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
          {/* Body Section - Conditional Rendering */}
          {activeIndex === 0 && (
            <div className="p-l-m-t-body p-4">
              <CatalogProductListPreview
                data={{
                  data: catalogProductsData,
                  isLoading: isLoading && queryParams.page === 1, // Only show loading on first page
                  groupItems: [],
                  activeGroup: "",
                  handleActiveGroup: () => { },
                }}
                onFilterChange={() => { }}
              />
            </div>
          )}

          {activeIndex === 1 && (
            <div className="catalog-owners-detail-card-preview comp-sections">
              <CatalogPreviewCompanySection
                catalogCompanyData={catalogCompanyData}
              />
            </div>
          )}

          {activeIndex === 2 && (
            <div className="catalog-owners-detail-card-preview comp-sections mb">
              <CatalogPreviewEnquirySection
                data={domainData?.data?._id}
                subDomain={subDomain}
              />
            </div>
          )}
        </div>
        <div className="main-body-right">
          <div className="catalog-feed-section-next-level">
            <div className="feed-left">
              <h4>{t("feed.title")}</h4>
              <ul>
                <li>{t("feed.features.unlimitedProducts")}</li>
                <li>{t("feed.features.leadsLevel")}</li>
                <li>{t("feed.features.ownDomain")}</li>
              </ul>
              <button
                className="btn-comp btn-outline bg-outline-dark"
                onClick={onOpenSidebar}
              >
                {t("feed.seePlans")}
              </button>
            </div>
            <div className="feed-right">
              <label className="feed-img"></label>
            </div>
          </div>

          <div className="analytics-section">
            <div className="analytics-header">
              <div className="analytics-icon">
                <Image
                  src={analyticsUp}
                  alt={"analytics-up"}
                  width={24}
                  height={24}
                />
              </div>
              <h5>{t("analytics.title")}</h5>
            </div>
            <div className="analytics-section-one a-s-o-border">
              {" "}
              <div className="metrics-row">
                <div className="metric">
                  <div className="metric-label">{t("analytics.views")}</div>
                  <div className="metric-sec">
                    <span className="metric-icon">
                      <Image src={eyeIcon} alt={"eye"} width={24} height={24} />
                    </span>
                    <span className="metric-value">
                      {catalogData?.views || "0"}
                    </span>
                  </div>
                </div>
                <div className="metric">
                  <div className="metric-label">
                    {t("analytics.impressions")}
                  </div>
                  <div className="metric-sec">
                    <span className="metric-icon">
                      <Image
                        src={analyticsStar}
                        alt={"analytics-star"}
                        width={25}
                        height={25}
                      />
                    </span>
                    <span className="metric-value">
                      {catalogData?.impression || "0"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="info-row">
                <div className="info-item">
                  <div className="info-label">{t("analytics.lastEdited")}</div>
                  <div className="info-value">
                    {formatISOToDMY(catalogData?.updatedAt)}
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">
                    {t("analytics.lastEditedBy")}
                  </div>
                  <div className="info-value">
                    {catalogCompanyData?.businessName}
                  </div>
                </div>
              </div>
              <div className="status-row">
                <div className="status-label">{t("analytics.status")}</div>
                <span className="status-badge">
                  {catalogData?.isCatalogPublished
                    ? t("analytics.active")
                    : t("analytics.pending")}
                </span>
              </div>{" "}
            </div>
            <div className="analytics-section-one a-s-o-two">
              <div className="catalog-link">
                <div className="info-label">{t("analytics.catalogLink")}</div>
                <div
                  className="info-value"
                  onClick={handleClick}
                  style={{ cursor: "pointer" }}
                >
                  {process.env.NEXT_PUBLIC_SITE_URL ||
                    "https://sandbox.pepagora.org"}
                  /{catalogData?.subDomain}
                </div>
              </div>
              <div className="info-item-bottom">
                <div className="info-label">{t("analytics.lastEditedBy")}</div>
                <div className="info-value">
                  {catalogCompanyData?.businessName}
                </div>
              </div>

              <button disabled className="published-button">
                {t("analytics.published")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogBodySection;
