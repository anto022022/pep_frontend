import apparelFashion from "@/public/img/static-site/categories/apparel-fashion.jpg";
import realEstate from "@/public/img/static-site/categories/construction-real-estate.jpg";
import electronicsElectric from "@/public/img/static-site/categories/electronics-electrical.jpg";
import foodAgri from "@/public/img/static-site/categories/food-agriculture.jpg";
import healthCare from "@/public/img/static-site/categories/health-personal-care.jpg";
import homeLife from "@/public/img/static-site/categories/home-lifestyle.jpg";
import indusEquip from "@/public/img/static-site/categories/industrial-equipment.jpg";
import { useTranslations } from "next-intl";
import Image from "next/image.js";
import "../(static_pages)/(assets)/assets/css/bootstrap.min.css";
import "../(static_pages)/(assets)/assets/css/style.css";
import "../(static_pages)/(assets)/assets/scss/home/home.css";
import "../(static_pages)/(assets)/assets/css/dev-style.css";
import Link from "next/link";
import React from "react";
import hardwareTools from "@/public/img/static-site/categories/hardware-tools.jpg";
import officeSupplies from "@/public/img/static-site/categories/office-supplies.jpg";
import automotiveTransport from "@/public/img/static-site/categories/automotive-transport.jpg";
import packaging from "@/public/img/static-site/categories/packaging.jpg";
import rawMaterial from "@/public/img/static-site/categories/raw-material.jpg";
import sports from "@/public/img/static-site/categories/sports.jpg";
import support from "@/public/img/static-site/categories/support.jpg";
import { useGetCategoryHomeQuery } from "@/app/[locale]/_store/apiReducer/commonApi";

