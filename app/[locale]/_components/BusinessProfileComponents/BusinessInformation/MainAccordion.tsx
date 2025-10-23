"use client";
import AccordionHeader from "@/app/[locale]/_components/Common/AccordionHeader";

import { BusinessProfileStageKey } from "@/app/[locale]/_models/StoreFront";
import { RootState, useAppSelector } from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import { Accordion, AccordionTab } from "primereact/accordion";
import { useEffect, useState } from "react";
import AdditionalSection from "./AdditionalSection";
import BusinessDetailsSection from "./BusinessDetailsSection";
import CompanyRegistrationDetailsSection from "./CompanyRegistrationDetailsSection";

const MainAccordion = () => {
  const initialEditState = {
    [BusinessProfileStageKey.BusinessDetails]: false,
    [BusinessProfileStageKey.CompanyRegistrationDetails]: false,
    [BusinessProfileStageKey.FactoryWarehouseDetails]: false,
    [BusinessProfileStageKey.Additional]: false,
  };

  const currentProductForm = useAppSelector(
    (state: RootState) => state.stepperStatus.currentForm
  );

  const businessProfileT = useTranslations("businessProfile");


  const [editState, setEditState] =
    useState<Record<string, boolean>>(initialEditState);

  const [activeIndex, setActiveIndex] = useState<number[]>([]);




  // const handelEditState = (key: string, value: boolean) => {
  //   if (currentStepperStatus[BusinessProfileStageKey.BusinessDetails] !== "completed") {
  //         updateEditStatus(BusinessProfileStageKey.BusinessDetails, true);
  //       }
  //       else {
  //         updateEditStatus(BusinessProfileStageKey.BusinessDetails, false);
  //       }

  //   setEditState((prev) => {
  //     return { ...prev, [key]: value };
  //   });

  //   // If editing is enabled, activate the corresponding tab
  //   if (value) {
  //     const idx = tabKeyToIndex(key);
  //     if (idx !== -1) {
  //       setActiveIndex((prev) => {
  //         if (prev.includes(idx)) return prev;
  //         return [...prev, idx];
  //       });
  //     }
  //   }
  // };

  const handelEditState = (key: string, value: boolean) => {
    setEditState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const accordionSections = [
    {
      key: BusinessProfileStageKey.BusinessDetails,
      header: (
        <AccordionHeader
          title={businessProfileT("businessInformation.businessDetails.title")}
          subtxt={businessProfileT(
            "businessInformation.businessDetails.AllFieldsAreRequired"
          )}
          className={"title-700"}
          isEdit={editState[BusinessProfileStageKey.BusinessDetails]}
          handleEdit={() =>
            handelEditState(BusinessProfileStageKey.BusinessDetails, true)
          }
        />
      ),
      children: (
        <BusinessDetailsSection
          isEdit={editState[BusinessProfileStageKey.BusinessDetails]}
          onSuccess={() =>
            handelEditState(BusinessProfileStageKey.BusinessDetails, false)
          }
          updateEditStatus={(key: string, value: boolean) =>
            handelEditState(key, value)
          }
        />
      ),
    },
    {
      key: BusinessProfileStageKey.CompanyRegistrationDetails,
      header: (
        <AccordionHeader
          title={businessProfileT(
            "businessProfileStepper.companyRegistrationDetails"
          )}
          isEdit={editState[BusinessProfileStageKey.CompanyRegistrationDetails]}
          handleEdit={() =>
            handelEditState(
              BusinessProfileStageKey.CompanyRegistrationDetails,
              true
            )
          }
        />
      ),
      children: (
        <CompanyRegistrationDetailsSection
          isEdit={editState[BusinessProfileStageKey.CompanyRegistrationDetails]}
          onSuccess={() =>
            handelEditState(
              BusinessProfileStageKey.CompanyRegistrationDetails,
              false
            )
          }
          updateEditStatus={(key: string, value: boolean) =>
            handelEditState(key, value)
          }
        />
      ),
    },
    {
      key: BusinessProfileStageKey.Additional,
      header: (
        <AccordionHeader
          title={businessProfileT("businessProfileStepper.additional")}
          isEdit={editState[BusinessProfileStageKey.Additional]}
          handleEdit={() =>
            handelEditState(BusinessProfileStageKey.Additional, true)
          }
        />
      ),
      children: (
        <AdditionalSection
          isEdit={editState[BusinessProfileStageKey.Additional]}
          onSuccess={() =>
            handelEditState(BusinessProfileStageKey.Additional, false)
          }
          updateEditStatus={(key: string, value: boolean) =>
            handelEditState(key, value)
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
    if (!currentProductForm) return;
    const idx = tabKeyToIndex(currentProductForm);
    if (idx === -1) return;

    // setActiveIndex((prev) => {
    //   if (prev.includes(idx)) return prev;
    //   return [...prev, idx];
    // });
    setActiveIndex((prev) => (prev.includes(idx) ? prev : [...prev, idx]));

    setTimeout(() => {
      const el = document.getElementById(`accordion-tab-${currentProductForm}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  }, [currentProductForm]);

  useEffect(() => {
    setActiveIndex([0, 1, 2]);
  }, []);

  const handleTabChange = (e: { index: number | number[] }) => {
    // const clickedIndex = e.index as number;
    // setActiveIndex((prev) =>
    //   prev.includes(clickedIndex)
    //     ? prev.filter((i) => i !== clickedIndex) // close it
    //     : [...prev, clickedIndex] // open it
    // );
    // setActiveIndex((prev) => {
    //   if (prev.includes(clickedIndex)) {
    //     // Remove if already open
    //     return prev.filter((i) => i !== clickedIndex);
    //   } else {
    //     // Add if closed
    //     return [...prev, clickedIndex];
    //   }
    // });
    let indexes = Array.isArray(e.index) ? e.index : [e.index];

    // Ensure it's always flat & numeric
    indexes = indexes.map((i) => Number(i));

    setActiveIndex(indexes);
  };

  return (
    <>
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
    </>

  );
};

export default MainAccordion;