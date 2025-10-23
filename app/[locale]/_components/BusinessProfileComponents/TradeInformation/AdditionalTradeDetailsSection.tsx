import Typography from "@/app/[locale]/_components/Base/Typography";
import MultiSelectInputs from "@/app/[locale]/_components/form/MultiSelectDrapDown";
import { BrochureIcon } from "@/app/[locale]/_components/Icons/SVGIcons";
import DndImageUpload from "@/app/[locale]/_components/StoreFront/Forms/DndImageUpload";
import InputField from "@/app/[locale]/_components/StoreFront/Forms/InputField";
import Select from "@/app/[locale]/_components/StoreFront/Forms/Select";
import { useLocalizedOptions } from "@/app/[locale]/_hooks/useLocalizedOptions";
import {
  DeliveryTimeEstimateDto,
  ImportImage,
  MinimumOrderValue,
} from "@/app/[locale]/_interface/BusinessProfile";
import { languageList, unitOptions } from "@/app/[locale]/_models/common";
import {
  BusinessProfileStageKey,
  currencyList,
  Incoterms,
  incoTermsOptions,
} from "@/app/[locale]/_models/StoreFront";
import {
  useGetBusinessInformationQuery,
  useUpdateTradeAdditionalDetailsMutation,
} from "@/app/[locale]/_store/apiReducer/businessProfileApi";
import { TradeDetailsSchema } from "@/app/[locale]/_validationSchema/businessProfile";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import Button from "@/app/[locale]/_components/Buttons/Button";
import { showToast } from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";

interface AdditionalTradeDetailsSectionProps {
  isEdit: boolean;
  updateEditStatus: (key: string, value: boolean) => void;
  onSuccess: () => void;
}

export interface SectionRef {
  submit: () => void;
}

export interface AdditionalTradeDetails {
  iecNumber?: string;
  iecDoc?: ImportImage;
  exportPercent?: number;
  languageSpoken?: string[];
  nearestPort?: string;
  averageLeadTime?: DeliveryTimeEstimateDto;
  minOrderValue?: MinimumOrderValue;
  deliveryTerm?: string[];
}
const AdditionalTradeDetailsSection: React.FC<
  AdditionalTradeDetailsSectionProps
