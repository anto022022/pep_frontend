import { Incoterms, PaymentTerm } from "@/app/[locale]/_models/StoreFront";
import {
  countryOfOriginSchema,
  currencySchema,
} from "@/app/[locale]/_validationSchema/salesProduct";
import * as z from "zod";

// Common schema Start
const currentYear = new Date().getFullYear();

export const countryCodeSchema = z.object({
  name: z.string().nonempty({ message: "Country name is required" }),
  code: z.string().nonempty({ message: "Country code is required" }),
  // name: z.string().optional(),
  // code: z.string().optional(),
});

export const countryCodeOptionalSchema = z.object({
  name: z.string().optional(),
  code: z.string().optional(),
});

export const languageSchema = z.object({
  name: z
    .string({ required_error: "Language is required" })
    .nonempty({ message: "Language is required" }),
  value: z
    .string({ required_error: "Language is required" })
    .nonempty({ message: "Language is required" }),
});

export const deliveryTimeEstimateSchema = z.object({
  value: z.number().min(1, "").optional(),

  unit: z.enum(["days", "weeks", "months"]).optional(),
});

const minimumOrderValueSchema = z.object({
  currency: currencySchema.optional(),
  value: z
    .number({
      required_error: "Minimum order value is required",
      invalid_type_error: "Minimum order value must be a number",
    })
    .optional(),
});

// const productImageSchema = z.object({
//   src: z
//     .string()
//     .optional()
//     .transform((val) => (val?.trim() === "" ? undefined : val)),
//   alt: z
//     .string()
//     .optional()
//     .transform((val) => (val?.trim() === "" ? undefined : val)),
//   exten: z
//     .string()
//     .optional()
//     .transform((val) => (val?.trim() === "" ? undefined : val)),
//   size: z
//     .number()
//     .optional()
//     .transform((val) => (val === 0 ? undefined : val)),
// });

const productImageSchema = z
  .object({
    src: z
      .string()
      .optional()
      .transform((v) => (v?.trim() === "" ? undefined : v)),
    alt: z
      .string()
      .optional()
      .transform((v) => (v?.trim() === "" ? undefined : v)),
    exten: z
      .string()
      .optional()
      .transform((v) => (v?.trim() === "" ? undefined : v)),
    size: z
      .number()
      .optional()
      .transform((v) => (v === 0 ? undefined : v)),
  })
  .transform((obj) => {
    // ✅ If all values are undefined, return undefined
    const allEmpty = Object.values(obj).every((v) => v === undefined);
    return allEmpty ? undefined : obj;
  });

export const productBrochureSchema = z.object({
  src: z
    .string()
    .optional()
    .transform((v) => (v?.trim() === "" ? undefined : v)),
  alt: z
    .string()
    .optional()
    .transform((v) => (v?.trim() === "" ? undefined : v)),
  exten: z
    .string()
    .optional()
    .transform((v) => (v?.trim() === "" ? undefined : v)),
  size: z
    .number()
    .optional()
    .transform((v) => (v === 0 ? undefined : v)),
});

// const namedImageSchema = z
//   .object({
//     name: z
//       .string()
//       .optional()
//       .transform((val) => (val?.trim() === "" ? undefined : val)),
//     image: productImageSchema.optional(),
//   })
//   .transform((val) => (Object.values(val).length === 0 ? val : undefined));

const namedImageSchema = z.object({
  name: z
    .string()
    .optional()
    .transform((val) => (val?.trim() === "" ? undefined : val)),
  image: productImageSchema.optional(),
}).refine(
  (data) =>
    (!!data.name && !!data.image) || (!data.name && !data.image),
  {
    message: "Name and image must be provided together",
    path: ["name"],
  }
);
// .transform(val => {
//   const allEmpty = Object.values(val).every(v => v === undefined);
//   return allEmpty ? undefined : val;
// });

const awardSchema = z.object({
  name: z
    .string()
    .optional()
    .transform((val) => (val?.trim() === "" ? undefined : val)),
  image: productImageSchema.optional(),
  year: z
    .number({ invalid_type_error: "Year must be a number" })
    .int("Year must be an integer")
    .gte(1900, "Year must be after 1900")
    .lte(2099, "Year must be before 2100")
    .optional()
    .transform((val) => (!val ? undefined : val)),
});

const httpsUrl = z
  .string()
  .refine((val) => val === "" || /^https:\/\//.test(val), {
    message: "URL must start with https://",
  });

