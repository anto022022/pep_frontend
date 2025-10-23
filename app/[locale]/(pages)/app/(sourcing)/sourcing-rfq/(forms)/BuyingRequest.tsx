import Typography from "@/app/[locale]/_components/Base/Typography";
import SuccessDialog from "@/app/[locale]/_components/dialog/SuccessDialog";
import NestedCategorySelect from "@/app/[locale]/_components/form/NestedCategorySelect";
import {
  BrochureIcon,
  CloseIcon,
} from "@/app/[locale]/_components/Icons/SVGIcons";
import { TableDisplayToggle } from "@/app/[locale]/_components/Pipe/TableDisplayToggle";
import DndImageUpload from "@/app/[locale]/_components/StoreFront/Forms/DndImageUpload";
import InputField from "@/app/[locale]/_components/StoreFront/Forms/InputField";
import Select from "@/app/[locale]/_components/StoreFront/Forms/Select";
import TextArea from "@/app/[locale]/_components/StoreFront/Forms/TextArea";
import useAiGenerator from "@/app/[locale]/_hooks/useGeneratewithAi";
import { useLocalizedOptions } from "@/app/[locale]/_hooks/useLocalizedOptions";
import { getImageUrl } from "@/app/[locale]/_hooks/utility";
import {
  currencyList,
  paymentTermsOptions,
  PricingType,
  unitOption,
} from "@/app/[locale]/_models/StoreFront";
import { useLazyGetCategoryAiSuggestionsQuery } from "@/app/[locale]/_store/apiReducer/productsApi";
import { setIsPostBuyingRequestSidebarOpen } from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Sidebar } from "primereact/sidebar";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
export interface Certificate {
  name: string;
  src: string;
  alt: string;
  exten: string;
  size: number;
}
const BuyingRequest = () => {
  const [Loading, setIsLoading] = useState(false);
  const [
    getCategoryAiSuggestions,
    { data: aiGeneratedCategoryList },
  ] = useLazyGetCategoryAiSuggestionsQuery();
  const dispatch = useAppDispatch();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const {
    register,
    control,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      productName: "",
      category: {},
      subCategory: {},
      productCategory: {},
      categorySuggestion: {},
      brandName: "",
      productDescription: "",
      productImage: [],
      currency: {},
      pricing: {
        pricingType: PricingType.FIXED,
        unitPrice: undefined,
      },
      minOrderQuantity: undefined,
      moqUnit: "",
    },
    mode: "onBlur",
  });
  const isPostBuyingRequestSidebarOpen = useAppSelector(
    (state: RootState) => state.uiData.isPostBuyingRequestSidebarOpen
  );
  const [isActive, setIsActive] = useState(false);
  const ob = useTranslations("rfq.buyingRequest");
  const fi = useTranslations("rfq.buyingRequest.buyingRequestForm");
  const localizedCurrencyList = useLocalizedOptions("common", currencyList);
  const localizedUnitList = useLocalizedOptions("salesProduct", unitOption);
  const setDetailedDescriptions = (description: any) => {
    setValue("productDescription", description?.description);
  };
  const triggerAiCategory = () => {
    if (!getValues("productName")) return;
    getCategoryAiSuggestions({
      product_name: getValues("productName") ?? "",
    });
  };
  const formValues = watch();
  const requestBody = useMemo(() => {
    return {
      lan: "en",
      max_length: 250,
      productName: formValues?.productName,
      category: formValues?.category?.name,
      subCategory: formValues?.subCategory?.name,
      productCategory: formValues?.productCategory?.name,
    };
  }, [formValues]);
  const { regenerate: regenerateDescription } = useAiGenerator({
    apiEndpoint: `${process.env.NEXT_PUBLIC_API_URL_AG || "https://api.sandbox.pepagora.org/"}sales/ai/get-short-description`,
    storageKey: "pt_dd",
    secretKey: `]$WO!6'()h"S1bm,/Y{CjR?t]43J^|` as string,
    lan: "en",
    keyword: formValues.productDescription as string,
    max_length: 250,
    setIsLoading: setIsLoading,
    setDescription: setDetailedDescriptions,
    requestBody,
    value: "description",
  });

  const preferredSourcing = ["nearby", "withinMyCountry", "international"];
  const localizedPaymentTerms = useLocalizedOptions(
    "salesProduct",
    paymentTermsOptions
  );
  return (
    <>
      <Sidebar
        visible={isPostBuyingRequestSidebarOpen}
        position="right"
        onHide={() => dispatch(setIsPostBuyingRequestSidebarOpen(false))}
        className="offcanvas-sidebar-comp variants-sidebar addnewproduct-sidebar"
        content={() => (
          <>
            <div className="o-s-c-top">
              <div className="o-s-c-header">
                <Typography variant="h4" className="o-s-c-h-title">
                  <BrochureIcon />
                  {ob("buyingRequestForm.title")}
                </Typography>
                <CloseIcon
                  onClick={() =>
                    dispatch(setIsPostBuyingRequestSidebarOpen(false))
                  }
                />
              </div>
              <div className="o-s-c-body">
                <div className="o-s-c-b-right">
                  <div className="forms-block">
                    {/* Product name*/}
                    <div className="forms-group">
                      <label className="f-g-label">
                        {fi("productName.label")}
                      </label>

                      <Controller
                        name="productName"
                        control={control}
                        render={({ field }) => (
                          <InputField
                            {...field}
                            placeholder={fi("productName.placeHolder")}
                            onBlur={() => {
                              triggerAiCategory();
                              field.onBlur();
                            }}
                          />
                        )}
                      />
                    </div>
                    {/*Category*/}
                    <div className="forms-group">
                      <label className="f-g-label">
                        {fi("productCategory.label")}
                      </label>
                      <NestedCategorySelect
                        setValue={(field: any, value: any) =>
                          setValue(field, value)
                        }
                        control={control}
                        errors={errors}
                        aiGeneratedContent={aiGeneratedCategoryList?.data ?? []}
                        isFormActive={true}
                        placeholder={fi("productCategory.placeHolder")}
                      />
                    </div>
                    {/* Product description*/}
                    <div className="forms-group">
                      <Controller
                        name="productDescription"
                        control={control}
                        render={({ field }) => (
                          <TextArea
                            {...field}
                            label={fi("productDescription.label")}
                            placeholder={fi("productDescription.placeHolder")}
                            optionalTxt="(Optional)"
                            value={field.value}
                            onChange={(value: string) => field.onChange(value)}
                            aiFunc={regenerateDescription}
                            loading={Loading}
                            isActive={isActive}
                          />
                        )}
                      />

                      {errors.productDescription && (
                        <span className="error-txt">
                          {errors.productDescription.message}
                        </span>
                      )}
                    </div>
                    {/*EOQ*/}
                    <div className="forms-group">
                      <div className="f-g-input-horiz"></div>
                      <label
                        className="f-g-label"
                        htmlFor="MinimumOrderQuantity"
                      >
                        {fi("estimatedOrderQuantity.label")}
                      </label>
                      <div className="f-g-input-horiz">
                        <div className="forms-group f-g-w100">
                          <Controller
                            name="estOrderQuantity.quantity"
                            control={control}
                            render={({ field }) => (
                              <InputField
                                {...field}
                                placeholder="e.g:50"
                                value={field.value?.toString() ?? ""}
                                onChange={(e) => {
                                  const numberValue = parseFloat(
                                    e.target.value
                                  );
                                  field.onChange(
                                    isNaN(numberValue) ? undefined : numberValue
                                  );
                                }}
                              />
                            )}
                          />
                        </div>
                        <div className="forms-group f-g-w100">
                          <Controller
                            name={"estOrderQuantity.unit"}
                            control={control}
                            render={({ field }) => (
                              <Select
                                options={localizedUnitList}
                                optionLabel={`name`}
                                optionValue="value"
                                placeholder="Units"
                                value={field.value}
                                onChange={field.onChange}
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    {/*PUP*/}
                    <div className="forms-group">
                      <label className="f-g-label" htmlFor="">
                        {fi("preferredUnitPrice.label")}
                      </label>
                      <Controller
                        name="preferredUnitPrice.currency"
                        control={control}
                        render={({ field }) => (
                          <Select
                            options={localizedCurrencyList}
                            optionLabel={`name`}
                            value={field.value}
                            placeholder="INR"
                            onChange={field.onChange}
                            itemTemplate={(opt) =>
                              `${opt.symbol} - ${opt.code}`
                            }
                            valueTemplate={(value) =>
                              !value
                                ? "INR"
                                : `${value?.symbol} - ${value?.code}`
                            }
                          />
                        )}
                      />
                      {errors.preferredUnitPrice?.currency && (
                        <span className="error-txt">
                          {errors.preferredUnitPrice.currency.message}
                        </span>
                      )}
                    </div>

                    <div className="forms-group">
                      <label className="f-g-label" htmlFor="priceRange">
                        Price Range
                      </label>
                      <div className="f-g-input-horiz">
                        <div className="forms-group f-g-w100">
                          <Controller
                            name="preferredUnitPrice.priceRange.minPrice"
                            control={control}
                            render={({ field }) => (
                              <InputField
                                {...field}
                                placeholder="Enter Min.Price"
                                value={field.value?.toString() ?? ""}
                                onChange={(e) => {
                                  const numberValue = parseFloat(
                                    e.target.value
                                  );
                                  field.onChange(
                                    isNaN(numberValue) ? undefined : numberValue
                                  );
                                }}
                              />
                            )}
                          />
                        </div>
                        <div className="forms-group f-g-w100">
                          <Controller
                            name="preferredUnitPrice.priceRange.maxPrice"
                            control={control}
                            render={({ field }) => (
                              <InputField
                                {...field}
                                placeholder="Enter Max.Price"
                                value={field.value?.toString() ?? ""}
                                onChange={(e) => {
                                  const numberValue = parseFloat(
                                    e.target.value
                                  );
                                  field.onChange(
                                    isNaN(numberValue) ? undefined : numberValue
                                  );
                                }}
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    {/*PUP*/}
                  </div>
                  <div className="forms-group">
                    <label className="f-g-label" htmlFor="image">
                      {fi("upload.label")}
                    </label>
                    <Controller
                      name="productImage"
                      control={control}
                      render={({ field }) => (
                        <DndImageUpload
                          maxUpload={7}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    {errors.productImage && (
                      <span className="error-txt">
                        {errors.productImage.message}
                      </span>
                    )}
                  </div>
                  <div className="forms-group">
                    <label className="f-g-label">{"Sample availability"}</label>
                    <div className="price-forms-radio split-3">
                      {preferredSourcing.map((option, i) => (
                        <label
                          key={i}
                          htmlFor={option}
                          className="forms-radio-horiz"
                        >
                          <input
                            type="radio"
                            id={option}
                            className="forms-radio"
                            {...register(
                              "samplesAvailability.availabilityType"
                            )}
                            value={option}
                          />
                          <span className="f-r-h-label">
                            {fi(`preferredRegion.options.${option}`)}{" "}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="forms-group">
                    <label className="f-g-label" htmlFor="stockAvail">
                      {fi("paymentTerms.label")}
                    </label>
                    <Controller
                      name="paymentTerms"
                      control={control}
                      render={({ field }) => (
                        <Select
                          options={localizedPaymentTerms}
                          optionLabel={`name`}
                          value={field.value}
                          placeholder={fi("paymentTerms.placeHolder")}
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                        />
                      )}
                    />
                    {errors.paymentTerms && (
                      <span className="error-txt">
                        {errors.paymentTerms.message}
                      </span>
                    )}
                  </div>
                  <div
                    className={`wid-100 other-payment-input ${formValues.paymentTerms?.includes(PaymentTerm.CUSTOM)
                        ? "active"
                        : ""
                      }`}
                  >
                    <Controller
                      name="customPaymentTerm"
                      control={control}
                      render={({ field }) => (
                        <InputField
                          className="wid-100"
                          placeholder={fi("paymentTerms.placeHolder")}
                          {...field}
                        />
                      )}
                    />
                    {errors.otherPaymentMethod && (
                      <span className="error-txt">
                        {errors.otherPaymentMethod.message}
                      </span>
                    )}
                  </div>
                  <TableDisplayToggle
                    id="freee"
                    value={false}
                    onToggle={ }
                  />{" "}
                  <div className="tabs-form-group">
                    <label
                      htmlFor="Shipping & Packaging"
                      className="t-f-g-label"
                    >
                      {fi("requiredCertifications.label")}
                    </label>
                    <div className="two-col-layout gap-y">
                      {certificates?.map(
                        (item, index) =>
                          item?.src && (
                            <div className="tabs-form-group" key={index}>
                              <label
                                htmlFor="Shipping & Packaging"
                                className="t-f-g-label"
                              >
                                {item?.name}
                              </label>
                              <Link
                                href={getImageUrl(item.src)}
                                className="brochure-document-block"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <div className="b-d-b-left">
                                  <BrochureIcon />
                                  <span className="b-d-b-filename">
                                    {item.name}
                                  </span>
                                </div>
                                <div className="b-d-b-right">
                                  <span className="b-d-b-size">
                                    {" "}
                                    {item?.size !== undefined
                                      ? (item.size / (1024 * 1024)).toFixed(2) +
                                      " MB"
                                      : ""}
                                  </span>
                                </div>
                              </Link>
                            </div>
                          )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="o-s-c-footer">
              <div className="o-s-c-f-left"></div>
              <div className="o-s-c-f-right"></div>
            </div>
          </>
        )}
      />
      <SuccessDialog
        visible={false}
        title={ob("buyingRequestSuccess.title")}
        subTxt={ob("buyingRequestSuccess.description")}
      />
    </>
  );
};

export default BuyingRequest;