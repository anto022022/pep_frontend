import { Variant } from "@/app/[locale]/(pages)/app/(sales)/sales-product/form/(forms)/AttributesVariants";
import { getImageUrl, groupByAttribute } from "@/app/[locale]/_hooks/utility";
import { PreviewData } from "@/app/[locale]/_interface/SalesProductInterface";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Typography from "../../../Base/Typography";
import {
  AddImageVariantIcon,
  DownVariantsIcon,
  SearchIcon,
} from "../../../Icons/SVGIcons";
import Select from "../Select";

const AttributesVaraintsDetails = ({
  previewData,
}: {
  previewData: PreviewData;
}) => {
  const [groupBy, setGroupBy] = useState<string>("");
  const [groupedVariant, setGroupedVariants] = useState<
    Record<string, Variant[]>
  >({});
  const [groupSearch, setGroupSearch] = useState("");
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const t = useTranslations("salesProduct.viewPage.attributes");

  useEffect(() => {
    if (
      previewData.variantAttributes &&
      previewData.variantAttributes.length > 0
    ) {
      setGroupBy(previewData.variantAttributes[0].key);
    }
  }, [previewData, previewData.variantAttributes]);

  useEffect(() => {
    if (groupBy && previewData?.variants && previewData?.variants.length > 0) {
      setGroupedVariants(
        groupByAttribute(previewData?.variants, groupBy, groupSearch)
      );
    }
  }, [groupBy, previewData.variants, groupSearch]);

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="tabs-content">
      <div className="tabs-form-group">
        <label htmlFor="Technical Specification" className="t-f-g-label">
          {t("detailedDescription")}
        </label>
        <span className="t-f-g-txt">
          {previewData?.detailedDescription
            ? previewData?.detailedDescription
            : "--"}{" "}
        </span>
      </div>
      <div className="tabs-form-group">
        <label htmlFor="Product Application" className="t-f-g-label">
          {t("applications")}
        </label>
        <span className="t-f-g-txt">
          {previewData?.productApplications
            ? previewData?.productApplications
            : "--"}
        </span>
      </div>

      <div className="tabs-form-group">
        <label htmlFor="Product Attributes" className="t-f-g-label">
          {t("productAttributes")}
        </label>
        {previewData?.variantAttributes &&
        previewData?.variantAttributes.length > 0 ? (
          <table className="product-attributes-table">
            <thead>
              <tr>
                <th> {t("attributes")}</th>
                <th> {t("value")}</th>
              </tr>
            </thead>
            <tbody>
              {previewData?.variantAttributes &&
                previewData?.variantAttributes.map((attribute, index) => {
                  return (
                    <tr key={index}>
                      <td>{attribute.key}</td>
                      <td>{attribute.values.join(", ")}</td>
                    </tr>
                  );
                })}
              {/* {previewData?.attributes &&
                previewData?.attributes.map((attribute, index) => {
                  if (attribute.values.length > 0) {
                    return (
                      <tr key={index}>
                        <td>{attribute.key}</td>
                        <td>{attribute.values.map(value => value.name).join(", ")}</td>
                      </tr>
                    );
                  }
                })
              } */}
            </tbody>
          </table>
        ) : (
          <p>--</p>
        )}
      </div>
      {previewData.variantAttributes &&
      previewData.variants &&
      previewData.variantAttributes.length > 0 &&
      previewData.variants.length > 0 ? (
        <div className="tabs-form-group variants-tabs">
          <div className="variants-table-comp">
            <div className="v-t-c-header">
              <div className="forms-group f-g-horiz">
                <label className="f-g-label" htmlFor="Group by">
                  {t("groupBy")}
                </label>
                <Select
                  value={groupBy}
                  options={previewData?.variantAttributes || []}
                  optionLabel="key"
                  optionValue="key"
                  onChange={(value) => setGroupBy(value)}
                />
              </div>
              <div className="icon-input-comp invert">
                <SearchIcon />
                <input
                  placeholder={t("searchProduct")}
                  type="search"
                  className="forms-input"
                  onChange={(e) => setGroupSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="variants-table-responsive">
              <table className="variants-table">
                <thead>
                  <tr>
                    <th>
                      <label className={`forms-checkbox light-bg`}>
                        <input type="checkbox" disabled={true} />
                        <span className="custom-checkbox"></span>
                      </label>
                    </th>
                    <th> {t("variantDetails")}</th>
                    <th className="variant-detail-th">
                      {/* {previewData?.pricing.pricingType===PricingType.FIXED&&t("price")}
                      {previewData?.pricing.pricingType===PricingType.PRICE_RANGE&&t("priceRange")} */}
                      {Object.values(openGroups).find((val) => val === true) &&
                        t("variantName")}
                    </th>
                    <th>
                      {" "}
                      {Object.values(openGroups).find((val) => val === true) &&
                        t("moq")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(groupedVariant).map((key, index) => {
                    // const groupMinPriceIndex = 0;
                    // const isSamePrice =
                    //   groupMinPriceIndex !== undefined &&
                    //   groupedVariant[key].every(
                    //     (variant) =>
                    //       variant.price ===
                    //       groupedVariant[key][groupMinPriceIndex].price
                    //   );

                    // const isSameMinPrice =
                    //   groupMinPriceIndex !== undefined &&
                    //   groupedVariant[key].every(
                    //     (variant) =>
                    //       variant.minPrice ===
                    //       groupedVariant[key][groupMinPriceIndex].minPrice
                    //   );

                    // const isSameMaxPrice =
                    //   groupMinPriceIndex !== undefined &&
                    //   groupedVariant[key].every(
                    //     (variant) =>
                    //       variant.maxPrice ===
                    //       groupedVariant[key][groupMinPriceIndex].maxPrice
                    //   );

                    const availableValue = groupedVariant[key].every(
                      (variant) => variant.available
                    );

                    // const priceValue = isSamePrice
                    //   ? groupedVariant[key][groupMinPriceIndex].price
                    //   : undefined;

                    // const minPriceValue = isSameMinPrice
                    //   ? groupedVariant[key][groupMinPriceIndex].minPrice
                    //   : undefined;

                    // const maxPriceValue = isSameMaxPrice
                    //   ? groupedVariant[key][groupMinPriceIndex].maxPrice
                    //   : undefined;
                    return (
                      <React.Fragment key={`${key}-${index}`}>
                        <tr>
                          <td>
                            <label
                              className={`forms-checkbox light-bg`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                checked={availableValue}
                                disabled={true}
                              />
                              <span className="custom-checkbox"></span>
                            </label>
                          </td>
                          <td>
                            <div className="variant-info">
                              <div className="v-i-img">
                                <AddImageVariantIcon />
                              </div>
                              <div className="v-i-content">
                                <Typography
                                  variant="span"
                                  className="v-i-c-title"
                                >
                                  {key}
                                </Typography>
                                <button
                                  type="button"
                                  className="btn-open-variant"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleGroup(key);
                                  }}
                                >
                                  <Typography
                                    variant="span"
                                    className="b-o-v-txt"
                                  >
                                    {groupedVariant[key].length} {t("variants")}
                                  </Typography>
                                  <DownVariantsIcon />
                                </button>
                              </div>
                            </div>
                          </td>
                          <td></td>
                          <td>
                            {/* <div className="price-range-inputs-group">
                              <input
                                type="number"
                                className="forms-input"
                                style={{
                                  display: priceRange ? "none" : "block",
                                }}
                                value={priceValue ? priceValue : ""}
                                placeholder="$0.00"
                                disabled={true}
                              />
                              <input
                                type="number"
                                className="forms-input"
                                value={minPriceValue ? minPriceValue : ""}
                                placeholder="$0.00"
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  display: !priceRange ? "none" : "block",
                                }}
                                disabled={true}
                              />
                              <input
                                type="number"
                                className="forms-input"
                                value={maxPriceValue ? maxPriceValue : ""}
                                style={{
                                  display: !priceRange ? "none" : "block",
                                }}
                                placeholder="$0.00"
                                onClick={(e) => e.stopPropagation()}
                                disabled={true}
                              />
                            </div> */}
                          </td>
                        </tr>
                        {openGroups[key] &&
                          groupedVariant[key].map((variant, gvIndex) => {
                            const variantValue: Variant =
                              groupedVariant[key][gvIndex];
                            return (
                              <tr className="inside-tr" key={variant.index}>
                                <td></td>
                                <td>
                                  <div className="variant-info">
                                    <label
                                      className={`forms-checkbox light-bg`}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={variantValue.available}
                                        onClick={(e) => e.stopPropagation()}
                                        disabled={true}
                                      />
                                      <span className="custom-checkbox"></span>
                                    </label>
                                    <div className="v-i-img">
                                      {variantValue.variantImg.length > 0 ? (
                                        <Image
                                          src={getImageUrl(
                                            variantValue.variantImg[0].src
                                          )}
                                          width={52}
                                          height={52}
                                          alt="Product"
                                          sizes="100vw"
                                        ></Image>
                                      ) : (
                                        <AddImageVariantIcon />
                                      )}
                                    </div>
                                    <div className="v-i-content">
                                      {variant.displayName && (
                                        <Typography
                                          variant="span"
                                          className="v-i-c-title"
                                        >
                                          {variant.displayName}
                                        </Typography>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <p className="variant-name-description">
                                    {variantValue.variantName}
                                  </p>
                                </td>
                                <td>
                                  {/* <div className="price-range-inputs-group">
                                    <input
                                      type="number"
                                      className={`forms-input`}
                                      style={{
                                        display: priceRange ? "none" : "block",
                                      }}
                                      value={
                                        variantValue.price
                                          ? variantValue.price
                                          : ""
                                      }
                                      onClick={(e) => e.stopPropagation()}
                                      disabled={true}
                                      placeholder="$0.00"
                                    />
                                    <input
                                      type="number"
                                      className={`forms-input`}
                                      style={{
                                        display: !priceRange ? "none" : "block",
                                      }}
                                      value={
                                        variantValue.minPrice
                                          ? variantValue.minPrice
                                          : ""
                                      }
                                      onClick={(e) => e.stopPropagation()}
                                      disabled={true}
                                      placeholder="$0.00"
                                    />
                                    <input
                                      type="number"
                                      style={{
                                        display: !priceRange ? "none" : "block",
                                      }}
                                      className={`forms-input`}
                                      value={
                                        variantValue.maxPrice
                                          ? variantValue.maxPrice
                                          : ""
                                      }
                                      placeholder="$0.00"
                                      onClick={(e) => e.stopPropagation()}
                                      disabled={true}
                                    />
                                  </div> */}
                                  {variantValue.minOrderQuantity &&
                                  variantValue.moqUnit
                                    ? `${variantValue.minOrderQuantity} - ${variantValue.moqUnit}`
                                    : "--"}
                                </td>
                              </tr>
                            );
                          })}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <p>--</p>
      )}
    </div>
  );
};

export default AttributesVaraintsDetails;