const socialMediaLinksSchema = z
  .object({
    facebook: httpsUrl.optional(),
    youtube: httpsUrl.optional(),
    instagram: httpsUrl.optional(),
    linkedin: httpsUrl.optional(),
  })
  .optional();

export const AddressStateAndCity = z.object({
  name: z.string(),
  longitude: z.string().nullable().optional(),
  latitude: z.string().nullable().optional(),
  isoCode: z.string().optional(),
  countryCode: z.string(),
  stateCode: z.string().optional(),
});

export const AddressStateAndCityOptional = z.object({
  name: z.string().optional(),
  longitude: z.string().nullable().optional(),
  latitude: z.string().nullable().optional(),
  isoCode: z.string().optional(),
  countryCode: z.string().optional(),
  stateCode: z.string().optional(),
});

// Common schema Start

// Business Information Schema start
export const businessDetailSchema = z.object({
  legalBusinessName: z.string()
    .nonempty({ message: "Legal Business Name is required" })
    .min(2, "Enter Legal Business Name greater then 2 characters")
    .max(100, "Legal Business name less then 100 characters"),
  businessName: z
    .string()
    .nonempty({ message: "Business Name is required" })
    .max(250, "Business Name must be less then 250 characters"),
  ownerName: z
    .string()
    .nonempty({ message: "Business Name is required" })
    .max(100, "Legal Owner Name must be less then 100 characters")
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Legal Owner Name must not contain special characters",
    }),
  businessType: z.string().nonempty({ message: "Legal Status is required" }),
  businessTypeSpecific: z
    .array(z.string())
    .nonempty({ message: "Business Type is required" }),
  businessAddress: z.object({
    addressLine: z.string().nonempty({ message: "Address is required" })
      .min(5, { message: 'Address must be at least 5 characters' })
      .max(100, { message: 'Address must be at most 100 characters' }),
    city: AddressStateAndCity.extend({
      name: z.string().nonempty({ message: "City is required" }),
    }),
    state: AddressStateAndCity.extend({
      name: z.string().nonempty({ message: "State is required" }),
    }),

    pinCode: z
      .string()
      .nonempty({ message: "ZIP code is required" })
      .regex(/^[A-Za-z0-9 -]{4,10}$/, {
        message:
          "Pincode must be 4 to 10 characters and can include letters, numbers, spaces, and dashes",
      }),
    country: countryCodeSchema,
  }),
  phoneNumber: z.object({
    countryCode: z
      .string()
      .nonempty({ message: "Phone Number Country code is required" }),
    number: z
      .string()
      .nonempty({ message: "Phone Number is required" })
      .regex(/^\d+$/, "Phone number must contain only digits")
      .min(8, "Minium 8 Digits need to enter")
      .max(15, "Maximum 15 Digits only"),
  }),
  email: z
    .string()
    .nonempty({ message: "Business Email is required" })
    .email("Invalid email address")
    .max(100, "Maximum 100 characters only allow")
    .transform((val) => val.toLowerCase()),
  industry: z
    .object({
      _id: z.string().nonempty({ message: "Industry id is required" }),
      uniqueId: z
        .string()
        .nonempty({ message: "Industry uniqueId is required" }),
      name: z.string().nonempty({ message: "Industry name is required" }),
    })
    .refine((val) => !!val, { message: "Industry is required" }),
  establishment: z
    .string()
    .nonempty({ message: "Year of Establishment is required" })
    .regex(/^\d{4}$/, "Year must be in YYYY format")
    .refine(
      (val) => {
        const year = parseInt(val, 10);
        return year <= currentYear;
      },
      { message: `Year must not be greater than ${currentYear}` }
    ),
  employeeCount: z
    .string()
    .nonempty({ message: "No. of Employees is required" }),
  mainProduct: z
    .array(
      z
        .string()
        .trim()
        .max(100, "Each product name must be less than 100 characters")
        .regex(
          /^[A-Za-z]+(?: [A-Za-z]+)*$/,
          "Only letters and spaces are allowed"
        )
    )
    .min(1, "At least one product is required"),

  shipAddress: z.boolean().optional(),
});

export const BusinessCompanyDetailSchema = z.object({
  businessRegistration: z.object({
    documentType: z.string().nonempty({ message: "Document Type is required" }),
    documentId: z.string().nonempty({ message: "Document Id is required" })
      .min(4, { message: "Document number must be at least 5 characters" })
      .max(20, { message: "Document number must be at most 20 characters" }),
  }),
});

