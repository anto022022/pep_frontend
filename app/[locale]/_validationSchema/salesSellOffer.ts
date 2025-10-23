import * as z from "zod";
import { PricingType } from "../_models/StoreFront";
import { OfferType } from "../_models/sales/sellOffer";
import { countryOfOriginSchema, currencySchema } from "./salesProduct";

const BulkPriceSchema = z.object({
  minQty: z.number({ required_error: "minQty is required" }),
  maxQty: z.number({ required_error: "maxQty is required" }),
  price: z.number({ required_error: "price is required" }),
});

const pricingSchema = z.object({
  pricingType: z.nativeEnum(PricingType, {
    required_error: "pricingType is required",
  }),
  unitPrice: z.number().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  unit: z
    .string()
    .transform((val) => (val.trim() === "" ? undefined : val))
    .optional(),
  bulkPrices: z
    .array(BulkPriceSchema)
    .transform((data) => (data.length > 0 ? data : undefined))
    .optional(),
});

export const OfferInfoSchema = z
  .object({
    offerType: z.nativeEnum(OfferType, {
      required_error: "offerType is required",
    }),
    discountPercent: z
      .number()
      .min(1, "Must be at least 1%")
      .max(99, "Must be at most 99%")
      .optional(),
    minOrderQuantity: z.number().optional(),
    minQty: z.number().min(1, "Must be more than 0").optional(),
    maxQty: z.number().min(1, "Must be more than 0").optional(),
    unit: z.string().nonempty({ message: "Unit is required" }),
    currency: currencySchema.optional(),
    pricing: pricingSchema.optional(),
    buyQty: z.number().optional(),
    freeQty: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    const {
      offerType,
      discountPercent,
      minQty,
      maxQty,
      minOrderQuantity,
      pricing,
      buyQty,
      freeQty,
    } = data;

    if (!offerType) return;

    if (discountPercent !== undefined && discountPercent > 100) {
      ctx.addIssue({
        path: ["discountPercent"],
        code: z.ZodIssueCode.custom,
        message: "discountPercent can not exceed 100%",
      });
    }

    if (offerType !== OfferType.BUY_MORE && minOrderQuantity === undefined) {
      ctx.addIssue({
        path: ["minOrderQuantity"],
        code: z.ZodIssueCode.custom,
        message: "minOrderQuantity is required",
      });
    }

    if (
      offerType === OfferType.FIXED_DISCOUNT ||
      offerType === OfferType.LIMITED_TIME
    ) {
      if (discountPercent === undefined) {
        ctx.addIssue({
          path: ["discountPercent"],
          code: z.ZodIssueCode.custom,
          message: "discountPercent is required",
        });
      }
      if (!pricing) {
        ctx.addIssue({
          path: ["pricing"],
          code: z.ZodIssueCode.custom,
          message: "pricing is required",
        });
      }
    }

    if (minQty !== undefined && maxQty !== undefined && minQty >= maxQty) {
      ctx.addIssue({
        path: ["minQty"],
        code: z.ZodIssueCode.custom,
        message: "minQty must be less than maxQty",
      });
    }
    if (offerType === OfferType.LOW_MOQ) {
      if (minQty === undefined) {
        ctx.addIssue({
          path: ["minQty"],
          code: z.ZodIssueCode.custom,
          message: "minQty is required",
        });
      }
      if (minQty && minOrderQuantity && minQty > minOrderQuantity) {
        ctx.addIssue({
          path: ["minQty"],
          code: z.ZodIssueCode.custom,
          message: "minQty must be less than actual MOQ",
        });
      }
    }

    if (offerType === OfferType.BUY_MORE) {
      if (buyQty === undefined) {
        ctx.addIssue({
          path: ["buyQty"],
          code: z.ZodIssueCode.custom,
          message: "buyQty is required",
        });
      }
      if (freeQty === undefined) {
        ctx.addIssue({
          path: ["freeQty"],
          code: z.ZodIssueCode.custom,
          message: "freeQty is required",
        });
      }
    }

    if (pricing?.pricingType) {
      const { pricingType, unitPrice, minPrice, maxPrice, bulkPrices, unit } =
        pricing;

      if (pricingType === PricingType.FIXED && unitPrice === undefined) {
        ctx.addIssue({
          path: ["pricing", "unitPrice"],
          code: z.ZodIssueCode.custom,
          message: "unitPrice is required",
        });
      }

      if (pricingType === PricingType.PRICE_RANGE) {
        if (minPrice === undefined) {
          ctx.addIssue({
            path: ["pricing", "minPrice"],
            code: z.ZodIssueCode.custom,
            message: "minPrice is required",
          });
        }
        if (maxPrice === undefined) {
          ctx.addIssue({
            path: ["pricing", "maxPrice"],
            code: z.ZodIssueCode.custom,
            message: "maxPrice is required",
          });
        }
      }

      if (pricingType === PricingType.BULK) {
        if (!bulkPrices || bulkPrices.length === 0) {
          ctx.addIssue({
            path: ["pricing", "bulkPrices"],
            code: z.ZodIssueCode.custom,
            message: "bulkPrices is required",
          });
        }
        if (!unit) {
          ctx.addIssue({
            path: ["pricing", "unit"],
            code: z.ZodIssueCode.custom,
            message: "unit is required",
          });
        }
      }
    }
  });