const HomePageCards = () => {
  const t = useTranslations("home");
  const { data: categories, isLoading } = useGetCategoryHomeQuery();

  // Create a mapping function to get liveUrl by category name
  const getLiveUrlByName = (categoryName: string) => {
    if (!categories?.data) return "";

    const category = categories.data.find((cat) =>
      cat.name.toLowerCase().includes(categoryName.toLowerCase())
    );

    return category ? category.liveUrl : "";
  };

  // Map category names to their corresponding liveUrl
  const categoryUrls = {
    apparel: getLiveUrlByName("Apparel & Fashion"),
    industrial: getLiveUrlByName("Industrial Equipment & Machinery"),
    home: getLiveUrlByName("Home & Lifestyle"),
    health: getLiveUrlByName("Health & Personal Care"),
    food: getLiveUrlByName("Food & Agriculture"),
    construction: getLiveUrlByName("Construction"),
    electronics: getLiveUrlByName("Electronics & Electrical"),
    automotive: getLiveUrlByName("Automotive & Transport"),
    raw: getLiveUrlByName("Raw Materials & Chemicals"),
    sports: getLiveUrlByName("Sports & Entertainment"),
    tools: getLiveUrlByName("Tools & Hardware"),
    packaging: getLiveUrlByName("Packaging & Printing"),
    office: getLiveUrlByName("Office Supplies & Equipment"),
    services: getLiveUrlByName("Services & Support"),
  };

  return (
    <section className="success-stories-section">
      <div className="container">
        <div className="row align-items-center justify-content-center text-center">
          <div className="col-lg-12">
            <div className="info-with-triger-block">
              <div className="i-w-t-info w-100">
                <div className="title-h2">
                  {t("categories.title")} <span>{t("categories.titleLast")}</span>
                </div>
                <div className="subtitle-h3">{t("categories.subtitle")}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-horizontial-scroll">
          <div className="categories-card-group mt-md-5 mt-3">
            <Link
              href={`/c/${categoryUrls.apparel}`}
              className="categories-card"
            >
              <div className="c-c-img">
                <Image
                  width={160}
                  height={100}
                  src={apparelFashion}
                  className="img-fluid"
                  alt="Category"
                />
              </div>
              <div className="c-c-content">
                <span className="c-c-c-txt">{t("categories.items.ct1")}</span>
              </div>
            </Link>
            <Link
              href={`/c/${categoryUrls.industrial}`}
              className="categories-card"
            >
              <div className="c-c-img">
                <Image
                  width={160}
                  height={100}
                  src={indusEquip}
                  className="img-fluid"
                  alt="Category"
                />
              </div>
              <div className="c-c-content">
                <span className="c-c-c-txt">{t("categories.items.ct2")}</span>
              </div>
            </Link>
            <Link href={`/c/${categoryUrls.home}`} className="categories-card">
              <div className="c-c-img">
                <Image
                  width={160}
                  height={100}
                  src={homeLife}
                  className="img-fluid"
                  alt="Category"
                />
              </div>
              <div className="c-c-content">
                <span className="c-c-c-txt">{t("categories.items.ct3")}</span>
              </div>
            </Link>
            <Link
              href={`/c/${categoryUrls.health}`}
              className="categories-card"
            >
              <div className="c-c-img">
                <Image
                  width={160}
                  height={100}
                  src={healthCare}
                  className="img-fluid"
                  alt="Category"
                />
              </div>
              <div className="c-c-content">
                <span className="c-c-c-txt">{t("categories.items.ct4")}</span>
              </div>
            </Link>
            <Link href={`/c/${categoryUrls.food}`} className="categories-card">
              <div className="c-c-img">
                <Image
                  width={160}
                  height={100}
                  src={foodAgri}
                  className="img-fluid"
                  alt="Category"
                />
              </div>
              <div className="c-c-content">
                <span className="c-c-c-txt">{t("categories.items.ct5")}</span>
              </div>
            </Link>
            <Link
              href={`/c/${categoryUrls.construction}`}
              className="categories-card"
            >
              <div className="c-c-img">
                <Image
                  width={160}
                  height={100}
                  src={realEstate}
                  className="img-fluid"
                  alt="Category"
                />
              </div>
              <div className="c-c-content">
                <span className="c-c-c-txt">{t("categories.items.ct6")}</span>
              </div>
            </Link>
            <Link
              href={`/c/${categoryUrls.electronics}`}
              className="categories-card"
            >
              <div className="c-c-img">
                <Image
                  width={160}
                  height={100}
                  src={electronicsElectric}
                  className="img-fluid"
                  alt="Category"
                />
              </div>
              <div className="c-c-content">
                <span className="c-c-c-txt">{t("categories.items.ct7")}</span>
              </div>
            </Link>
            <Link
              href={`/c/${categoryUrls.automotive}`}
              className="categories-card"
            >
              <div className="c-c-img">
                <Image
                  width={160}
                  height={100}
                  src={automotiveTransport}
                  className="img-fluid"
                  alt="Category"
                />
              </div>
              <div className="c-c-content">
                <span className="c-c-c-txt">{t("categories.items.ct8")}</span>
              </div>
            </Link>
            <Link href={`/c/${categoryUrls.raw}`} className="categories-card">
              <div className="c-c-img">
                <Image
                  width={160}
                  height={100}
                  src={rawMaterial}
                  className="img-fluid"
                  alt="Category"
                />
              </div>
              <div className="c-c-content">
                <span className="c-c-c-txt">{t("categories.items.ct9")}</span>
              </div>
            </Link>
            <Link
              href={`/c/${categoryUrls.sports}`}
              className="categories-card"
            >
              <div className="c-c-img">
                <Image
                  width={160}
                  height={100}
                  src={sports}
                  className="img-fluid"
                  alt="Category"
                />
              </div>
              <div className="c-c-content">
                <span className="c-c-c-txt">{t("categories.items.ct10")}</span>
              </div>
            </Link>
            <Link href={`/c/${categoryUrls.tools}`} className="categories-card">
              <div className="c-c-img">
                <Image
                  width={160}
                  height={100}
                  src={hardwareTools}
                  className="img-fluid"
                  alt="Category"
                />
              </div>
              <div className="c-c-content">
                <span className="c-c-c-txt">{t("categories.items.ct11")}</span>
              </div>
            </Link>
            <Link
              href={`/c/${categoryUrls.packaging}`}
              className="categories-card"
            >
              <div className="c-c-img">
                <Image
                  width={160}
                  height={100}
                  src={packaging}
                  className="img-fluid"
                  alt="Category"
                />
              </div>
              <div className="c-c-content">
                <span className="c-c-c-txt">{t("categories.items.ct12")}</span>
              </div>
            </Link>
            <Link
              href={`/c/${categoryUrls.office}`}
              className="categories-card"
            >
              <div className="c-c-img">
                <Image
                  width={160}
                  height={100}
                  src={officeSupplies}
                  className="img-fluid"
                  alt="Category"
                />
              </div>
              <div className="c-c-content">
                <span className="c-c-c-txt">{t("categories.items.ct13")}</span>
              </div>
            </Link>
            <Link
              href={`/c/${categoryUrls.services}`}
              className="categories-card"
            >
              <div className="c-c-img">
                <Image
                  width={160}
                  height={100}
                  src={support}
                  className="img-fluid"
                  alt="Category"
                />
              </div>
              <div className="c-c-content">
                <span className="c-c-c-txt">{t("categories.items.ct14")}</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePageCards;
