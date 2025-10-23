"use client";
import Typography from "@/app/[locale]/_components/Base/Typography";
import ButtonIconLeftOutline from "@/app/[locale]/_components/Buttons/ButtonIconLeftOutline";
import Buttons from "@/app/[locale]/_components/Buttons/Buttons";
import BrDetailsCard from "@/app/[locale]/_components/Cards/BrDetailsCard";
import ChartAnalyticsCard from "@/app/[locale]/_components/Cards/ChartAnalyticsCard";
import SupplierQuoteCard from "@/app/[locale]/_components/Cards/SupplierQuoteCard";
import TempMobScreen from "@/app/[locale]/_components/Common/TempMobScreen";
import {
  ArrowSwapIcon,
  LeftArrowIcon,
  QuotesIcon,
} from "@/app/[locale]/_components/Icons/SVGIcons";
import DatePipe from "@/app/[locale]/_components/Pipe/DatePipe";
import useIsMobile from "@/app/[locale]/_hooks/useIsMobile";
import { BuyingRequestDetails } from "@/app/[locale]/_interface/RfqInterface";
import { useGetBuyingRequestDetailsQuery } from "@/app/[locale]/_store/apiReducer/buyingRequestApi";
import Link from "next/link";
import { use, useEffect, useState } from "react";

const page = ({ params }: { params: Promise<any> }) => {
  const [previewData, setPreviewData] = useState<BuyingRequestDetails | null>(
    null
  );
  const isMobile = useIsMobile(1200);
  const unwrappedParams = use(params);

  const { data, isSuccess } = useGetBuyingRequestDetailsQuery(
    unwrappedParams?.id ?? undefined,
    { skip: !unwrappedParams?.id }
  );

  useEffect(() => {
    if (isSuccess && data) {
      setPreviewData(data.data);
    }
  }, [data, isSuccess]);

  if (isMobile) {
    return <TempMobScreen />;
  }

  return (
    <>
      {previewData && (
        <div className="landing-page-layout buying-request-layout">
          <header className="l-p-l-header">
            <div className="l-p-l-h-left">
              <div className="previous-btn-comp">
                <Link href={"/app/sourcing-rfq"} className="btn-comp btn-icon">
                  <LeftArrowIcon />
                </Link>
                <Typography variant="span" className="p-b-c-txt fnt-w-600">
                  {previewData?.rfqTitle ? previewData?.rfqTitle :""}
                </Typography>
              </div>
            </div>
            <div className="l-p-l-h-right">
              <ButtonIconLeftOutline
                name={"Edit Details"}
                className={"bg-outline-grey custom-width"}
              ></ButtonIconLeftOutline>
              <div className="valid-txt">
                <Typography variant="span" className="v-t-label">
                  Validity Date
                </Typography>
                <Typography variant="span" className="v-t-value">
                  {previewData.validityDate ? (
                    <DatePipe value={previewData.validityDate} type="date" />
                  ) : (
                    "Open Ended"
                  )}
                </Typography>
              </div>
              <Link href={"/app/sourcing-rfq"}>
                <Buttons
                  className={"btn-c-primary"}
                  disabled={true}
                  text={"Re-Post"}
                />
              </Link>
            </div>
          </header>
          <div className="l-p-l-body-block">
            <section className="l-p-l-body">
              <div className="l-p-l-b-left">
                <BrDetailsCard {...previewData} />
              </div>
              <aside className="l-p-l-b-right">
                <div className="box-shads-2 product-right-info status-box">
                  <div className="p-r-i-item">
                    <div className="space-btwn">
                      <div className="icon-label">
                        <label htmlFor="status" className="i-l-txt">
                          Status
                        </label>
                      </div>
                      <span className="table-badge-comp order-confirm">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
                <ChartAnalyticsCard
                  impressions={previewData.analytics.impressions}
                  views={previewData.analytics.views}
                  quotes={previewData.analytics.quotesReceivedCount}
                />
              </aside>
            </section>
            <div className="quotes-received-block">
              <div className="block-head">
                <div className="b-h-left d-flex gap-10px align-cntr">
                  <QuotesIcon />
                  <Typography variant="span" className="b-h-title">
                    Quotes Received
                  </Typography>
                </div>
                <div className="b-h-right">
                  <ButtonIconLeftOutline
                    name={"Sort By"}
                    className={"bg-outline-grey btn-c-sm"}
                  >
                    <ArrowSwapIcon />
                  </ButtonIconLeftOutline>
                </div>
              </div>
              <SupplierQuoteCard data={[]} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default page;
