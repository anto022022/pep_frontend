import * as z from "zod";

export const businessDetailsSchema = z.object({
  businessLocation: z.object({
    name: z
      .string({ required_error: "Country is required" })
      .nonempty("Country is required"),
    code: z.string().nonempty("Country code is required"),
  }),
  businessType: z.enum(["register", "unregister", "nonprofit"], {
    errorMap: () => ({ message: "Please select a valid business type" }),
  }),
});

export const CategoriesListSchema = z.object({
  _id: z.string().min(1, { message: "Industry is required" }),
  uniqueId: z.string().min(1, { message: "uniqueId is required" }),
  name: z.string().min(1, { message: "name is required" }),
});

const allowedBusinessNameRegex = /^[a-zA-Z0-9\s\-&']+$/;

export const businessOperationSchema = (businessType: string) =>
  z.object({
    legalBusinessName:
      businessType !== "unregister"
        ? z
          .string()
          .nonempty("Business name is required")
          .regex(
            allowedBusinessNameRegex,
            "Business name contains invalid characters"
          )
        : z
          .string()
          .optional()
          .transform((data) => (data === "" ? undefined : data))
          .refine(
            (val) => !val || allowedBusinessNameRegex.test(val),
            "Business name contains invalid characters"
          ),
    industry: CategoriesListSchema,
    website: z
      .string()
      .regex(
        /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/,
        "Please provide official company website"
      )
      .optional()
      .or(z.literal(""))
      .transform((data) => (data === "" ? undefined : data)),
    productBrief: z
      .string()
      .nonempty("Please describe your product or service")
      .regex(
        /^[a-zA-Z0-9\s.,&-]+$/,
        "Product description can only contain letters, numbers, spaces, commas, periods, hyphens, and '&'"
      ),
  });

export const phoneNumberSchema = z.object({
  countryCode: z
    .string()
    .startsWith("+", { message: "Country code must start with +" })
    .min(2, { message: "Invalid country code" }),

  number: z
    .string()
    .min(5, { message: "Phone number is too short" })
    .max(15, { message: "Phone number is too long" })
    .regex(/^\d+$/, { message: "Phone number must contain only digits" }),
});

export const contactInformationSchema = z.object({
  businessPhoneNo: phoneNumberSchema,
  businessEmail: z
    .string()
    .nonempty("Email is required")
    .email("Invalid email format"),
  businessAddress: z.object({
    addressLine: z.string().nonempty("Address is required"),
    city: z.string().nonempty("City is required"),
    state: z.string().nonempty("State is required"),
    pinCode: z
      .string()
      .nonempty("PIN Code is required")
      .regex(/^\d{4,10}$/, "Invalid PIN Code"),
    country: z.object({
      name: z
        .string({ required_error: "Country is required" })
        .nonempty("Country is required"),
      code: z.string().nonempty("Country code is required"),
    }),
  }),
});

export const businessRepresentativeSchema = (businessType: string) =>
  z.object({
    jobTitle:
      businessType !== "unregister"
        ? z.string().nonempty("Job Title  is required")
        : z
          .string()
          .optional()
          .transform((data) => (data === "" ? undefined : data)),

    firstName: z.string().nonempty("First name is required"),
    middleName: z
      .string()
      .optional()
      .transform((val) => (val?.trim() === "" ? undefined : val)),
    lastName: z.string().nonempty("Last name is required"),
    workEmail: z
      .string()
      .nonempty("Email is required")
      .email("Invalid email format"),
    workPhoneNo: phoneNumberSchema,
  });

const nameRegex = /^[a-zA-Z\s]*$/;

export const sourcingDetailsSchema = z.object({
  firstName: z
    .string()
    .nonempty("First name is required")
    .regex(nameRegex, "First name must not include special characters"),

  middleName: z
    .string()
    .optional()
    .transform((val) => (val?.trim() === "" ? undefined : val))
    .refine((val) => !val || nameRegex.test(val), {
      message: "Middle name must not include special characters",
    }),

  lastName: z
    .string()
    .nonempty("Last name is required")
    .regex(nameRegex, "Last name must not include special characters"),

  workEmail: z.string().nonempty("Email is required").email("Invalid email"),
  industry: CategoriesListSchema,
  mainProducts: z
    .array(
      z
        .string()
        .trim()
        .max(100, "Each product name must be less than 100 characters")
        .regex(/^[A-Za-z]+(?: [A-Za-z]+)*$/, "Only letters and spaces are allowed")
    )
    .min(1, "At least one product is required"),

  website: z
    .string()
    .regex(
      /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/,
      "Please provide official company website."
    )
    .optional()
    .or(z.literal(""))
    .transform((data) => (data === "" ? undefined : data)),
  legalBusinessName: z
    .string()
    .optional()
    .transform((data) => (data === "" ? undefined : data)),
});
