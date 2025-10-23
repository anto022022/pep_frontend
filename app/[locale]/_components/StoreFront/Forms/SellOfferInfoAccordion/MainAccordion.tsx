"use client";
import { SellOfferPreviewData } from "@/app/[locale]/_interface/SellOfferInterface";
import { ProductOfferKey } from "@/app/[locale]/_models/StoreFront";
import { setCurrentForm } from "@/app/[locale]/_store/reducers/stepper_status_store";
import { useAppDispatch } from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Accordion, AccordionTab } from "primereact/accordion";
import React from "react";
import Typography from "../../../Base/Typography";
import { EditIcon } from "../../../Icons/SVGIcons";
import BasicInfoTab from "./BasicInfoTab";
import OfferDetails from "./OfferDetails";
import PricingPayment from "./PricingPayment";

const MainAccordion = ({
  previewData,
  id,
}: {
  previewData: SellOfferPreviewData;
  id: string;
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  //const[editing,setEditing]=useState<boolean>(true);
  // const currentSellOfferForm = useAppSelector(
  //   (state: RootState) => state.stepperStatus.currentForm
  // );

  const t = useTranslations("salesOffer.viewPage");

  type ProductOfferKeyType = keyof typeof ProductOfferKey;

  const handleEdit = (page: ProductOfferKeyType) => {
    dispatch(setCurrentForm(ProductOfferKey[page]));
    router.push(`./form?id=${id}&CurrentForm=${page}`);
  };

  const tabs: {
    header: React.ReactNode;
    children: React.ReactNode;
    disabled?: boolean;
  }[] = [
    {
      header: (
        <div className="accordion-header-left">
          <Typography variant="h2" className="a-h-l-title">
            {t("productInfoLabel")}
          </Typography>
          {/* <div
            className="edit-icon-action"
            onClick={() => handleEdit(ProductOfferKey.ProductDetails)}
          >
            <EditIcon />
          </div> */}
        </div>
      ),
      children: <BasicInfoTab previewData={previewData} />,
    },
    {
      header: (
        <div className="accordion-header-left">
          <Typography variant="h2" className="a-h-l-title">
            {t("offerLabel")}
          </Typography>
          <div
            className="edit-icon-action"
            onClick={() => handleEdit(ProductOfferKey.OfferDetails)}
          >
            <EditIcon />
          </div>
        </div>
      ),
      children: <OfferDetails previewData={previewData} />,
    },
    {
      header: (
        <div className="accordion-header-left">
          <Typography variant="h2" className="a-h-l-title">
            {t("pricingLabel")}
          </Typography>
          <div
            className="edit-icon-action"
            onClick={() => handleEdit(ProductOfferKey.PaymentShipping)}
          >
            <EditIcon />
          </div>
        </div>
      ),
      children: <PricingPayment previewData={previewData} />,
    },
  ];

  const activeIndex = tabs.map((_, index) => index);

  return (
    <div className="accordion-comp">
      <Accordion activeIndex={activeIndex} multiple>
        {tabs.map((tab, i) => (
          <AccordionTab key={i} header={tab.header} disabled={tab.disabled}>
            {tab.children}
          </AccordionTab>
        ))}
      </Accordion>
    </div>
  );
};

export default MainAccordion;
