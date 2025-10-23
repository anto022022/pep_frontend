"use client";

import {
  ApparelCategoryIcon,
  AutomotiveCategoryIcon,
  CategoryDummyIcon,
  ConstructionCategoryIcon,
  ElectronicsCategoryIcon,
  FoodCategoryIcon,
  HealthCategoryIcon,
  IndustrialCategoryIcon,
  LifestyleCategoryIcon,
  OfficeCategoryIcon,
  PackagingCategoryIcon,
  RawCategoryIcon,
  ServiceCategoryIcon,
  SportsCategoryIcon,
  ToolsCategoryIcon,
  ViewMore,
} from "@/app/[locale]/_components/Icons/SVGIcons";
import useIsMobile from "@/app/[locale]/_hooks/useIsMobile";
import { getImageUrl } from "@/app/[locale]/_hooks/utility";
import { setProductSearch } from "@/app/[locale]/_store/reducers/filters_store";
import { useAppDispatch } from "@/app/[locale]/_store/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Category {
  _id: string;
  uniqueId: string;
  name: string;
  liveUrl: string;
}

interface SubCategory {
  uniqueId: string;
  name: string;
  liveUrl: string;
  marketSize?: string;
  annualGrowth?: string;
  averageMargin?: string;
  image: string;
}

const categoryIcons = {
  "Apparel & Fashion": <ApparelCategoryIcon />,
  "Automotive & Transport": <AutomotiveCategoryIcon />,
  Construction: <ConstructionCategoryIcon />,
  "Electronics & Electrical": <ElectronicsCategoryIcon />,
  "Food & Agriculture": <FoodCategoryIcon />,
  "Health & Personal Care": <HealthCategoryIcon />,
  "Home & Lifestyle": <LifestyleCategoryIcon />,
  "Industrial Equipment & Machinery": <IndustrialCategoryIcon />,
  "Office Supplies & Equipment": <OfficeCategoryIcon />,
  "Packaging & Printing": <PackagingCategoryIcon />,
  "Raw Materials & Chemicals": <RawCategoryIcon />,
  "Services & Support": <ServiceCategoryIcon />,
  "Sports & Entertainment": <SportsCategoryIcon />,
  "Tools & Hardware": <ToolsCategoryIcon />,
};

