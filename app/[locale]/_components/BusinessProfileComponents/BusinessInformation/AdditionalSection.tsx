import Typography from "@/app/[locale]/_components/Base/Typography";
import Inputs from "@/app/[locale]/_components/form/Inputs";
// import Select from "@/app/[locale]/_components/form/Select";
import Button from "@/app/[locale]/_components/Buttons/Button";
import Select from "@/app/[locale]/_components/StoreFront/Forms/Select";
import {
  AdditionalSectionAPIFormat,
  AdditionalSectionInterface,
  countryBasedStates,
  countryCodesInterface,
} from "@/app/[locale]/_interface/BusinessProfile";
import { annualTurnoverRanger } from "@/app/[locale]/_models/common";
import { BusinessProfileStageKey } from "@/app/[locale]/_models/StoreFront";
import {
  useGetBusinessInformationQuery,
  useUpdateAdditionalDetailsMutation,
} from "@/app/[locale]/_store/apiReducer/businessProfileApi";
import { showToast } from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { BusinessAdditionalSectionSchema } from "@/app/[locale]/_validationSchema/businessProfile";
import '@/app/[locale]/dev_styles.css';
import { zodResolver } from "@hookform/resolvers/zod";
import { City, Country, State } from "country-state-city";
import { useTranslations } from "next-intl";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface BusinessInformationInterface {
  isEdit: boolean;
  updateEditStatus: (key: string, value: boolean) => void;
  onSuccess: () => void;
}

