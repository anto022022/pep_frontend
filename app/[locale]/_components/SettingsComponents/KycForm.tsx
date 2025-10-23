"use client";
import InputField from "@/app/[locale]/_components/StoreFront/Forms/InputField";
import useSettingNextStep from "@/app/[locale]/_hooks/useSettingNextStep";
import { AccountSettingsStageKey } from "@/app/[locale]/_models/StoreFront";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  AccountSettings,
  DocumentInfo,
  KycFormValues,
  NationalIdDropdown,
  Section,
} from "../../_interface/SettingsInterface";
import {
  useGetKycDetailsQuery,
  useLazyGetCountryDocumentsQuery,
  useUpdateKycMutation,
} from "../../_store/apiReducer/settingsApi";
import {
  setIsAccountSettingOpen,
  setIsKycComplete,
} from "../../_store/reducers/ui_store";
import { useAppDispatch } from "../../_store/store";
import DndImageUpload from "../StoreFront/Forms/DndImageUpload";
import Select from "../StoreFront/Forms/Select";
import ComplianceSettingsForm from "./ComplianceSettingsForm";

const documentInfo = (): DocumentInfo => ({
  src: "",
  alt: "",
  exten: "",
  size: 0,
});

const defaultInfo = (): Section => ({
  documentType: "",
  document: documentInfo(),
});

const defaultValues = {
  identityVerification: defaultInfo(),
  addressVerification: defaultInfo(),
};

