import Typography from "@/app/[locale]/_components/Base/Typography";
import {
  PlusIcon,
  TrashTableIcon,
} from "@/app/[locale]/_components/Icons/SVGIcons";
import DndImageUpload from "@/app/[locale]/_components/StoreFront/Forms/DndImageUpload";
import {
  Award,
  ImportImage,
  NamedImage,
  SocialMediaLinks,
} from "@/app/[locale]/_interface/BusinessProfile";
import LinkedInIcon from "@/public/img//linkedin-icon.svg";
import FacebookIcon from "@/public/img/facebook-icon.svg";
import InstagramIcon from "@/public/img/instagram-icon.svg";
import YoutubeIcon from "@/public/img/youtube-icon.svg";
import Image from "next/image";
import React, { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import { BrandingView } from "@/app/[locale]/_components/BusinessProfileComponents/BrandMedia/BrandingView";
import Button from "@/app/[locale]/_components/Buttons/Button";
import ButtonIcon from "@/app/[locale]/_components/Buttons/ButtonIcon";
import ButtonIconRight from "@/app/[locale]/_components/Buttons/ButtonIconRight";
import DndVideoUpload from "@/app/[locale]/_components/StoreFront/Forms/DndVideoUpload";
import InputField from "@/app/[locale]/_components/StoreFront/Forms/InputField";
import { BusinessProfileStageKey } from "@/app/[locale]/_models/StoreFront";
import {
  useGetBusinessInformationQuery,
  useUpdateBrandingMediaMutation,
} from "@/app/[locale]/_store/apiReducer/businessProfileApi";
import { showToast } from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { brandingMediaSchema } from "@/app/[locale]/_validationSchema/businessProfile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

interface BrandMediaSectionProps {
  isEdit: boolean;
  updateEditStatus: (key: string, value: boolean) => void;
  onSuccess: () => void;
}

// export interface UploadedImage1{

//   src?: string;
//   alt?: string;
//   exten?: string;
//   size?: number;

// }
export interface brandingMediaFormValue {
  companyLogo?: ImportImage;
  companyVideo?: ImportImage;
  companyVideoLink?: string;
  brochures?: UploadedImage1[];
  ownBrands?: NamedImage[];
  otherBrands?: NamedImage[];
  awards?: Award[];
  certificates?: NamedImage[];
  socialMediaLinks?: SocialMediaLinks;
}

const BrandMediaSection: React.FC<BrandMediaSectionProps> = ({
  isEdit,
  updateEditStatus,
  onSuccess,
}) => {
  const dispatch = useAppDispatch();
  const currentStepperStatus = useAppSelector(
    (state: RootState) => state.stepperStatus.stepperStatus
  );

  const { data: brandingData, isSuccess } = useGetBusinessInformationQuery(
    {
      stage: "BrandingMedia",
    },
    {
      skip:
        currentStepperStatus[BusinessProfileStageKey.BrandingMedia] ===
        "pending",
    }
  );

  const t = useTranslations("businessProfile.brandingMedia");
  const [updateBranding] = useUpdateBrandingMediaMutation();
  const {
    handleSubmit,
    control,
    getValues,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<brandingMediaFormValue>({
    defaultValues: {
      companyLogo: {
        src: "",
        alt: "",
        exten: "",
        size: 0,
      },
      companyVideo: {
        src: "",
        alt: "",
        exten: "",
        size: 0,
      },
      companyVideoLink:"",
      ownBrands: [
        {
          name: "",
          image: {
            src: "",
            alt: "",
            exten: "",
            size: 0,
          },
        },
      ],
      otherBrands: [
        {
          name: "",
          image: {
            src: "",
            alt: "",
            exten: "",
            size: 0,
          },
        },
      ],
      awards: [
        {
          name: "",
          year: undefined,
          image: {
            src: "",
            alt: "",
            exten: "",
            size: 0,
          },
        },
      ],
      certificates: [
        {
          name: "",
          image: {
            src: "",
            alt: "",
            exten: "",
            size: 0,
          },
        },
      ],
      socialMediaLinks: {
        facebook: "",
        youtube: "",
        instagram: "",
        linkedin: "",
      },
      
    },
    resolver: zodResolver(brandingMediaSchema),
  });

  const {
    fields: certificatesFields,
    append: appendCertificates,
    remove: removeCertificates,
  } = useFieldArray({
    control,
    name: "certificates",
  });
  const {
    fields: ownBrandsFields,
    append: appendBrands,
    remove: removeBrands,
  } = useFieldArray({
    control,
    name: "ownBrands",
  });

  const {
    fields: otherBrandsFields,
    append: appendOtherBrands,
    remove: removeOtherBrands,
  } = useFieldArray({
    control,
    name: "otherBrands",
  });

  const {
    fields: awardsFields,
    append: appendAwards,
    remove: removeAwards,
  } = useFieldArray({
    control,
    name: "awards",
  });
  const handleAddCertificates = (value) => {
    const certificates = getValues(value) || [];

    if (certificates.length >= 5) {
      dispatch(
        showToast({
          title: "Error!",
          message: "You can only add up to 5 certifications options.",
          theme: "error",
        })
      );
      return;
    }

    if (
      certificates.length > 0 &&
      !certificates[certificates.length - 1]?.name?.trim() &&
      !certificates[certificates.length - 1]?.image.src?.trim()
    ) {
      dispatch(
        showToast({
          title: "Error!",
          message:
            "Must fill the previous certification details before adding a new one.",
          theme: "error",
        })
      );
      return;
    }
    if (value == "certificates") {
      appendCertificates({
        name: "",
        image: { src: "", alt: "", exten: "", size: 0 },
      });
    }
    if (value == "ownBrands") {
      appendBrands({
        name: "",
        image: { src: "", alt: "", exten: "", size: 0 },
      });
    }
    if (value == "otherBrands") {
      appendOtherBrands({
        name: "",
        image: { src: "", alt: "", exten: "", size: 0 },
      });
    }
    if (value == "awards") {
      appendAwards({
        name: "",
        image: { src: "", alt: "", exten: "", size: 0 },
        year: undefined,
      });
    }
  };
  useEffect(() => {
    // if (!brandingData?.data?.companyLogo) {
    //   updateEditStatus(BusinessProfileStageKey.BrandingMedia, true);
    // } else {
    //   updateEditStatus(BusinessProfileStageKey.BrandingMedia, false);
    // }
    if (
      currentStepperStatus[BusinessProfileStageKey.BrandingMedia] !==
      "completed"
    ) {
      updateEditStatus(BusinessProfileStageKey.BrandingMedia, true);
    } else {
      updateEditStatus(BusinessProfileStageKey.BrandingMedia, false);
    }
    if (isSuccess && brandingData) {
      reset({
        companyLogo: brandingData?.data?.companyLogo ?? {},
        companyVideo: brandingData?.data?.companyVideo ?? {
          src: "",
          alt: "",
          exten: "",
          size: 0,
        },
        companyVideoLink: brandingData?.data?.companyVideoLink ?? "",
        brochures: brandingData?.data?.brochures ?? [],
        ownBrands:
          brandingData?.data?.ownBrands?.length > 0
            ? brandingData?.data?.ownBrands
            : [
              {
                name: "",
                image: {
                  src: "",
                  alt: "",
                  exten: "",
                  size: 0,
                },
              },
            ],
        otherBrands:
          brandingData?.data?.otherBrands?.length > 0
            ? brandingData?.data?.otherBrands
            : [
              {
                name: "",
                image: {
                  src: "",
                  alt: "",
                  exten: "",
                  size: 0,
                },
              },
            ],
        awards:
          brandingData?.data?.awards?.length > 0
            ? brandingData?.data?.awards
            : [
              {
                name: "",
                image: {
                  src: "",
                  alt: "",
                  exten: "",
                  size: 0,
                },
              },
            ],
        certificates:
          brandingData?.data?.certificates?.length > 0
            ? brandingData?.data?.certificates
            : [
              {
                name: "",
                image: {
                  src: "",
                  alt: "",
                  exten: "",
                  size: 0,
                },
              },
            ],
        socialMediaLinks: brandingData?.data?.socialMediaLinks ?? {},
      });
    }
  }, [isSuccess, brandingData, reset]);

  const handleFormSubmit = async (data: brandingMediaFormValue) => {

    // const cleanedPayload = Object.fromEntries(
    //   Object.entries(data).filter(
    //     ([key, value]) => {
    //       if (key === 'companyVideoLink') {
    //         return value !== ""; // only include if not empty
    //       }
    //       return true; // keep all other fields as-is
    //     }
    //   )
    // );

    try {
      await updateBranding(data).unwrap();
      reset();
      onSuccess();
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

  return (
    <>
      {!isEdit ? (
        <>
          <BrandingView data={brandingData?.data} />
        </>
      ) : (
        <div className="c-f-b-t-body">
          <form
            className="forms-block"
            onSubmit={handleSubmit((data) => handleFormSubmit(data))}
          >
            {/* Company Logo */}
            <div className="forms-group">
              <div className="a-f-b-txt-block">
                <Typography variant="span" className="a-f-b-subtxt">
                  {t("companyLogo")}
                </Typography>
              </div>
              <div className="tabs-content">
                <div className="tabs-content">
                  <div className="forms-group">
                    <Controller
                      name="companyLogo"
                      control={control}
                      render={({ field }) => (
                        <DndImageUpload
                          value={
                            Array.isArray(field.value)
                              ? field.value[0]
                              : field.value || undefined
                          }
                          onChange={(file) => {
                            // Ensure file is UploadedImage (not array)
                            if (Array.isArray(file)) {
                              field.onChange(file[0]); // take the first
                            } else {
                              field.onChange(file);
                            }
                          }}
                          single={true}
                          maxUpload={1}
                        // placeHolder="Upload Image Allowed File types JPG,JPEG,PNG,GIF(Max 5MB) max:500x500px"
                        />
                      )}
                    />

                    {errors.companyLogo && (
                      <span className="error-txt">
                        {errors.companyLogo.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Company video */}
            <div className="forms-group">
              <div className="a-f-b-txt-block">
                <Typography variant="span" className="a-f-b-subtxt">
                  {t("companyVideo")}
                </Typography>
              </div>
              <Controller
                name="companyVideo"
                control={control}
                render={({ field: companyVideo }) => (
                  <Controller
                    name="companyVideoLink"
                    control={control}
                    render={({ field: companyVideoLink }) => (
                      <DndVideoUpload
                        value={
                          Array.isArray(companyVideo.value)
                            ? companyVideo.value[0] // if it's an array, pass the first one
                            : companyVideo.value || undefined // if it's a single object or null
                        }
                        onChange={(file) => {
                          // force value to always be a single UploadedImage
                          if (Array.isArray(file)) {
                            companyVideo.onChange(file[0]);
                          } else {
                            companyVideo.onChange(file);
                          }
                        }}
                        youtubeUrl={companyVideoLink.value || ""}
                        onYoutubeUrlChange={companyVideoLink.onChange}
                      />
                    )}
                  />
                )}
              />
              {errors.companyVideo && (
                <span className="error-txt">{errors.companyVideo.message}</span>
              )}
              {errors.companyVideoLink && (
                <span className="error-txt">
                  {errors.companyVideoLink.message}
                </span>
              )}
            </div>
            {/* Company brochure */}
            <div className="forms-group">
              <div className="a-f-b-txt-block">
                <Typography variant="span" className="a-f-b-subtxt">
                  {t("brochures")}
                </Typography>
              </div>
              <div className="tabs-content">
                <div className="tabs-content">
                  <div className="forms-group">
                    <Controller
                      name="brochures"
                      control={control}
                      render={({ field }) => (
                        <DndImageUpload
                          maxUpload={7}
                          value={field.value ?? []}
                          onChange={field.onChange}
                          allowedFileTypes={["application/pdf"]}
                          placeHolder=""
                        />
                      )}
                    />
                    {errors.brochures && (
                      <span className="error-txt">
                        {errors.brochures.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Own brands */}
            <div className="forms-group">
              <div className="a-f-b-txt-block">
                <Typography variant="span" className="a-f-b-subtxt">
                  {t("ownBrands.title")}
                </Typography>
              </div>
              <div className="add-certifications-block-group">
                {ownBrandsFields.map((field, index) => (
                  <div className="loop-block" key={field.id || index}>
                    <div className="add-certifications-block">
                      <Controller
                        name={`ownBrands.${index}.name`}
                        control={control}
                        render={({ field }) => (
                          <InputField
                            {...field}
                            placeholder={t("ownBrands.brandTitle")}
                          />
                        )}
                      />
                      {errors?.ownBrands?.[index]?.name && (
                        <span className="error-txt">
                          {errors.ownBrands[index].name.message}
                        </span>
                      )}

                      <Controller
                        name={`ownBrands.${index}.image`}
                        control={control}
                        render={({ field }) => (
                          <DndImageUpload
                            value={
                              Array.isArray(field.value)
                                ? field.value[0] // if it's an array, pass the first one
                                : field.value || undefined // if it's a single object or null
                            }
                            onChange={(file) => {
                              const newFile = Array.isArray(file)
                                ? file[0]
                                : file;

                              if (newFile && typeof newFile === "object") {
                                field.onChange({
                                  ...(field.value ?? {}),
                                  ...newFile,
                                });
                              }
                            }}
                            single={true}
                            allowedFileTypes={[
                              "application/pdf",
                              "image/jpg",
                              "image/png",
                              "image/jpeg",
                            ]}
                            placeHolder={"Upload PDF ,Image (jpg/png) files"}
                          // maxHeight={900}
                          // maxWidth={500}
                          />
                        )}
                      />
                      {errors?.ownBrands?.[index]?.image && (
                        <span className="error-txt">
                          {errors.ownBrands[index].image.message}
                        </span>
                      )}

                      {errors?.ownBrands && (
                        <span className="error-txt">
                          {errors.ownBrands.message}
                        </span>
                      )}
                    </div>
                    {ownBrandsFields.length > 1 && (
                      <ButtonIcon
                        className="b-c-i-rounded b-c-i-outline b-c-i-danger"
                        onClick={() => removeBrands(index)}
                      >
                        <TrashTableIcon />
                      </ButtonIcon>
                    )}
                  </div>
                ))}

                <div className="add-option-block margin-l-auto">
                  <ButtonIconRight
                    name={t("ownBrands.add")}
                    className={"btn-c-secondary btn-plain-txt"}
                    onClick={() => handleAddCertificates("ownBrands")}
                  >
                    <PlusIcon />
                  </ButtonIconRight>
                </div>
              </div>
            </div>
            {/* Other brands */}
            <div className="forms-group">
              <div className="a-f-b-txt-block">
                <Typography variant="span" className="a-f-b-subtxt">
                  {t("otherBrands.title")}
                </Typography>
              </div>
              <div className="add-certifications-block-group">
                {otherBrandsFields.map((field, index) => (
                  <div className="loop-block" key={field.id || index}>
                    <div className="add-certifications-block">
                      <Controller
                        name={`otherBrands.${index}.name`}
                        control={control}
                        render={({ field }) => (
                          <InputField
                            {...field}
                            placeholder={t("ownBrands.brandTitle")}
                          />
                        )}
                      />
                      {errors?.otherBrands?.[index]?.name && (
                        <span className="error-txt">
                          {errors.otherBrands[index].name.message}
                        </span>
                      )}

                      <Controller
                        name={`otherBrands.${index}.image`}
                        control={control}
                        render={({ field }) => (
                          <DndImageUpload
                            value={
                              Array.isArray(field.value)
                                ? field.value[0] // if it's an array, pass the first one
                                : field.value || undefined // if it's a single object or null
                            }
                            onChange={(file) => {
                              const newFile = Array.isArray(file)
                                ? file[0]
                                : file;

                              if (newFile && typeof newFile === "object") {
                                field.onChange({
                                  ...(field.value ?? {}),
                                  ...newFile,
                                });
                              }
                            }}
                            single={true}
                            allowedFileTypes={[
                              "application/pdf",
                              "image/jpg",
                              "image/png",
                              "image/jpeg",
                            ]}
                            placeHolder={"Upload PDF ,Image (jpg/png) files"}
                          // maxHeight={900}
                          // maxWidth={500}
                          />
                        )}
                      />
                      {errors?.otherBrands?.[index]?.image && (
                        <span className="error-txt">
                          {errors.otherBrands[index].image.message}
                        </span>
                      )}
                    </div>
                    {otherBrandsFields.length > 1 && (
                      <ButtonIcon
                        className="b-c-i-rounded b-c-i-outline b-c-i-danger"
                        onClick={() => removeOtherBrands(index)}
                      >
                        <TrashTableIcon />
                      </ButtonIcon>
                    )}
                  </div>
                ))}

                <div className="add-option-block margin-l-auto">
                  <ButtonIconRight
                    name={t("otherBrands.add")}
                    className={"btn-c-secondary btn-plain-txt"}
                    onClick={() => handleAddCertificates("otherBrands")}
                  >
                    <PlusIcon />
                  </ButtonIconRight>
                </div>
              </div>
            </div>
            {/* Awards */}
            <div className="forms-group">
              <div className="a-f-b-txt-block">
                <Typography variant="span" className="a-f-b-subtxt">
                  {t("awards.title")}
                </Typography>
              </div>
              <div className="add-certifications-block-group">
                {awardsFields.map((field, index) => (
                  <div className="loop-block" key={field.id || index}>
                    <div className="add-certifications-block">
                      <Controller
                        name={`awards.${index}.name`}
                        control={control}
                        render={({ field }) => (
                          <InputField
                            {...field}
                            placeholder={t("awards.awardTitle")}
                          />
                        )}
                      />
                      {errors?.awards?.[index]?.name && (
                        <span className="error-txt">
                          {errors.awards[index].name.message}
                        </span>
                      )}
                      <Controller
                        name={`awards.${index}.year`}
                        control={control}
                        render={({ field }) => (
                          <InputField
                            {...field}
                            value={
                              field.value !== undefined && field.value !== null
                                ? field.value.toString()
                                : ""
                            }
                            onChange={(e) => {
                              const numberValue = parseFloat(e.target.value);
                              field.onChange(
                                isNaN(numberValue) ? undefined : numberValue
                              );
                            }}
                            // onChange={()=>setValue(`awards.${index}.year`,typeof field.value==="number"?field.value:parseInt(field.value))}
                            placeholder={t("awards.year")}
                          />
                        )}
                      />
                      {errors?.awards?.[index]?.year && (
                        <span className="error-txt">
                          {errors.awards[index].year.message}
                        </span>
                      )}
                      <Controller
                        name={`awards.${index}.image`}
                        control={control}
                        render={({ field }) => (
                          <DndImageUpload
                            value={
                              Array.isArray(field.value)
                                ? field.value[0] // if it's an array, pass the first one
                                : field.value || undefined // if it's a single object or null
                            }
                            onChange={(file) => {
                              const newFile = Array.isArray(file)
                                ? file[0]
                                : file;

                              if (newFile && typeof newFile === "object") {
                                field.onChange({
                                  ...(field.value ?? {}),
                                  ...newFile,
                                });
                              }
                            }}
                            single={true}
                            allowedFileTypes={[
                              "image/jpg",
                              "image/jpeg",
                              "image/png",
                            ]}

                          // maxHeight={900}
                          // maxWidth={500}
                          />
                        )}
                      />
                      {errors?.awards && (
                        <span className="error-txt">
                          {errors.awards.message}
                        </span>
                      )}
                    </div>
                    {awardsFields.length > 1 && (
                      <ButtonIcon
                        className="b-c-i-rounded b-c-i-outline b-c-i-danger"
                        onClick={() => removeAwards(index)}
                      >
                        <TrashTableIcon />
                      </ButtonIcon>
                    )}
                  </div>
                ))}
                <div className="add-option-block margin-l-auto">
                  <ButtonIconRight
                    name={t("awards.add")}
                    className={"btn-c-secondary btn-plain-txt"}
                    onClick={() => handleAddCertificates("awards")}
                  >
                    <PlusIcon />
                  </ButtonIconRight>
                </div>
              </div>
            </div>
            {/* Certificates */}
            <div className="forms-group">
              <div className="a-f-b-txt-block">
                <Typography variant="span" className="a-f-b-subtxt">
                  {t("certificates.title")}
                </Typography>
              </div>
              <div className="add-certifications-block-group">
                {certificatesFields.map((field, index) => (
                  <div className="loop-block" key={field.id || index}>
                    <div className="add-certifications-block">
                      <Controller
                        name={`certificates.${index}.name`}
                        control={control}
                        render={({ field }) => (
                          <InputField
                            {...field}
                            placeholder={t("certificates.certTitle")}
                          />
                        )}
                      />
                      {errors?.certificates?.[index]?.name && (
                        <span className="error-txt">
                          {errors.certificates[index].name.message}
                        </span>
                      )}

                      <Controller
                        name={`certificates.${index}.image`}
                        control={control}
                        render={({ field }) => (
                          <DndImageUpload
                            value={
                              Array.isArray(field.value)
                                ? field.value[0] // if it's an array, pass the first one
                                : field.value || undefined // if it's a single object or null
                            }
                            onChange={(file) => {
                              const newFile = Array.isArray(file)
                                ? file[0]
                                : file;

                              if (newFile && typeof newFile === "object") {
                                field.onChange({
                                  ...(field.value ?? {}),
                                  ...newFile,
                                });
                              }
                            }}
                            single={true}
                            allowedFileTypes={[
                              "application/pdf",
                              "image/jpg",
                              "image/png",
                              "image/jpeg",
                            ]}

                          // maxHeight={900}
                          // maxWidth={500}
                          />
                        )}
                      />
                      {errors?.certificates?.[index]?.image && (
                        <span className="error-txt">
                          {errors.certificates[index].image.message}
                        </span>
                      )}
                    </div>
                    {certificatesFields.length > 1 && (
                      <ButtonIcon
                        className="b-c-i-rounded b-c-i-outline b-c-i-danger"
                        onClick={() => removeCertificates(index)}
                      >
                        <TrashTableIcon />
                      </ButtonIcon>
                    )}
                  </div>
                ))}

                <div className="add-option-block margin-l-auto">
                  <ButtonIconRight
                    name={t("certificates.add")}
                    className={"btn-c-secondary btn-plain-txt"}
                    onClick={() => handleAddCertificates("certificates")}
                  >
                    <PlusIcon />
                  </ButtonIconRight>
                </div>
              </div>
            </div>
            {/* Social media */}
            <div className="forms-group">
              <div className="a-f-b-txt-block">
                <Typography variant="span" className="a-f-b-subtxt">
                  {t("social")}
                </Typography>
              </div>
              <div className="tabs-content col-2-layout flex-dir-row mt-15px">
                <div className="tabs-form-group">
                  <div className="s-l-g-item">
                    <Image
                      src={FacebookIcon}
                      width={28}
                      height={28}
                      alt="Facebook"
                    ></Image>
                    <Typography variant="span" className="s-l-g-i-txt">
                      {t("facebook")}
                    </Typography>
                  </div>
                  <Controller
                    name="socialMediaLinks.facebook"
                    control={control}
                    render={({ field }) => (
                      <InputField {...field} placeholder={t("enterLink")} />
                    )}
                  />
                  {errors?.socialMediaLinks?.facebook && (
                    <span className="error-txt">
                      {errors?.socialMediaLinks?.facebook?.message}
                    </span>
                  )}
                </div>
                <div className="tabs-form-group">
                  <div className="s-l-g-item">
                    <Image
                      src={YoutubeIcon}
                      width={28}
                      height={28}
                      alt="YouTube"
                    ></Image>
                    <Typography variant="span" className="s-l-g-i-txt">
                      {t("youtube")}
                    </Typography>
                  </div>
                  <Controller
                    name="socialMediaLinks.youtube"
                    control={control}
                    render={({ field }) => (
                      <InputField {...field} placeholder={t("enterLink")} />
                    )}
                  />
                  {errors?.socialMediaLinks?.youtube && (
                    <span className="error-txt">
                      {errors?.socialMediaLinks?.youtube?.message}
                    </span>
                  )}
                </div>
                <div className="tabs-form-group">
                  <div className="s-l-g-item">
                    <Image
                      src={InstagramIcon}
                      width={28}
                      height={28}
                      alt="Instagram"
                    ></Image>
                    <Typography variant="span" className="s-l-g-i-txt">
                      {t("instagram")}
                    </Typography>
                  </div>
                  <Controller
                    name="socialMediaLinks.instagram"
                    control={control}
                    render={({ field }) => (
                      <InputField {...field} placeholder={t("enterLink")} />
                    )}
                  />
                  {errors?.socialMediaLinks?.instagram && (
                    <span className="error-txt">
                      {errors?.socialMediaLinks?.instagram?.message}
                    </span>
                  )}
                </div>
                <div className="tabs-form-group">
                  <div className="s-l-g-item">
                    <Image
                      src={LinkedInIcon}
                      width={28}
                      height={28}
                      alt="LinkedIn"
                    ></Image>
                    <Typography variant="span" className="s-l-g-i-txt">
                      {t("linkedin")}
                    </Typography>
                  </div>
                  <Controller
                    name="socialMediaLinks.linkedin"
                    control={control}
                    render={({ field }) => (
                      <InputField {...field} placeholder={t("enterLink")} />
                    )}
                  />
                  {errors?.socialMediaLinks?.linkedin && (
                    <span className="error-txt">
                      {errors?.socialMediaLinks?.linkedin?.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="button-group-block edit-save-btn-block">
              <Button
                className={"btn-outline bg-outline-dark btn-c-sm"}
                text={t("cancel")}
                onClick={onSuccess}
                disabled={
                  isSubmitting ||
                  !(
                    currentStepperStatus?.[
                    BusinessProfileStageKey.BusinessDetails
                    ] === "completed" &&
                    currentStepperStatus?.[
                    BusinessProfileStageKey.CompanyRegistrationDetails
                    ] === "completed"
                  )
                }
              />
              <Button
                className={"btn-c-primary btn-c-sm"}
                text={t("save")}
                type="submit"
                disabled={
                  isSubmitting ||
                  !(
                    currentStepperStatus?.[
                    BusinessProfileStageKey.BusinessDetails
                    ] === "completed" &&
                    currentStepperStatus?.[
                    BusinessProfileStageKey.CompanyRegistrationDetails
                    ] === "completed"
                  )
                }
              />
            </div>
          </form>
        </div>
      )}
    </>
  );
};
export default BrandMediaSection;
