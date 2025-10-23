"use client";
import { BusinessTypePathEnum } from "@/app/[locale]/_interface/OnboardInterface";
import { RootState, useAppSelector } from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ReactNode, use } from "react";
import Typography from "../../../../_components/Base/Typography";

function StagingLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<any>;
}) {
  const reduxStepperData = useAppSelector(
    (state: RootState) => state.onboardingData.boardingStepper || []
  );
  const unwrappedParams = use(params);
  const locale = unwrappedParams?.locale || "en";
  const t = useTranslations("userType.enumTitle");

  // useEffect(() => {
  //   console.log("reduxStepperData", reduxStepperData);
  // }, [reduxStepperData]);

  return (
    <>
      {reduxStepperData.length > 0 && (
        <div className="timeline-step-form-wrap">
          <div className="timeline-steps-comp">
            <ul className="t-s-c-ul">
              {reduxStepperData.map((item: any, index: number) => {
                const isActive =
                  item[item?.enum] === "completed" ||
                  item[item?.enum] === "active";
                const isLatestActive = item[item?.enum] === "active";
                return (
                  <li
                    className={`${isActive ? "active" : ""} ${isLatestActive ? "latest-active" : ""
                      }`}
                    key={index}
                  >
                    <Link
                      href={`/${locale}/onboard/${BusinessTypePathEnum[item?.enum]
                        }`}
                    >
                      <Typography variant="span">{t(item?.title)}</Typography>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          {children}
        </div>
      )}
    </>
  );
}

export default StagingLayout;
