import { z } from "zod";

export const sendMessageSchema = z.object({
  subject: z.string().min(1, "Subject is required").max(100, "Subject must be less than 100 characters"),
  content: z.string().min(1, "Message content is required").max(1000, "Message must be less than 1000 characters"),
  to: z.array(z.string()).min(1, "At least one recipient is required"),
  cc: z.array(z.string()).optional(),
  bcc: z.array(z.string()).optional(),
  attachment: z.array(z.any()).optional(),
});

export type SendMessageFormData = z.infer<typeof sendMessageSchema>;