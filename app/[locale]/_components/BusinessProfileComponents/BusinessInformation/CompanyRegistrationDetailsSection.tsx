import Button from "@/app/[locale]/_components/Buttons/Button";
import Inputs from "@/app/[locale]/_components/form/Inputs";
import Select from "@/app/[locale]/_components/StoreFront/Forms/Select";
import { countryWishDocumentsList } from "@/app/[locale]/_models/common";
import { BusinessProfileStageKey } from "@/app/[locale]/_models/StoreFront";
import {
  useGetBusinessInformationQuery,
  useUpdateCompanyDetailsMutation,
} from "@/app/[locale]/_store/apiReducer/businessProfileApi";
import { showToast } from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { BusinessCompanyDetailSchema } from "@/app/[locale]/_validationSchema/businessProfile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
export interface CompanyDetailsInterface {
  businessRegistration: {
    documentType: string;
    documentId: string;
  };
}

interface BusinessInformationInterface {
  isEdit: boolean;
  updateEditStatus: (key: string, value: boolean) => void;
  onSuccess: () => void;
}

const CompanyRegistrationDetailsSection: React.FC<
  BusinessInformationInterface
> = (props) => {
  const { isEdit, updateEditStatus, onSuccess } = props;
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CompanyDetailsInterface>({
    defaultValues: {
      businessRegistration: {
        documentType: "",
        documentId: "",
      },
    },
    mode: "onBlur",
    resolver: zodResolver(BusinessCompanyDetailSchema),
  });
  const dispatch = useAppDispatch();
  const businessProfileT = useTranslations(
    "businessProfile.businessInformation"
  );
  const currentStepperStatus = useAppSelector(
    (state: RootState) => state.stepperStatus.stepperStatus
  );

  // Business Details(Get)
  const {
    data: businessDetailsInfo,
    refetch: businessRefetch,
  } = useGetBusinessInformationQuery(
    {
      stage: "BusinessDetails",
    },
    {
      skip:
        currentStepperStatus[BusinessProfileStageKey.BusinessDetails] ===
        "pending",
    }
  );

  useEffect(() => {
    if (currentStepperStatus[BusinessProfileStageKey.BusinessDetails] !== "pending") {
      businessRefetch();
    }
  }, [currentStepperStatus[BusinessProfileStageKey.BusinessDetails]]);


  const getCountryCode = businessDetailsInfo?.data?.businessAddress?.country?.code;
  // const getCountryCode = 'IN';
  const countryBasedDocumentType = React.useMemo(() => {
    const selectedCountry = countryWishDocumentsList.find(
      (country) => country["Country Code"] === getCountryCode
    );

    if (!selectedCountry) return [];

    const documents = selectedCountry.Accepted_documents;

    return Object.entries(documents).map(([key, value]) => ({
      name: key,  // this is the user-facing label
      value: value,   // this is the actual document type key
    }));
  }, [getCountryCode]);


  const {
    data: companyRegistrationInfo,
    isSuccess,
    refetch,
  } = useGetBusinessInformationQuery(
    {
      stage: "CompanyRegistrationDetails",
    },
    {
      skip:
        currentStepperStatus[
        BusinessProfileStageKey.CompanyRegistrationDetails
        ] === "pending",
    }
  );

  // business company update api
  const [updateCompanyDetails] = useUpdateCompanyDetailsMutation();

  useEffect(() => {
    if (
      currentStepperStatus[
      BusinessProfileStageKey.CompanyRegistrationDetails
      ] !== "pending"
    ) {
      refetch();
    }
  }, [
    currentStepperStatus[BusinessProfileStageKey.CompanyRegistrationDetails],
  ]);

  useEffect(() => {
    if (currentStepperStatus[BusinessProfileStageKey.CompanyRegistrationDetails] !== "completed") {
      updateEditStatus(
        BusinessProfileStageKey.CompanyRegistrationDetails,
        true
      );
    } else {
      updateEditStatus(
        BusinessProfileStageKey.CompanyRegistrationDetails,
        false
      );
    }
    if (isSuccess && companyRegistrationInfo) {
      reset({
        businessRegistration: {
          documentType:
            companyRegistrationInfo?.data?.businessRegistration?.documentType ??
            "",
          documentId:
            companyRegistrationInfo?.data?.businessRegistration?.documentId ??
            "",
        },
      });
    }
  }, [isSuccess, companyRegistrationInfo, reset]);

  const onSubmit = async (data: CompanyDetailsInterface) => {
    try {
      await updateCompanyDetails(data).unwrap();
      onSuccess();
      reset();
    } catch (error) {
      dispatch(
        showToast({
          title: "Error!",
          message: "Invalid Inputs",
          theme: "error",
        })
      );
    }
  };

  const onError = (errors: any) => {
    // Show toast only if there are validation errors
    console.warn('company reg123', errors);
    dispatch(
      showToast({
        title: "Warning!",
        message: "Please fill in all required fields.",
        theme: "info",
      })
    );
  };

  const handleCancelButton = () => {
    reset({
      businessRegistration: {
        documentType: companyRegistrationInfo?.data?.businessRegistration?.documentType ?? "",
        documentId: companyRegistrationInfo?.data?.businessRegistration?.documentId ?? "",
      }
    });
    onSuccess();
  };

  return (
    <>
      {isEdit && (
        <form>
          <div className="c-f-b-t-body">
            <div className="forms-block">
              <div className="forms-group">
                <label className="f-g-label">
                  {businessProfileT("companyRegn.docType")}
                </label>
                <Controller
                  name="businessRegistration.documentType"
                  control={control}
                  render={({ field }) => (
                    countryBasedDocumentType?.length > 0 ? (
                      <Select
                        // options={countryBasedDocumentType}
                        options={countryBasedDocumentType}
                        value={field.value}
                        // onChange={field.onChange}
                        onChange={field.onChange}
                        filter={true}
                        filterBy="name"
                        virtualScrollerOptions={{
                          itemSize: 40,
                        }}
                        placeholder={businessProfileT(
                          "companyRegn.docTypePlaceholder"
                        )}
                      />
                    ) : (
                      <Inputs
                        type="text"
                        placeholder={businessProfileT("companyRegn.docTypePlaceholder")}
                        {...field}
                      />
                    )

                  )}
                />
                {errors.businessRegistration?.documentType && (
                  <span className="error-txt">
                    {errors.businessRegistration?.documentType?.message}
                  </span>
                )}
              </div>
              <div className="forms-group">
                <label className="f-g-label">
                  {businessProfileT("companyRegn.docNo")}
                </label>
                <Controller
                  name="businessRegistration.documentId"
                  control={control}
                  render={({ field }) => (
                    <Inputs
                      type="text"
                      placeholder={businessProfileT(
                        "companyRegn.docNoPlaceholder"
                      )}
                      {...field}
                    />
                  )}
                />
                {errors.businessRegistration?.documentId && (
                  <span className="error-txt">
                    {errors.businessRegistration?.documentId?.message}
                  </span>
                )}
              </div>
              <div className="button-group-block edit-save-btn-block">
                <Button
                  className={"btn-outline bg-outline-dark btn-c-sm"}
                  text={businessProfileT("businessDetails.cancel")}
                  onClick={handleCancelButton}
                  disabled={isSubmitting ||
                    !(currentStepperStatus?.[BusinessProfileStageKey.BusinessDetails] ===
                      "completed")
                  }
                />
                <Button
                  className={"btn-c-primary btn-c-sm"}
                  text={businessProfileT("businessDetails.save")}
                  onClick={handleSubmit(onSubmit, onError)}
                  disabled={isSubmitting ||
                    !(currentStepperStatus?.[BusinessProfileStageKey.BusinessDetails] ===
                      "completed")
                  }
                />
              </div>
            </div>
          </div>
        </form>
      )}
      {!isEdit && (
        <div className="c-f-b-t-body label-grey-reverse">
          <div className="tabs-content col-2-layout flex-dir-row">
            <div className="tabs-form-group">
              <label htmlFor="Product Name" className="t-f-g-label">
                {businessProfileT("companyRegn.docType")}
              </label>
              <span className="t-f-g-txt">
                {companyRegistrationInfo?.data?.businessRegistration
                  ?.documentType ?? "--"}
              </span>
            </div>
            <div className="tabs-form-group">
              <label htmlFor="Product Name" className="t-f-g-label">
                {businessProfileT("companyRegn.docNo")}
              </label>
              <span className="t-f-g-txt">
                {companyRegistrationInfo?.data?.businessRegistration
                  ?.documentId ?? "--"}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompanyRegistrationDetailsSection;
