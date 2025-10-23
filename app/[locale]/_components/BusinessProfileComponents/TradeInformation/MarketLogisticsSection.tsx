"use client";
import Button from "@/app/[locale]/_components/Buttons/Button";
import MultiSelectInputs from "@/app/[locale]/_components/form/MultiSelectDrapDown";
import { CountryOfOrigin } from "@/app/[locale]/_interface/SellOfferInterface";
import { BusinessProfileStageKey } from "@/app/[locale]/_models/StoreFront";
import {
  useGetBusinessInformationQuery,
  useUpdateMarketLogisticsMutation,
} from "@/app/[locale]/_store/apiReducer/businessProfileApi";
import { showToast } from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { marketSchema } from "@/app/[locale]/_validationSchema/businessProfile";
import { zodResolver } from "@hookform/resolvers/zod";
import { Country } from "country-state-city";
import { useTranslations } from "next-intl";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

interface MarketLogisticsSectionProps {
  isEdit: boolean;
  updateEditStatus: (key: string, value: boolean) => void;
  onSuccess: () => void;
}

export interface Market {
  mainMarkets: CountryOfOrigin[];
}

const MarketLogisticsSection: React.FC<MarketLogisticsSectionProps> = ({
  isEdit,
  updateEditStatus,
  onSuccess,
}) => {
  const dispatch = useAppDispatch();
  const currentStepperStatus = useAppSelector(
    (state: RootState) => state.stepperStatus.stepperStatus
  );
  const { data: marketData, isSuccess } = useGetBusinessInformationQuery(
    { stage: "MarketLogistics" },
    {
      skip:
        currentStepperStatus[BusinessProfileStageKey.MarketLogistics] ===
        "pending",
    }
  );

  const [updateMarket] = useUpdateMarketLogisticsMutation();
  const [countriesOptions, setCountriesOptions] = React.useState<
    { name: string; code: string }[]
  >([]);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Market>({
    defaultValues: {
      mainMarkets: [],
    },
    mode: "onChange",
    resolver: zodResolver(marketSchema),
  });
  const t = useTranslations("businessProfile.marketLogistics");
  const handleFormSubmit = async (data: Market) => {
    try {
      await updateMarket(data);
      reset();
      onSuccess();
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
  useEffect(() => {
    const countries = Country.getAllCountries().map((country) => ({
      name: country.name,
      code: country.isoCode,
    }));
    setCountriesOptions(countries); // Set the entire array at once
  }, []);

  useEffect(() => {
    // if(!marketData?.data?.mainMarkets){
    //       updateEditStatus(BusinessProfileStageKey.MarketLogistics, true);
    //     }
    //     else{
    //       updateEditStatus(BusinessProfileStageKey.MarketLogistics,false)
    //     }
    if (
      currentStepperStatus[BusinessProfileStageKey.MarketLogistics] !==
      "completed"
    ) {
      updateEditStatus(BusinessProfileStageKey.MarketLogistics, true);
    } else {
      updateEditStatus(BusinessProfileStageKey.MarketLogistics, false);
    }
    if (isSuccess) {
      reset({
        mainMarkets: marketData?.data?.mainMarkets ?? [],
      });
    }
  }, [isSuccess, marketData, reset]);

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
          <div className="tabs-content col-2-layout flex-dir-row">
            <div className="tabs-form-group">
              <label htmlFor="Product Name" className="t-f-g-label">
                {t("mainMarkets")}
              </label>
              <span className="t-f-g-txt">
                {marketData?.data?.mainMarkets &&
                  marketData?.data?.mainMarkets.length > 0
                  ? marketData?.data?.mainMarkets?.map(
                    (item: CountryOfOrigin, index: number) => (
                      <span key={index}>
                        {item.name}
                        {index !== marketData?.data?.mainMarkets.length - 1 &&
                          ", "}
                      </span>
                    )
                  )
                  : ""}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="c-f-b-t-body">
          <form className="forms-block">
            <div className="forms-group ">
              <label className="f-g-label">
                {t("mainMarkets")}
                <span className="f-g-label-dim"></span>
              </label>
              <Controller
                name="mainMarkets"
                control={control}
                render={({ field }) => (
                  <MultiSelectInputs
                    value={field.value}
                    onChange={(e) => field.onChange(e.value)}
                    options={countriesOptions}
                    optionLabel="name"
                    filter={true}
                    appendTo={"self"}
                    placeholder={t("placeholder")}
                    maxSelectedLabels={5}
                    className="customize-dropdown"
                    virtualScrollerOptions={{
                      itemSize: 40,
                    }}
                  />
                )}
              />

              {errors.mainMarkets && (
                <span className="error-txt">{errors.mainMarkets.message}</span>
              )}
            </div>
            <div className="button-group-block edit-save-btn-block">
              <Button
                className={"btn-outline bg-outline-dark btn-c-sm"}
                text={t("cancel")}
                onClick={onSuccess}
                disabled={isSubmitting ||
                  !(currentStepperStatus?.[BusinessProfileStageKey.BusinessDetails] === "completed" &&
                    currentStepperStatus?.[BusinessProfileStageKey.CompanyRegistrationDetails] === "completed"
                  )
                }
              />
              <Button
                className={"btn-c-primary btn-c-sm"}
                text={t("save")}
                onClick={handleSubmit(handleFormSubmit, onError)}
                disabled={isSubmitting ||
                  !(currentStepperStatus?.[BusinessProfileStageKey.BusinessDetails] === "completed" &&
                    currentStepperStatus?.[BusinessProfileStageKey.CompanyRegistrationDetails] === "completed"
                  )
                }
              />
            </div>
          </form>
        </div>
      )}
    </>
    // <form ref={formRef} onSubmit={handleFormSubmit}>
    //   <div>
    //     <label htmlFor="targetMarkets">Target Markets</label>
    //     <input name="targetMarkets" placeholder="Target Markets" />
    //   </div>
    //   <div>
    //     <label htmlFor="logisticsPartner">Logistics Partner</label>
    //     <input name="logisticsPartner" placeholder="Logistics Partner" />
    //   </div>
    // </form>
  );
};

export default MarketLogisticsSection;
