"use client";

import CheckBoxInputs from "@/app/[locale]/_components/form/CheckBoxInputs";
import { useUpdatePaymentMethodMutation } from "@/app/[locale]/_store/apiReducer/settingsApi";
import { setSettingPaymentCardInfo } from "@/app/[locale]/_store/reducers/settings_store";
import { updatePaymentFormSchema } from "@/app/[locale]/_validationSchema/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  setIsAccountSettingOpen,
  showToast,
} from "../../_store/reducers/ui_store";
import { RootState, useAppDispatch, useAppSelector } from "../../_store/store";
import Typography from "../Base/Typography";
import Buttons from "../Buttons/Buttons";
import InputField from "../StoreFront/Forms/InputField";

interface FormValues {
  cardHolderName: string;
  cardNo: string;
  cardExpiredDate: string;
  cvv: string;
  isCompliantWithRBIGuidelines?: boolean;
}

const defaultValues = {
  cardHolderName: "",
  cardNo: "",
  cardExpiredDate: "",
  cvv: "",
  isCompliantWithRBIGuidelines: false,
};

const UpdatePaymentMethod = ({
  paymentMethodInfo,
}: {
  paymentMethodInfo: FormValues;
}) => {
  const dispatch = useAppDispatch();
  const { isAccountSettingOpen } = useAppSelector(
    (state: RootState) => state.uiData
  );

  const [updatePaymentMethod] = useUpdatePaymentMethodMutation();

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "all",
    resolver: zodResolver(updatePaymentFormSchema),
    defaultValues,
  });
  const accSetLang = useTranslations("accountSettings");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    reset(paymentMethodInfo);
  }, [paymentMethodInfo]);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    dispatch(setSettingPaymentCardInfo(data));
    const payload = {
      cardHolderName: data.cardHolderName,
      cardNo: data.cardNo,
      cardExpiredDate: data.cardExpiredDate,
      isCompliantWithRBIGuidelines: data.isCompliantWithRBIGuidelines,
    };
    let response = await updatePaymentMethod(payload);
    if (response?.data?.statusCode === 200) {
      setIsLoading(false);
      dispatch(setIsAccountSettingOpen(false));
      dispatch(
        showToast({
          title: "Success",
          message: response.data.message,
          theme: "success",
        })
      );
      reset();
    } else {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      visible={isAccountSettingOpen}
      modal
      className="modal-comp category-modal ubo-verify-modal"
      closable={false}
      onHide={() => dispatch(setIsAccountSettingOpen(false))}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="body-payment">
          <div className="m-c-head">
            <div className="m-c-h-title-info-wrapper">
              <Typography variant="h6" className="modal-title">
                {paymentMethodInfo?.cardNo
                  ? accSetLang(
                    "subscriptionDetails.paymentMethodForm.fields.title"
                  )
                  : accSetLang("subscriptionDetails.AddPaymentMethod")}
              </Typography>
            </div>
          </div>

          <div className="m-c-body pay-mt">
            <div className="forms-block">
              <div className="loop-block">
                <div className="forms-block wid-100">
                  <div className="forms-group ">
                    <label className="f-g-label">
                      {accSetLang(
                        "subscriptionDetails.paymentMethodForm.fields.cardHolderName"
                      )}
                    </label>
                    <InputField
                      type="text"
                      placeholder={accSetLang(
                        "subscriptionDetails.paymentMethodForm.placeholder.EnterCardHolderName"
                      )}
                      {...register(`cardHolderName`)}
                    />
                    {errors.cardHolderName && (
                      <small className="error-txt">
                        {errors.cardHolderName?.message}
                      </small>
                    )}
                  </div>
                  <div className="forms-group">
                    <label className="f-g-label">
                      {accSetLang(
                        "subscriptionDetails.paymentMethodForm.fields.cardNo"
                      )}
                    </label>
                    <InputField
                      type="text"
                      placeholder={accSetLang(
                        "subscriptionDetails.paymentMethodForm.placeholder.EnterCardNo"
                      )}
                      {...register(`cardNo`)}
                    />
                    {errors.cardNo && (
                      <small className="error-txt">
                        {errors.cardNo?.message}
                      </small>
                    )}
                  </div>

                  <div className="forms-group">
                    <div className="f-g-input-horiz">
                      <div className="forms-group wid-100">
                        <label className="f-g-label">
                          {accSetLang(
                            "subscriptionDetails.paymentMethodForm.fields.Expired by"
                          )}
                        </label>
                        <InputField
                          type="text"
                          placeholder={accSetLang(
                            "subscriptionDetails.paymentMethodForm.placeholder.EnterExpiredDate"
                          )}
                          {...register(`cardExpiredDate`)}
                        />
                        {errors.cardExpiredDate && (
                          <small className="error-txt">
                            {errors.cardExpiredDate?.message}
                          </small>
                        )}
                      </div>
                      <div className="forms-group wid-100">
                        <label className="f-g-label">
                          {accSetLang(
                            "subscriptionDetails.paymentMethodForm.fields.cvv"
                          )}
                        </label>
                        <InputField
                          type="number"
                          placeholder={accSetLang(
                            "subscriptionDetails.paymentMethodForm.placeholder.EnterCVV"
                          )}
                          {...register(`cvv`)}
                        />
                        {errors.cvv && (
                          <small className="error-txt">
                            {errors.cvv?.message}
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="pay-mt">
            <Controller
              name="isCompliantWithRBIGuidelines"
              control={control}
              render={({ field }) => (
                <CheckBoxInputs
                  id="isCompliantWithRBIGuidelines"
                  label={accSetLang(
                    "subscriptionDetails.paymentMethodForm.placeholder.Accept"
                  )}
                  className="my-checkbox"
                  checked={field.value}
                  onchange={field.onChange}
                />
              )}
            />
            {/* {errors.isCompliantWithRBIGuidelines && (
              <small className="error-txt">
                {errors.isCompliantWithRBIGuidelines?.message}
              </small>
            )} */}
          </div>
          <div className="custom-bottom-border" />
          <div className="m-c-footer pay-mt">
            <Buttons
              className="btn-comp btn-outline bg-outline-dark"
              text={accSetLang(
                "subscriptionDetails.paymentMethodForm.fields.cancel"
              )}
              onClick={() => dispatch(setIsAccountSettingOpen(false))}
            />
            <Buttons
              disabled={isLoading}
              className="btn-c-primary"
              text={
                isLoading
                  ? accSetLang(
                    "subscriptionDetails.paymentMethodForm.fields.loading"
                  )
                  : paymentMethodInfo?.cardNo
                    ? accSetLang(
                      "subscriptionDetails.paymentMethodForm.fields.button"
                    )
                    : accSetLang(
                      "subscriptionDetails.paymentMethodForm.fields.Add"
                    )
              }
              type="submit"
            />
          </div>
        </div>
      </form>
    </Dialog>
  );
};

export default UpdatePaymentMethod;
