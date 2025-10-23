import { BreadcrumbItem } from "@/app/[locale]/_components/Cards/Marketplace/BreadCrumbs";
import { parseCategoryString } from "@/app/[locale]/_hooks/utility";
import {
  decryptBreadcrumbs,
  encryptBreadcrumbs,
} from "@/app/[locale]/_utility/crypto";

export interface BreadcrumbItemWithRef extends BreadcrumbItem {
  encryptedRef: string;
}

export function updateBreadcrumbTrail(
  ref: string | undefined,
  current?: BreadcrumbItem
): {
  refQuery: string;
  breadCrumpData: BreadcrumbItemWithRef[];
  categoryPaths: {
    category: string | null;
    subcategory: string | null;
  };
} {
  let trail: BreadcrumbItem[] = [];

  if (ref) {
    try {
      trail = decryptBreadcrumbs(ref);
    } catch (err) {
      console.error("❌ Error decrypting breadcrumbs:", err);
      trail = [];
    }
  }

  if (current) {
    trail = trail.filter(
      (item) => item.path !== current.path && item.type !== current.type
    );
    trail.push(current);
  }

  // Build breadcrumb list with encryptedRef for each item
  const breadCrumpDataWithRef: BreadcrumbItemWithRef[] = trail.map(
    (item, index) => ({
      ...item,
      encryptedRef: encryptBreadcrumbs(trail.slice(0, index)),
    })
  );

  const refQuery = encryptBreadcrumbs(trail);

  // Extract latest category and subcategory paths
  const categoryItem = [...trail].reverse().find((item) => item.type === "c");
  const subcategoryItem = [...trail]
    .reverse()
    .find((item) => item.type === "sc");

  const categoryPaths = {
    category:
      typeof categoryItem?.path === "string"
        ? parseCategoryString(categoryItem.path).id
        : null,
    subcategory:
      typeof subcategoryItem?.path === "string"
        ? parseCategoryString(subcategoryItem?.path).id
        : null,
  };

  return {
    refQuery,
    breadCrumpData: breadCrumpDataWithRef,
    categoryPaths,
  };
}
