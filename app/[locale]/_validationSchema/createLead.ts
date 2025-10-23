import * as z from "zod";
import {
  CreateLead,
  LeadStage,
  LeadSource,
  LeadContactPermission,
} from "../_interface/LeadsInterface";

export const postLeadsSchema: z.ZodType<CreateLead> = z.object({
  contactName: z
    .string()
    .max(100, "Contact name must be at most 100 characters")
    .nonempty("Contact name is required"),

  email: z
    .string()
    .email({ message: "Invalid email address" })
    .max(50, "Email must be at most 50 characters") // RFC standard limit
    .nonempty("Email is required"),

  phoneNo: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits")
    .regex(/^[0-9]+$/, "Phone number must contain only numbers")
    .nonempty("Phone number is required"),
  jobTitle: z
    .string()
    .max(100, "Job Title must be at most 100 characters")
    .optional(),
  companyName: z
    .string()
    .max(100, "Company name must be at most 100 characters")
    .optional(),
  customerId: z.string().optional(),
  interestProductIds: z
    .array(
      z.object({
        productId: z.string(),
        productName: z.string().optional(),
      })
    )
    .optional(),
  requirementDetails: z
    .string()
    .max(500, "Requirement Details must be at most 500 characters")
    .optional(),
  stage: z.nativeEnum(LeadStage),
  source: z.nativeEnum(LeadSource),
  permission: z.nativeEnum(LeadContactPermission),
  isArchived: z.boolean().optional(),
  isDraft: z.boolean().optional(),
});
