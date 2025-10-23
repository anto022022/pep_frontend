import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import Button from "@/app/[locale]/_components/Buttons/Button";
import MultiSelectInputs from "@/app/[locale]/_components/form/MultiSelectDrapDown";
import { FactoryWarehouseInterface } from "@/app/[locale]/_interface/BusinessProfile";
import { contractManufacturingOptions } from "@/app/[locale]/_models/common";
import { BusinessProfileStageKey } from "@/app/[locale]/_models/StoreFront";
import {
  useGetBusinessInformationQuery,
  useUpdateFactoryWarehouseDetailsMutation,
} from "@/app/[locale]/_store/apiReducer/businessProfileApi";
import { showToast } from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { BusinessFactoryWarehouseSchema } from "@/app/[locale]/_validationSchema/businessProfile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

interface BusinessInformationInterface {
  isEdit: boolean;
  updateEditStatus: (key: string, value: boolean) => void;
  onSuccess: () => void;
}

const ManufacturingTeams: React.FC<BusinessInformationInterface> = (props) => {
  const { isEdit, updateEditStatus, onSuccess } = props;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const common = useTranslations("common");
  const currentStepperStatus = useAppSelector(
    (state: RootState) => state.stepperStatus.stepperStatus
  );
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FactoryWarehouseInterface>({
    defaultValues: {
      contractManufacturing: [],
    },
    mode: "onBlur",
    resolver: zodResolver(BusinessFactoryWarehouseSchema),
  });
  const businessProfileT = useTranslations(
    "businessProfile.businessInformation"
  );

  // Factory Warehouse Details Api(Get)
  const {
    data: FactoryWarehouseInfo,
    isSuccess,
    refetch,
  } = useGetBusinessInformationQuery(
    {
      stage: "FactoryWarehouseDetails",
    },
    {
      skip:
        currentStepperStatus[
          BusinessProfileStageKey.FactoryWarehouseDetails
        ] === "pending",
    }
  );

  // Factory Warehouse Details update Api
  const [updateFactoryWarehouseDetails] =
    useUpdateFactoryWarehouseDetailsMutation();

  useEffect(() => {
    if (
      currentStepperStatus[BusinessProfileStageKey.FactoryWarehouseDetails] !==
      "pending"
    ) {
      refetch();
    }
  }, [currentStepperStatus[BusinessProfileStageKey.FactoryWarehouseDetails]]);

  //Re-set the value to from
  useEffect(() => {
    if (
      currentStepperStatus[BusinessProfileStageKey.FactoryWarehouseDetails] !==
      "completed"
    ) {
      updateEditStatus(BusinessProfileStageKey.FactoryWarehouseDetails, true);
    } else {
      updateEditStatus(BusinessProfileStageKey.FactoryWarehouseDetails, false);
    }

    if (isSuccess && FactoryWarehouseInfo) {
      reset({
        contractManufacturing:
          FactoryWarehouseInfo?.data?.contractManufacturing ?? [],
      });
    }
  }, [FactoryWarehouseInfo, isSuccess, reset]);

    const onSubmit = async (data: FactoryWarehouseInterface) => {
        try {
            await updateFactoryWarehouseDetails(data).unwrap();
            if (currentStepperStatus[BusinessProfileStageKey.BusinessDetails] === 'completed' &&
                currentStepperStatus[BusinessProfileStageKey.CompanyRegistrationDetails] === 'completed' &&
                currentStepperStatus[BusinessProfileStageKey.MarketLogistics] === 'completed' &&
                currentStepperStatus[BusinessProfileStageKey.ShippingPaymentTerms] === 'completed') {
                router.push("/app");
            }
            onSuccess();
            reset();
        } catch (error) {
            const errorData = error?.data?.error;
      dispatch(
        showToast({
          title: "Error!",
          message: errorData[0],
          theme: "error",
        })
      );
    }
  };

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
      {/* View form */}
      {!isEdit && (
        <div className="c-f-b-t-body label-grey-reverse">
          <div className="tabs-content col-2-layout flex-dir-row">
            <div className="tabs-form-group">
              <label htmlFor="Product Name" className="t-f-g-label">
                {businessProfileT(
                  "manufacturingTerms.contractManufacturing.title"
                )}
              </label>
              <span className="t-f-g-txt">
                {FactoryWarehouseInfo?.data?.contractManufacturing?.map(
                  (data: string, index: number, arr: string[]) => (
                    <span key={index}>
                      {data}
                      {index < arr.length - 1 ? ", " : ""}
                    </span>
                  )
                ) ?? "--"}
              </span>
            </div>
          </div>
        </div>
      )}
      {isEdit && (
        <form>
          <div className="c-f-b-t-body">
            <div className="forms-block">
              <div className="forms-group">
                <label className="f-g-label">
                  {businessProfileT(
                    "manufacturingTerms.contractManufacturing.title"
                  )}
                </label>
                <Controller
                  name="contractManufacturing"
                  control={control}
                  render={({ field }) => (
                    <MultiSelectInputs
                      options={contractManufacturingOptions}
                      value={field.value || []}
                      onChange={field.onChange}
                      selectAllLabel={`${common("selectAll")}`}
                      appendTo={"self"}
                    />
                  )}
                />
                {errors.contractManufacturing && (
                  <span className="error-txt">
                    {errors.contractManufacturing.message}
                  </span>
                )}
              </div>
              <div className="button-group-block edit-save-btn-block">
                <Button
                  className={"btn-outline bg-outline-dark btn-c-sm"}
                  text={businessProfileT("businessDetails.cancel")}
                  onClick={onSuccess}
                  disabled={
                    isSubmitting ||
                    !(
                      currentStepperStatus?.[
                        BusinessProfileStageKey.BusinessDetails
                      ] === "completed" &&
                      currentStepperStatus?.[
                        BusinessProfileStageKey.CompanyRegistrationDetails
                      ] === "completed" &&
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
                  text={businessProfileT("businessDetails.save")}
                  onClick={handleSubmit(onSubmit, onError)}
                  disabled={
                    isSubmitting ||
                    !(
                      currentStepperStatus?.[
                        BusinessProfileStageKey.BusinessDetails
                      ] === "completed" &&
                      currentStepperStatus?.[
                        BusinessProfileStageKey.CompanyRegistrationDetails
                      ] === "completed" &&
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
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default ManufacturingTeams;
