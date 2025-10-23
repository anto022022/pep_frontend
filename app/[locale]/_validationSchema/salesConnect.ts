import { CustomerSource } from "@/app/[locale]/_interface/CustomerInterface";
import { countryOfOriginSchema } from "@/app/[locale]/_validationSchema/salesProduct";
import * as z from "zod";
export const SourceSchema = z
  .object({
    label: z.string().nonempty({ message: "Source label is required" }),
    value: z.string().nonempty({ message: "Source Value is required" }),
  })
  .strict();

export const addNewContactSchema = z.object({
  contactName: z
    .string()
    .min(1, "Contact name is required")
    .max(100, { message: "Contact Name must not exceed 100 characters" }),
  companyName: z
    .string()
    .min(1, "Company name is required")
    .max(100, { message: "Company Name must not exceed 100 characters" }),
  email: z
    .string()
    .min(10, "Invalid email address")
    .email("Invalid email address"),
  phoneNo: z.object({
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
  whatsAppNo: z.object({
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

  country: countryOfOriginSchema,
  source: z.enum(
    Object.values(CustomerSource) as [CustomerSource, ...CustomerSource[]],
    { required_error: " Source must be selected" }
  ),
});