export const BusinessTaxVerificationSchema = z.object({
  gstNo: z.string().nonempty({ message: "GST No is required" }),
  VATNo: z.string().optional(),
  PANNo: z.string().nonempty({ message: "PAN No is required" }),
});

export const BusinessAdditionalSectionSchema = z.object({
  shippingAddress: z
    .object({
      addressLine: z.string()
        .max(100, { message: 'Address must be at most 100 characters' })
        .refine(val => val.length === 0 || val.length >= 5, {
          message: 'Address must be at least 5 characters',
        })
        .optional(),
      city: AddressStateAndCityOptional.optional(),
      state: AddressStateAndCityOptional.optional(),
      pinCode: z
        .string()
        // .regex(/^[A-Za-z0-9 -]{4,10}$/, {
        //   message: "Pincode must be 4 to 10 characters and can include letters, numbers, spaces, and dashes",
        // })
        .optional(),
      country: z
        .object({
          name: z.string().optional(),
          code: z.string().optional(),
        })
        .optional(),
    })
    .optional()
    .superRefine((val, ctx) => {
      if (!val) return; // shippingAddress is optional → valid

      const { addressLine, city, state, pinCode, country } = val;

      // Put all required address fields in an array
      const fields = [
        addressLine,
        city?.name,
        state?.name,
        pinCode,
        country?.name,
        country?.code,
      ];

      // Check if user filled anything
      const anyFilled = fields.some((f) => f && String(f).trim() !== "");

      // Check if all required are filled
      const allFilled = fields.every((f) => f && String(f).trim() !== "");

      // Validate pinCode format using regex
      if (typeof pinCode === "string" && pinCode?.trim() !== "") {
        const regex = /^[A-Za-z0-9 -]{4,10}$/;
        if (!regex.test(pinCode)) {
          ctx.addIssue({
            path: ["pinCode"],
            code: z.ZodIssueCode.custom,
            message:
              "Pincode must be 4-10 characters and only include letters, numbers, spaces, and dashes",
          });
        }
      }

      if (anyFilled && !allFilled) {
        // user started filling but didn't complete → error for each missing field
        if (!addressLine || addressLine.trim() === "") {
          ctx.addIssue({
            path: ["addressLine"],
            code: z.ZodIssueCode.custom,
            message: "Address line is required when address is provided",
          });
        }
        if (!city?.name || city.name.trim() === "") {
          ctx.addIssue({
            path: ["city"],
            code: z.ZodIssueCode.custom,
            message: "City is required when address is provided",
          });
        }
        if (!state?.name || state.name.trim() === "") {
          ctx.addIssue({
            path: ["state"],
            code: z.ZodIssueCode.custom,
            message: "State is required when address is provided",
          });
        }
        if (!pinCode || pinCode.trim() === "") {
          ctx.addIssue({
            path: ["pinCode"],
            code: z.ZodIssueCode.custom,
            message: "Pincode is required when address is provided",
          });
        }
        if (!country?.name || country.name.trim() === "") {
          ctx.addIssue({
            path: ["country", "name"],
            code: z.ZodIssueCode.custom,
            message: "Country name is required when address is provided",
          });
        }

        if (!country?.code || country.code.trim() === "") {
          ctx.addIssue({
            path: ["country", "code"],
            code: z.ZodIssueCode.custom,
            message: "Country code is required when address is provided",
          });
        }

      }
    }),
  annualTurnover: z.string().optional(),
  website: z
    .string()
    .refine(
      (val) =>
        !val ||
        /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/.test(val),
      { message: "Invalid website URL" }
    )
    .optional(),
});
// Business Information Schema end