const AllCategory = ({
  isCategoryActive = false,
  setIsCategoryActive,
}: {
  isCategoryActive: boolean;
  setIsCategoryActive: (value: boolean) => void;
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<
    Record<string, SubCategory[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [mobileSubActive, setMobileSubActive] = useState<boolean>(false);
  const [loadingCategories, setLoadingCategories] = useState<
    Record<string, boolean>
  >({});
  const [errorCategories, setErrorCategories] = useState<
    Record<string, string>
  >({});
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
  const [isClient, setIsClient] = useState<boolean>(false);

  const getCategories = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_AG ||
        "https://api.sandbox.pepagora.org/"
        }get-category-home`
      );
      const result = await res.json();
      if (result.statusCode === 200) {
        setCategories(result.data);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const getSubCategories = async (uniqueId: string) => {
    try {
      setLoadingCategories((prev) => ({ ...prev, [uniqueId]: true }));

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_AG ||
        "https://api.sandbox.pepagora.org/"
        }get-category-with-subcategories-home/${uniqueId}?page=1&limit=26`
      );
      const result = await res.json();
      if (result.statusCode === 200) {
        const subcats = result?.data?.category?.mappedChildren || [];
        setSubCategories((prev) => ({
          ...prev,
          [uniqueId]: subcats,
        }));
        // Clear any previous errors
        setErrorCategories((prev) => ({ ...prev, [uniqueId]: "" }));
      } else {
        const errorMsg = `API returned status code: ${result.statusCode}`;
        console.error(errorMsg);
        setErrorCategories((prev) => ({ ...prev, [uniqueId]: errorMsg }));
      }
    } catch (err) {
      const errorMsg = `Failed to fetch subcategories: ${err.message}`;
      console.error(errorMsg);
      setErrorCategories((prev) => ({ ...prev, [uniqueId]: errorMsg }));
    } finally {
      setLoadingCategories((prev) => ({ ...prev, [uniqueId]: false }));
    }
  };

  const toggleMobileActiveBar = (ele: Category, tabIndex: number) => {
    if (isMobile) {
      setMobileSubActive((prev) => !prev);
    }
    // dispatch(setProductSearch(""));
    handleTabClick(ele.uniqueId, tabIndex);
  };

  // Set client state to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load categories on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getCategories();
      setLoading(false);
    };
    fetchData();
  }, []);

  // Auto load first category's subcategories
  useEffect(() => {
    if (categories.length > 0) {
      const firstCategoryId = categories[0].uniqueId;
      getSubCategories(firstCategoryId);
    }
  }, [categories]);

  const handleTabClick = (uniqueId: string, tabIndex: number) => {
    setActiveTabIndex(tabIndex);
    getSubCategories(uniqueId);
  };

  const retryLoadSubCategories = (uniqueId: string) => {
    getSubCategories(uniqueId);
  };

  const handleSubCategory = (url: string) => {
    router.push(`/sc/${url}`);
    setIsCategoryActive(false);
    dispatch(setProductSearch(""));
  };

  // Prevent hydration mismatch by not rendering until client is ready
  if (!isClient || loading) return <p>Loading...</p>;

  return (
    <>
      <div
        key={`all-category-${isClient ? "client" : "server"}`}
        className={`p-all-categories-container ${isCategoryActive ? "active" : ""
          }`}
        id="p-all-categories-container"
      >
        {/* Tabs */}
        <ul className="p-nav p-nav-tabs" id="categoriesTab2" role="tablist">
          {categories
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((cat, idx) => (
              <li className="p-nav-item" role="presentation" key={cat._id}>
                <button
                  className={`p-nav-link i-w-t-item-block ${idx === activeTabIndex ? "active" : ""
                    }`}
                  id={`categoriesTab2item${cat.uniqueId}`}
                  type="button"
                  role="tab"
                  aria-selected={idx === activeTabIndex ? "true" : "false"}
                  onClick={() => toggleMobileActiveBar(cat, idx)}
                >
                  {categoryIcons[cat.name] ?? <CategoryDummyIcon />}
                  <span>{cat.name}</span>
                </button>
              </li>
            ))}
        </ul>

        {/* Tab Content */}
        <div
          className={`${mobileSubActive ? "active" : ""} tab-content`}
          id="categoriesTab2Content"
        >
          {categories.map((cat, idx) =>
            idx === activeTabIndex ? (
              <div
                key={cat._id}
                className="tab-pane show active"
                id={`categoriesTab2item${cat.uniqueId}-pane`}
                role="tabpanel"
              >
                <div className="p-a-c-c-title-group">
                  <div className="p-a-c-c-title">{cat.name}</div>
                  {!isMobile ? (
                    <button onClick={() => setIsCategoryActive(false)}>
                      <span className="material-symbols-rounded">close</span>
                    </button>
                  ) : (
                    <button
                      className="p-a-c-c-close-btn"
                      onClick={() => setMobileSubActive(false)}
                    >
                      <span className="material-symbols-rounded">close</span>
                    </button>
                  )}

                  {/* //temp fix */}
                  <button
                    onClick={() => setIsCategoryActive(false)}
                    className="extra-menu-control"
                  >
                    <span className="material-symbols-rounded ">close</span>
                  </button>
                </div>

                <div className="p-a-c-c-body">
                  {loadingCategories[cat.uniqueId] ? (
                    <div className="text-center py-4">
                      <p>Loading subcategories...</p>
                    </div>
                  ) : subCategories[cat.uniqueId] &&
                    subCategories[cat.uniqueId].length > 0 ? (
                    subCategories[cat.uniqueId]
                      .filter((e) => e.image)
                      ?.map((sub) => (
                        <div
                          className="p-a-c-c-item"
                          key={sub.uniqueId}
                          onClick={() => handleSubCategory(sub.liveUrl)}
                        >
                          <div className="p-a-c-c-image">
                            <img
                              src={
                                getImageUrl(sub.image) ||
                                getImageUrl(
                                  `/assets/category/apparel-and-fashion/inventory-software.jpg`
                                )
                              }
                              alt={sub.name}
                              className="img-responsive"
                            />
                          </div>
                          <div className="p-a-c-c-i-title">{sub.name}</div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-4">
                      {errorCategories[cat.uniqueId] ? (
                        <>
                          <p className="text-danger mb-2">
                            Error: {errorCategories[cat.uniqueId]}
                          </p>
                          <button
                            className="btn-custom btn-custom-sm btn-custom-outline-primary"
                            onClick={() => retryLoadSubCategories(cat.uniqueId)}
                          >
                            Retry
                          </button>
                        </>
                      ) : (
                        <>
                          <p className="text-muted mb-2">
                            {subCategories[cat.uniqueId]
                              ? "No subcategories found"
                              : "Click this tab to load subcategories..."}
                          </p>
                          <button
                            className="btn-custom btn-custom-sm btn-custom-outline-primary"
                            onClick={() => retryLoadSubCategories(cat.uniqueId)}
                          >
                            Retry
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  <Link
                    href={`/c/${cat.liveUrl}`}
                    onClick={() => {
                      setIsCategoryActive(false);
                      setMobileSubActive(false);
                    }}
                    className="p-a-c-c-item"
                  >
                    <div className="p-a-c-c-image">
                      {/* <Image src="assets/img/menu-categories/view-more.png" alt="view-more" className="img-fluid"></Image> */}
                      <ViewMore />
                    </div>
                    <div className="p-a-c-c-i-title">View More</div>
                  </Link>
                </div>
              </div>
            ) : null
          )}
        </div>
      </div>
    </>
  );
};

export default AllCategory;
