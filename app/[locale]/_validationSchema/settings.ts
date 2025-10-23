import * as z from "zod";

export const profileSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(100, "Legal first name must not exceed 100 characters")
      .regex(
        /^[A-Za-z\s]+$/,
        "Legal first name can contain only alphabets and spaces"
      ),

    middleName: z
      .string()
      .max(100, "Middle name must not exceed 100 characters")
      .regex(
        /^[a-zA-Z\s\-'.]*$/,
        "Only letters, spaces, apostrophes, and hyphens are allowed"
      )
      .optional()
      .or(z.literal("")),

    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(100, "Legal last name must not exceed 100 characters")
      .regex(
        /^[A-Za-z\s]+$/,
        "Legal last name can contain only alphabets and spaces"
      ),

    jobTitle: z
      .string()
      .min(1, "Job title is required")
      .max(100, "Job Title must not exceed 100 characters")
      .regex(
        /^[A-Za-z\s]+$/,
        "Job Title can contain only alphabets and spaces"
      ),

    dateOfBirth: z
      .date({ required_error: "Date of Birth is required" })
      .refine((d) => d < new Date(), {
        message: "Date of Birth must be in the past",
      }),

    nationalIdNo: z.string().min(1, "National ID Number is required"),
    WhatsAppNo: z
      .object({
        countryCode: z.string().min(1, "Country code is required"),
        number: z.string().min(1, "WhatsApp number is required"),
      })
      .optional(),

    nationalIdType: z.string().min(1, "National ID type is required"),

    personalAddress: z.object({
      addressLine: z
        .string()
        .min(1, "Address is required")
        .max(100, "Address must be under 100 characters"),

      country: z.object({
        name: z.string().min(1, "Country name is required"),
        code: z.string().min(1, "Country code is required"),
      }),

      city: z
        .string()
        .min(1, "City is required")
        .max(50, "City name must be under 50 characters"),

      state: z
        .string()
        .min(1, "State is required")
        .max(50, "State name must be under 50 characters"),

      pinCode: z.string().min(4, "ZIP code is required"),
    }),

    workEmail: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email format"),

    workPhoneNo: z.object({
      countryCode: z.string().min(1, "Country code is required"),
      number: z.string().min(1, "Mobile  number is required"),
    }),
    additionalDocument: z
      .object({
        document: z
          .object({
            src: z.string().default(""),
            alt: z.string().default(""),
            exten: z.string().default(""),
            size: z.number().default(0),
          })
          .nullable() // Allowing null values here
          .optional(), // Makes the document field optional as well
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    const panRegex = /^[A-Za-z0-9]{10}$/;
    const voterIdRegex = /^[A-Za-z0-9]{10}$/;
    const dlRegex = /^[A-Za-z0-9]{16}$/;
    const { nationalIdType, nationalIdNo } = data;
    if (nationalIdType.includes("pan") && !panRegex.test(nationalIdNo)) {
      ctx.addIssue({
        path: ["nationalIdNo"],
        message: "PAN must be 10 characters.",
        code: z.ZodIssueCode.custom,
      });
    } else if (
      nationalIdType.includes("voter") &&
      !voterIdRegex.test(nationalIdNo)
    ) {
      ctx.addIssue({
        path: ["nationalIdNo"],
        message: "Voter ID must be 10 characters.",
        code: z.ZodIssueCode.custom,
      });
    } else if (
      nationalIdType.includes("drive") &&
      !dlRegex.test(nationalIdNo)
    ) {
      ctx.addIssue({
        path: ["nationalIdNo"],
        message: "Driver’s License must be 16 characters.",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export const businessSchema = z.object({
  accountID: z.string().optional(),

  businessName: z
    .string()
    .nonempty("Bussiness name is required")
    .min(3, "Bussiness name must be at least 3 characters")
    .max(100, "Bussiness name must not exceed 100 characters")
    .regex(
      /^[A-Za-z\s]+$/,
      "Bussiness name can contain only alphabets and spaces"
    ),
  businessAddress: z.object({
    addressLine: z
      .string()
      .min(1, "Address is required")
      .max(100, "Address must be under 100 characters"),

    country: z.object({
      name: z.string().min(1, "Country name is required"),
      code: z.string().min(1, "Country code is required"),
    }),
    city: z
      .string()
      .min(1, "City is required")
      .max(50, "City name must be under 50 characters"),

    state: z
      .string()
      .min(1, "State is required")
      .max(50, "State name must be under 50 characters"),

    pinCode: z.string().min(4, "ZIP code is required"),
  }),

  timeZone: z
    .string()
    .nonempty("Time zone is required")
    .min(2, "Time zone must be at least 2 characters")
    .max(50, "Time zone must be under 50 characters"),
  phoneNo: z.string().nonempty("Phone number is required"),
  countryCode: z.string().min(1, "Country code is required"),

  additionalPhoneNo: z
    .array(
      z.object({
        countryCode: z.string().min(1, "Country code is required"),
        number: z.string().min(1, "Mobile  number is required"),
      })
    )
    .optional(),

  email: z
    .string()
    .nonempty("Email is required")
    .refine((val) => !val || /^\S+@\S+\.\S+$/.test(val), {
      message: "Invalid email format",
    }),
});

export const taxFormSchema = z.object({
  taxes: z
    .array(
      z.object({
        country: z
          .string({
            required_error: "Country is required",
          })
          .min(1, "Country is required"),
        country_code: z.string().optional(),
        currency: z.string().min(1, "Currency is required"),
        tax_id_label: z
          .string()
          .min(1, "Tax Identification Number is required"),
        tax_types: z.string().min(1, "Applicable Tax Type is required"),
        default_tax_rates: z
          .string()
          .min(1, "Tax Rate is required")
          .regex(/^\d+(\.\d+)?$/, "Tax Rate must be a valid number"),
      })
    )
    .min(1, "At least one tax entry is required"),
});

export const updatePaymentFormSchema = z.object({
  cardHolderName: z.string().min(1, "Cardholder name is required"),
  cardNo: z.string().regex(/^\d{16}$/, "Card number must be 16 digits"),
  cardExpiredDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry date must be in MM/YY format"),
  cvv: z.string().regex(/^\d{3}$/, "CVV must be exactly 3 digits"),

  isCompliantWithRBIGuidelines: z.boolean().optional(),
});

export const userBillingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  businessName: z.string().min(1, "Business name is required"),
  billingAddress: z.object({
    addressLine: z
      .string()
      .min(1, "Address is required")
      .max(100, "Address must be under 100 characters"),

    country: z.object({
      name: z.string().min(1, "Country name is required"),
      code: z.string().min(1, "Country code is required"),
    }),

    city: z
      .string()
      .min(1, "City is required")
      .max(50, "City name must be under 50 characters"),

    state: z
      .string()
      .min(1, "State is required")
      .max(50, "State name must be under 50 characters"),

    pinCode: z.string().min(4, "ZIP code is required"),
  }),
});
