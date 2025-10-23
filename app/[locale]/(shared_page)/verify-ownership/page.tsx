"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Typography from "../../_components/Base/Typography";
import DateTimePickerCalender from "../../_components/StoreFront/Forms/DateTimePickerCalender";
import InputField from "../../_components/StoreFront/Forms/InputField";
import ButtonIconRight from "../../_components/Buttons/ButtonIconRight";
import { RightArrowIcon } from "../../_components/Icons/SVGIcons";
import Select from "../../_components/StoreFront/Forms/Select";
import {
  DocumentInfo,
  NationalIdDropdown,
  Section,
} from "../../_interface/SettingsInterface";
import DndImageUpload from "../../_components/StoreFront/Forms/DndImageUpload";
import { countryOptions } from "../../_models/common";
import SettingTopBar from "../../_components/StoreFront/SettingsTopBar";
import { useSearchParams } from "next/navigation";
import {
  useLazyGetCountryDocumentsQuery,
  useUpdateComplianceUboMutation,
} from "../../_store/apiReducer/settingsApi";
import { useDispatch } from "react-redux";
import { showToast } from "../../_store/reducers/ui_store";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

const verificationList = [
  {
    name: "Pan card",
    value: "Pancard",
  },
  {
    name: "Aadhar card",
    value: "Aadharcard",
  },
  {
    name: "Voter ID",
    value: "VoterID",
  },
];

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
type FormValues = {
  name: string;
  dateOfBirth: Date;
  nationality: string;
  country: string;
  streetAddress: string;
  apartmentUnit: string;
  city: string;
  postalCode: string;
  ownershipPercentage: number;
  identityVerification: Section;
  relationshipWithEntity: string;
  taxIdentificationNumber: string;
};
const defaultValues = {
  name: "",
  dateOfBirth: undefined,
  nationality: "",
  country: "",
  streetAddress: "",
  apartmentUnit: "",
  city: "",
  postalCode: "",
  ownershipPercentage: 0,
  identityVerification: defaultInfo(),
  relationshipWithEntity: "",
  taxIdentificationNumber: "",
};

// Zod schemas
const documentInfoSchema = z.object({
  src: z.string().nonempty("src is required"),
  alt: z.string().nonempty("alt is required"),
  exten: z.string().nonempty("exten is required"),
  size: z.number(),
});

const identityVerificationSchema = z.object({
  documentType: z.string().nonempty("Document is required"),
  document: documentInfoSchema,
});

const verifyOwnerShipSchema = z.object({
  name: z
    .string()
    .nonempty("Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must not exceed 100 characters")
    .regex(/^[A-Za-z\s]+$/, "Name can contain only alphabets and spaces"),

  dateOfBirth: z
    .date({ required_error: "Date of Birth is required" })
    .refine((d) => d < new Date(), {
      message: "Date of Birth must be in the past",
    }),

  nationality: z
    .string()
    .nonempty("Nationality is required")
    .min(3, "Nationality must be at least 3 characters")
    .max(100, "Nationality must not exceed 100 characters")
    .regex(
      /^[A-Za-z\s]+$/,
      "Nationality can contain only alphabets and spaces"
    ),

  country: z
    .string()
    .nonempty("Country is required")
    .min(2, "Country must be at least 2 characters")
    .max(100, "Country must not exceed 100 characters")
    .regex(
      /^[A-Za-z\s]+$/,
      "Country name can contain only alphabets and spaces"
    ),

  streetAddress: z
    .string()
    .nonempty("Street address is required")
    .min(3, "Street address must be at least 3 characters")
    .max(100, "Street address must be under 100 characters"),

  apartmentUnit: z
    .string()
    .nonempty("Apartment/Unit cannot be empty")
    .max(50, "Apartment/Unit must be under 50 characters"),

  city: z
    .string()
    .nonempty("City is required")
    .min(2, "City must be at least 2 characters")
    .max(50, "City name must be under 50 characters")
    .regex(/^[A-Za-z\s]+$/, "City can contain only alphabets and spaces"),

  postalCode: z
    .string()
    .nonempty("Postal code is required")
    .min(4, "Postal code must be at least 4 characters")
    .max(20, "Postal code must be under 20 characters")
    .regex(
      /^[A-Za-z0-9\s\-]+$/,
      "Postal code can only contain letters, numbers, spaces, and dashes"
    ),

  ownershipPercentage: z.coerce
    .number({
      required_error: "Ownership percentage is required",
      invalid_type_error: "Ownership percentage must be a number",
    })
    .min(1, "Ownership cannot be less than 1%")
    .max(100, "Ownership cannot exceed 100%"),

  identityVerification: identityVerificationSchema, // Keep as is, assumed defined elsewhere

  relationshipWithEntity: z
    .string()
    .nonempty("Relationship is required")
    .min(2, "Relationship must be at least 2 characters")
    .max(50, "Relationship must be under 50 characters")
    .regex(/^[A-Za-z\s]+$/, "Relationship can contain only letters and spaces"),

  taxIdentificationNumber: z
    .string()
    .nonempty("Tax ID is required")
    .min(6, "Tax ID must be at least 6 characters")
    .max(20, "Tax ID must be under 20 characters")
    .regex(
      /^[A-Za-z0-9\-]+$/,
      "Tax ID can contain only letters, numbers, and dashes"
    ),
});

