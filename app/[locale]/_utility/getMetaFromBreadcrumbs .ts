import { BreadcrumbItemWithRef } from "./breadcrumbTrail";

export function getMetaFromBreadcrumbs(
  data: BreadcrumbItemWithRef[],
  fallbackTitle = "Default Title",
  fallbackPath = "/"
) {
  const lastIndex = data.length - 1;

  const title = data[lastIndex]?.name ?? fallbackTitle;

  let path = fallbackPath;

  if (lastIndex > 0) {
    const prev = data[lastIndex - 1];

    const basePath =
      prev.type !== "sc-2" ? `/${prev.type}/${prev.path}` : `/${prev.path}`;

    const queryString = prev.encryptedRef
      ? `?ref=${encodeURIComponent(prev.encryptedRef)}`
      : "";

    path = `${basePath}${queryString}`;
  }

  return { title, path };
}
