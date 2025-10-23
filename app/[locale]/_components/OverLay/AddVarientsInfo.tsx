import {
  BulkPrice,
  ProductImage,
} from "@/app/[locale]/_interface/MarketPlaceInterface";
import {
  BulkPricing,
  ProductPricing,
} from "@/app/[locale]/_interface/SalesProductInterface";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Sidebar } from "primereact/sidebar";
import { useEffect, useState } from "react";
import {
  FieldErrors,
  UseFormGetValues,
  UseFormSetValue,
  UseFormTrigger
} from "react-hook-form";
import {
  attributsVariantsFormValue,
  Variant,
} from "../../(pages)/app/(sales)/sales-product/form/(forms)/AttributesVariants";
import { useLocalizedOptions } from "../../_hooks/useLocalizedOptions";
import { getImageUrl } from "../../_hooks/utility";
import { PricingType, unitOption } from "../../_models/StoreFront";
import {
  setIsVariantsidebarOpen,
  showToast,
} from "../../_store/reducers/ui_store";
import { RootState, useAppDispatch, useAppSelector } from "../../_store/store";
import Typography from "../Base/Typography";
import ButtonIcon from "../Buttons/ButtonIcon";
import ButtonIconLeftOutline from "../Buttons/ButtonIconLeftOutline";
import ButtonIconRight from "../Buttons/ButtonIconRight";
import {
  AddImageVariantIcon,
  CloseIcon,
  PlusIcon,
  RightArrowIcon,
  SearchIcon,
  TrashTableIcon
} from "../Icons/SVGIcons";
import DndImageUpload from "../StoreFront/Forms/DndImageUpload";
import InputField from "../StoreFront/Forms/InputField";
import Select from "../StoreFront/Forms/Select";
interface AddVarientInfoSidebarProps {
  currentIndex: number;
  setCurrentIndex: (n: number) => void;
  selectedGroup: Variant[];
  setValue: UseFormSetValue<attributsVariantsFormValue>;
  getValues: UseFormGetValues<attributsVariantsFormValue>;
  trigger: UseFormTrigger<attributsVariantsFormValue>;
  errors: FieldErrors<attributsVariantsFormValue>;
}
const AddVariantInfoSidebar = ({
  currentIndex = 0,
  setCurrentIndex,
  selectedGroup,
  setValue,
  getValues,
  trigger,
  errors,
}: AddVarientInfoSidebarProps) => {
  const dispatch = useAppDispatch();
  const productName: string = useAppSelector(
    (state: RootState) => state.preview?.productName
  );
  const productImage: ProductImage[] = useAppSelector(
    (state: RootState) => state.preview?.productImage
  );
  const isVariantsidebarOpen = useAppSelector(
    (state: RootState) => state.uiData.isVariantsidebarOpen
  );

  const [tempVariants, setTempVariants] = useState<Variant[]>([]);
  const [originalVariants, setOriginalVariants] = useState<Variant[]>([]);
  const [queryDisplayName, setQueryDisplayName] = useState<string>("");

  const t = useTranslations(
    "salesProduct.specifications.fields.variants.fields.variantFields"
  );
  const localizedUnitList = useLocalizedOptions("salesProduct", unitOption);

  // useEffect(() => {
  //   console.log("tempVariants", tempVariants);
  // }, [tempVariants]);

  useEffect(() => {
    if (isVariantsidebarOpen) {
      const variants = getValues("variants");
      setOriginalVariants([...variants]);
      setTempVariants([...variants]);
    }
  }, [isVariantsidebarOpen]);

  if (!selectedGroup || selectedGroup.length === 0) return null;

  const selectedItem = selectedGroup[currentIndex];
  if (!selectedItem) return null;

  const variantLength = tempVariants.length;
  const variantValue = tempVariants[selectedItem.index as number];

  const updateTempVariant = (index: number, key: string, value: any) => {
    setTempVariants((prev) => {
      const newVariants = [...prev];
      newVariants[index] = { ...newVariants[index], [key]: value };
      return newVariants;
    });
  };

  const updateTempVariantPricing = (
    index: number,
    keyPath: string,
    value: any
  ) => {
    setTempVariants((prev) => {
      const newVariants = [...prev];
      const variant = { ...newVariants[index] };

      const pricing: ProductPricing = { ...variant.pricing } as ProductPricing;
      const keys = keyPath.split(".");

      let target: any = pricing;
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        const nextKey = keys[i + 1];
        const isArrayIndex = /^\d+$/.test(nextKey);

        if (target[key] === undefined) {
          target[key] = isArrayIndex ? [] : {};
        } else {
          target[key] = Array.isArray(target[key])
            ? [...target[key]]
            : { ...target[key] };
        }
        target = target[key];
      }

      target[keys[keys.length - 1]] = value;
      variant.pricing = pricing;
      // Recalculate minOrderQuantity here
      if (
        pricing.pricingType === PricingType.BULK &&
        pricing.bulkPrices?.length
      ) {
        const minQty = Math.min(
          ...pricing.bulkPrices.map((p: BulkPrice) => p.minQty)
        );
        variant.minOrderQuantity = minQty;
      }
      newVariants[index] = variant;

      return newVariants;
    });
  };

  const handleBulkPriceDelete = (
    variantIndex: number,
    bulkPriceIndex: number
  ) => {
    setTempVariants((prev) => {
      const newVariants = [...prev];
      const variant = { ...newVariants[variantIndex] };
      const pricing: BulkPricing = { ...variant.pricing };

      pricing.bulkPrices = pricing.bulkPrices.filter(
        (_, i) => i !== bulkPriceIndex
      );

      // Optional: Update minOrderQuantity if needed
      if (
        pricing.pricingType === PricingType.BULK &&
        pricing.bulkPrices.length > 1
      ) {
        const minQty = Math.min(...pricing.bulkPrices.map((p) => p.minQty));
        variant.minOrderQuantity = minQty;
      }

      variant.pricing = pricing;
      newVariants[variantIndex] = variant;
      return newVariants;
    });
  };

  const handleContinue = async () => {
    tempVariants.forEach((variant, idx) => {
      setValue(`variants.${idx}`, variant);
    });
    const variantPathsToValidate = selectedGroup.map(
      (variant) => `variants.${variant.index}` as const
    );
    const isValid = await trigger(
      variantPathsToValidate as Array<`variants.${number}`>
    );
    if (!isValid) {
      // Revert each invalid variant to the original (non-edited) version
      setQueryDisplayName("");
      selectedGroup.forEach((item) => {
        const idx = item.index as number;
        const hasError = Object.keys(errors?.variants?.[idx] || {}).length > 0;
        if (hasError) {
          setValue(`variants.${idx}`, originalVariants[idx]);
        }
      });
      for (let i = 0; i < selectedGroup.length; i++) {
        const item = selectedGroup[i];
        const hasError =
          Object.keys(errors?.variants?.[item.index as number] || {}).length >
          0;
        if (hasError) {
          setCurrentIndex(i);
          break;
        }
      }
      return;
    }
    // debugger;
    dispatch(setIsVariantsidebarOpen(false));
    setQueryDisplayName("");
  };

  const handleAddBulkPrice = (index: number) => {
    const emptyBulkPrice = {
      minQty: undefined,
      maxQty: undefined,
      price: undefined,
    };

    const isBulkPriceValid = (bp: typeof emptyBulkPrice) => {
      return (
        typeof bp.minQty === "number" &&
        typeof bp.maxQty === "number" &&
        typeof bp.price === "number"
      );
    };
    setTempVariants((prev) => {
      const newVariants = [...prev];
      const variant = newVariants[index];
      const bulkPrices = variant.pricing?.bulkPrices ?? [];

      // Check maximum limit
      if (bulkPrices.length >= 5) {
        dispatch(
          showToast({
            title: "Error!",
            message: "You can only add up to 5 BulkPrices.",
            theme: "error",
          })
        );
        return prev;
      }

      // Check if the last bulk price is valid
      if (
        bulkPrices.length > 0 &&
        !isBulkPriceValid(bulkPrices[bulkPrices.length - 1])
      ) {
        dispatch(
          showToast({
            title: "Error!",
            message: "Must fill the previous before adding a new one.",
            theme: "error",
          })
        );
        return prev;
      }

      // Add new bulk price
      const updatedVariant = {
        ...variant,
        pricing: {
          ...variant.pricing,
          bulkPrices: [...bulkPrices, emptyBulkPrice],
        },
      };

      newVariants[index] = updatedVariant;
      return newVariants;
    });
  };

  return (
    <>
      <Sidebar
        visible={isVariantsidebarOpen}
        position="right"
        onHide={async () => {
          await trigger("variants");
          dispatch(setIsVariantsidebarOpen(false));
          setQueryDisplayName("");
        }}
        className="offcanvas-sidebar-comp variants-sidebar"
        content={() => (
          <>
            <div className="o-s-c-top">
              <div className="o-s-c-header">
                <Typography variant="h4" className="o-s-c-h-title">
                  {t("title")}
                </Typography>
                <CloseIcon
                  onClick={async () => {
                    await trigger("variants");
                    dispatch(setIsVariantsidebarOpen(false));
                    setQueryDisplayName("");
                  }}
                />
              </div>
              <div className="o-s-c-body">
                <div className="o-s-c-b-left">
                  <div className="varaints-info">
                    <div className="v-i-img">
                      {productImage && productImage.length > 0 && (
                        <Image
                          src={getImageUrl(productImage[0].src)}
                          width={72}
                          height={55}
                          alt="Variant Image"
                          sizes="100vw"
                        ></Image>
                      )}
                    </div>
                    <div className="v-i-content">
                      <Typography variant="h3" className="v-i-txt v-i-title">
                        {productName}
                      </Typography>
                      <Typography variant="span" className="v-i-txt v-i-count">
                        {variantLength} {t("variant")}
                      </Typography>
                    </div>
                  </div>
                  <div className="search-product">
                    <div className="icon-input-comp invert">
                      <SearchIcon />
                      <input
                        placeholder="Search Product"
                        type="search"
                        value={queryDisplayName}
                        className="forms-input"
                        onChange={(e) => setQueryDisplayName(e.target.value)}
                      />
                    </div>
                  </div>
                  {selectedGroup.length > 0 && (
                    <div className="variants-list-group">
                      {selectedGroup
                        .map((item, idx) => ({ item, idx })) // pair item with its original index
                        .filter(({ item }) =>
                          item.variantName
                            .toLowerCase()
                            .includes(queryDisplayName.toLowerCase())
                        )
                        .map(({ item, idx }) => {
                          const subVariantValue =
                            tempVariants[item.index as number];
                          return (
                            <div
                              className={`v-l-item ${currentIndex == idx ? "active" : ""
                                }`}
                              key={`${idx}-index`}
                              onClick={() => setCurrentIndex(idx)}
                            >
                              <label
                                className={`forms-checkbox light-bg`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <input
                                  type="checkbox"
                                  checked={subVariantValue.available}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={async (e) => {
                                    const checked = e.target.checked;
                                    updateTempVariant(
                                      item.index as number,
                                      "available",
                                      checked
                                    );
                                    setValue(
                                      `variants.${item.index as number
                                      }.available`,
                                      checked,
                                      { shouldValidate: true }
                                    );
                                    await trigger(
                                      `variants.${item.index as number
                                      }.available`
                                    );
                                  }}
                                />
                                <span className="custom-checkbox"></span>
                              </label>
                              <div className="v-l-i-img">
                                {subVariantValue.variantImg.length > 0 ? (
                                  <Image
                                    src={getImageUrl(
                                      subVariantValue.variantImg[0].src
                                    )}
                                    width={40}
                                    height={40}
                                    alt="XS"
                                    sizes="100vw"
                                  ></Image>
                                ) : (
                                  <AddImageVariantIcon />
                                )}
                              </div>
                              <Typography variant="span" className="v-l-i-txt">
                                {subVariantValue.variantName}
                              </Typography>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
                <div className="o-s-c-b-right">
                  <div className="forms-block">
                    <div className="forms-group">
                      <label className="f-g-label">
                        {t("variantName.label")}
                      </label>
                      <input
                        type="text"
                        className={`forms-input ${errors.variants?.[selectedItem.index as number]
                            ?.variantName?.message
                            ? "error-input"
                            : ""
                          }`}
                        value={variantValue.variantName ?? ""}
                        onChange={async (e) => {
                          const value = e.target.value;
                          updateTempVariant(
                            selectedItem.index as number,
                            "variantName",
                            value
                          );
                          setValue(
                            `variants.${selectedItem.index as number
                            }.variantName`,
                            value,
                            { shouldValidate: true }
                          );
                          await trigger(
                            `variants.${selectedItem.index as number
                            }.variantName`
                          );
                        }}
                        placeholder={t("variantName.placeholder")}
                      />
                      {errors.variants?.[selectedItem.index as number]
                        ?.variantName && (
                          <span className="error-txt">
                            {
                              errors.variants?.[selectedItem.index as number]
                                ?.variantName?.message
                            }
                          </span>
                        )}
                    </div>
                    <div className="forms-group">
                      <label className="f-g-label">{t("image.label")}</label>
                      <DndImageUpload
                        maxUpload={7}
                        value={variantValue.variantImg}
                        onChange={async (value) => {
                          updateTempVariant(
                            selectedItem.index as number,
                            "variantImg",
                            value
                          );
                          setValue(
                            `variants.${selectedItem.index as number
                            }.variantImg`,
                            value as ProductImage[],
                            { shouldValidate: true }
                          );
                          await trigger(
                            `variants.${selectedItem.index as number
                            }.variantImg`
                          );
                        }}
                        placeHolder={t("image.placeholder")}
                      />
                      {errors.variants?.[selectedItem.index as number]
                        ?.variantImg && (
                          <span className="error-txt">
                            {
                              errors.variants?.[selectedItem.index as number]
                                ?.variantImg?.message
                            }
                          </span>
                        )}
                    </div>
                    <div className="forms-group">
                      {/* <label className='f-g-label' >{t("pricing.label")}</label> */}

                      {/* Fixed Price */}
                      {variantValue.pricing &&
                        variantValue.pricing.pricingType ===
                        PricingType.FIXED && (
                          <div className="forms-group">
                            <label className="f-g-label">
                              {t("fixed_pricing.label")}
                            </label>
                            <InputField
                              placeholder={t("fixed_pricing.placeholder")}
                              value={
                                variantValue.pricing.unitPrice?.toString() ?? ""
                              }
                              onChange={async (e) => {
                                const numberValue = parseFloat(e.target.value);
                                updateTempVariantPricing(
                                  selectedItem.index as number,
                                  "unitPrice",
                                  isNaN(numberValue) ? undefined : numberValue
                                );
                                setValue(
                                  `variants.${selectedItem.index as number
                                  }.pricing.unitPrice`,
                                  isNaN(numberValue) ? undefined : numberValue,
                                  { shouldValidate: true }
                                );
                                await trigger(
                                  `variants.${selectedItem.index as number
                                  }.pricing.unitPrice`
                                );
                              }}
                            />
                            {errors.variants?.[selectedItem.index as number]
                              ?.pricing &&
                              "unitPrice" in
                              (errors.variants?.[selectedItem.index as number]
                                ?.pricing ?? {}) && (
                                <span className="error-txt">
                                  {
                                    (
                                      errors.variants?.[
                                        selectedItem.index as number
                                      ]?.pricing as any
                                    ).unitPrice?.message
                                  }
                                </span>
                              )}
                          </div>
                        )}
                      {/* Fixed Price */}
                      {/* Variable Price */}
                      {variantValue.pricing &&
                        variantValue.pricing.pricingType ===
                        PricingType.PRICE_RANGE && (
                          <div className="forms-group">
                            <label className="f-g-label" htmlFor="priceRange">
                              {t("variable_pricing.label")}
                            </label>
                            <div className="f-g-input-horiz">
                              <div className="forms-group f-g-w100">
                                <InputField
                                  placeholder={t(
                                    "variable_pricing.minPrice_placeholder"
                                  )}
                                  value={
                                    variantValue.pricing.minPrice
                                      ?.toString()
                                      ?.toString() ?? ""
                                  }
                                  onChange={async (e) => {
                                    const numberValue = parseFloat(
                                      e.target.value
                                    );
                                    updateTempVariantPricing(
                                      selectedItem.index as number,
                                      "minPrice",
                                      isNaN(numberValue)
                                        ? undefined
                                        : numberValue
                                    );
                                    setValue(
                                      `variants.${selectedItem.index as number
                                      }.pricing.minPrice`,
                                      isNaN(numberValue)
                                        ? undefined
                                        : numberValue,
                                      { shouldValidate: true }
                                    );
                                    await trigger(
                                      `variants.${selectedItem.index as number
                                      }.pricing.minPrice`
                                    );
                                  }}
                                />
                                {errors.variants?.[selectedItem.index as number]
                                  ?.pricing &&
                                  "minPrice" in
                                  (errors.variants?.[
                                    selectedItem.index as number
                                  ]?.pricing ?? {}) && (
                                    <span className="error-txt">
                                      {
                                        (
                                          errors.variants?.[
                                            selectedItem.index as number
                                          ]?.pricing as any
                                        ).minPrice?.message
                                      }
                                    </span>
                                  )}
                              </div>
                              <div className="forms-group f-g-w100">
                                <InputField
                                  placeholder={t(
                                    "variable_pricing.maxPrice_placeholder"
                                  )}
                                  value={
                                    variantValue.pricing.maxPrice
                                      ?.toString()
                                      ?.toString() ?? ""
                                  }
                                  onChange={async (e) => {
                                    const numberValue = parseFloat(
                                      e.target.value
                                    );
                                    updateTempVariantPricing(
                                      selectedItem.index as number,
                                      "maxPrice",
                                      isNaN(numberValue)
                                        ? undefined
                                        : numberValue
                                    );
                                    setValue(
                                      `variants.${selectedItem.index as number
                                      }.pricing.maxPrice`,
                                      isNaN(numberValue)
                                        ? undefined
                                        : numberValue,
                                      { shouldValidate: true }
                                    );
                                    await trigger(
                                      `variants.${selectedItem.index as number
                                      }.pricing.maxPrice`
                                    );
                                  }}
                                />
                                {errors.variants?.[selectedItem.index as number]
                                  ?.pricing &&
                                  "maxPrice" in
                                  (errors.variants?.[
                                    selectedItem.index as number
                                  ]?.pricing ?? {}) && (
                                    <span className="error-txt">
                                      {
                                        (
                                          errors.variants?.[
                                            selectedItem.index as number
                                          ]?.pricing as any
                                        ).maxPrice?.message
                                      }
                                    </span>
                                  )}
                              </div>
                            </div>
                          </div>
                        )}
                      {/* Variable Price */}
                      {/* Bulk Pricing */}
                      {variantValue.pricing &&
                        variantValue.pricing.pricingType ===
                        PricingType.BULK && (
                          <div className="forms-group">
                            <span className="pricing-block-title">
                              {t("bulk_pricing.label")}
                            </span>
                            <div className="forms-group-spacing-column">
                              <div className="forms-group f-g-s-c-item">
                                <div className="forms-group">
                                  <label className="f-g-label">
                                    {t("bulk_pricing.unitTypeLabel")}
                                  </label>
                                  <Select
                                    options={localizedUnitList}
                                    optionLabel="name"
                                    optionValue="value"
                                    placeholder={t("bulk_pricing.placeholder")}
                                    value={variantValue.pricing.unit}
                                    onChange={async (value) => {
                                      updateTempVariantPricing(
                                        selectedItem.index as number,
                                        `unit`,
                                        value
                                      );
                                      updateTempVariant(
                                        selectedItem.index as number,
                                        "moqUnit",
                                        value
                                      );
                                      setValue(
                                        `variants.${selectedItem.index as number
                                        }.pricing.unit`,
                                        value,
                                        { shouldValidate: true }
                                      );
                                      setValue(
                                        `variants.${selectedItem.index as number
                                        }.moqUnit`,
                                        value,
                                        { shouldValidate: true }
                                      );
                                      await trigger(
                                        `variants.${selectedItem.index as number
                                        }.pricing.unit`
                                      );
                                      await trigger(
                                        `variants.${selectedItem.index as number
                                        }.moqUnit`
                                      );
                                    }}
                                  />
                                  {errors.variants?.[
                                    selectedItem.index as number
                                  ]?.pricing &&
                                    "unit" in
                                    (errors.variants?.[
                                      selectedItem.index as number
                                    ]?.pricing ?? {}) && (
                                      <span className="error-txt">
                                        {
                                          (
                                            errors.variants?.[
                                              selectedItem.index as number
                                            ]?.pricing as any
                                          ).unit?.message
                                        }
                                      </span>
                                    )}
                                </div>
                                <div className="forms-helper-txt-group">
                                  {variantValue.pricing.bulkPrices?.map(
                                    (price: BulkPrice, index: number) => {
                                      const variantErrors =
                                        errors.variants?.[
                                        selectedItem.index as number
                                        ];
                                      const bulkErrors =
                                        variantValue.pricing &&
                                        variantValue.pricing.pricingType ===
                                        PricingType.BULK &&
                                        "bulkPrices" in
                                        (variantErrors?.pricing || {}) &&
                                        (variantErrors?.pricing as any)
                                          ?.bulkPrices?.[index];
                                      return (
                                        <div
                                          className="forms-split"
                                          key={index}
                                        >
                                          <div className="forms-group wid-100">
                                            <label className="f-g-label">
                                              {t("add_tier.add_qty_label")}
                                            </label>
                                            <div className="f-g-input-horiz">
                                              <div className="forms-group f-g-w100">
                                                <InputField
                                                  placeholder={t(
                                                    "add_tier.quantity_from_placeholder"
                                                  )}
                                                  value={
                                                    price.minQty?.toString() ??
                                                    ""
                                                  }
                                                  onChange={async (e) => {
                                                    const val = parseFloat(
                                                      e.target.value
                                                    );
                                                    updateTempVariantPricing(
                                                      selectedItem.index as number,
                                                      `bulkPrices.${index}.minQty`,
                                                      isNaN(val)
                                                        ? undefined
                                                        : val
                                                    );
                                                    setValue(
                                                      `variants.${selectedItem.index as number
                                                      }.pricing.bulkPrices.${index}.minQty`,
                                                      isNaN(val)
                                                        ? undefined
                                                        : val,
                                                      { shouldValidate: true }
                                                    );
                                                    await trigger(
                                                      `variants.${selectedItem.index as number
                                                      }.pricing.bulkPrices.${index}.minQty`
                                                    );
                                                  }}
                                                />
                                                {bulkErrors?.minQty
                                                  ?.message && (
                                                    <span className="error-txt">
                                                      {bulkErrors.minQty.message}
                                                    </span>
                                                  )}
                                              </div>
                                              <div className="forms-group f-g-w100">
                                                <InputField
                                                  placeholder={t(
                                                    "add_tier.quantity_to_placeholder"
                                                  )}
                                                  value={
                                                    price.maxQty?.toString() ??
                                                    ""
                                                  }
                                                  onChange={async (e) => {
                                                    const val = parseFloat(
                                                      e.target.value
                                                    );
                                                    updateTempVariantPricing(
                                                      selectedItem.index as number,
                                                      `bulkPrices.${index}.maxQty`,
                                                      isNaN(val)
                                                        ? undefined
                                                        : val
                                                    );
                                                    setValue(
                                                      `variants.${selectedItem.index as number
                                                      }.pricing.bulkPrices.${index}.maxQty`,
                                                      isNaN(val)
                                                        ? undefined
                                                        : val,
                                                      { shouldValidate: true }
                                                    );
                                                    await trigger(
                                                      `variants.${selectedItem.index as number
                                                      }.pricing.bulkPrices.${index}.maxQty`
                                                    );
                                                  }}
                                                />
                                                {bulkErrors?.maxQty
                                                  ?.message && (
                                                    <span className="error-txt">
                                                      {bulkErrors.maxQty.message}
                                                    </span>
                                                  )}
                                              </div>
                                            </div>
                                          </div>
                                          <div className="forms-group wid-200px">
                                            <label className="f-g-label">
                                              {t("add_tier.price_label")}
                                            </label>
                                            <div className="forms-group f-g-w100">
                                              <InputField
                                                placeholder={t(
                                                  "add_tier.price_placeholder"
                                                )}
                                                value={
                                                  price.price?.toString() ?? ""
                                                }
                                                onChange={async (e) => {
                                                  const val = parseFloat(
                                                    e.target.value
                                                  );
                                                  updateTempVariantPricing(
                                                    selectedItem.index as number,
                                                    `bulkPrices.${index}.price`,
                                                    isNaN(val) ? undefined : val
                                                  );
                                                  setValue(
                                                    `variants.${selectedItem.index as number
                                                    }.pricing.bulkPrices.${index}.price`,
                                                    isNaN(val)
                                                      ? undefined
                                                      : val,
                                                    { shouldValidate: true }
                                                  );
                                                  await trigger(
                                                    `variants.${selectedItem.index as number
                                                    }.pricing.bulkPrices.${index}.price`
                                                  );
                                                }}
                                              />
                                              {bulkErrors?.price?.message && (
                                                <span className="error-txt">
                                                  {bulkErrors.price.message}
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                          {variantValue.pricing.bulkPrices
                                            .length > 1 && (
                                              <ButtonIcon
                                                className="b-c-i-rounded b-c-i-outline b-c-i-danger"
                                                onClick={() =>
                                                  handleBulkPriceDelete(
                                                    selectedItem.index as number,
                                                    index
                                                  )
                                                }
                                              >
                                                <TrashTableIcon />
                                              </ButtonIcon>
                                            )}
                                        </div>
                                      );
                                    }
                                  )}
                                  <span className="helper-txt">
                                    {t("add_tier.helper")}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="add-option-block">
                              <ButtonIconLeftOutline
                                name={t("add_tier.label")}
                                className={"bg-outline-grey btn-attributes"}
                                onClick={() =>
                                  handleAddBulkPrice(
                                    selectedItem.index as number
                                  )
                                }
                              >
                                <PlusIcon />
                              </ButtonIconLeftOutline>
                            </div>
                          </div>
                        )}
                    </div>
                    <div className="forms-group">
                      <label className="f-g-label">
                        {t("sku&Model.label")}
                      </label>
                      <InputField
                        value={variantValue.skuCode ?? ""}
                        onChange={async (e) => {
                          const value = e.target.value;
                          updateTempVariant(
                            selectedItem.index as number,
                            "skuCode",
                            value
                          );
                          setValue(
                            `variants.${selectedItem.index as number}.skuCode`,
                            value,
                            { shouldValidate: true }
                          );
                          await trigger(
                            `variants.${selectedItem.index as number}.skuCode`
                          );
                        }}
                        placeholder={t("sku&Model.placeholder")}
                      />
                      {errors.variants?.[selectedItem.index as number]
                        ?.skuCode && (
                          <span className="error-txt">
                            {
                              errors.variants?.[selectedItem.index as number]
                                ?.skuCode?.message
                            }
                          </span>
                        )}
                      <span className="helper-txt">
                        {t("sku&Model.helper")}
                      </span>
                    </div>
                    {!(
                      variantValue.pricing &&
                      variantValue.pricing.pricingType === PricingType.BULK
                    ) && (
                        <div className="forms-group">
                          <label
                            className="f-g-label"
                            htmlFor="MinimumOrderQuantity"
                          >
                            {t("moq.label")}
                          </label>
                          <div className="f-g-input-horiz">
                            <div className="forms-group f-g-w100">
                              <InputField
                                placeholder={t("moq.placeholder")}
                                value={
                                  variantValue.minOrderQuantity?.toString() ?? ""
                                }
                                onChange={async (e) => {
                                  const numberValue = parseFloat(e.target.value);
                                  updateTempVariant(
                                    selectedItem.index as number,
                                    "minOrderQuantity",
                                    isNaN(numberValue) ? undefined : numberValue
                                  );
                                  setValue(
                                    `variants.${selectedItem.index as number
                                    }.minOrderQuantity`,
                                    isNaN(numberValue) ? undefined : numberValue,
                                    { shouldValidate: true }
                                  );
                                  await trigger(
                                    `variants.${selectedItem.index as number
                                    }.minOrderQuantity`
                                  );
                                }}
                              />
                              {errors.variants?.[selectedItem.index as number]
                                ?.minOrderQuantity && (
                                  <span className="error-txt">
                                    {
                                      errors.variants?.[
                                        selectedItem.index as number
                                      ]?.minOrderQuantity?.message
                                    }
                                  </span>
                                )}
                            </div>
                            <div className="forms-group f-g-w100">
                              <Select
                                options={localizedUnitList}
                                optionLabel={`name`}
                                optionValue="value"
                                placeholder={t("moq.unit_placeholder")}
                                value={variantValue.moqUnit}
                                onChange={async (value) => {
                                  updateTempVariant(
                                    selectedItem.index as number,
                                    "moqUnit",
                                    value
                                  );
                                  setValue(
                                    `variants.${selectedItem.index as number
                                    }.moqUnit`,
                                    value,
                                    { shouldValidate: true }
                                  );
                                  await trigger(
                                    `variants.${selectedItem.index as number
                                    }.moqUnit`
                                  );
                                }}
                              />
                              {errors.variants?.[selectedItem.index as number]
                                ?.moqUnit && (
                                  <span className="error-txt">
                                    {
                                      errors.variants?.[
                                        selectedItem.index as number
                                      ]?.moqUnit?.message
                                    }
                                  </span>
                                )}
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
            <div className="o-s-c-footer">
              <div className="o-s-c-f-left"></div>
              <div className="o-s-c-f-right">
                <div className="o-s-c-btn-group">
                  {/* <ButtonIconLeftOutline name={'Delete Variant'} className={'bg-outline-grey custom-width'}>
                                    </ButtonIconLeftOutline> */}
                  <ButtonIconRight
                    name={"Continue"}
                    className={""}
                    onClick={handleContinue}
                  >
                    <RightArrowIcon />
                  </ButtonIconRight>
                </div>
              </div>
            </div>
          </>
        )}
      ></Sidebar>
    </>
  );
};

export default AddVariantInfoSidebar;
