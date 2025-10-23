import {
  attributsVariantsFormValue,
  Variant,
} from "@/app/[locale]/(pages)/app/(sales)/sales-product/form/(forms)/AttributesVariants";
import { getImageUrl } from "@/app/[locale]/_hooks/utility";
import { setIsVariantsidebarOpen } from "@/app/[locale]/_store/reducers/ui_store";
import {
  useAppDispatch,
} from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import {
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormTrigger,
} from "react-hook-form";
import Typography from "../../Base/Typography";
import { AddImageVariantIcon, DownVariantsIcon } from "../../Icons/SVGIcons";
import AddVariantInfoSidebar from "../../OverLay/AddVarientsInfo";

interface VariantsTableInterface {
  groupedVariant: Record<string, Variant[]>;
  setValue: UseFormSetValue<attributsVariantsFormValue>;
  getValues: UseFormGetValues<attributsVariantsFormValue>;
  errors: FieldErrors<attributsVariantsFormValue>;
  register: UseFormRegister<any>;
  trigger: UseFormTrigger<attributsVariantsFormValue>;
}

const VariantsTable: FC<VariantsTableInterface> = ({
  groupedVariant,
  setValue,
  getValues,
  errors,
  trigger,
}) => {
  const dispatch = useAppDispatch();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [selectedGroup, setSelectedGroup] = useState<Variant[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const t = useTranslations(
    "salesProduct.specifications.fields.variants.fields.variantTableHead"
  );

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSelectedGroup = (selectedGroup: Variant[], selectedIndex = 0) => {
    dispatch(setIsVariantsidebarOpen(true));
    setSelectedGroup(selectedGroup);
    setCurrentIndex(selectedIndex);
  };

  useEffect(() => {
    if (errors.variants && Array.isArray(errors.variants)) {
      const firstErrorIndex = errors.variants.findIndex(
        (variantError) => variantError !== null && variantError !== undefined
      );
      if (firstErrorIndex !== -1) {
        let groupNameWithError: string | null = null;
        let localGroupIndex: number | null = null;

        for (const groupName in groupedVariant) {
          const group = groupedVariant[groupName];

          const foundIndex = group.findIndex(
            (variant) => variant.index === firstErrorIndex
          );

          if (foundIndex !== -1) {
            groupNameWithError = groupName;
            localGroupIndex = foundIndex;
            break;
          }
        }

        if (groupNameWithError !== null && localGroupIndex !== null) {
          dispatch(setIsVariantsidebarOpen(true));
          setSelectedGroup(groupedVariant[groupNameWithError]);
          setCurrentIndex(localGroupIndex);
        }
      }
    }
  }, [errors]);

  const allChecked = Object.values(groupedVariant).every((group) =>
    group.every(
      (variant) =>
        variant.index !== undefined &&
        getValues(`variants.${variant.index}.available`)
    )
  );

  const handleSelectAll = (checked: boolean) => {
    Object.values(groupedVariant).forEach((group) => {
      group.forEach((variant) => {
        if (variant.index !== undefined) {
          setValue(`variants.${variant.index}.available`, checked);
          trigger([`variants.${variant.index}`]);
        }
      });
    });
  };

  return (
    <div className="variants-table-responsive">
      <table className="variants-table">
        <thead>
          <tr>
            <th>
              <label className={`forms-checkbox light-bg`}>
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
                <span className="custom-checkbox"></span>
              </label>
            </th>
            <th>{t("variant")}</th>
            <th className="variant-detail-th">
              {Object.values(openGroups).find((item) => item === true) &&
                t("VariantName")}
            </th>
            <th>
              {/* {pricingType===PricingType.PRICE_RANGE&&t("priceRange")}
              {pricingType===PricingType.FIXED&&t("price")} */}
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(groupedVariant).map((key, index) => {
            const availableValue = groupedVariant[key].every(
              (variant) =>
                variant.index !== undefined &&
                getValues(`variants.${variant.index}.available`)
            );
            return (
              <React.Fragment key={`${key}-${index}`}>
                <tr onClick={() => handleSelectedGroup(groupedVariant[key])}>
                  <td>
                    <label
                      className={`forms-checkbox light-bg`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={availableValue}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          groupedVariant[key].forEach((variant) => {
                            if (variant.index !== undefined) {
                              setValue(
                                `variants.${variant.index}.available`,
                                checked
                              );
                              trigger([`variants.${variant.index as number}`]);
                            }
                          });
                        }}
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
                        <Typography variant="span" className="v-i-c-title">
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
                          <Typography variant="span" className="b-o-v-txt">
                            {groupedVariant[key].length}{" "}
                            {groupedVariant[key].length > 1
                              ? t("variants")
                              : t("variant")}
                          </Typography>
                          <DownVariantsIcon />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td></td>
                  <td>
                    {/*<div className="price-range-inputs-group">
                     <input
                        type="number"
                        className="forms-input"
                        style={{display:priceRange?"none":"block"}}
                        value={priceValue ? priceValue : ""}
                        placeholder="$0.00"
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          groupedVariant[key].forEach((variant) => {
                            if (variant.index !== undefined) {
                              setValue(
                                `variants.${variant.index}.price`,
                                value >= 0 ? value : undefined,
                                {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                }
                              );
                            }
                          });
                        }}
                      />
                      <input
                        type="number"
                        className="forms-input"
                        value={minPriceValue ? minPriceValue : ""}
                        placeholder="$0.00"
                        onClick={(e) => e.stopPropagation()}
                        style={{display:!priceRange?"none":"block"}}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          groupedVariant[key].forEach((variant) => {
                            if (variant.index !== undefined) {
                              setValue(
                                `variants.${variant.index}.minPrice`,
                                value >= 0 ? value : undefined,
                                {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                }
                              );
                            }
                          });
                        }}
                      />
                      <input
                        type="number"
                        className="forms-input"
                        value={maxPriceValue ? maxPriceValue : ""}
                        style={{display:!priceRange?"none":"block"}}
                        placeholder="$0.00"
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          groupedVariant[key].forEach((variant) => {
                            if (variant.index !== undefined) {
                              setValue(
                                `variants.${variant.index}.maxPrice`,
                                value,
                                {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                }
                              );
                            }
                          });
                        }}
                      />
                    </div> */}
                  </td>
                </tr>
                {openGroups[key] &&
                  groupedVariant[key].map((variant, gvIndex) => {
                    const variantValue: Variant = getValues(
                      `variants.${variant.index as number}`
                    );
                    return (
                      <tr
                        className="inside-tr"
                        key={variant.index}
                        onClick={() =>
                          handleSelectedGroup(groupedVariant[key], gvIndex)
                        }
                      >
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
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setValue(
                                    `variants.${
                                      variant.index as number
                                    }.available`,
                                    checked
                                  );
                                  trigger([
                                    `variants.${variant.index as number}`,
                                  ]);
                                }}
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
                              className={`forms-input ${
                                errors.variants?.[variant.index as number]
                                  ?.price?.message
                                  ? "error-input"
                                  : ""
                              }`}
                              style={{display:priceRange?"none":"block"}}
                              value={
                                variantValue.price ? variantValue.price : ""
                              }
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                const value = e.target.value;
                                const parsed = parseFloat(value);
                                if (!isNaN(parsed)) {
                                  setValue(
                                    `variants.${variant.index as number}.price`,
                                    parsed
                                  );
                                  trigger([
                                    `variants.${variant.index as number}.price`,
                                  ]);
                                } else {
                                  setValue(
                                    `variants.${variant.index as number}.price`,
                                    undefined
                                  );
                                }
                              }}
                              placeholder="$0.00"
                            />
                            <input
                              type="number"
                              className={`forms-input ${
                                errors.variants?.[variant.index as number]
                                  ?.minPrice?.message
                                  ? "error-input"
                                  : ""
                              }`}
                              style={{display:!priceRange?"none":"block"}}
                              value={
                                variantValue.minPrice
                                  ? variantValue.minPrice
                                  : ""
                              }
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                const value = e.target.value;
                                const parsed = parseFloat(value);
                                if (!isNaN(parsed)) {
                                  setValue(
                                    `variants.${
                                      variant.index as number
                                    }.minPrice`,
                                    parsed
                                  );
                                  trigger([
                                    `variants.${
                                      variant.index as number
                                    }.minPrice`,
                                  ]);
                                } else {
                                  setValue(
                                    `variants.${
                                      variant.index as number
                                    }.minPrice`,
                                    undefined
                                  );
                                }
                              }}
                              placeholder="$0.00"
                            />
                            <input
                              type="number"
                              style={{display:!priceRange?"none":"block"}}
                              className={`forms-input ${
                                errors.variants?.[variant.index as number]
                                  ?.maxPrice?.message
                                  ? "error-input"
                                  : ""
                              }`}
                              value={
                                variantValue.maxPrice
                                  ? variantValue.maxPrice
                                  : ""
                              }
                              placeholder="$0.00"
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                const value = e.target.value;
                                const parsed = parseFloat(value);
                                if (!isNaN(parsed)) {
                                  setValue(
                                    `variants.${
                                      variant.index as number
                                    }.maxPrice`,
                                    parsed
                                  );
                                  trigger([
                                    `variants.${
                                      variant.index as number
                                    }.maxPrice`,
                                  ]);
                                } else {
                                  setValue(
                                    `variants.${
                                      variant.index as number
                                    }.maxPrice`,
                                    undefined
                                  );
                                }
                              }}
                            />
                          </div> */}
                        </td>
                      </tr>
                    );
                  })}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      <AddVariantInfoSidebar
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        selectedGroup={selectedGroup}
        setValue={setValue}
        getValues={getValues}
        trigger={trigger}
        errors={errors}
      />
    </div>
  );
};

export default VariantsTable;
