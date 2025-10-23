"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Dialog } from "primereact/dialog";
import Typography from "../Base/Typography";
import ButtonIcon from "../Buttons/ButtonIcon";
import { PlusIcon, TrashTableIcon } from "../Icons/SVGIcons";
import ButtonIconLeftOutline from "../Buttons/ButtonIconLeftOutline";
import Buttons from "../Buttons/Buttons";
import InputField from "../StoreFront/Forms/InputField";
import { RootState, useAppDispatch, useAppSelector } from "../../_store/store";
import { setIsAccountSettingOpen, setIsUboComplete } from "../../_store/reducers/ui_store";
import { useTranslations } from "next-intl";
import { useUpdateUboMutation } from "../../_store/apiReducer/settingsApi";
import { AccountSettings } from "../../_interface/SettingsInterface";
import { AccountSettingsStageKey } from "@/app/[locale]/_models/StoreFront";
import useSettingNextStep from "@/app/[locale]/_hooks/useSettingNextStep";

interface UboMember {
  name: string;
  email: string;
  shareholding: number;
}

interface FormValues {
  members: UboMember[];
}

const UboForm = ({ data:accountSettingData }: { data: AccountSettings }) => {
  const dispatch = useAppDispatch();
  const { isAccountSettingOpen } = useAppSelector(
    (state: RootState) => state.uiData
  );
  const { nextStep } = useSettingNextStep();

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "all",
    defaultValues: {
      members: [{ name: "", email: "", shareholding: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const accSetLang = useTranslations("accountSettings");
  const [updateUbo] = useUpdateUboMutation();

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    const response = await updateUbo(data.members);
    if (response?.data?.statusCode === 200) {
      setIsLoading(false);
      dispatch(setIsAccountSettingOpen(false));
      dispatch(setIsUboComplete(true));
      reset();
      let validateObj = {
        subModule: "UBO",
      };
      nextStep(AccountSettingsStageKey.TaxSettings, validateObj);
    }
    else{
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
        <div className="m-c-head">
          <div className="m-c-h-title-info-wrapper">
            <Typography variant="h6" className="modal-title">
              {accSetLang("complianceSettings.uboVerification.formInfo.title")}
            </Typography>
            <Typography variant="span" className="modal-subtxt">
              {accSetLang("complianceSettings.uboVerification.formInfo.subTitle")}
            </Typography>
          </div>
        </div>

        <div className="m-c-body">
          <div className="forms-block">
            {fields.map((field, index) => (
              <div className="loop-block" key={field.id}>
                <div className="forms-block wid-100">
                  <div className="forms-group">
                    <label className="f-g-label">
                      {" "}
                      {accSetLang(
                        "complianceSettings.uboVerification.formInfo.input_1.name"
                      )}
                    </label>
                    <InputField
                      type="text"
                      placeholder={accSetLang(
                        "complianceSettings.uboVerification.formInfo.input_1.placeholder"
                      )}
                      {...register(`members.${index}.name`, {
                        required: `${accSetLang(
                          "complianceSettings.uboVerification.formInfo.input_1.errorMsg"
                        )}`,
                      })}
                    />
                    {errors.members?.[index]?.name && (
                      <small className="error-txt">
                        {errors.members[index].name?.message}
                      </small>
                    )}
                  </div>

                  <div className="forms-group">
                    <label className="f-g-label">
                      {" "}
                      {accSetLang(
                        "complianceSettings.uboVerification.formInfo.input_2.name"
                      )}
                    </label>
                    <InputField
                      type="text"
                      placeholder={accSetLang(
                        "complianceSettings.uboVerification.formInfo.input_2.placeholder"
                      )}
                      {...register(`members.${index}.email`, {
                        required: `${accSetLang(
                          "complianceSettings.uboVerification.formInfo.input_2.errorMsg"
                        )}`,
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: `${accSetLang(
                            "complianceSettings.uboVerification.formInfo.input_2.patternMsg"
                          )}`,
                        },
                      })}
                    />
                    {errors.members?.[index]?.email && (
                      <small className="error-txt">
                        {errors.members[index].email?.message}
                      </small>
                    )}
                  </div>

                  <div className="forms-group">
                    <label className="f-g-label">
                      {" "}
                      {accSetLang(
                        "complianceSettings.uboVerification.formInfo.input_3.name"
                      )}
                    </label>
                    <InputField
                      type="number"
                      placeholder={accSetLang(
                        "complianceSettings.uboVerification.formInfo.input_3.placeholder"
                      )}
                      {...register(`members.${index}.shareholding`, {
                        required: `${accSetLang(
                          "complianceSettings.uboVerification.formInfo.input_3.errorMsg"
                        )}`,
                        min: {
                          value: 0,
                          message: `${accSetLang(
                            "complianceSettings.uboVerification.formInfo.input_3.min"
                          )}`,
                        },
                        max: {
                          value: 100,
                          message: `${accSetLang(
                            "complianceSettings.uboVerification.formInfo.input_3.max"
                          )}`,
                        },
                      })}
                    />
                    {errors.members?.[index]?.shareholding && (
                      <small className="error-txt">
                        {errors.members[index].shareholding?.message}
                      </small>
                    )}
                  </div>
                </div>

                {index !== 0 && (
                  <ButtonIcon
                    className="b-c-i-rounded b-c-i-danger"
                    onClick={() => remove(index)}
                  >
                    <TrashTableIcon />
                  </ButtonIcon>
                )}
              </div>
            ))}
          </div>

          <div className="add-option-block margin-l-auto">
            <ButtonIconLeftOutline
              name={accSetLang(
                "complianceSettings.uboVerification.button.addMember"
              )}
              className="bg-outline-grey btn-attributes"
              onClick={() => append({ name: "", email: "", shareholding: 0 })}
            >
              <PlusIcon />
            </ButtonIconLeftOutline>
          </div>
        </div>

        <div className="m-c-footer">
          <Buttons
            className="btn-comp btn-outline bg-outline-dark"
            text={accSetLang("complianceSettings.uboVerification.button.cancel")}
            onClick={() => dispatch(setIsAccountSettingOpen(false))}
          />
          <Buttons
            className="btn-c-primary"
            text={accSetLang("complianceSettings.uboVerification.button.submit")}
            type="submit"
          />
        </div>
      </form>
    </Dialog>
  );
};

export default UboForm;
