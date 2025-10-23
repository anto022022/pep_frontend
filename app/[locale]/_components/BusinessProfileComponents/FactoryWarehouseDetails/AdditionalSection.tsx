import { Country } from "country-state-city";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import Typography from "@/app/[locale]/_components/Base/Typography";
import AdditionalSectionViewPage from "@/app/[locale]/_components/BusinessProfileComponents/FactoryWarehouseDetails/AdditionalSectionViewPage";
import Button from "@/app/[locale]/_components/Buttons/Button";
import ButtonIcon from "@/app/[locale]/_components/Buttons/ButtonIcon";
import ButtonIconLeftOutline from "@/app/[locale]/_components/Buttons/ButtonIconLeftOutline";
import {
  PlusIcon,
  TrashIcon,
  TrashTableIcon,
} from "@/app/[locale]/_components/Icons/SVGIcons";
import DndImageUpload from "@/app/[locale]/_components/StoreFront/Forms/DndImageUpload";
import Select from "@/app/[locale]/_components/StoreFront/Forms/Select";
import Inputs from "@/app/[locale]/_components/form/Inputs";
import {
  factoryDivision,
  InfrastructureImgInterface,
} from "@/app/[locale]/_interface/BusinessProfile";
import { BusinessProfileStageKey } from "@/app/[locale]/_models/StoreFront";
import {
  annualOutputValueRange,
  totalFactorySizeRange,
  warehouseStorageAreaRange,
} from "@/app/[locale]/_models/common";
import {
  useGetBusinessInformationQuery,
  useUpdateAdditionalInformationMutation,
} from "@/app/[locale]/_store/apiReducer/businessProfileApi";
import { showToast } from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { BusinessFactoryWarehouseAdditionalInformation } from "@/app/[locale]/_validationSchema/businessProfile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export interface FactoryWarehouseAdditionalSectionInterface {
  totalFactorySize?: string;
  noOfProductionLines?: number;
  annualOutputValue?: string;
  productionFacilities?: string;
  annualProductionCapacity: {
    product?: string;
    quantity?: number;
    unit?: string;
  }[];
  warehouseStorageArea?: string;
  warehouseCertification?: {
    src?: string;
    alt?: string;
    exten?: string;
    size?: number;
  };
  infrastructureImg?: InfrastructureImgInterface[];
  infrastructureOverview?: string;
  noOfQcStaff?: number;
  noOfRdStaff?: number;
  factoryDivision?: factoryDivision[];
}

interface BusinessInformationInterface {
  isEdit: boolean;
  updateEditStatus: (key: string, value: boolean) => void;
  onSuccess: () => void;
}

