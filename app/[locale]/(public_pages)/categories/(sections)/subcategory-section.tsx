"use client";

import { CategoryWithSubCategories } from "@/app/[locale]/(public_pages)/categories/[category]/page";
import Typography from "@/app/[locale]/_components/Base/Typography";
import ButtonIconRight from "@/app/[locale]/_components/Buttons/ButtonIconRight";
import SubCategory from "@/app/[locale]/_components/Cards/Marketplace/SubCategory";
import ReusableSwiper from "@/app/[locale]/_components/Carousel/ReusableSwiper";
import { ChevronDownIcon } from "@/app/[locale]/_components/Icons/SVGIcons";
import useIsMobile from "@/app/[locale]/_hooks/useIsMobile";
import "@/app/[locale]/dev_styles.css";
import { useTranslations } from "next-intl";
import { useState } from "react";

export interface SectionProps {
  refQuery?: string;
}

function SubCategorySection({
  name,
  mappedChildren: subCategoryList,
  refQuery,
  seoContent,
}: CategoryWithSubCategories & { refQuery: string }) {
  const t = useTranslations("categoryPage");
  const isMobile = useIsMobile();
console.log(" name,  subCategoryList, refQuery", name, subCategoryList, refQuery)

  // state to handle show more
  const [showAll, setShowAll] = useState(false);

  // limit to 12 initially
  const visibleSubCategories = showAll
    ? subCategoryList
    : subCategoryList?.slice(0, 12);

  return (
    <>
      <section className="section-block p-mob-pad">
        <div className="title-block sub-cat-title-block">
          <Typography className="cat-title" variant="h1">
            {name}
          </Typography>       
        
        </div>
        <Typography className="cat-subtxt" variant="h1">
            {seoContent?.by_lang?.en?.intro_html}
          </Typography>
        {seoContent?.by_lang?.en?.llm_text && (
  <div style={{ display: 'none' }}>
    <Typography className="cat-subtxt" variant="p">
      {seoContent.by_lang.en.llm_text}
    </Typography>
    

  </div>
  
  
)}


        {visibleSubCategories?.length > 0 ? (
          <>
            {!isMobile ? (
              <div className="cards-listing-group">
                {visibleSubCategories?.map((item: any, index: number) => (
                  <SubCategory
                    key={index}
                    name={item?.name}
                    link={`/sc/${item?.liveUrl}`}
                    marketValue={item?.marketSize}
                    annualValue={item?.annualGrowth}
                    averageValue={item?.averageMargin}
                    img={item?.image}
                    refQuery={refQuery}
                  />
                ))}
              </div>
            ) : (
              <div className="mob-carousel">
                <ReusableSwiper
                  slides={visibleSubCategories}
                  slidesPerView={2}
                  spaceBetween={10}
                  grid={{ rows: 2, fill: "row" }}
                  loop={false}
                  freeMode={false}
                  navigation={false}
                  pagination={true}
                  paginationClass="r-s-pagination"
                  className="reusable-swiper"
                  breakpoints={{
                    320: { slidesPerView: 2, spaceBetween: 10 },
                    600: { slidesPerView: 3, spaceBetween: 10 },
                    991: { slidesPerView: 4, spaceBetween: 20 },
                  }}
                  renderItem={(item: any, index: number) => (
                    <SubCategory
                      key={index}
                      name={item.name}
                      link={`/sc/${item?.liveUrl}`}
                      marketValue={item?.marketSize}
                      annualValue={item?.annualGrowth}
                      averageValue={item?.averageMargin}
                      img={item?.image}
                      refQuery={refQuery}
                    />
                  )}
                />
              </div>
            )}
          </>
        ) : null}

        <div className="section-block-footer">
          <div className="s-b-f-left">
            <div className="footer-txt-info">
              <p className="f-t-i-txt">{t("subCategorySection.marketDesc")}</p>
              <p className="f-t-i-txt">{t("subCategorySection.annualDesc")}</p>
              <p className="f-t-i-txt">{t("subCategorySection.averageDec")}</p>
              <p className="f-t-i-txt">{t("subCategorySection.disclaimer")}</p>
            </div>
          </div>
          <div className="s-b-f-right">
            {subCategoryList?.length > 12 && (
              <ButtonIconRight
                name={
                  showAll
                    ? t("subCategorySection.showLessBtn") // add translation for "Show Less"
                    : t("subCategorySection.showMoreBtn")
                }
                theme={"btn-outline bg-outline-dark"}
                onClick={() => setShowAll((prev) => !prev)}
              >
                <ChevronDownIcon
                  className={`chevron-icon ${showAll ? "up" : "down"}`}
                />
              </ButtonIconRight>
            )}
          </div>

        </div>

      </section>

    </>
  );
}

export default SubCategorySection;