// Branding Media Schema start
export const brandingMediaSchema = z.object({
  companyLogo: productImageSchema.optional().transform((val) => val ?? {}),
  companyVideo: productImageSchema.optional().transform((val) => val ?? {}),
  // companyVideoLink: z
  //   .union([z.string().url({ message: "Invalid YouTube URL" }), z.literal("")])
  //   .optional().transform((val) => val ?? ""),
  companyVideoLink: z
    .string()
    .optional()
    .transform((val) => val ?? "") // Ensure undefined becomes empty string
    .refine(
      (val) =>
        val === "" ||
        /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}$/.test(val),
      {
        message: "Invalid YouTube URL",
      }
    ),

  brochures: z
    .array(productBrochureSchema)
    .optional()
    .transform((arr) => {
      if (!arr || arr.length === 0) return [];
      const cleaned = arr.filter((item) =>
        Object.values(item).some((v) => v !== undefined)
      );
      return cleaned.length > 0 ? cleaned : [];
    }),
  ownBrands: z
    .array(namedImageSchema)
    .optional()
    .transform((arr) => {
      if (!arr || arr.length === 0) return [];
      const cleaned = arr.filter((item) =>
        Object.values(item).some((v) => v !== undefined)
      );
      return cleaned.length > 0 ? cleaned : [];
    }),
  otherBrands: z
    .array(namedImageSchema)
    .optional()
    .transform((arr) => {
      if (!arr || arr.length === 0) return [];
      const cleaned = arr.filter((item) =>
        Object.values(item).some((v) => v !== undefined)
      );
      return cleaned.length > 0 ? cleaned : [];
    }),
  // awards: z.array(awardSchema).optional(),
  awards: z
    .array(awardSchema)
    .optional()
    .transform((arr) => {
      if (!arr || arr.length === 0) return [];
      const cleaned = arr.filter((item) =>
        Object.values(item).some((v) => v !== undefined)
      );
      return cleaned.length > 0 ? cleaned : [];
    }),
  certificates: z
    .array(namedImageSchema)
    .optional()
    .transform((arr) => {
      if (!arr || arr.length === 0) return [];
      const cleaned = arr.filter((item) =>
        Object.values(item).some((v) => v !== undefined)
      );
      return cleaned.length > 0 ? cleaned : [];
    }),
  socialMediaLinks: socialMediaLinksSchema.optional(),
});
// Branding Media Schema end

// Trade Information Schema start
export const marketSchema = z.object({
  mainMarkets: z
    .array(countryOfOriginSchema)
    .min(1, { message: "At least one country should be selected" }),
});

export const shippingSchema = z
  .object({
    shippingMethod: z
      .array(z.string())
      .min(1, { message: "At least one Shipping Method should be selected" }),
    paymentMethods: z
      .array(z.string())
      .min(1, { message: "At least one Payment Method should be selected" }),
    otherPaymentMethod: z
      .string()
      .transform((val) => (val.trim() === "" ? undefined : val))
      .optional(),
    paymentTerms: z.enum(
      Object.values(PaymentTerm) as [PaymentTerm, ...PaymentTerm[]],
      {
        errorMap: () => ({ message: "Please select a valid Payment Term" }),
      }
    ),

    customPaymentTerm: z
      .string()
      .transform((val) => (val.trim() === "" ? undefined : val))
      .optional(),
    acceptedCurrency: z
      .array(currencySchema)
      .min(1, { message: "At least one currency should be selected" }),
  })
  .superRefine((data, ctx) => {
    if (
      data.paymentMethods.includes("others") &&
      !data.otherPaymentMethod?.trim()
    ) {
      ctx.addIssue({
        path: ["otherPaymentMethod"],
        code: z.ZodIssueCode.custom,
        message: "Required",
      });
    }
    if (
      data.paymentTerms?.includes("CUSTOM") &&
      !data.customPaymentTerm?.trim()
    ) {
      ctx.addIssue({
        path: ["customPaymentTerm"],
        code: z.ZodIssueCode.custom,
        message: "Payment Term is Required",
      });
    }
  });

export const TradeDetailsSchema = z.object({
  iecNumber: z
    .string()
    .max(15, { message: "Must be at most 15 characters" })
    .regex(/^[a-zA-Z0-9]*$/, {
      message: "Only alphanumeric characters allowed",
    })
    .optional(),
  iecDoc: productImageSchema.optional(),
  exportPercent: z
    .number()
    .min(0, { message: "Value must be at least 0" })
    .max(100, { message: "Value must be at most 100" })
    .optional(),
  languageSpoken: z.array(z.string()).optional(),
  nearestPort: z.string().optional(),
  averageLeadTime: deliveryTimeEstimateSchema.optional(),
  minOrderValue: minimumOrderValueSchema.optional(),
  deliveryTerm: z
    .array(z.enum(Object.values(Incoterms) as [string, ...string[]], {}))
    .optional(),
});

// Trade Information Schema end

// Factory & Warehouse Details start
export const BusinessFactoryWarehouseSchema = z.object({
  contractManufacturing: z.array(z.string())
    .min(1, { message: 'At least one contract manufacturing type must be selected' }),
});