const AdditionalSection: React.FC<BusinessInformationInterface> = (props) => {
  const { isEdit, updateEditStatus, onSuccess } = props;
  const dispatch = useAppDispatch();
  const currentStepperStatus = useAppSelector(
    (state: RootState) => state.stepperStatus.stepperStatus
  );
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FactoryWarehouseAdditionalSectionInterface>({
    defaultValues: {
      noOfProductionLines: 0,
      productionFacilities: "",
      annualProductionCapacity: [
        {
          product: "",
          quantity: 0,
          unit: "",
        },
      ],
      warehouseCertification: {},
      infrastructureImg: [],
      infrastructureOverview: "",
      noOfQcStaff: 0,
      noOfRdStaff: 0,
      factoryDivision: [],
    },
    mode: "onBlur",
    resolver: zodResolver(BusinessFactoryWarehouseAdditionalInformation),
  });
  let country = useAppSelector((state: any) => state.location);
  const businessProfileT = useTranslations("businessProfile");
  const {
    fields: annualCapacityField,
    append: annualCapacityAppend,
    remove: annualCapacityRemove,
  } = useFieldArray({
    control,
    name: "annualProductionCapacity",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "factoryDivision",
  });

  const [countriesOptions, setCountriesOptions] = useState<
    { name: string; code: string }[]
  >([]);
  // const [selectedCountry, setSelectedCountry] = useState<countryCodesInterface | null>(null);
  // const [selectedState, setSelectedState] = useState<countryBasedStates | null>(null);
  // const [stateOptions, setStateOptions] = useState<countryBasedStates[]>([]);
  // const [cityOptions, setCityOptions] = useState<countryBasedStates[]>([]);
  // const [divisionStateOptions, setDivisionStateOptions] = useState<countryBasedStates[][]>([]);
  // const [divisionCityOptions, setDivisionCityOptions] = useState<countryBasedStates[][]>([]);

  // Business information Api(Get)
  const {
    data: AdditionalInfo,
    isSuccess,
    refetch,
  } = useGetBusinessInformationQuery(
    { stage: "AdditionalFactoryDetails" },
    {
      skip:
        currentStepperStatus[
        BusinessProfileStageKey.AdditionalFactoryDetails
        ] === "pending",
    }
  );
  const AdditionalInformation = AdditionalInfo?.data;

  // business additional section update api
  const [updateAdditionalInformation] =
    useUpdateAdditionalInformationMutation();

  useEffect(() => {
    if (
      currentStepperStatus[BusinessProfileStageKey.AdditionalFactoryDetails] !==
      "pending"
    ) {
      refetch();
    }
  }, [currentStepperStatus[BusinessProfileStageKey.AdditionalFactoryDetails]]);

  useEffect(() => {
    const countries = Country.getAllCountries().map((country) => ({
      name: country.name,
      code: country.isoCode,
    }));
    setCountriesOptions(countries); // Set the entire array at once
  }, []);

  // useEffect(() => {
  //     const selectState = State.getStatesOfCountry(selectedCountry?.code)?.map((stateDetails) => ({
  //         name: stateDetails?.name ?? "",
  //         longitude: stateDetails?.longitude ?? null,
  //         latitude: stateDetails?.latitude ?? null,
  //         isoCode: stateDetails?.isoCode,
  //         countryCode: stateDetails?.countryCode
  //     }))
  //     setStateOptions(selectState);
  // }, [selectedCountry]);

  // useEffect(() => {
  //     if (selectedCountry?.code && selectedState?.isoCode) {
  //         const selectCity = City.getCitiesOfState(selectedCountry?.code, selectedState?.isoCode).map((cityDetails) => ({
  //             name: cityDetails?.name ?? "",
  //             longitude: cityDetails?.longitude ?? null,
  //             latitude: cityDetails?.latitude ?? null,
  //             countryCode: cityDetails?.countryCode ?? "",
  //             stateCode: cityDetails?.stateCode ?? "",
  //         }));
  //         setCityOptions(selectCity);
  //     }
  // }, [selectedState, selectedCountry]);

  useEffect(() => {
    if (
      currentStepperStatus[BusinessProfileStageKey.AdditionalFactoryDetails] !==
      "completed"
    ) {
      updateEditStatus(BusinessProfileStageKey.AdditionalFactoryDetails, true);
    } else {
      updateEditStatus(BusinessProfileStageKey.AdditionalFactoryDetails, false);
    }

    if (!isSuccess || !AdditionalInfo) return;

    // const getCountryCode = AdditionalInformation?.shippingAddress?.country?.code;

    // const countryBasedStateList = State.getStatesOfCountry(getCountryCode)?.map((stateDetails) => ({
    //     name: stateDetails?.name ?? "",
    //     longitude: stateDetails?.longitude ?? null,
    //     latitude: stateDetails?.latitude ?? null,
    //     isoCode: stateDetails?.isoCode ?? "",
    //     countryCode: stateDetails?.countryCode ?? ""
    // }));

    // setStateOptions(countryBasedStateList);

    // const updatedStateOptions: countryBasedStates[][] = [];
    // const updatedCityOptions: countryBasedStates[][] = [];

    // const mappedFactoryDivisions = AdditionalInfo?.data?.factoryDivision?.map((div, index) => {
    //     const divisionCountryCode = div?.address?.country?.code;

    //     const stateList = State.getStatesOfCountry(divisionCountryCode)?.map((stateDetails) => ({
    //         name: stateDetails?.name ?? "",
    //         longitude: stateDetails?.longitude ?? null,
    //         latitude: stateDetails?.latitude ?? null,
    //         isoCode: stateDetails?.isoCode ?? "",
    //         countryCode: stateDetails?.countryCode ?? ""
    //     })) ?? [];

    //     updatedStateOptions.push(stateList);

    //     const matchedState = stateList.find((s) => s.name === div?.address?.state);

    //     let cityList: countryBasedStates[] = [];
    //     let matchedCity;

    //     if (divisionCountryCode && matchedState?.isoCode) {
    //         cityList = City.getCitiesOfState(divisionCountryCode, matchedState.isoCode)?.map((cityDetails) => ({
    //             name: cityDetails?.name ?? "",
    //             longitude: cityDetails?.longitude ?? null,
    //             latitude: cityDetails?.latitude ?? null,
    //             countryCode: cityDetails?.countryCode ?? "",
    //             stateCode: cityDetails?.stateCode ?? "",
    //         })) ?? [];

    //         matchedCity = cityList.find((city) => city.name === div?.address?.city);
    //     }

    //     updatedCityOptions.push(cityList);

    //     return {
    //         ...div,
    //         address: {
    //             ...div.address,
    //             state: matchedState || "",
    //             city: matchedCity || "",
    //         },
    //     };
    // });

    // setDivisionStateOptions(updatedStateOptions);
    // setDivisionCityOptions(updatedCityOptions);

    reset({
      totalFactorySize: AdditionalInfo?.data?.totalFactorySize,
      noOfProductionLines: AdditionalInfo?.data?.noOfProductionLines,
      annualOutputValue: AdditionalInfo?.data?.annualOutputValue,
      productionFacilities: AdditionalInfo?.data?.productionFacilities,
      annualProductionCapacity: AdditionalInfo?.data?.annualProductionCapacity,
      warehouseStorageArea: AdditionalInfo?.data?.warehouseStorageArea,
      warehouseCertification: AdditionalInfo?.data?.warehouseCertification,
      infrastructureImg: Array.isArray(AdditionalInfo?.data?.infrastructureImg)
        ? AdditionalInfo.data.infrastructureImg
        : AdditionalInfo.data.infrastructureImg
          ? [AdditionalInfo.data.infrastructureImg]
          : [],
      infrastructureOverview: AdditionalInfo?.data?.infrastructureOverview,
      noOfQcStaff: AdditionalInfo?.data?.noOfQcStaff ?? 0,
      noOfRdStaff: AdditionalInfo?.data?.noOfRdStaff ?? 0,
      // factoryDivision: mappedFactoryDivisions ?? [],
      factoryDivision: AdditionalInfo?.data?.factoryDivision ?? [],
    });
  }, [isSuccess, AdditionalInfo, reset]);

  const onSubmit = async (data: FactoryWarehouseAdditionalSectionInterface) => {
    const payload: FactoryWarehouseAdditionalSectionInterface = {
      totalFactorySize: data?.totalFactorySize,
      noOfProductionLines: data.noOfProductionLines
        ? Number(data.noOfProductionLines)
        : 0,
      annualOutputValue: data?.annualOutputValue,
      productionFacilities: data?.productionFacilities,
      annualProductionCapacity: data?.annualProductionCapacity,
      warehouseStorageArea: data?.warehouseStorageArea,
      warehouseCertification: data?.warehouseCertification,
      // infrastructureImg: data?.infrastructureImg,
      infrastructureImg: data?.infrastructureImg?.filter(
        (img) => img.src && img.exten && img.size > 0
      ),
      infrastructureOverview: data?.infrastructureOverview,
      noOfQcStaff: data?.noOfQcStaff ?? 0,
      noOfRdStaff: data?.noOfRdStaff ?? 0,
      factoryDivision: data?.factoryDivision,
    };
    try {
      await updateAdditionalInformation(payload).unwrap();
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

  const handleOnChange = (value: string, country: any, index: number) => {
    const dialCode = country?.dialCode || "";
    const phoneNumber = value.replace(dialCode, "");
    setValue(`factoryDivision.${index}.phoneNumber`, {
      countryCode: dialCode,
      number: phoneNumber,
    });
  };

  const onError = (errors: any) => {
    // Show toast only if there are validation errors
    console.warn('far add reg123', errors);
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
        <AdditionalSectionViewPage
          AdditionalInformation={AdditionalInformation}
        />
      )}
      {isEdit && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="c-f-b-t-body">
            <div className="accordion-form-block-group">
              {/* Factory & Warehouse Details */}
              <div className="accordion-form-block">
                <Typography variant="span" className="a-f-b-title">
                  {businessProfileT(
                    "businessProfileStepper.factoryWarehouseDetails.title"
                  )}
                </Typography>
                <div className="forms-block">
                  <div className="forms-group">
                    <label className="f-g-label">
                      {businessProfileT(
                        "businessInformation.factoryDetails.factorySize.title"
                      )}
                    </label>
                    <Controller
                      name="totalFactorySize"
                      control={control}
                      render={({ field }) => (
                        <Select
                          placeholder={"1500 sqm"}
                          options={totalFactorySizeRange}
                          {...field}
                        />
                      )}
                    />
                  </div>
                  <div className="forms-group">
                    <label className="f-g-label">
                      {businessProfileT(
                        "businessInformation.factoryDetails.infaImage"
                      )}
                    </label>
                    <Controller
                      name="infrastructureImg"
                      control={control}
                      render={({ field }) => (
                        <DndImageUpload
                          value={
                            Array.isArray(field.value)
                              ? field.value
                              : field.value
                                ? [field.value] // Wrap single object in array
                                : []
                          }
                          onChange={(file) => {
                            // Normalize output
                            const normalized = Array.isArray(file)
                              ? file
                              : file
                                ? [file]
                                : [];
                            field.onChange(normalized);
                          }}
                          single={false}
                          allowedFileTypes={[
                            "image/jpeg",
                            "image/jpg",
                            "image/png",
                          ]}
                          maxHeight={900}
                          maxWidth={500}
                          from={`brochre`}
                          maxUpload={3}
                        />
                      )}
                    />
                    {errors.infrastructureImg && (
                      <span className="error-txt">
                        {errors.infrastructureImg.message}
                      </span>
                    )}
                  </div>
                  <div className="forms-group">
                    <label className="f-g-label">
                      {businessProfileT(
                        "businessInformation.factoryDetails.overview"
                      )}
                    </label>
                    <Controller
                      name="infrastructureOverview"
                      control={control}
                      render={({ field }) => (
                        <Inputs
                          type="text"
                          placeholder={businessProfileT(
                            "businessInformation.factoryDetails.overViewEnter"
                          )}
                          {...field}
                        />
                      )}
                    />
                    {errors.infrastructureOverview && (
                      <span className="error-txt">
                        {errors.infrastructureOverview.message}
                      </span>
                    )}
                  </div>
                  <div className="forms-group">
                    <label className="f-g-label">
                      {businessProfileT(
                        "businessInformation.factoryDetails.productionLines"
                      )}
                    </label>
                    <Controller
                      name="noOfProductionLines"
                      control={control}
                      render={({ field: { value, onChange, ...rest } }) => (
                        <Inputs
                          type="number"
                          placeholder={businessProfileT(
                            "businessInformation.factoryDetails.productionLinesPlaceholder"
                          )}
                          value={value !== undefined ? String(value) : ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            onChange(val === "" ? "" : Number(val));
                          }}
                          {...rest}
                        />
                      )}
                    />
                    {errors.noOfProductionLines && (
                      <span className="error-txt">
                        {errors.noOfProductionLines.message}
                      </span>
                    )}
                  </div>
                  <div className="forms-group">
                    <label className="f-g-label">
                      {businessProfileT(
                        "businessInformation.factoryDetails.annualOutput"
                      )}
                    </label>
                    <Controller
                      name="annualOutputValue"
                      control={control}
                      render={({ field }) => (
                        <Select
                          placeholder={"$10M–$50M"}
                          options={annualOutputValueRange}
                          {...field}
                        />
                      )}
                    />
                  </div>
                  <div className="forms-group">
                    <label className="f-g-label">
                      {businessProfileT(
                        "businessInformation.factoryDetails.qcstaff"
                      )}
                    </label>
                    <Controller
                      name="noOfQcStaff"
                      control={control}
                      render={({ field: { value, onChange, ...rest } }) => (
                        <Inputs
                          type="number"
                          placeholder={businessProfileT(
                            "businessInformation.factoryDetails.qcstaffPlaceholder"
                          )}
                          value={value !== undefined ? String(value) : ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            onChange(val === "" ? "" : Number(val));
                          }}
                          {...rest}
                        />
                      )}
                    />
                    {errors.noOfQcStaff && (
                      <span className="error-txt">
                        {errors.noOfQcStaff.message}
                      </span>
                    )}
                  </div>
                  <div className="forms-group">
                    <label className="f-g-label">
                      {businessProfileT(
                        "businessInformation.factoryDetails.r&dStaff"
                      )}
                    </label>
                    <Controller
                      name="noOfRdStaff"
                      control={control}
                      render={({ field: { value, onChange, ...rest } }) => (
                        <Inputs
                          type="number"
                          placeholder={businessProfileT(
                            "businessInformation.factoryDetails.r&dStaffPlaceholder"
                          )}
                          value={value !== undefined ? String(value) : ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            onChange(val === "" ? "" : Number(val));
                          }}
                          {...rest}
                        />
                      )}
                    />
                    {errors.noOfRdStaff && (
                      <span className="error-txt">{errors.noOfRdStaff.message}</span>
                    )}
                  </div>
                  <div className="forms-group">
                    <label className="f-g-label">
                      {businessProfileT(
                        "businessInformation.factoryDetails.productionFacility"
                      )}
                    </label>
                    <Controller
                      name="productionFacilities"
                      control={control}
                      render={({ field }) => (
                        <Inputs
                          type="text"
                          placeholder={businessProfileT(
                            "businessInformation.factoryDetails.productionFacilityPlaceholder"
                          )}
                          {...field}
                        />
                      )}
                    />
                    {errors.productionFacilities && (
                      <span className="error-txt">
                        {errors.productionFacilities.message}
                      </span>
                    )}
                  </div>
                  {/* Annual Production Capacity */}
                  <div className="forms-group">
                    <label className="f-g-label">
                      {businessProfileT(
                        "businessInformation.factoryDetails.productionCapacity.title"
                      )}
                    </label>
                    {annualCapacityField?.map((field, index: number) => (
                      <div className="loop-block" key={field.id}>
                        <div className="forms-group f-g-s-c-item wid-100">
                          <Controller
                            name={`annualProductionCapacity.${index}.product`}
                            control={control}
                            render={({ field }) => (
                              <Inputs
                                type="text"
                                placeholder={businessProfileT(
                                  "businessInformation.factoryDetails.productionCapacity.productName"
                                )}
                                {...field}
                              />
                            )}
                          />
                          {errors.annualProductionCapacity?.[index]
                            ?.product && (
                              <span className="error-txt">
                                {
                                  errors.annualProductionCapacity[index]?.product
                                    ?.message
                                }
                              </span>
                            )}
                        </div>

                        <div className="forms-group wid-100">
                          <div className="f-g-input-horiz">
                            <Controller
                              name={`annualProductionCapacity.${index}.quantity`}
                              control={control}
                              render={({
                                field: { value, onChange, ...rest },
                              }) => (
                                <Inputs
                                  type="number"
                                  placeholder={businessProfileT(
                                    "businessInformation.factoryDetails.productionCapacity.productQuantity"
                                  )}
                                  value={
                                    value !== undefined ? String(value) : ""
                                  }
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    onChange(val === "" ? "" : Number(val));
                                  }}
                                  {...rest}
                                />
                              )}
                            />
                            <Controller
                              name={`annualProductionCapacity.${index}.unit`}
                              control={control}
                              render={({ field }) => (
                                <Inputs
                                  type="text"
                                  placeholder={businessProfileT(
                                    "businessInformation.factoryDetails.productionCapacity.unit"
                                  )}
                                  {...field}
                                />
                              )}
                            />
                          </div>
                          {(errors.annualProductionCapacity?.[index]
                            ?.quantity ||
                            errors.annualProductionCapacity?.[index]?.unit) && (
                              <span className="error-txt">
                                {errors.annualProductionCapacity?.[index]
                                  ?.quantity?.message ||
                                  errors.annualProductionCapacity?.[index]?.unit
                                    ?.message}
                              </span>
                            )}
                        </div>

                        {index >= 0 && (
                          <ButtonIcon
                            className="b-c-i-outline b-c-i-rounded b-c-i-danger"
                            onClick={() => annualCapacityRemove(index)}
                          >
                            <TrashTableIcon />
                          </ButtonIcon>
                        )}
                      </div>
                    ))}

                    <div className="add-option-block margin-left-auto">
                      <ButtonIconLeftOutline
                        name={businessProfileT(
                          "businessInformation.factoryDetails.productionCapacity.add"
                        )}
                        className="bg-outline-grey btn-attributes"
                        onClick={() =>
                          annualCapacityAppend({
                            product: "",
                            quantity: 0,
                            unit: "",
                          })
                        }
                      >
                        <PlusIcon />
                      </ButtonIconLeftOutline>
                    </div>
                  </div>
                  <div className="forms-group">
                    <label className="f-g-label">
                      {businessProfileT(
                        "businessInformation.factoryDetails.warehouse.title"
                      )}
                    </label>
                    <Controller
                      name="warehouseStorageArea"
                      control={control}
                      render={({ field }) => (
                        // <Inputs type="text" placeholder={'Enter Warehouse Storage Area'}
                        //   {...field} />
                        <Select
                          placeholder={businessProfileT(
                            "businessInformation.factoryDetails.warehouse.placeholder"
                          )}
                          options={warehouseStorageAreaRange}
                          {...field}
                        />
                      )}
                    />
                    {errors.warehouseStorageArea && (
                      <span className="error-txt">
                        {errors.warehouseStorageArea.message}
                      </span>
                    )}
                  </div>
                  <div className="forms-group">
                    <label className="f-g-label">
                      {businessProfileT(
                        "businessInformation.factoryDetails.warehouse.certificate"
                      )}
                    </label>
                    <Controller
                      name="warehouseCertification"
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
                          // placeHolder={t(
                          //   "productInformation.fields.productBrochure.placeholder"
                          // )}
                          maxHeight={900}
                          maxWidth={500}
                          from={`brochre`}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
              {/* Office-Branch / Other Location */}
              <div className="accordion-form-block">
                {fields.map((fieldItem, index: number) => (
                  <div key={fieldItem.id}>
                    <Typography variant="span" className="a-f-b-title">
                      {businessProfileT(
                        "businessInformation.factoryDetails.officeBranch.title"
                      )}
                    </Typography>
                    <div className="forms-block">
                      <div className="forms-group">
                        <label className="f-g-label">
                          {businessProfileT(
                            "businessInformation.factoryDetails.officeBranch.division.title"
                          )}
                        </label>
                        <Controller
                          name={`factoryDivision.${index}.divisionName`}
                          control={control}
                          render={({ field }) => (
                            <Inputs
                              type="text"
                              placeholder={businessProfileT(
                                "businessInformation.factoryDetails.officeBranch.division.placeholder"
                              )}
                              {...field}
                            />
                          )}
                        />
                        {errors.factoryDivision?.[index]?.divisionName && (
                          <span className="error-txt">
                            {
                              errors.factoryDivision?.[index]?.divisionName
                                .message
                            }
                          </span>
                        )}
                      </div>
                      <div className="forms-group">
                        <label className="f-g-label">
                          {businessProfileT(
                            "businessInformation.factoryDetails.officeBranch.company.title"
                          )}
                        </label>
                        <Controller
                          name={`factoryDivision.${index}.companyName`}
                          control={control}
                          render={({ field }) => (
                            <Inputs
                              type="text"
                              placeholder={businessProfileT(
                                "businessInformation.factoryDetails.officeBranch.company.placeholder"
                              )}
                              {...field}
                            />
                          )}
                        />
                        {errors.factoryDivision?.[index]?.companyName && (
                          <span className="error-txt">
                            {
                              errors.factoryDivision?.[index]?.companyName
                                .message
                            }
                          </span>
                        )}
                      </div>
                      <div className="forms-group">
                        <label className="f-g-label">
                          {businessProfileT(
                            "businessInformation.factoryDetails.officeBranch.contact.title"
                          )}
                        </label>
                        <Controller
                          name={`factoryDivision.${index}.contactName`}
                          control={control}
                          render={({ field }) => (
                            <Inputs
                              type="text"
                              placeholder={businessProfileT(
                                "businessInformation.factoryDetails.officeBranch.contact.placeholder"
                              )}
                              {...field}
                            />
                          )}
                        />
                        {errors.factoryDivision?.[index]?.contactName && (
                          <span className="error-txt">
                            {
                              errors.factoryDivision?.[index]?.contactName
                                .message
                            }
                          </span>
                        )}
                      </div>
                      <div className="forms-group">
                        <label className="f-g-label">
                          {businessProfileT(
                            "businessInformation.factoryDetails.officeBranch.phone.title"
                          )}
                        </label>
                        <Controller
                          name={`factoryDivision.${index}.phoneNumber`}
                          control={control}
                          render={({ field }) => (
                            // <Inputs
                            //     type="number"
                            //     placeholder={"Enter Phone Number"}
                            //     {...field}
                            // />
                            <PhoneInput
                              value={`${field.value?.countryCode ?? ""}${field.value?.number ?? ""
                                }`} // Ensure proper formatting
                              country={
                                country?.country_code.toLowerCase() || "in"
                              }
                              onChange={(value: string, country: any) => {
                                const dialCode = country.dialCode || "";
                                const phoneNumber = value
                                  .replace(dialCode, "")
                                  .replace(/^\+/, "");
                                field.onChange({
                                  countryCode: dialCode,
                                  cellNo: phoneNumber,
                                });
                                handleOnChange(value, country, index);
                              }}
                              inputStyle={{ width: "100%" }}
                              placeholder={businessProfileT(
                                "businessInformation.factoryDetails.officeBranch.phone.placeholder"
                              )}
                            />
                          )}
                        />
                        {errors.factoryDivision?.[index]?.phoneNumber && (
                          <span className="error-txt">
                            {
                              errors.factoryDivision?.[index]?.phoneNumber
                                .message
                            }
                          </span>
                        )}
                      </div>

                      <div className="forms-group">
                        {/* <label className='f-g-label'>Business Address</label> */}
                        <label className="f-g-label">
                          {businessProfileT(
                            "businessInformation.factoryDetails.officeBranch.address.title"
                          )}
                        </label>
                        <Controller
                          name={`factoryDivision.${index}.address.country`}
                          control={control}
                          render={({ field }) => (
                            <Select
                              options={countriesOptions}
                              value={field.value}
                              onChange={(e) => {
                                field.onChange(e);
                                // setSelectedCountry(e);
                              }}
                              filter={true}
                              filterBy="name"
                              virtualScrollerOptions={{
                                itemSize: 40,
                              }}
                              placeholder={businessProfileT(
                                "businessInformation.businessDetails.contactInfo.country"
                              )}
                            />
                          )}
                        />
                        {errors.factoryDivision?.[index]?.address?.country && (
                          <span className="error-txt">
                            {
                              errors.factoryDivision?.[index]?.address?.country
                                ?.message
                            }
                          </span>
                        )}
                        <>
                          <Controller
                            name={`factoryDivision.${index}.address.addressLine`}
                            control={control}
                            render={({ field }) => (
                              <Inputs
                                type="text"
                                placeholder={businessProfileT(
                                  "businessInformation.businessDetails.businessAddress"
                                )}
                                {...field}
                              />
                            )}
                          />
                          {errors.factoryDivision?.[index]?.address
                            ?.addressLine && (
                              <span className="error-txt">
                                {
                                  errors.factoryDivision?.[index]?.address
                                    ?.addressLine.message
                                }
                              </span>
                            )}
                        </>

                        <div className="f-g-input-horiz">
                          <Controller
                            name={`factoryDivision.${index}.address.state`}
                            control={control}
                            render={({ field }) => (
                              <Inputs
                                type="text"
                                placeholder={businessProfileT(
                                  "businessInformation.businessDetails.contactInfo.address.state"
                                )}
                                // value={(field.value as any)?.name || ''}
                                value={field.value || ""}
                                onChange={(e) => {
                                  field.onChange(e); // This sends a string back to the form
                                }}
                              />
                              // <Select
                              //     disabled={divisionStateOptions[index]?.length > 0 ? false : true}
                              //     options={divisionStateOptions[index] || []}
                              //     value={field.value}
                              //     // onChange={field.onChange}
                              //     onChange={(e) => {
                              //         field.onChange(e);
                              //         // const selected = stateOptions.find(s => s.name === e);
                              //         // setSelectedState(selected ?? null);
                              //         setSelectedState(e);
                              //     }}
                              //     filter
                              //     filterBy="name"
                              //     virtualScrollerOptions={{
                              //         itemSize: 40,
                              //     }}
                              //     placeholder={'State'}
                              // />
                            )}
                          />
                          <Controller
                            name={`factoryDivision.${index}.address.city`}
                            control={control}
                            render={({ field }) => (
                              <Inputs
                                type="text"
                                placeholder={businessProfileT(
                                  "businessInformation.businessDetails.contactInfo.address.city"
                                )}
                                // value={(field.value as any)?.name || ''}
                                value={field.value || ""}
                                onChange={(e) => {
                                  field.onChange(e); // This sends a string back to the form
                                }}
                              />
                              // <Select
                              //     disabled={divisionCityOptions[index]?.length > 0 ? false : true}
                              //     options={divisionCityOptions[index] || []}
                              //     // onChange={field.onChange}
                              //     filter={true}
                              //     filterBy="name"
                              //     virtualScrollerOptions={{
                              //         itemSize: 40,
                              //     }}
                              //     placeholder={'City'}
                              //     {...field}
                              // />
                            )}
                          />
                        </div>
                        {errors.factoryDivision?.[index]?.address?.city && (
                          <span className="error-txt">
                            {
                              errors.factoryDivision?.[index]?.address?.city
                                .message
                            }
                          </span>
                        )}
                        {errors.factoryDivision?.[index]?.address?.state && (
                          <span className="error-txt">
                            {
                              errors.factoryDivision?.[index]?.address?.state
                                .message
                            }
                          </span>
                        )}
                        <div className="f-g-input-horiz">
                          {/* <Controller
                                                        name={`factoryDivision.${index}.address.country`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Select
                                                                options={countriesOptions}
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                                filter={true}
                                                                filterBy="name"
                                                                virtualScrollerOptions={{
                                                                    itemSize: 40,
                                                                }}
                                                                placeholder={"Country"}
                                                            />
                                                        )}
                                                    /> */}
                          <Controller
                            name={`factoryDivision.${index}.address.pinCode`}
                            control={control}
                            render={({ field }) => (
                              <Inputs
                                type="text"
                                placeholder={businessProfileT(
                                  "businessInformation.businessDetails.contactInfo.address.pincode"
                                )}
                                {...field}
                              />
                            )}
                          />
                        </div>
                        {errors.factoryDivision?.[index]?.address?.pinCode && (
                          <span className="error-txt">
                            {
                              errors.factoryDivision?.[index]?.address?.pinCode
                                .message
                            }
                          </span>
                        )}
                      </div>
                      <div className="forms-group">
                        <label className="f-g-label">Google Map Link</label>
                        <Controller
                          name={`factoryDivision.${index}.googleMapLink`}
                          control={control}
                          render={({ field }) => (
                            <Inputs
                              type={"text"}
                              placeholder={businessProfileT(
                                "businessInformation.businessDetails.contactInfo.enterGoogleMapLink"
                              )}
                              {...field}
                            />
                          )}
                        />
                        {errors.factoryDivision?.[index]?.googleMapLink && (
                          <span className="error-txt">
                            {
                              errors.factoryDivision?.[index]?.googleMapLink
                                .message
                            }
                          </span>
                        )}
                      </div>
                      {index > 0 && (
                        <div className="add-option-block margin-left-auto">
                          <ButtonIconLeftOutline
                            name={""}
                            className={"bg-outline-red btn-attributes"}
                            onClick={() => remove(index)}
                          >
                            <TrashIcon />
                          </ButtonIconLeftOutline>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div className="add-option-block margin-left-auto">
                  <ButtonIconLeftOutline
                    name={businessProfileT(
                      "businessInformation.factoryDetails.officeBranch.addDiv"
                    )}
                    className={"bg-outline-grey btn-attributes"}
                    onClick={() =>
                      append({
                        divisionName: "",
                        companyName: "",
                        contactName: "",
                        phoneNumber: {
                          countryCode: "",
                          number: "",
                        },
                        address: {
                          addressLine: "",
                          state: "",
                          pinCode: "",
                          city: "",
                          country: {
                            name: "",
                            code: "In",
                          },
                        },
                        googleMapLink: "",
                      })
                    }
                  >
                    <PlusIcon />
                  </ButtonIconLeftOutline>
                </div>
              </div>
              <div className="button-group-block edit-save-btn-block">
                <Button
                  className={"btn-outline bg-outline-dark btn-c-sm"}
                  text={businessProfileT(
                    "businessInformation.businessDetails.cancel"
                  )}
                  onClick={onSuccess}
                  disabled={isSubmitting ||
                    !(currentStepperStatus?.[BusinessProfileStageKey.FactoryWarehouseDetails] === "completed")
                  }
                />
                <Button
                  className={"btn-c-primary btn-c-sm"}
                  text={businessProfileT(
                    "businessInformation.businessDetails.save"
                  )}
                  onClick={handleSubmit(onSubmit, onError)}
                  disabled={isSubmitting ||
                    !(currentStepperStatus?.[BusinessProfileStageKey.FactoryWarehouseDetails] === "completed")
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

export default AdditionalSection;
