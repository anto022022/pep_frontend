import { useEffect, useState } from "react";

import AdditionalSection from "@/app/[locale]/_components/BusinessProfileComponents/FactoryWarehouseDetails/AdditionalSection";
import ManufacturingTeams from "@/app/[locale]/_components/BusinessProfileComponents/FactoryWarehouseDetails/ManufacturingTeams";
import AccordionHeader from "@/app/[locale]/_components/Common/AccordionHeader";
import { BusinessProfileStageKey } from "@/app/[locale]/_models/StoreFront";
import { RootState, useAppSelector } from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import { Accordion, AccordionTab } from "primereact/accordion";

const FactoryWarehouseDetailsAccordion = () => {
    const businessProfileT = useTranslations(
        "businessProfile"
    );
    const initialEditState = {
        [BusinessProfileStageKey.FactoryWarehouseDetails]: false,
        [BusinessProfileStageKey.AdditionalFactoryDetails]: false,
    };

    const currentProductForm = useAppSelector(
        (state: RootState) => state.stepperStatus.currentForm);

    const [editState, setEditState] =
        useState<Record<string, boolean>>(initialEditState);
    const [activeIndex, setActiveIndex] = useState<number[]>([]);

    const accordionSections = [
        {
            key: BusinessProfileStageKey.FactoryWarehouseDetails,
            header: (
                <AccordionHeader
                    title={businessProfileT("businessInformation.manufacturingTerms.title")}
                    className={'title-700'}
                    isEdit={editState[BusinessProfileStageKey.FactoryWarehouseDetails]}

                    handleEdit={() =>
                        handelEditState(BusinessProfileStageKey.FactoryWarehouseDetails, true)
                    }
                />
            ),
            children: (
                <ManufacturingTeams
                    isEdit={editState[BusinessProfileStageKey.FactoryWarehouseDetails]}
                    onSuccess={() =>
                        handelEditState(BusinessProfileStageKey.FactoryWarehouseDetails, false)
                    }
                    updateEditStatus={(key: string, value: boolean) => handelEditState(key, value)}
                />
            ),
        },
        {
            key: BusinessProfileStageKey.AdditionalFactoryDetails,
            header: (
                <AccordionHeader
                    title={businessProfileT("businessProfileStepper.additional")}
                    isEdit={editState[BusinessProfileStageKey.AdditionalFactoryDetails]}

                    handleEdit={() =>
                        handelEditState(
                            BusinessProfileStageKey.AdditionalFactoryDetails, true)
                    }
                />
            ),
            children: (
                <AdditionalSection
                    isEdit={editState[BusinessProfileStageKey.AdditionalFactoryDetails]}
                    onSuccess={() =>
                        handelEditState(
                            BusinessProfileStageKey.AdditionalFactoryDetails,
                            false
                        )
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
        setActiveIndex([0, 1]);
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

    const handleTabChange = (e: { index: number | number[] }) => {
        let indexes = Array.isArray(e.index) ? e.index : [e.index];
        // Ensure it's always flat & numeric
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

export default FactoryWarehouseDetailsAccordion;