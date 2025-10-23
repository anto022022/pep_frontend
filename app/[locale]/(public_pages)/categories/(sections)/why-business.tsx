"use client";
import { SectionProps } from "@/app/[locale]/(public_pages)/categories/(sections)/subcategory-section";
import Typography from "@/app/[locale]/_components/Base/Typography";
import WhyBusinessCard from "@/app/[locale]/_components/Cards/WhyBusinessCard";
import { useTranslations } from "next-intl";
import { useRouter } from "next/dist/client/components/navigation";
import sales from "../../../../../public/img/sales.svg";
import smarter from "../../../../../public/img/smarter.svg";

function WhyBusiness({}: SectionProps) {
  const t = useTranslations("categoryPage");
  const router = useRouter();

  return (
    <>
      <section className="section-block">
        <div className="s-b-head p-mob-pad">
          <div className="s-b-h-left s-b-left-alone">
            <div className="title-block">
              <Typography className="cat-title cat-title-md" variant="h4">
                {t("pepagora.title")}
              </Typography>
              <Typography className="cat-subtxt" variant="p">
                {t("pepagora.description")}
              </Typography>
            </div>
          </div>
        </div>
        <div className="why-bussiness-group p-mob-pad">
          <WhyBusinessCard
            title={t("pepagora.selling.title")}
            featureOne={t("pepagora.selling.products")}
            featureTwo={t("pepagora.selling.visibility")}
            featureThree={t("pepagora.selling.catalog")}
            image={sales}
            buttonName={t("pepagora.selling.button")}
            onClick={() => {
              router.push("/app/sales-product");
            }}
          />
          <WhyBusinessCard
            title={t("pepagora.sourcing.title")}
            featureOne={t("pepagora.sourcing.rfq")}
            featureTwo={t("pepagora.sourcing.countries")}
            featureThree={t("pepagora.sourcing.tools")}
            image={smarter}
            buttonName={t("pepagora.sourcing.button")}
            onClick={() => {
              router.push("/app/sourcing-rfq");
            }}
          />
        </div>
      </section>
    </>
  );
}

export default WhyBusiness;
