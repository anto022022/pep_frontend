"use client";

import Typography from "@/app/[locale]/_components/Base/Typography";
import SearchDropdown from "@/app/[locale]/_components/Common/SearchDropdown/SearchDropdown";
import Image from "next/image";
import Link from "next/link";
import notFound from "@/public/img/not-found.svg";
import useIsMobile from "@/app/[locale]/_hooks/useIsMobile";
import { useTranslations } from "next-intl";

export default function NotFoundPage() {
  const common = useTranslations("common");
  const isMobile = useIsMobile(560);
  return (
    <div className="not-found-container">
      <div className="not-found-section">
        <div className="not-found-section-left">
          <div className="content-section-one">
            <Typography variant="h1">
              <span className="nf-title-one">
                {common("pageNotFound.title_1")}{" "}
              </span>
              <span className="nf-title-two">
                {common("pageNotFound.title_2")}
              </span>
            </Typography>
            <Typography variant="h2" className="nf-desc-one">
              {common("pageNotFound.description_1")}
            </Typography>
          </div>
          <div className="content-section-two">

            <Typography variant="p" className="nf-desc-two">
              {common("pageNotFound.description_step_1")}
              <span className="nf-link">
                {" "}
                <Link href="/">
                  {common("pageNotFound.description_step_2")}
                </Link>
              </span>
              , {common("pageNotFound.description_step_3")}
              <span className="nf-link">
                {" "}
                <Link href="/s/contact-us">
                  {common("pageNotFound.description_step_4")}
                </Link>
              </span>
              , {common("pageNotFound.description_step_5")}
            </Typography>
          <SearchDropdown className="p-main-search" isNoPlaceholder={true} />

          </div>

        </div>
        <div className="not-found-section-right">
          <Image
            src={notFound}
            alt="Not Found"
            width={isMobile ? 290 : 500}
            height={isMobile ? 290 : 500}
          />
        </div>
      </div>
    </div>
  );
}
