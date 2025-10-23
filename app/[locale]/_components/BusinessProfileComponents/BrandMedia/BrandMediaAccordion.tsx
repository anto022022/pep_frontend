import AccordionHeader from "@/app/[locale]/_components/Common/AccordionHeader";
import { BusinessProfileStageKey } from "@/app/[locale]/_models/StoreFront";
import { RootState, useAppSelector } from "@/app/[locale]/_store/store";
import { Accordion, AccordionTab } from "primereact/accordion";
import { useEffect, useState } from "react";
import BrandMediaSection from "./BrandMediaSection";
import { useTranslations } from "next-intl";

const BrandMediaAccordion = () => {
  const initialEditState = {
    [BusinessProfileStageKey.BrandingMedia]: false,
  };
  const t=useTranslations("businessProfile");
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
      key: BusinessProfileStageKey.BrandingMedia,
      header: (
        <AccordionHeader
          title={t("businessProfileStepper.brandingAndMedia.title")}
          
          isEdit={editState[BusinessProfileStageKey.BrandingMedia]}
          handleEdit={() =>
            handelEditState(BusinessProfileStageKey.BrandingMedia, true)
          }
        />
      ),
      children: (
        <BrandMediaSection
          isEdit={editState[BusinessProfileStageKey.BrandingMedia]}
          onSuccess={() =>
            handelEditState(BusinessProfileStageKey.BrandingMedia, false)
          }
          updateEditStatus={(key: string, value: boolean) => handelEditState(key, value)}
        />
      ),
    },
  ];

  // Helper to map tab key to index
  const tabKeyToIndex = (key: string) => {
    return accordionSections.findIndex((section) => section.key === key);
  };

  useEffect(() => {
    if (!currentProductForm) return;
    const idx = tabKeyToIndex(currentProductForm);
    if (idx === -1) return;

    setActiveIndex((prev) => {
      if (prev.includes(idx)) return prev;
      return [...prev, idx];
    });

    setTimeout(() => {
      const el = document.getElementById(`accordion-tab-${currentProductForm}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  }, [currentProductForm]);

  return (
    <div className="accordion-comp a-c-business-profile">

      <Accordion
        activeIndex={activeIndex}
        onTabChange={(e) =>
          setActiveIndex(Array.isArray(e.index) ? e.index : [e.index])
        }
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

export default BrandMediaAccordion;
