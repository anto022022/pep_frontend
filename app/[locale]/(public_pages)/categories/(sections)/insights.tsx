"use client";

import { SectionProps } from "@/app/[locale]/(public_pages)/categories/(sections)/subcategory-section";
import Typography from "@/app/[locale]/_components/Base/Typography";
import InsightsCard from "@/app/[locale]/_components/Cards/InsightsCard";
import ReusableSwiper from "@/app/[locale]/_components/Carousel/ReusableSwiper";
import { RightArrowIcon } from "@/app/[locale]/_components/Icons/SVGIcons";
import { insightsList } from "@/public/sampleData";
import { useTranslations } from "next-intl";
import Link from "next/link";

function Insights({ }: SectionProps) {
  const t = useTranslations("categoryPage");

  return (
    <>
      <section className="section-block">
        <div className="s-b-head p-mob-pad">
          <div className="s-b-h-left">
            <div className="title-block">
              <Typography className="cat-title cat-title-md" variant="h4">
                {t("insights.title")}
              </Typography>
            </div>
          </div>
          <div className="s-b-h-right">
            <Link href={""} className="mob-view-all">
              <RightArrowIcon />
            </Link>
          </div>
        </div>
        {insightsList.length > 0 ? (
          <div className="mob-carousel pl-mob-pad nav-pag-right">
            <ReusableSwiper
              slides={insightsList}
              slidesPerView={1.2}
              spaceBetween={10}
              loop={false}
              freeMode={false}
              navigation={true}
              pagination={true}
              autoplay={2000}
              paginationClass="r-s-pagination"
              className="reusable-swiper"
              breakpoints={{
                320: {
                  slidesPerView: 1.2,
                  spaceBetween: 10,
                },
                650: {
                  slidesPerView: 2,
                  spaceBetween: 15,
                },
                1100: {
                  slidesPerView: 3,
                  spaceBetween: 15,
                },
                1350: {
                  slidesPerView: 4,
                  spaceBetween: 20,
                },
              }}
              renderItem={(item: any, index: number) => (
                <InsightsCard
                  key={index}
                  image={item.image}
                  date={item.date}
                  categoryName={item.categoryName}
                  name={item.name}
                  companyName={item.companyName}
                  readTime={item.readTime}
                  badgeTheme={item.badgeTheme}
                />
              )}
            />
          </div>
        ) : null}
      </section>
    </>
  );
}

export default Insights;