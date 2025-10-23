"use client";

import { SectionProps } from "@/app/[locale]/(public_pages)/categories/(sections)/subcategory-section";
import Typography from "@/app/[locale]/_components/Base/Typography";
import TradeShowsCard from "@/app/[locale]/_components/Cards/TradeShowsCard";
import ReusableSwiper from "@/app/[locale]/_components/Carousel/ReusableSwiper";
import { RightArrowIcon } from "@/app/[locale]/_components/Icons/SVGIcons";
import { tradeShowsList } from "@/public/sampleData";
import { useTranslations } from "next-intl";
import Link from "next/link";

function TradeShow({}: SectionProps) {
  const t = useTranslations("categoryPage");

  return (
    <>
      <section className="section-block">
        <div className="s-b-head p-mob-pad">
          <div className="s-b-h-left">
            <div className="title-block">
              <Typography className="cat-title cat-title-md" variant="h3">
                {t("pepagora.tradeShow.label")}
              </Typography>
            </div>
          </div>
          <div className="s-b-h-right">
            <Link href={""} className="mob-view-all">
              <RightArrowIcon />
            </Link>
          </div>
        </div>
        {tradeShowsList.length > 0 ? (
          <div className="mob-carousel p-mob-pad nav-pag-right">
            <ReusableSwiper
              slides={tradeShowsList}
              slidesPerView={1.2}
              spaceBetween={10}
              loop={false}
              freeMode={false}
              navigation={true}
              pagination={true}
              autoplay={3000}
              paginationClass="r-s-pagination"
              className="reusable-swiper"
              breakpoints={{
                320: {
                  slidesPerView: 1,
                  spaceBetween: 10,
                },
                767: {
                  slidesPerView: 2,
                  spaceBetween: 15,
                },
                1350: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                },
              }}
              renderItem={(item: any, index: number) => (
                <TradeShowsCard
                  key={index}
                  date={item.date}
                  showName={item.showName}
                  image={item.image}
                  location={item.location}
                  // badgeData={item.badgeData}
                />
              )}
            />
          </div>
        ) : null}
      </section>
    </>
  );
}

export default TradeShow;