> = ({ isEdit, onSuccess, updateEditStatus }) => {
  const currentStepperStatus = useAppSelector(
    (state: RootState) => state.stepperStatus.stepperStatus
  );
  const [updateTradeAdditional] = useUpdateTradeAdditionalDetailsMutation();
  const { data: tradeAdditionalData, isSuccess } =
    useGetBusinessInformationQuery(
      {
        stage: "AdditionalTradeDetails",
      },
      {
        skip:
          currentStepperStatus[
            BusinessProfileStageKey.AdditionalTradeDetails
          ] === "pending",
      }
    );
  const localizedIncoTerms = useLocalizedOptions(
    "salesProduct",
    incoTermsOptions
  );
  const localizedCurrencyList = useLocalizedOptions("common", currencyList);
  const common = useTranslations("common");
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AdditionalTradeDetails>({
    defaultValues: {
      iecNumber: "",
      iecDoc: {},
      exportPercent: 0,
      languageSpoken: [],
      nearestPort: "",
      averageLeadTime: {},
      minOrderValue: {},
      deliveryTerm: [],
    },
    resolver: zodResolver(TradeDetailsSchema),
  });
  const dispatch = useAppDispatch();
  const t = useTranslations("businessProfile.tradeAdditional");
  const fileNameFn = (path: string) => {
    const fileNameWithExt = path.split("/").pop();
    const fileName = fileNameWithExt?.split(".").slice(0, -1).join(".");
    return fileName;
  };
  const handleFormSubmit = async (data: AdditionalTradeDetails) => {
    try {
      await updateTradeAdditional(data).unwrap();
      reset();
      onSuccess();
    } catch (error) {
      console.log(error);
      dispatch(
        showToast({
          title: "Error!",
          message: error.message,
          theme: "error",
        })
      );
    }
  };
  console.log(errors);
  useEffect(() => {
    //  if(!tradeAdditionalData?.data?.iecNumber){
    //           updateEditStatus(BusinessProfileStageKey.AdditionalTradeDetails, true);
    //         }
    //         else{
    //           updateEditStatus(BusinessProfileStageKey.AdditionalTradeDetails,false)
    //         }
    if (
      currentStepperStatus[BusinessProfileStageKey.AdditionalTradeDetails] !==
      "completed"
    ) {
      updateEditStatus(BusinessProfileStageKey.AdditionalTradeDetails, true);
    } else {
      updateEditStatus(BusinessProfileStageKey.AdditionalTradeDetails, false);
    }
    if (isSuccess) {
      reset({
        iecNumber: tradeAdditionalData?.data?.iecNumber ?? "",
        iecDoc: tradeAdditionalData?.data?.iecDoc ?? {},
        exportPercent: tradeAdditionalData?.data?.exportPercent ?? 0,
        languageSpoken: tradeAdditionalData?.data?.languageSpoken ?? [],
        nearestPort: tradeAdditionalData?.data?.nearestPort ?? "",
        averageLeadTime: tradeAdditionalData?.data?.averageLeadTime ?? {},
        minOrderValue: tradeAdditionalData?.data?.minOrderValue ?? {},
        deliveryTerm: tradeAdditionalData?.data?.deliveryTerm ?? [],
      });
    }
  }, [isSuccess, tradeAdditionalData, reset]);

  const onError = () => {
    // Show toast only if there are validation errors
    dispatch(
      showToast({
        title: "Warning!",
        message: "Please fill in all required fields.",
        theme: "info",
      })
    );
  };

  return (
    <>
      {!isEdit ? (
        <div className="c-f-b-t-body label-grey-reverse">
          <div className="accordion-form-block-group">
            <div className="accordion-form-block">
              <div className="a-f-b-txt-block">
                <Typography variant="span" className="a-f-b-subtxt">
                  {t("basicInfo")}
                </Typography>
              </div>
              <div className="tabs-content">
                <div className="tabs-form-group">
                  <label htmlFor="IEC Number" className="t-f-g-label">
                    {t("iecNo")}
                  </label>
                  <span className="t-f-g-txt">
                    {tradeAdditionalData?.data?.iecNumber ?? "--"}
                  </span>
                </div>
                <div className="tabs-form-group">
                  <label htmlFor="IEC Document" className="t-f-g-label">
                    {t("iecDoc")}
                  </label>
                  {tradeAdditionalData?.data?.iecDoc && (
                    <div className="brochure-document-block remv-bg px-unset">
                      <div className="b-d-b-left">
                        <BrochureIcon />
                        <span className="b-d-b-filename">
                          {fileNameFn(tradeAdditionalData?.data?.iecDoc?.src)}
                          .pdf
                        </span>
                      </div>
                      {tradeAdditionalData?.data?.iecDoc?.size && (
                        <div className="b-d-b-right">
                          <span className="b-d-b-size">
                            {" "}
                            {(
                              tradeAdditionalData?.data?.iecDoc?.size /
                              (1024 * 1024)
                            ).toFixed(1)}{" "}
                            MB
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="tabs-form-group">
                  <label htmlFor="Export Percentage" className="t-f-g-label">
                    {t("percent.title")}
                  </label>
                  <span className="t-f-g-txt">
                    {tradeAdditionalData?.data?.exportPercent ?? "-"}%
                  </span>
                </div>
                <div className="tabs-form-group">
                  <label htmlFor="Language Spoken" className="t-f-g-label">
                    {t("language.title")}
                  </label>
                  <span className="t-f-g-txt">
                    {tradeAdditionalData?.data?.languageSpoken &&
                    tradeAdditionalData?.data?.languageSpoken.length > 0
                      ? tradeAdditionalData?.data?.languageSpoken?.map(
                          (item: string, index: number) => (
                            <span key={index}>
                              {item}
                              {index !==
                                tradeAdditionalData?.data?.languageSpoken
                                  ?.length -
                                  1 && ", "}
                            </span>
                          )
                        )
                      : ""}
                  </span>
                </div>
              </div>
            </div>
            <div className="accordion-form-block">
              <div className="a-f-b-txt-block">
                <Typography variant="span" className="a-f-b-subtxt">
                  {t("market")}
                </Typography>
              </div>
              <div className="tabs-content">
                <div className="tabs-form-group">
                  <label htmlFor="Nearest Port" className="t-f-g-label">
                    {t("port.title")}
                  </label>
                  <span className="t-f-g-txt">
                    {tradeAdditionalData?.data?.nearestPort ?? "--"}
                  </span>
                </div>
              </div>
            </div>
            <div className="accordion-form-block">
              <div className="a-f-b-txt-block">
                <Typography variant="span" className="a-f-b-subtxt">
                  {t("shipping")}
                </Typography>
              </div>
              <div className="tabs-content">
                <div className="tabs-form-group">
                  <label htmlFor="Average Lead Time" className="t-f-g-label">
                    {t("leadTime.title")}
                  </label>
                  {tradeAdditionalData?.data?.averageLeadTime && (
                    <span className="t-f-g-txt">
                      {tradeAdditionalData?.data?.averageLeadTime?.value}{" "}
                      {tradeAdditionalData?.data?.averageLeadTime?.unit}
                    </span>
                  )}
                </div>
                <div className="tabs-form-group">
                  <label htmlFor="Minimum Order Value" className="t-f-g-label">
                    {t("minValue.title")}
                  </label>
                  {tradeAdditionalData?.data?.minOrderValue && (
                    <span className="t-f-g-txt">
                      {
                        tradeAdditionalData?.data?.minOrderValue?.currency
                          ?.symbol
                      }{" "}
                      {tradeAdditionalData?.data?.minOrderValue?.value}
                    </span>
                  )}
                </div>
                <div className="tabs-form-group">
                  <label
                    htmlFor="Accepted Delivery Terms"
                    className="t-f-g-label"
                  >
                    {t("deliveryTerms.title")}
                  </label>
                  <span className="t-f-g-txt">
                    {tradeAdditionalData?.data?.deliveryTerm &&
                    tradeAdditionalData?.data?.deliveryTerm.length > 0
                      ? tradeAdditionalData?.data?.deliveryTerm?.map(
                          (item: Incoterms, index: number) => (
                            <span key={index}>
                              {item}
                              {index !==
                                tradeAdditionalData?.data?.deliveryTerm
                                  ?.length -
                                  1 && ", "}
                            </span>
                          )
                        )
                      : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="c-f-b-t-body">
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="accordion-form-block">
              <div className="a-f-b-txt-block">
                <Typography variant="span" className="a-f-b-subtxt">
                  {t("basicInfo")}
                </Typography>
              </div>
              <div className="tabs-content">
                <div className="tabs-form-group">
                  <label htmlFor="IEC Number" className="t-f-g-label">
                    {t("iecNo")}
                  </label>
                  <Controller
                    name="iecNumber"
                    control={control}
                    render={({ field }) => (
                      <InputField {...field} placeholder={t("enterIec")} />
                    )}
                  />
                  {errors.iecNumber && (
                    <span className="error-txt">
                      {errors.iecNumber.message}
                    </span>
                  )}
                </div>
                <div className="tabs-form-group">
                  <label htmlFor="IEC Document" className="t-f-g-label">
                    {t("iecDoc")}
                  </label>
                  <Controller
                    name="iecDoc"
                    control={control}
                    render={({ field }) => (
                      <DndImageUpload
                        value={
                          Array.isArray(field.value)
                            ? field.value[0] // if it's an array, pass the first one
                            : field.value || undefined // if it's a single object or null
                        }
                        onChange={(file) => {
                          const newFile = Array.isArray(file) ? file[0] : file;

                          if (newFile && typeof newFile === "object") {
                            field.onChange({
                              ...(field.value ?? {}),
                              ...newFile,
                            });
                          }
                        }}
                        single={true}
                        allowedFileTypes={["application/pdf"]}
                        placeHolder={"Upload PDF files"}
                        // maxHeight={900}
                        // maxWidth={500}
                      />
                      // <DndImageUpload
                      //   maxUpload={7}
                      //   value={field.value}
                      //   onChange={field.onChange}
                      // />
                    )}
                  />
                  {errors.iecDoc && (
                    <span className="error-txt">{errors.iecDoc.message}</span>
                  )}
                </div>
                <div className="tabs-form-group">
                  <label htmlFor="Export Percentage" className="t-f-g-label">
                    {t("percent.title")}
                  </label>
                  <Controller
                    name="exportPercent"
                    control={control}
                    render={({ field }) => (
                      <InputField
                        {...field}
                        placeholder={t("percent.placeholder")}
                        value={field.value?.toString() ?? ""}
                        onChange={(e) => {
                          const numberValue = parseFloat(e.target.value);
                          field.onChange(
                            isNaN(numberValue) ? undefined : numberValue
                          );
                        }}
                      />
                    )}
                  />
                  {errors.exportPercent && (
                    <span className="error-txt">
                      {errors.exportPercent.message}
                    </span>
                  )}
                </div>
                <div className="forms-group ">
                  <label className="f-g-label">{t("language.title")}</label>
                  <Controller
                    name="languageSpoken"
                    control={control}
                    render={({ field }) => (
                      <MultiSelectInputs
                        value={field.value}
                        onChange={field.onChange}
                        options={languageList}
                        optionLabel="name"
                        filter={false}
                        placeholder={t("language.placeholder")}
                        maxSelectedLabels={5}
                        className="customize-dropdown"
                        virtualScrollerOptions={{
                          itemSize: 40,
                        }}
                        appendTo={"self"}
                        selectAllLabel={common("selectAll")}
                      />
                    )}
                  />
                  {errors.languageSpoken && (
                    <span className="error-txt">
                      {errors.languageSpoken.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="accordion-form-block">
              <div className="a-f-b-txt-block">
                <Typography variant="span" className="a-f-b-subtxt">
                  {t("market")}
                </Typography>
              </div>
              <div className="tabs-content">
                <div className="tabs-form-group">
                  <label htmlFor="Nearest Port" className="t-f-g-label">
                    {t("port.title")}
                  </label>
                  <Controller
                    name="nearestPort"
                    control={control}
                    render={({ field }) => (
                      <InputField
                        {...field}
                        placeholder={t("port.placeholder")}
                      />
                    )}
                  />
                  {errors.nearestPort && (
                    <span className="error-txt">
                      {errors.nearestPort.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="accordion-form-block">
              <div className="a-f-b-txt-block">
                <Typography variant="span" className="a-f-b-subtxt">
                  {t("shipping")}
                </Typography>
              </div>
              <div className="tabs-content">
                <div className="tabs-form-group">
                  <label htmlFor="Average Lead Time" className="t-f-g-label">
                    {t("leadTime.title")}
                  </label>
                  <Controller
                    name="averageLeadTime.value"
                    control={control}
                    render={({ field }) => (
                      <InputField
                        {...field}
                        placeholder={t("leadTime.value")}
                        value={field.value?.toString() ?? ""}
                        onChange={(e) => {
                          const numberValue = parseFloat(e.target.value);
                          field.onChange(
                            isNaN(numberValue) ? undefined : numberValue
                          );
                        }}
                      />
                    )}
                  />
                  {errors?.averageLeadTime?.value && (
                    <span className="error-txt">
                      {errors?.averageLeadTime?.value.message}
                    </span>
                  )}
                  <Controller
                    name="averageLeadTime.unit"
                    control={control}
                    render={({ field }) => (
                      <Select
                        options={unitOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={t("leadTime.duration")}
                        optionLabel={`label`}
                      />
                    )}
                  />
                  {errors?.averageLeadTime?.unit && (
                    <span className="error-txt">
                      {errors?.averageLeadTime?.unit.message}
                    </span>
                  )}
                </div>
                {/* Minimum Order Value */}
                <div className="tabs-form-group">
                  <label htmlFor="Minimum Order Value" className="t-f-g-label">
                    {t("minValue.title")}
                  </label>
                  <Controller
                    name="minOrderValue.currency"
                    control={control}
                    render={({ field }) => (
                      <Select
                        options={localizedCurrencyList}
                        optionLabel={`name`}
                        value={field.value}
                        placeholder={t("minValue.currency")}
                        onChange={field.onChange}
                        itemTemplate={(opt) => `${opt.symbol} - ${opt.code}`}
                        valueTemplate={(value) =>
                          !value
                            ? "Select Currency"
                            : `${value?.symbol} - ${value?.code}`
                        }
                      />
                    )}
                  />
                  {errors?.minOrderValue?.currency && (
                    <span className="error-txt">
                      {errors.minOrderValue.currency.message}
                    </span>
                  )}
                  <Controller
                    name="minOrderValue.value"
                    control={control}
                    render={({ field }) => (
                      <InputField
                        {...field}
                        placeholder={t("minValue.value")}
                        value={field.value?.toString() ?? ""}
                        onChange={(e) => {
                          const numberValue = parseFloat(e.target.value);
                          field.onChange(
                            isNaN(numberValue) ? undefined : numberValue
                          );
                        }}
                      />
                    )}
                  />
                  {errors.minOrderValue?.value && (
                    <span className="error-txt">
                      {errors.minOrderValue.value.message}
                    </span>
                  )}
                </div>
                {/* Delivery Terms */}

                <div className="forms-group ">
                  <label className="f-g-label">
                    {t("deliveryTerms.title")}
                    <span className="f-g-label-dim"></span>
                  </label>
                  <Controller
                    name="deliveryTerm"
                    control={control}
                    render={({ field }) => (
                      <MultiSelectInputs
                        value={field.value}
                        onChange={(e) => field.onChange(e.value)}
                        options={localizedIncoTerms}
                        optionLabel={`name`}
                        optionValue="code"
                        filter={true}
                        placeholder={t("deliveryTerms.placeholder")}
                        maxSelectedLabels={5}
                        className="customize-dropdown"
                        virtualScrollerOptions={{
                          itemSize: 40,
                        }}
                      />
                    )}
                  />
                  {errors.deliveryTerm && (
                    <span className="error-txt">
                      {errors.deliveryTerm.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="button-group-block edit-save-btn-block">
              <Button
                className={"btn-outline bg-outline-dark btn-c-sm"}
                text={t("cancel")}
                onClick={onSuccess}
                disabled={
                  isSubmitting ||
                  !(
                    currentStepperStatus?.[
                      BusinessProfileStageKey.MarketLogistics
                    ] === "completed" &&
                    currentStepperStatus?.[
                      BusinessProfileStageKey.ShippingPaymentTerms
                    ] === "completed"
                  )
                }
              />
              <Button
                className={"btn-c-primary btn-c-sm"}
                text={t("save")}
                type="submit"
                onClick={handleSubmit(
                  (data) => handleFormSubmit(data),
                  onError
                )}
                disabled={
                  isSubmitting ||
                  !(
                    currentStepperStatus?.[
                      BusinessProfileStageKey.MarketLogistics
                    ] === "completed" &&
                    currentStepperStatus?.[
                      BusinessProfileStageKey.ShippingPaymentTerms
                    ] === "completed"
                  )
                }
              />
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default AdditionalTradeDetailsSection;
