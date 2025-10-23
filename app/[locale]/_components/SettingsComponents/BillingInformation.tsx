"use client";

import { useUpdateMembershipBillingAddressMutation } from "@/app/[locale]/_store/apiReducer/settingsApi";
import { userBillingSchema } from "@/app/[locale]/_validationSchema/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { City, Country, State } from "country-state-city";
import { useTranslations } from "next-intl";
import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "../../_components/StoreFront/Forms/Select";
import {
  setIsAccountSettingOpen,
  showToast,
} from "../../_store/reducers/ui_store";
import { RootState, useAppDispatch, useAppSelector } from "../../_store/store";
import Typography from "../Base/Typography";
import Buttons from "../Buttons/Buttons";
import InputField from "../StoreFront/Forms/InputField";

interface FormValues {
  name: string;
  businessName: string;
  billingAddress: {
    addressLine: string;
    city: string;
    state: string;
    pinCode: string;
    country: {
      name: string;
      code: string;
    };
  };
}

const defaultValues = {
  name: "",
  businessName: "",
  billingAddress: {
    addressLine: "",
    city: "",
    state: "",
    pinCode: "",
    country: {
      name: "",
      code: "",
    },
  },
};
const BillingInformation = ({
  billingAddressInfo,
}: {
  billingAddressInfo: FormValues;
}) => {
  const dispatch = useAppDispatch();
  const { isAccountSettingOpen } = useAppSelector(
    (state: RootState) => state.uiData
  );
  const [updateMembershipBillingAddress] =
    useUpdateMembershipBillingAddressMutation();
  const {
    control,
    handleSubmit,
    register,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "all",
    defaultValues,
    resolver: zodResolver(userBillingSchema),
  });
  const [countriesOptions, setCountriesOptions] = useState<
    { name: string; code: string }[]
  >([]);
  useEffect(() => {
    const countries = Country.getAllCountries().map((country) => ({
      name: country.name,
      code: country.isoCode,
    }));
    setCountriesOptions(countries);
  }, []);

  useEffect(() => {
    reset(billingAddressInfo);
  }, [billingAddressInfo]);

  const [statesOptions, setStatesOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [citiesOptions, setCitiesOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const selectedCountry = watch("billingAddress.country")?.code;
  const selectedState = watch("billingAddress.state");
  const CountryVal = watch("billingAddress.country.name");
  const StateVal = watch("billingAddress.state");
  const CityVal = watch("billingAddress.city");
  const accSetLang = useTranslations("accountSettings");

  useEffect(() => {
    if (selectedCountry && selectedState) {
      const stateList = State.getStatesOfCountry(selectedCountry).map(
        (state) => ({
          label: state.name,
          value: state.name,
        })
      );
      setStatesOptions(stateList);
      const matchedState = State.getStatesOfCountry(selectedCountry).find(
        (s) => s.name === selectedState
      );

      if (matchedState) {
        const cities = City.getCitiesOfState(
          selectedCountry,
          matchedState.isoCode
        ).map((city) => ({
          label: city.name,
          value: city.name,
        }));
        setCitiesOptions(cities);
      }
    }
  }, [watch("billingAddress.country"), watch("billingAddress.state")]);

  const handleStateCityClick = async (
    country: {
      name: string;
      code: string;
    },
    stateName?: string
  ) => {
    setValue("billingAddress.state", "");
    setValue("billingAddress.city", "");

    const stateList = State.getStatesOfCountry(country.code).map((state) => ({
      label: state.name,
      value: state.name,
    }));
    setStatesOptions(stateList);

    if (stateName) {
      const matchedState = State.getStatesOfCountry(country.code).find(
        (s) => s.name === stateName
      );

      if (matchedState) {
        const cities = City.getCitiesOfState(
          country.code,
          matchedState.isoCode
        );

        const cityOptions = cities.map((city) => ({
          label: city.name,
          value: city.name,
        }));

        setCitiesOptions(cityOptions);
      } else {
        setCitiesOptions([]);
      }
    } else {
      setCitiesOptions([]);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    let response = await updateMembershipBillingAddress(data);
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
                {billingAddressInfo?.billingAddress?.addressLine
                  ? accSetLang(
                    "subscriptionDetails.billingInformationForm.fields.title"
                  )
                  : accSetLang("subscriptionDetails.AddBillingInformation")}
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
                        "subscriptionDetails.billingInformationForm.fields.name"
                      )}
                    </label>
                    <InputField
                      type="text"
                      placeholder={accSetLang(
                        "subscriptionDetails.billingInformationForm.placeholder.EnterName"
                      )}
                      {...register(`name`)}
                    />
                    {errors.name && (
                      <small className="error-txt">
                        {errors.name?.message}
                      </small>
                    )}
                  </div>
                  <div className="forms-group">
                    <label className="f-g-label">
                      {accSetLang(
                        "subscriptionDetails.billingInformationForm.fields.businessName"
                      )}
                    </label>
                    <InputField
                      type="text"
                      placeholder={accSetLang(
                        "subscriptionDetails.billingInformationForm.placeholder.EnterBusinessName"
                      )}
                      {...register(`businessName`)}
                    />
                    <Typography variant="p" className="p-d-c-c-subtxt-sm">
                      {accSetLang(
                        "subscriptionDetails.billingInformationForm.highlight.bussingessName"
                      )}
                    </Typography>
                    {errors.businessName && (
                      <small className="error-txt">
                        {errors.businessName?.message}
                      </small>
                    )}
                  </div>

                  <div className="forms-group">
                    <label className="f-g-label">
                      {accSetLang(
                        "subscriptionDetails.billingInformationForm.fields.address"
                      )}
                    </label>
                    <InputField
                      type="text"
                      placeholder={accSetLang(
                        "subscriptionDetails.billingInformationForm.placeholder.EnterAddress"
                      )}
                      {...register(`billingAddress.addressLine`)}
                    />
                    {errors?.billingAddress?.addressLine && (
                      <small className="error-txt">
                        {errors.billingAddress.addressLine.message}
                      </small>
                    )}
                  </div>

                  <div className="forms-group">
                    <div className="f-g-input-horiz">
                      <div className="forms-group wid-100">
                        <label className="f-g-label">
                          {accSetLang(
                            "subscriptionDetails.billingInformationForm.fields.country"
                          )}
                        </label>
                        <Controller
                          control={control}
                          name="billingAddress.country"
                          render={({ field }) => (
                            <Select
                              options={countriesOptions}
                              value={field.value}
                              onChange={(value) => {
                                handleStateCityClick(value);
                                field.onChange(value);
                              }}
                              filter={true}
                              filterBy="name"
                              virtualScrollerOptions={{
                                itemSize: 40,
                              }}
                              placeholder={accSetLang(
                                "subscriptionDetails.billingInformationForm.placeholder.Select"
                              )}
                            />
                          )}
                        />
                        {errors?.billingAddress?.country && (
                          <small className="error-txt">
                            {errors.billingAddress.country.message}
                          </small>
                        )}
                      </div>
                      <div className="forms-group wid-100">
                        <label className="f-g-label">
                          {accSetLang(
                            "subscriptionDetails.billingInformationForm.fields.state"
                          )}
                        </label>

                        {!statesOptions.length ? (
                          <InputField
                            type="text"
                            disabled={!CountryVal}
                            placeholder={accSetLang(
                              "subscriptionDetails.billingInformationForm.placeholder.EnterState"
                            )}
                            {...register("billingAddress.state")}
                          />
                        ) : (
                          <>
                            <Controller
                              control={control}
                              name="billingAddress.state"
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  value={field.value}
                                  onChange={(val) => field.onChange(val)}
                                  optionLabel="label"
                                  optionValue="value"
                                  disabled={!CountryVal}
                                  options={statesOptions}
                                  placeholder={accSetLang(
                                    "subscriptionDetails.billingInformationForm.placeholder.Select"
                                  )}
                                  filter={true}
                                  filterBy="label"
                                  virtualScrollerOptions={{ itemSize: 40 }}
                                />
                              )}
                            />
                            {errors?.billingAddress?.state && (
                              <small className="error-txt">
                                {errors.billingAddress.state.message}
                              </small>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="forms-group">
                    <div className="f-g-input-horiz">
                      <div className="forms-group wid-100">
                        <label className="f-g-label">
                          {accSetLang(
                            "subscriptionDetails.billingInformationForm.fields.city"
                          )}
                        </label>
                        {!citiesOptions.length ? (
                          <InputField
                            type="text"
                            disabled={!(CountryVal && StateVal)}
                            placeholder={accSetLang(
                              "subscriptionDetails.billingInformationForm.placeholder.EnterCity"
                            )}
                            {...register("billingAddress.city")}
                          />
                        ) : (
                          <>
                            <Controller
                              control={control}
                              name="billingAddress.city"
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  disabled={!(CountryVal && StateVal)}
                                  options={citiesOptions}
                                  value={field.value}
                                  onChange={(val) => field.onChange(val)}
                                  optionLabel="label"
                                  optionValue="value"
                                  placeholder={accSetLang(
                                    "subscriptionDetails.billingInformationForm.placeholder.Select"
                                  )}
                                  filter={true}
                                  filterBy="label"
                                  virtualScrollerOptions={{
                                    itemSize: 40,
                                  }}
                                />
                              )}
                            />
                            {errors?.billingAddress?.city && (
                              <small className="error-txt">
                                {errors.billingAddress.city.message}
                              </small>
                            )}
                          </>
                        )}
                      </div>
                      <div className="forms-group wid-100">
                        <label className="f-g-label">
                          {accSetLang(
                            "subscriptionDetails.billingInformationForm.fields.pinCode"
                          )}
                        </label>
                        <InputField
                          type="text"
                          disabled={!(CountryVal && StateVal && CityVal)}
                          placeholder={accSetLang(
                            "subscriptionDetails.billingInformationForm.placeholder.EnterPincode"
                          )}
                          {...register("billingAddress.pinCode")}
                        />
                        {errors?.billingAddress?.pinCode && (
                          <small className="error-txt">
                            {errors.billingAddress.pinCode.message}
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="custom-bottom-border" />
          <div className="m-c-footer pay-mt">
            <Buttons
              className="btn-comp btn-outline bg-outline-dark"
              text={accSetLang(
                "subscriptionDetails.billingInformationForm.fields.cancel"
              )}
              type="button"
              onClick={() => dispatch(setIsAccountSettingOpen(false))}
            />
            <Buttons
              disabled={isLoading}
              className="btn-c-primary"
              text={
                isLoading
                  ? accSetLang(
                    "subscriptionDetails.billingInformationForm.fields.loading"
                  )
                  : billingAddressInfo?.billingAddress?.addressLine
                    ? accSetLang(
                      "subscriptionDetails.billingInformationForm.fields.button"
                    )
                    : accSetLang(
                      "subscriptionDetails.billingInformationForm.fields.Add"
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

export default BillingInformation;
