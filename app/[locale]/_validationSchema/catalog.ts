import * as z from "zod";
export const ownerName = z
  .string()
  .nonempty({ message: "Legal Owner Name is required" })
  .min(3, { message: "Legal Owner Name be at least 3 characters" })
  .max(100, { message: "Legal Owner Name must not exceed 100 characters" })
  .regex(/^[a-zA-Z0-9\s]+$/, {
    message: "Legal Owner Namemust not contain special characters (%,$,@)",
  })
  .refine((val) => val !== val.toUpperCase(), {
    message: "Legal Owner Name must not be in all caps",
  });
export const businessType = z
  .string()
  .nonempty({ message: "Legal Status is required" })
  .min(3, { message: "Legal Status must be at least 3 characters" })
  .max(100, { message: "Legal Status must not exceed 100 characters" })
  .regex(/^[a-zA-Z0-9\s\/\-'']+$/, {
    message:
      "Legal Status may only contain letters, numbers, spaces, /, -, and '",
  })
  .refine((val) => val !== val.toUpperCase(), {
    message: "Legal Status must not be in all caps",
  });
export const businessTypeSchema = z
  .array(
    z
      .string()
      .nonempty({ message: "Business Type is required" })
      .min(3, { message: "Business Type must be at least 3 characters" })
      .max(100, { message: "Business Type must not exceed 100 characters" })
      .regex(/^[a-zA-Z0-9\s\/\-']+$/, {
        message:
          "Business Type may only contain letters, numbers, spaces, /, -, and '",
      })
      .refine((val) => val !== val.toUpperCase(), {
        message: "Business Type must not be in all caps",
      })
  )
  .min(1, { message: "Select at least one Business Type" });

export const CategoriesListSchema = z.object({
  _id: z.string().min(1, { message: "Industry is required" }),
  uniqueId: z.string().min(1, { message: "uniqueId is required" }),
  name: z.string().min(1, { message: "name is required" }),
});

export const industrySchema = z.object({
  _id: z.string().min(1, { message: "Industry ID is required" }),
  uniqueId: z.string().min(1, { message: "Unique ID is required" }),
  name: z.string().min(1, { message: "name is required" }),
  liveUrl: z.string().optional(),
});
export const catalogHomepageSchema = z.object({
  ownerName: ownerName,
  businessType: businessType,
  businessTypeSpecific: businessTypeSchema,
  industry: CategoriesListSchema,
});

export const CatalogSupplierSchema = z.object({
  supplierName: z.string().nonempty({ message: "Name is required" }),
  supplierEmail: z.string().nonempty({ message: "Email is required" })
    .email("Invalid email address")
    .transform((val) => val.toLowerCase()),
  supplierMobileNo: z.object({
    countryCode: z.string()
      .nonempty({ message: "Mobile Number Country code is required" }),
    number: z.string()
      .nonempty({ message: "Mobile Number is required" })
      .regex(/^\d+$/, "Mobile number must contain only digits")
      .min(10, "Minium 10 Digits need to enter")
      .max(15, "Maximum 15 Digits only"),
  }),
  supplierCountry: z.object({
    name: z.string().nonempty({ message: "Country name is required" }),
    code: z.string().nonempty({ message: "Country code is required" }),
    // name: z.string().optional(),
    // code: z.string().optional(),
  }),
  supplierMessage: z.string()
    .nonempty({ message: "Message is required" })
    .max(5000, { message: "Message must be 5000 characters or fewer" })
});