const KycForm = ({ data: accountSettingData }: { data: AccountSettings }) => {
  const [fetchCountryDocuments] = useLazyGetCountryDocumentsQuery();
  const [nationalIdDropdown, setNationalIdDropdown] = useState<
    NationalIdDropdown[]
  >([]);

  const common = useTranslations("common");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchCountryDocuments({}).unwrap();
        const documents = response?.data?.documents || [];
        console.log('document type', documents);
        const transformedDocuments = documents.map(
          (doc: any, index: number) => ({
            id: index.toString(),
            label: doc.label,
            value: doc.value,
          })
        );

        setNationalIdDropdown(transformedDocuments);
      } catch (err) {
        console.error(
          "Failed to fetch documents: " + JSON.stringify(err, null, 2)
        );
      }
    };

    fetchData(); // ✅ trigger the fetch
  }, [fetchCountryDocuments]);

  const dispatch = useAppDispatch();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<KycFormValues>({ mode: "all", defaultValues });
  const [updateKyc] = useUpdateKycMutation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const accSetLang = useTranslations("accountSettings");
  const { nextStep } = useSettingNextStep();
  const { data, isSuccess } = useGetKycDetailsQuery();

  useEffect(() => {
    if (isSuccess && data?.data?.kycVerification) {
      reset(data.data.kycVerification);
    }
  }, [isSuccess, data]);

  const kycOnSubmit = async (data: KycFormValues) => {
    setIsLoading(true);
    try {
      const response = await updateKyc(data);

      if (response?.data?.statusCode === 200) {
        const faciaResponse = response?.data?.data?.faciaResponse;

        if (
          faciaResponse?.status &&
          faciaResponse?.result?.data?.liveness_url
        ) {
          const liveUrl = faciaResponse.result.data.liveness_url;
          const referenceId = faciaResponse.result.data.reference_id;

          // setLivenessUrl(liveUrl);
          // router.push(`/app/settings/facia-verification?url=${liveUrl}`);
          // setShowDialog(true);

          // Store reference ID for callback handling
          localStorage.setItem("kyc_reference_id", referenceId);

          dispatch(setIsKycComplete(true));
          dispatch(setIsAccountSettingOpen(false));
          reset();
          let validateObj = {
            membershipStatus: accountSettingData?.membershipStatus,
            subModule: "KYC",
          };
          nextStep(AccountSettingsStageKey.TaxSettings, validateObj);
        }
      } else {
        // Show error message to user
        let errorMessage = "KYC update failed";
        if ("error" in response && response.error) {
          if (
            "data" in response.error &&
            response.error.data &&
            typeof response.error.data === "object" &&
            "message" in response.error.data
          ) {
            errorMessage = response.error.data.message as string;
          } else if ("message" in response.error) {
            errorMessage = response.error.message as string;
          }
        }
        setErrorMessage(errorMessage);
        // You can add a toast notification here to show the error to the user
      }
    } catch (error: any) {
      // Show error message to user

      setErrorMessage(errorMessage);
      // You can add a toast notification here to show the error to the user
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <ComplianceSettingsForm
        title={accSetLang("complianceSettings.kycVerification.title")}
        submitText={accSetLang(
          "complianceSettings.kycVerification.button.continue"
        )}
        submitLoadingText={accSetLang(
          "complianceSettings.kycVerification.button.submitting"
        )}
        reset={reset}
        isLoading={isLoading}
        handleSubmit={handleSubmit(kycOnSubmit)}
      >
        <div className="o-s-c-b-right">
          <div className="forms-block">
            <div className="forms-group">
              <label className="f-g-label">
                {accSetLang(
                  "complianceSettings.kycVerification.formInfo.identityVerification"
                )}
              </label>

              <Controller
                name="identityVerification.documentType"
                control={control}
                rules={{
                  required: `${accSetLang(
                    "complianceSettings.kycVerification.errorMsg.document"
                  )}`,
                }}
                render={({ field }) => (
                  <>
                    {nationalIdDropdown.length === 0 ? (
                      <>
                        <InputField
                          type="text"
                          placeholder="Enter IdentityVerification Type"
                          {...field}
                        />
                      </>
                    ) : (
                      <>
                        {" "}
                        <Select
                          style={{ width: "100%" }}
                          options={nationalIdDropdown}
                          placeholder={`${common("Select")}`}
                          optionLabel="label"
                          optionValue="value"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </>
                    )}
                    {errors.identityVerification?.documentType && (
                      <span className="error-txt">
                        {errors.identityVerification.documentType.message}
                      </span>
                    )}
                  </>
                )}
              />
            </div>
            <div className="forms-group">
              <label className="f-g-label">
                {" "}
                {accSetLang(
                  "complianceSettings.kycVerification.formInfo.uploadDocument"
                )}
              </label>
              <Controller
                name="identityVerification.document"
                control={control}
                render={({ field }) => (
                  <DndImageUpload
                    value={
                      Array.isArray(field.value)
                        ? field.value[0]
                        : field.value || undefined
                    }
                    onChange={(file) => {
                      if (Array.isArray(file)) {
                        field.onChange(file[0]);
                      } else {
                        field.onChange(file);
                      }
                    }}
                    single={true}
                    allowedFileTypes={[
                      "application/pdf",
                      "image/jpeg",
                      "image/jpg",
                      "image/png",
                    ]}
                    maxHeight={Infinity}
                    maxWidth={Infinity}
                    isShowEditBtn={false}
                  />
                )}
              />
              {errors.identityVerification?.document && (
                <span className="error-txt">
                  {errors.identityVerification.document.message}
                </span>
              )}
            </div>
            <div className="forms-group">
              <label className="f-g-label">
                {accSetLang(
                  "complianceSettings.kycVerification.formInfo.addressVerification"
                )}
              </label>
              <Controller
                name="addressVerification.documentType"
                control={control}
                render={({ field }) => (
                  <>
                    {nationalIdDropdown.length === 0 ? (
                      <>
                        <InputField
                          type="text"
                          placeholder="Enter Address Verification Type"
                          {...field}
                        />
                      </>
                    ) : (
                      <>
                        {" "}
                        <Select
                          style={{ width: "100%" }}
                          options={nationalIdDropdown}
                          placeholder={`${common("Select")}`}
                          optionLabel="label"
                          optionValue="value"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </>
                    )}
                    {errors.addressVerification?.documentType && (
                      <span className="error-txt">
                        {errors.addressVerification.documentType.message}
                      </span>
                    )}
                  </>
                )}
              />
            </div>
            <div className="forms-group">
              <label className="f-g-label">
                {" "}
                {accSetLang(
                  "complianceSettings.kycVerification.formInfo.uploadDocument"
                )}
              </label>
              <Controller
                name="addressVerification.document"
                control={control}
                render={({ field }) => (
                  <DndImageUpload
                    value={
                      Array.isArray(field.value)
                        ? field.value[0]
                        : field.value || undefined
                    }
                    onChange={(file) => {
                      if (Array.isArray(file)) {
                        field.onChange(file[0]);
                      } else {
                        field.onChange(file);
                      }
                    }}
                    single={true}
                    allowedFileTypes={[
                      "application/pdf",
                      "image/jpeg",
                      "image/jpg",
                      "image/png",
                    ]}
                    maxHeight={Infinity}
                    maxWidth={Infinity}
                    isShowEditBtn={false}
                  />
                )}
              />
              {errors.addressVerification?.document && (
                <span className="error-txt">
                  {errors.addressVerification.document.message}
                </span>
              )}
            </div>
          </div>
        </div>
      </ComplianceSettingsForm>
    </>
  );
};

export default KycForm;