const Page = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const userId = searchParams.get("userId");
  const common = useTranslations("common");
  const [nationalIdDropdown, setNationalIdDropdown] = useState<
    NationalIdDropdown[]
  >([]);
  const [updateComplianceUbo] = useUpdateComplianceUboMutation();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "all",
    defaultValues,
    resolver: zodResolver(verifyOwnerShipSchema),
  });
  const [fetchCountryDocuments] = useLazyGetCountryDocumentsQuery();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchCountryDocuments({}).unwrap();
        const documents = response?.data?.documents || [];
        const transformedDocuments = documents.map(
          (doc: any, index: number) => ({
            id: index.toString(),
            label: doc.label,
            value: doc.value,
          })
        );

        setNationalIdDropdown(transformedDocuments);
      } catch (err) {
        console.error("Failed to fetch documents:", err);
      }
    };

    fetchData(); // ✅ trigger the fetch
  }, [fetchCountryDocuments]);
  const onSubmit = async (data: FormValues) => {
    const response = await updateComplianceUbo({
      id: id || "",
      userId: userId || "",
      data: data,
    });
    const liveUrl =
      response?.data?.data?.faciaResponse?.result?.data?.liveness_url;
    if (response?.data?.data) {
      window.open(liveUrl);

      dispatch(
        showToast({
          title: "Success",
          message: "UBO update successfully!",
          theme: "success",
        })
      );
      reset();
    }
  };

  if (!id || !userId) {
    return <p>Not found</p>;
  }
  return (
    <div className="redirects-page">
      <SettingTopBar />
      <div className="r-p-body">
        <div className="center-form">
          <Typography variant="h1" className="c-f-title">
            Verify Ultimate Business <br /> Ownership{" "}
            <Typography variant="span" className="c-f-t-colored-txt">
              in minutes
            </Typography>
          </Typography>
          <div className="grid-info-boxes">
            <div className="info-box">
              <p className="info-box-text">Transparency & Compliance</p>
            </div>
            <div className="info-box">
              <p className="info-box-text">Risk Mitigation</p>
            </div>
            <div className="info-box">
              <p className="info-box-text">AML & Due Diligence</p>
            </div>
            <div className="info-box">
              <p className="info-box-text">Prevent illicit activities</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="forms-block">
            <div className="forms-group">
              <label className="f-g-label">Name</label>
              <InputField
                type="text"
                placeholder="Enter Your Name"
                {...register("name")}
              />
              {errors.name && (
                <small className="error-txt">{errors.name.message}</small>
              )}
            </div>

            <div className="forms-group">
              <div className="f-g-input-horiz">
                <div className="forms-group wid-100">
                  <label className="f-g-label">Date of Birth</label>
                  <Controller
                    control={control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <DateTimePickerCalender
                        placeholder="DD/MM/YY"
                        showTime={false}
                        value={field.value ?? undefined}
                        onChange={(date: Date | null) =>
                          field.onChange(date ?? undefined)
                        }
                      />
                    )}
                  />
                  {errors.dateOfBirth && (
                    <small className="error-txt">
                      {errors.dateOfBirth.message}
                    </small>
                  )}
                </div>

                <div className="forms-group wid-100">
                  <label className="f-g-label">Nationality</label>
                  <InputField
                    type="text"
                    placeholder="Enter Nationality"
                    {...register("nationality")}
                  />
                  {errors.nationality && (
                    <small className="error-txt">
                      {errors.nationality.message}
                    </small>
                  )}
                </div>
              </div>
            </div>

            <div className="forms-group">
              <label className="f-g-label">Residence Address</label>
              <div className="inputs-wrap">
                <Controller
                  control={control}
                  name="country"
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={countryOptions}
                      placeholder="Country"
                      virtualScrollerOptions={{ itemSize: 40 }}
                    />
                  )}
                />
                {errors.country && (
                  <small className="error-txt">{errors.country.message}</small>
                )}

                <InputField
                  placeholder="Street Address"
                  type="text"
                  {...register("streetAddress")}
                />
                {errors.streetAddress && (
                  <small className="error-txt">
                    {errors.streetAddress.message}
                  </small>
                )}

                <InputField
                  placeholder="Apartment, Unit, or Other"
                  type="text"
                  {...register("apartmentUnit")}
                />
                {errors.apartmentUnit && (
                  <small className="error-txt">
                    {errors.apartmentUnit.message}
                  </small>
                )}

                <InputField
                  placeholder="City"
                  type="text"
                  {...register("city")}
                />
                {errors.city && (
                  <small className="error-txt">{errors.city.message}</small>
                )}

                <InputField
                  placeholder="Postal Code"
                  type="number"
                  {...register("postalCode")}
                />
                {errors.postalCode && (
                  <small className="error-txt">
                    {errors.postalCode.message}
                  </small>
                )}
              </div>
            </div>

            <div className="forms-group">
              <label className="f-g-label">
                Percentage of ownership/Control
              </label>
              <InputField
                type="number"
                placeholder="%"
                {...register("ownershipPercentage")}
              />
              {errors.ownershipPercentage && (
                <small className="error-txt">
                  {errors.ownershipPercentage.message}
                </small>
              )}
            </div>

            <div className="forms-group">
              <label className="f-g-label">Identity Document</label>

              {/* <Controller
                name="identityVerification.documentType"
                control={control}
                render={({ field }) => (
                  <>
                    <Select
                      {...field}
                      style={{ width: "100%" }}
                      options={settingsProofValues}
                      onChange={(value: string) => field.onChange(value)}
                    />
                    {errors.identityVerification?.documentType && (
                      <span className="error-txt">
                        {errors.identityVerification.documentType.message}
                      </span>
                    )}
                  </>
                )}
              /> */}

              <Controller
                name="identityVerification.documentType"
                control={control}
                rules={{
                  required: `documentType is Required`,
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
                        {errors.identityVerification?.documentType && (
                          <span className="error-txt">
                            {errors.identityVerification.documentType.message}
                          </span>
                        )}
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
                        {errors.identityVerification?.documentType && (
                          <span className="error-txt">
                            {errors.identityVerification.documentType.message}
                          </span>
                        )}
                      </>
                    )}
                  </>
                )}
              />
            </div>

            <div className="forms-group">
              <label className="f-g-label">Upload Document</label>

              <Controller
                name="identityVerification.document"
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
              {errors.identityVerification?.document && (
                <span className="error-txt">
                  {errors.identityVerification.document.message}
                </span>
              )}
            </div>
            <div className="forms-group">
              <label className="f-g-label">Relationship with Entity</label>
              <Controller
                control={control}
                name="relationshipWithEntity"
                render={({ field }) => (
                  <Select
                    {...field}
                    options={verificationList}
                    placeholder="Select Relationship"
                  />
                )}
              />
              {errors.relationshipWithEntity && (
                <small className="error-txt">
                  {errors.relationshipWithEntity.message}
                </small>
              )}
            </div>

            <div className="forms-group">
              <label className="f-g-label">
                Tax Identification Number (TIN)
              </label>
              <InputField
                type="text"
                placeholder="Enter TAX"
                {...register("taxIdentificationNumber")}
              />
              {errors.taxIdentificationNumber && (
                <small className="error-txt">
                  {errors.taxIdentificationNumber.message}
                </small>
              )}
            </div>

            <ButtonIconRight
              name="Continue"
              className="wid-max-content margin-left-auto submit-btn"
              type="submit"
            >
              <RightArrowIcon />
            </ButtonIconRight>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
