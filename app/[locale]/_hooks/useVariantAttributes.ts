import { useMemo } from "react";
import { Variant } from "@/app/[locale]/(pages)/app/(sales)/sales-product/form/(forms)/AttributesVariants";
import { VariantAttribute } from "@/app/[locale]/_interface/SalesProductInterface";
interface AttributeCounts {
    [attributeName: string]: number;
}

interface Result {
    availableVariants: Variant[];
    attributeCounts: AttributeCounts;
    availableAttributes: VariantAttribute[];
}

export const useAvailableVariantsWithAttributeCounts = (variants: Variant[]): Result => {
    return useMemo(() => {
        const availableVariants = variants.filter((v) => v.available);

        const attributeValueSets: Record<string, Set<string>> = {};

        for (const variant of availableVariants) {
            for (const [key, value] of Object.entries(variant.attributes)) {
                if (!attributeValueSets[key]) {
                    attributeValueSets[key] = new Set();
                }
                attributeValueSets[key].add(value);
            }
        }

        const attributeCounts: AttributeCounts = {};
        const availableAttributes: VariantAttribute[] = [];

        for (const [key, valueSet] of Object.entries(attributeValueSets)) {
            const values = Array.from(valueSet);
            attributeCounts[key] = values.length;
            availableAttributes.push({
                key,
                values,
            });
        }

        return {
            availableVariants,
            attributeCounts,
            availableAttributes,
        };
    }, [variants]);
};
