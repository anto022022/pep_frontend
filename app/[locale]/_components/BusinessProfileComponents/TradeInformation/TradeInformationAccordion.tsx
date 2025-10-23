import AccordionHeader from "@/app/[locale]/_components/Common/AccordionHeader";
import { BusinessProfileStageKey } from "@/app/[locale]/_models/StoreFront";
import { RootState, useAppSelector } from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import { Accordion, AccordionTab } from "primereact/accordion";
import { useEffect, useState } from "react";
import AdditionalTradeDetailsSection from "./AdditionalTradeDetailsSection";
import MarketLogisticsSection from "./MarketLogisticsSection";
import ShippingPaymentTermsSection from "./ShippingPaymentTermsSection";

const TradeInformationAccordion = () => {
  const initialEditState = {
    [BusinessProfileStageKey.MarketLogistics]: false,
    [BusinessProfileStageKey.ShippingPaymentTerms]: false,
    [BusinessProfileStageKey.AdditionalTradeDetails]: false,
  };
  const t = useTranslations("businessProfile.businessProfileStepper")
  const currentProductForm = useAppSelector(
    (state: RootState) => state.stepperStatus.currentForm
  );

  const [editState, setEditState] =
    useState<Record<string, boolean>>(initialEditState);

  const [activeIndex, setActiveIndex] = useState<number[]>([]);

  const handelEditState = (key: string, value: boolean) => {
    setEditState((prev) => {
      return { ...prev, [key]: value };
    });

    // If editing is enabled, activate the corresponding tab
    if (value) {
      const idx = tabKeyToIndex(key);
      if (idx !== -1) {
        setActiveIndex((prev) => {
          if (prev.includes(idx)) return prev;
          return [...prev, idx];
        });
      }
    }
  };

  const accordionSections = [
    {
      key: BusinessProfileStageKey.MarketLogistics,
      header: (
        <AccordionHeader
          title={t("marketAndLogistics")}
          isEdit={editState[BusinessProfileStageKey.MarketLogistics]}

          handleEdit={() =>
            handelEditState(BusinessProfileStageKey.MarketLogistics, true)
          }

        />
      ),
      children: (
        <MarketLogisticsSection
          updateEditStatus={(key: string, value: boolean) => handelEditState(key, value)}
          isEdit={editState[BusinessProfileStageKey.MarketLogistics]}
          onSuccess={() =>
            handelEditState(BusinessProfileStageKey.MarketLogistics, false)
          }
        />
      ),
    },
    {
      key: BusinessProfileStageKey.ShippingPaymentTerms,
      header: (
        <AccordionHeader
          title={t("shippingAndPaymentTerms")}
          isEdit={editState[BusinessProfileStageKey.ShippingPaymentTerms]}

          handleEdit={() =>
            handelEditState(BusinessProfileStageKey.ShippingPaymentTerms, true)
          }

        />
      ),
      children: (
        <ShippingPaymentTermsSection
          updateEditStatus={(key: string, value: boolean) => handelEditState(key, value)}
          isEdit={editState[BusinessProfileStageKey.ShippingPaymentTerms]}
          onSuccess={() =>
            handelEditState(BusinessProfileStageKey.ShippingPaymentTerms, false)
          }
        />
      ),
    },
    {
      key: BusinessProfileStageKey.AdditionalTradeDetails,
      header: (
        <AccordionHeader
          title={t("tradeInformationAdditional")}
          isEdit={editState[BusinessProfileStageKey.AdditionalTradeDetails]}

          handleEdit={() =>
            handelEditState(
              BusinessProfileStageKey.AdditionalTradeDetails,
              true
            )
          }

        />
      ),
      children: (
        <AdditionalTradeDetailsSection
          updateEditStatus={(key: string, value: boolean) => handelEditState(key, value)}
          isEdit={editState[BusinessProfileStageKey.AdditionalTradeDetails]}
          onSuccess={() =>
            handelEditState(
              BusinessProfileStageKey.AdditionalTradeDetails,
              false
            )
          }
        />
      ),
    },
  ];

  // Helper to map tab key to index
  const tabKeyToIndex = (key: string) => {
    return accordionSections.findIndex((section) => section.key === key);
  };

  useEffect(() => {
    setActiveIndex([0, 1, 2]);
  }, []);

  useEffect(() => {
    if (!currentProductForm) return;
    const idx = tabKeyToIndex(currentProductForm);
    if (idx === -1) return;

    setActiveIndex((prev) => (prev.includes(idx) ? prev : [...prev, idx]));

    setTimeout(() => {
      const el = document.getElementById(`accordion-tab-${currentProductForm}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  }, [currentProductForm]);

  const handleTabChange = (e: { index: number | number[] }) => {
    let indexes = Array.isArray(e.index) ? e.index : [e.index];

    indexes = indexes.map((i) => Number(i));

    setActiveIndex(indexes);
  };

  return (
    <div className="accordion-comp a-c-business-profile">
      <Accordion
        activeIndex={activeIndex}
        onTabChange={handleTabChange}
        multiple
      >
        {accordionSections.map((tab) => (
          <AccordionTab key={tab?.key} header={tab.header}>
            <div id={`accordion-tab-${tab.key}`}>{tab.children}</div>
          </AccordionTab>
        ))}
      </Accordion>
    </div>
  );
};

export default TradeInformationAccordion;