const AdditionalSection: React.FC<BusinessInformationInterface> = (props) => {
  const { isEdit, updateEditStatus, onSuccess } = props;
  const formRef = useRef<HTMLFormElement>(null);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdditionalSectionInterface>({
    defaultValues: {
      shippingAddress: {
        addressLine: "",
        state: {},
        pinCode: "",
        city: {},
        country: {},
      },
      annualTurnover: "",
      website: "",
    },
    mode: "onBlur",
    resolver: zodResolver(BusinessAdditionalSectionSchema),
  });
  const dispatch = useAppDispatch();
  const currentStepperStatus = useAppSelector(
    (state: RootState) => state.stepperStatus.stepperStatus
  );

  const [countriesOptions, setCountriesOptions] = useState<
    { name: string; code: string }[]
  >([]);
  const [selectedCountry, setSelectedCountry] =
    useState<countryCodesInterface | null>(null);
  const [selectedState, setSelectedState] = useState<countryBasedStates | null>(
    null
  );
  const [stateOptions, setStateOptions] = useState<countryBasedStates[]>([]);
  const [cityOptions, setCityOptions] = useState<countryBasedStates[]>([]);

  // Tax verification Api(Get)
  const {
    data: AdditionalInfo,
    isSuccess,
    refetch,
  } = useGetBusinessInformationQuery(
    { stage: "Additional" },
    {
      skip:
        currentStepperStatus[BusinessProfileStageKey.Additional] === "pending",
    }
  );
  const AdditionalInformation = AdditionalInfo?.data;
  const businessProfileT = useTranslations(
    "businessProfile.businessInformation"
  );

  useEffect(() => {
    if (
      currentStepperStatus[BusinessProfileStageKey.Additional] !== "pending"
    ) {
      refetch();
    }
  }, [currentStepperStatus[BusinessProfileStageKey.Additional]]);

  useEffect(() => {
    const countries = Country.getAllCountries().map((country) => ({
      name: country.name,
      code: country.isoCode,
    }));
    setCountriesOptions(countries); // Set the entire array at once
  }, []);

  useEffect(() => {
    const selectState = State.getStatesOfCountry(selectedCountry?.code)?.map(
      (stateDetails) => ({
        name: stateDetails?.name ?? "",
        longitude: stateDetails?.longitude ?? null,
        latitude: stateDetails?.latitude ?? null,
        isoCode: stateDetails?.isoCode,
        countryCode: stateDetails?.countryCode,
      })
    );
    setStateOptions(selectState);
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedCountry?.code && selectedState?.isoCode) {
      const selectCity = City.getCitiesOfState(
        selectedCountry?.code,
        selectedState?.isoCode
      ).map((cityDetails) => ({
        name: cityDetails?.name ?? "",
        longitude: cityDetails?.longitude ?? null,
        latitude: cityDetails?.latitude ?? null,
        countryCode: cityDetails?.countryCode ?? "",
        stateCode: cityDetails?.stateCode ?? "",
      }));
      setCityOptions(selectCity);
    }
  }, [selectedState, selectedCountry]);

  // value reset useEffect
  useEffect(() => {
    if (
      currentStepperStatus[BusinessProfileStageKey.Additional] !== "completed"
    ) {
      updateEditStatus(BusinessProfileStageKey.Additional, true);
    } else {
      updateEditStatus(BusinessProfileStageKey.Additional, false);
    }
    const getCountryCode =
      AdditionalInformation?.shippingAddress?.country?.code;
    const countryBasedStateList = State?.getStatesOfCountry(
      getCountryCode
    )?.map((stateDetails) => ({
      name: stateDetails?.name ?? "",
      longitude: stateDetails?.longitude ?? null,
      latitude: stateDetails?.latitude ?? null,
      isoCode: stateDetails?.isoCode ?? "",
      countryCode: stateDetails?.countryCode ?? "",
    }));
    const matchedState = countryBasedStateList?.find(
      (state) => state?.name === AdditionalInformation?.shippingAddress?.state
    );
    let cityBasedOnState;
    if (getCountryCode && matchedState) {
      cityBasedOnState = City.getCitiesOfState(
        getCountryCode,
        matchedState?.isoCode
      )?.map((cityDetails: countryBasedStates) => ({
        name: cityDetails?.name ?? "",
        longitude: cityDetails?.longitude ?? null,
        latitude: cityDetails?.latitude ?? null,
        countryCode: cityDetails?.countryCode ?? "",
        stateCode: cityDetails?.stateCode ?? "",
      }));
    }
    const matchedCity = cityBasedOnState?.find(
      (city: countryBasedStates) =>
        city?.name === AdditionalInformation?.shippingAddress?.city
    );

    setStateOptions(countryBasedStateList);
    setCityOptions(cityBasedOnState);

    if (isSuccess && AdditionalInfo) {
      reset({
        shippingAddress: {
          addressLine: AdditionalInfo?.data?.shippingAddress?.addressLine ?? "",
          state: matchedState ?? {},
          pinCode: AdditionalInfo?.data?.shippingAddress?.pinCode ?? "",
          city: matchedCity ?? {},
          country: AdditionalInfo?.data?.shippingAddress?.country,
        },
        annualTurnover: AdditionalInfo?.data?.annualTurnover ?? "",
        website: AdditionalInfo?.data?.website ?? "",
      });
    }
  }, [isSuccess, AdditionalInfo, reset]);

  // business additional section update api
  const [updateAdditionalDetails] = useUpdateAdditionalDetailsMutation();

  const onSubmit = async (data: AdditionalSectionInterface) => {
    const shippingAddress: any = {
      addressLine: data?.shippingAddress?.addressLine ?? "",
      state: data?.shippingAddress?.state?.name ?? "",
      pinCode: data?.shippingAddress?.pinCode ?? "",
      city: data?.shippingAddress?.city?.name ?? "",
    };

    if (
      data?.shippingAddress?.country?.name &&
      data?.shippingAddress?.country?.code
    ) {
      shippingAddress.country = {
        name: data.shippingAddress.country.name,
        code: data.shippingAddress.country.code,
      };
    }
    const payload: AdditionalSectionAPIFormat = {
      shippingAddress,
      annualTurnover: data?.annualTurnover !== "" ? data?.annualTurnover : undefined,
      website: data?.website !== "" ? data?.website : undefined,
    };


    try {
      await updateAdditionalDetails(payload).unwrap();
      onSuccess();
      reset();
    } catch (error) {
      console.log('error add', error?.data?.message);

      dispatch(
        showToast({
          title: "Error!",
          message: error?.data?.message,
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

  return (
    <>
      {!isEdit && (
        <div className="c-f-b-t-body label-grey-reverse">
          <div className="accordion-form-block-group">
            <div className="accordion-form-block">
              <Typography variant="span" className="a-f-b-title">
                {businessProfileT("title")}
              </Typography>
              <div className="tabs-content">
                <div className="tabs-form-group">
                  <label htmlFor="Product Name" className="t-f-g-label">
                    {businessProfileT(
                      "businessAdditional.shippingAddress.title"
                    )}
                  </label>
                  {AdditionalInformation?.shippingAddress?.addressLine !== '' ? (
                    <span className="t-f-g-txt">
                      {`${AdditionalInformation?.shippingAddress?.addressLine ??
                        ""
                        },
                      ${AdditionalInformation?.shippingAddress?.city ?? ""},
                    ${AdditionalInformation?.shippingAddress?.state ?? ""},
                    ${AdditionalInformation?.shippingAddress?.country?.name ??
                        ""
                        }-
                    ${AdditionalInformation?.shippingAddress?.pinCode ?? "--"}`}
                    </span>
                  ) : (
                    "--"
                  )}
                </div>
                <div className="tabs-form-group">
                  <label htmlFor="Product Name" className="t-f-g-label">
                    {businessProfileT("businessAdditional.turnover")}
                  </label>
                  <span className="t-f-g-txt">
                    {AdditionalInformation?.annualTurnover ?? "--"}
                  </span>
                </div>
                <div className="tabs-form-group">
                  <label htmlFor="Product Name" className="t-f-g-label">
                    {businessProfileT("businessAdditional.website.title")}
                  </label>
                  <span className="t-f-g-txt">
                    {AdditionalInformation?.website ?? "--"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {isEdit && (
        <form ref={formRef}>
          <div className="c-f-b-t-body">
            <div className="accordion-form-block-group">
              {/* Business Information */}
              <div className="accordion-form-block">
                <Typography variant="span" className="a-f-b-title">
                  {businessProfileT("title")}
                </Typography>
                <div className="forms-block">
                  <div className="forms-group">
                    <label className="f-g-label">
                      {businessProfileT(
                        "businessAdditional.shippingAddress.title"
                      )}
                    </label>
                    <Controller
                      name="shippingAddress.addressLine"
                      control={control}
                      render={({ field }) => (
                        <Inputs
                          type={"text"}
                          placeholder={businessProfileT(
                            "businessDetails.businessAddressPlaceholder"
                          )}
                          {...field}
                          value={field.value ?? ""}
                        />
                      )}
                    />
                    {errors.shippingAddress?.addressLine && (
                      <span className="error-txt">
                        {errors.shippingAddress?.addressLine.message}
                      </span>
                    )}
                    {/* shippingAddress Country and State */}
                    <div className="f-g-input-horiz">
                      <div className="f-g-input-horiz-inside">
                        <Controller
                          name="shippingAddress.country"
                          control={control}
                          render={({ field }) => (
                            <Select
                              options={countriesOptions}
                              value={field.value}
                              onChange={(e) => {
                                field.onChange(e);
                                setSelectedCountry(e);
                              }}
                              filter={true}
                              filterBy="name"
                              virtualScrollerOptions={{
                                itemSize: 40,
                              }}
                              placeholder={businessProfileT(
                                "businessDetails.contactInfo.country"
                              )}
                            />
                          )}
                        />
                        {errors.shippingAddress?.country?.name && (
                          <span className="error-txt">
                            {errors.shippingAddress?.country?.name.message}
                          </span>
                        )}
                      </div>
                      <div className="f-g-input-horiz-inside">
                        <Controller
                          name="shippingAddress.state"
                          control={control}
                          render={({ field }) => (
                            <Select
                              disabled={stateOptions?.length > 0 ? false : true}
                              options={stateOptions}
                              value={field.value}
                              onChange={(e) => {
                                field.onChange(e);
                                setSelectedState(e);
                              }}
                              filter
                              filterBy="name"
                              virtualScrollerOptions={{
                                itemSize: 40,
                              }}
                              placeholder={businessProfileT(
                                "businessDetails.contactInfo.address.state"
                              )}
                            />
                          )}
                        />
                        {errors.shippingAddress?.state && (
                          <span className="error-txt">
                            {errors.shippingAddress?.state.message}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* shippingAddress City and PinCode */}
                    <div className="f-g-input-horiz">
                      <div className="f-g-input-horiz-inside">
                        <Controller
                          name="shippingAddress.city"
                          control={control}
                          render={({ field }) => (
                            <Select
                              disabled={cityOptions?.length > 0 ? false : true}
                              options={cityOptions}
                              // onChange={field.onChange}
                              filter={true}
                              filterBy="name"
                              virtualScrollerOptions={{
                                itemSize: 40,
                              }}
                              placeholder={businessProfileT(
                                "businessDetails.contactInfo.address.city"
                              )}
                              {...field}
                            />
                          )}
                        />
                        {errors.shippingAddress?.city && (
                          <span className="error-txt">
                            {errors.shippingAddress?.city.message}
                          </span>
                        )}
                      </div>
                      <div className="f-g-input-horiz-inside">
                        <Controller
                          name="shippingAddress.pinCode"
                          control={control}
                          render={({ field }) => (
                            <Inputs
                              type={"text"}
                              placeholder={businessProfileT(
                                "businessDetails.contactInfo.address.pincode"
                              )}
                              {...field}
                              value={field.value ?? ""}
                            />
                          )}
                        />
                        {errors.shippingAddress?.pinCode && (
                          <span className="error-txt">
                            {errors.shippingAddress?.pinCode.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="forms-group">
                    <label className="f-g-label">
                      {businessProfileT("businessAdditional.turnover")}
                    </label>
                    <Controller
                      name="annualTurnover"
                      control={control}
                      render={({ field }) => (
                        <Select
                          placeholder={"Select Annual Turnover"}
                          options={annualTurnoverRanger}
                          {...field}
                          value={field.value ?? null}
                        />
                      )}
                    />
                  </div>
                  <div className="forms-group">
                    <label className="f-g-label">
                      {businessProfileT("businessAdditional.website.title")}
                    </label>
                    <Controller
                      name="website"
                      control={control}
                      render={({ field }) => (
                        <Inputs
                          type={"text"}
                          placeholder={"www.apparel.com"}
                          {...field}
                          value={field.value ?? ""}
                        />
                      )}
                    />
                    {errors.website && (
                      <span className="error-txt">
                        {errors.website.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="button-group-block edit-save-btn-block">
                <Button
                  className={"btn-outline bg-outline-dark btn-c-sm"}
                  text={businessProfileT("businessDetails.cancel")}
                  onClick={onSuccess}
                  disabled={isSubmitting ||
                    !(currentStepperStatus?.[BusinessProfileStageKey.BusinessDetails] === "completed" &&
                      currentStepperStatus?.[BusinessProfileStageKey.CompanyRegistrationDetails] === "completed"
                    )
                  }
                />
                <Button
                  className={"btn-c-primary btn-c-sm"}
                  text={businessProfileT("businessDetails.save")}
                  onClick={handleSubmit(onSubmit, onError)}
                  disabled={isSubmitting ||
                    !(currentStepperStatus?.[BusinessProfileStageKey.BusinessDetails] === "completed" &&
                      currentStepperStatus?.[BusinessProfileStageKey.CompanyRegistrationDetails] === "completed"
                    )
                  }
                />
              </div>
            </div>
          </div>
          {/* <div className="button-group-block gap-10px wid-btn-block">
              <div className="add-option-block">
                <ButtonIconLeftOutline
                  name={"Cancel"}
                  className={"bg-outline-grey btn-attributes"}
                  onClick={onSuccess}
                >
                  <CloseIcon />
                </ButtonIconLeftOutline>
              </div>
              <Buttons
                className={"btn-c-primary btn-c-sm"}
                text={"Save"}
                onClick={handleSubmit(onSubmit)}
              />
            </div> */}
        </form>
      )}
    </>
  );
};

export default AdditionalSection;