export const BusinessFactoryWarehouseAdditionalInformation = z.object({
  totalFactorySize: z.string().optional(),
  noOfProductionLines: z
    .number()
    .min(0, { message: "Value must be at least 0" })
    .optional(),
  annualOutputValue: z.string().optional(),
  productionFacilities: z
    .string()
    .max(200, { message: "Maximum 200 characters only allow" })
    .optional(),
  annualProductionCapacity: z.array(
    z.object({
      product: z.string().optional(),
      quantity: z
        .number()
        .min(0, { message: "Value must be at least 0" })
        .optional(),
      unit: z.string().optional(),
    })
  ),
  warehouseStorageArea: z.string().optional(),
  warehouseCertification: z
    .object({
      src: z.string().optional(),
      alt: z.string().optional(),
      exten: z.string().optional(),
      size: z.number().optional(),
    })
    .optional(),
  infrastructureImg: z
    .array(
      z.object({
        src: z.string(),
        alt: z.string(),
        exten: z.string(),
        size: z.number(),
      })
    )
    .optional(),
  infrastructureOverview: z
    .string()
    .max(350, "Maximum 350 characters only allow")
    .optional(),
  noOfQcStaff: z
    .number()
    .min(0, { message: "Value must be at least 0" })
    .optional(),
  noOfRdStaff: z
    .number()
    .min(0, { message: "Value must be at least 0" })
    .optional(),
  factoryDivision: z
    .array(
      z.object({
        divisionName: z.string().optional(),
        companyName: z.string().optional(),
        contactName: z.string().optional(),
        phoneNumber: z
          .object({
            countryCode: z.string().optional(),
            number: z
              .string()
              .regex(/^\d+$/, "Phone number must contain only digits")
              // .min(10, "Minium 10 Digits need to enter")
              // .max(15, "Maximum 15 Digits only")
              .optional(),
          })
          .optional(),
        address: z
          .object({
            addressLine: z.string().optional(),
            state: z.string().optional(),
            city: z.string().optional(),
            pinCode: z
              .string()
              // .refine((val) => !val || /^\d{4,10}$/.test(val), {
              //   message: "Pincode must be numeric",
              // })
              .optional(),
            country: countryCodeOptionalSchema.optional(),
          })
          .optional()
          .superRefine((address, ctx) => {
            if (!address) return;

            const { addressLine, city, state, pinCode, country } = address;

            const fields = [
              addressLine,
              city,
              state,
              pinCode,
              country?.name,
              country?.code,
            ];

            const anyFilled = fields.some((f) => f && String(f).trim() !== "");
            const allFilled = fields.every((f) => f && String(f).trim() !== "");

            // If any field is filled but not all are filled → show errors
            if (anyFilled && !allFilled) {
              if (!addressLine || addressLine.trim() === "") {
                ctx.addIssue({
                  path: ["addressLine"],
                  code: z.ZodIssueCode.custom,
                  message: "Address line is required",
                });
              }
              if (!city || city.trim() === "") {
                ctx.addIssue({
                  path: ["city"],
                  code: z.ZodIssueCode.custom,
                  message: "City is required",
                });
              }
              if (!state || state.trim() === "") {
                ctx.addIssue({
                  path: ["state"],
                  code: z.ZodIssueCode.custom,
                  message: "State is required",
                });
              }
              if (!pinCode || pinCode.trim() === "") {
                ctx.addIssue({
                  path: ["pinCode"],
                  code: z.ZodIssueCode.custom,
                  message: "Pincode is required",
                });
              } else if (!/^[A-Za-z0-9\- ]{4,10}$/.test(pinCode)) {
                ctx.addIssue({
                  path: ["pinCode"],
                  code: z.ZodIssueCode.custom,
                  message:
                    "Pincode must be 4-10 characters and only include letters, numbers, spaces, and dashes",
                });
              }

              if (!country?.name || !country?.code) {
                ctx.addIssue({
                  path: ["country"],
                  code: z.ZodIssueCode.custom,
                  message: "Country name and code are required",
                });
              }
            }

            // If all fields are filled, check if pincode format is valid
            if (
              allFilled &&
              pinCode &&
              !/^[A-Za-z0-9\- ]{4,10}$/.test(pinCode)
            ) {
              ctx.addIssue({
                path: ["pinCode"],
                code: z.ZodIssueCode.custom,
                message:
                  "Pincode must be 4-10 characters and only include letters, numbers, spaces, and dashes",
              });
            }
          }),
        // .url("Invalid URL")
        googleMapLink: z.string().optional(),
      })
    )
    .optional(),
});
// Factory & Warehouse Details end