const today = new Date();
const oneYearFromToday = new Date();
oneYearFromToday.setFullYear(today.getFullYear() + 1);
today.setHours(0, 0, 0, 0);

export const offerDetailsScheme = z
  .object({
    offerTitle: z.string().nonempty({ message: "Offer Title is required" }),
    offerDescription: z
      .string()
      .nonempty({ message: "Offer Description is required" }),
    offerInfo: OfferInfoSchema,
    keyword: z
      .array(z.string())
      .transform((data) => (data.length > 0 ? data : undefined))
      .optional(),
    marketFocus: z
      .array(countryOfOriginSchema)
      .transform((data) => (data.length > 0 ? data : undefined))
      .optional(),
    offerStartDate: z
      .date({
        required_error: "Offer start date is required",
        invalid_type_error: "Invalid start date",
      })
      .refine((date) => date >= today, {
        message: "Offer start date cannot be in the past",
      }),
    offerEndDate: z
      .date({
        required_error: "Offer end date is required",
        invalid_type_error: "Invalid end date",
      })
      .refine((date) => date >= today, {
        message: "Offer end date cannot be in the past",
      }),
    immediateStart: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.offerEndDate <= data.offerStartDate) {
      const message = "Offer end date must be after start date";
      ctx.addIssue({
        path: ["offerStartDate"],
        code: z.ZodIssueCode.custom,
        message,
      });
      ctx.addIssue({
        path: ["offerEndDate"],
        code: z.ZodIssueCode.custom,
        message,
      });
    }

    // 2. Must be within 30 days from start date
    const maxAllowedEnd = new Date(data.offerStartDate);
    maxAllowedEnd.setDate(maxAllowedEnd.getDate() + 30);

    if (data.offerEndDate > maxAllowedEnd) {
      ctx.addIssue({
        path: ["offerEndDate"],
        code: z.ZodIssueCode.custom,
        message: "Offer end date cannot be more than 30 days from start date",
      });
    }

    if (data.offerInfo?.offerType === OfferType.LIMITED_TIME) {
      const diffInMs =
        data.offerEndDate.getTime() - data.offerStartDate.getTime();
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

      if (diffInDays > 15) {
        ctx.addIssue({
          path: ["offerEndDate"],
          code: z.ZodIssueCode.custom,
          message: "For limited offers, the duration must not exceed 15 days",
        });
      }
    }
  });

// Enums
export enum PaymentTerm {
  ADVANCE_100 = "ADVANCE_100",
  ADVANCE_50_DISPATCH_50 = "ADVANCE_50_DISPATCH_50",
  NET_30_60 = "NET_30_60",
  LC = "LC",
  ESCROW = "ESCROW",
  COD = "COD",
  CUSTOM = "CUSTOM",
}

// Dispatch Lead Time Schema

// Main Schema
// export const dispatchLeadTimeSchema = z
//   .object({
//     min_day: z.number().nullable().optional(),
//     max_day: z.number().nullable().optional(),
//   })
//   .transform((val) => val.min_day == null && val.max_day == null ? undefined : val)
//   .optional();

export const dispatchLeadTimeSchema = z
  .object({
    min_day: z.union([z.number(), z.null()]).optional(),
    max_day: z.union([z.number(), z.null()]).optional(),
  })
  .transform((val) =>
    val.min_day == null && val.max_day == null ? undefined : val
  )
  .optional();

export const paymentShippingSchema = z
  .object({
    internationalShipping: z.enum(["yes", "no", "uponRequest"]),

    shippingMethod: z
      .array(z.string())
      .min(1, { message: "At least one shipping method must be selected" }),

    dispatchLeadTime: dispatchLeadTimeSchema,

    paymentMethods: z
      .array(z.string())
      .min(1, { message: "At least one payment method must be selected" }),
    paymentTerms: z
      .array(
        z.enum(Object.values(PaymentTerm) as [PaymentTerm, ...PaymentTerm[]]),
        {
          invalid_type_error: "Invalid payment term",
        }
      )
      .optional(),

    otherPaymentMethod: z.string().optional(),
    customPaymentTerm: z.string().optional(),
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
      data.paymentTerms?.includes(PaymentTerm.CUSTOM) &&
      !data.customPaymentTerm?.trim()
    ) {
      ctx.addIssue({
        path: ["customPaymentTerm"],
        code: z.ZodIssueCode.custom,
        message: "Required",
      });
    }
  });
// .superRefine((val, ctx) => {
//   if (val.paymentMethods?.includes("others")) {
//     ctx.addIssue({
//       code: z.ZodIssueCode.custom,
//       path: ["otherPaymentMethod"],
//       message: "Other Payment Method is required if payment method is others",
//     });
//   }

//   if (val.paymentTerms?.includes(PaymentTerm.CUSTOM)) {
//     ctx.addIssue({
//       code: z.ZodIssueCode.custom,
//       path: ["customPaymentTerm"],
//       message: "Custom Payment Term is required if payment term is CUSTOM",
//     });
//   }
// });
