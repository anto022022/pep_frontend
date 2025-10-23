import { Controller, useForm } from "react-hook-form";
import ComplianceSettingsForm from "./ComplianceSettingsForm";
import { useTranslations } from "next-intl";
import DndImageUpload from "../StoreFront/Forms/DndImageUpload";
import Select from "../StoreFront/Forms/Select";
import {
  DocumentInfo,
  KybFormValues,
  Section,
} from "../../_interface/SettingsInterface";
import {
  useGetKybDetailsQuery,
  useUpdateKybMutation,
} from "../../_store/apiReducer/settingsApi";
import { useEffect, useState } from "react";
import SuccessDialog from "../dialog/SuccessDialog";
import Buttons from "../Buttons/Buttons";
import {
  setIsAccountSettingOpen,
  setIsKybComplete,
} from "../../_store/reducers/ui_store";
import { useAppDispatch } from "../../_store/store";
import { getComplianceSettingsOptions } from "@/app/[locale]/_models/common";
import { AccountSettings } from "../../_interface/SettingsInterface";
import { AccountSettingsStageKey } from "@/app/[locale]/_models/StoreFront";
import useSettingNextStep from "@/app/[locale]/_hooks/useSettingNextStep";

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
  businessRegistration: defaultInfo(),
  taxIdVerification: defaultInfo(),
  businessAddressProof: defaultInfo(),
};

const KybForm = ({ data: accountSettingData }: { data: AccountSettings }) => {
  const dispatch = useAppDispatch();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<KybFormValues>({ mode: "all", defaultValues });
  const [updateKyb] = useUpdateKybMutation();

  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const accSetLang = useTranslations("accountSettings");
  const { KybForm } = getComplianceSettingsOptions();
  const { data, isSuccess } = useGetKybDetailsQuery();
  const { nextStep } = useSettingNextStep();
  useEffect(() => {
    if (isSuccess && data?.data?.kybVerification) {
      reset(data.data.kybVerification);
    }
  }, [isSuccess, data]);

  const kybOnSubmit = async (data: KybFormValues) => {
    setIsLoading(true);
    const response = await updateKyb(data);
    if (response?.data?.statusCode === 200) {
      setIsLoading(false);
      dispatch(setIsAccountSettingOpen(false));
      dispatch(setIsKybComplete(true));
      reset();
      setDialogVisible(true);
      let validateObj = {
        membershipStatus: accountSettingData?.membershipStatus,
        subModule: "KYB",
      };
      nextStep(AccountSettingsStageKey.TaxSettings, validateObj);
    } else {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ComplianceSettingsForm
        title={accSetLang("complianceSettings.kybVerification.title")}
        submitText={accSetLang(
          "complianceSettings.kybVerification.button.continue"
        )}
        submitLoadingText={accSetLang(
          "complianceSettings.kybVerification.button.submitting"
        )}
        reset={reset}
        isLoading={isLoading}
        handleSubmit={handleSubmit(kybOnSubmit)}
      >
        <div className="o-s-c-b-right">
          <div className="forms-block">
            <div className="forms-group">
              <label className="f-g-label">
                {accSetLang(
                  "complianceSettings.kybVerification.formInfo.businessRegistrationDocument"
                )}
              </label>

              <Controller
                name="businessRegistration.documentType"
                control={control}
                rules={{
                  required: `${accSetLang(
                    "complianceSettings.kybVerification.errorMsg.document"
                  )}`,
                }}
                render={({ field }) => (
                  <>
                    <Select
                      {...field}
                      style={{ width: "100%" }}
                      options={KybForm.businessRegistrationDocument}
                      onChange={(value: string) => field.onChange(value)}
                    />
                    {errors.businessRegistration?.documentType && (
                      <span className="error-txt">
                        {errors.businessRegistration.documentType.message}
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
                  "complianceSettings.kybVerification.formInfo.uploadDocument"
                )}
              </label>
              <Controller
                name="businessRegistration.document"
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

              {errors.businessRegistration?.document && (
                <span className="error-txt">
                  {errors.businessRegistration.document.message}
                </span>
              )}
            </div>
            <div className="forms-group">
              <label className="f-g-label">
                {accSetLang(
                  "complianceSettings.kybVerification.formInfo.taxIdentificationVerification"
                )}
              </label>
              <Controller
                name="taxIdVerification.documentType"
                control={control}
                rules={{
                  required: `${accSetLang(
                    "complianceSettings.kybVerification.errorMsg.document"
                  )}`,
                }}
                render={({ field }) => (
                  <>
                    <Select
                      {...field}
                      style={{ width: "100%" }}
                      options={KybForm.taxIdentificationVerification}
                      onChange={(value: string) => field.onChange(value)}
                    />
                    {errors.taxIdVerification?.documentType && (
                      <span className="error-txt">
                        {errors.taxIdVerification.documentType.message}
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
                  "complianceSettings.kybVerification.formInfo.uploadDocument"
                )}
              </label>
              <Controller
                name="taxIdVerification.document"
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
              {errors.taxIdVerification?.document && (
                <span className="error-txt">
                  {errors.taxIdVerification.document.message}
                </span>
              )}
            </div>

            <div className="forms-group">
              <label className="f-g-label">
                {accSetLang(
                  "complianceSettings.kybVerification.formInfo.businessAddressProof"
                )}
              </label>
              <Controller
                name="businessAddressProof.documentType"
                control={control}
                rules={{
                  required: `${accSetLang(
                    "complianceSettings.kybVerification.errorMsg.document"
                  )}`,
                }}
                render={({ field }) => (
                  <>
                    <Select
                      {...field}
                      style={{ width: "100%" }}
                      options={KybForm.businessAddressProof}
                      onChange={(value: string) => field.onChange(value)}
                    />
                    {errors.businessAddressProof?.documentType && (
                      <span className="error-txt">
                        {errors.businessAddressProof.documentType.message}
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
                  "complianceSettings.kybVerification.formInfo.uploadDocument"
                )}
              </label>
              <Controller
                name="businessAddressProof.document"
                control={control}
                render={({ field }) => (
                  <DndImageUpload
                    value={field.value || undefined} // assume field.value is string or UploadedImage
                    onChange={(file) => {
                      if (Array.isArray(file)) {
                        field.onChange(file[0]); // just store a single file
                      } else {
                        field.onChange(file); // single file or string
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
              {errors.businessAddressProof?.documentType && (
                <span className="error-txt">
                  {errors.businessAddressProof.documentType.message}
                </span>
              )}
            </div>
          </div>
        </div>
      </ComplianceSettingsForm>
      <SuccessDialog
        visible={dialogVisible}
        title={accSetLang(
          "complianceSettings.kybVerification.successDialog.title"
        )}
        subTxt={accSetLang(
          "complianceSettings.kybVerification.successDialog.subTitle"
        )}
      >
        <Buttons
          className="btn-c-primary wid-max-content mx-auto wid-100px"
          text={accSetLang("complianceSettings.kybVerification.button.gotIt")}
          onClick={() => setDialogVisible(false)}
        />
      </SuccessDialog>
    </>
  );
};

export default KybForm;
