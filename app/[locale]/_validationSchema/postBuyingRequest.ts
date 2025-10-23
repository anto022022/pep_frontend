import * as z from "zod";
import {
  PreferredSourcingRegion,
  DeliveryTimeType,
  PaymentTerms,
  ShippingMethod,
  SourcingFrequency,
} from "../_interface/RfqInterface";

export const productNameSchema = z
  .string()

  .nonempty({ message: "Product Name is required" })
  .min(3, { message: "Product Name must be at least 3 characters" })
  .max(100, { message: "Product Name must not exceed 100 characters" })
  .regex(/^[a-zA-Z0-9\s]+$/, {
    message: "Product Name must not contain special characters (%,$,@)",
  })
  .refine((val) => val !== val.toUpperCase(), {
    message: "Product Name must not be in all caps",
  });

const categorySchema = z
  .object({
    _id: z.string().optional(),
    uniqueId: z.string().optional(),
    name: z.string().optional(),
  })
  .refine(
    (val) => {
      const isEmpty = !val._id && !val.name;
      const isValid = !!val._id && !!val.name;
      return isEmpty || isValid;
    },
    {
      message: "Both ID and name are required when category is filled",
    }
  )
  .optional();
const categorySuggestionSchema = z
  .object({
    industry: z.string().optional(),
    reason: z.string().optional(),
    suggestedCategory: z.string().optional(),
  })
  .optional();

export const currencySchema = z.object({
  code: z.string().nonempty({ message: "Currency is required" }),
  name: z.string().nonempty({ message: "Currency is required" }),
  symbol: z.string().nonempty({ message: "Currency is required" }),
});

// export const postRequestDetailsSchema: z.ZodType<CreateBuyingRequest> = z
//   .object({
//     productName: productNameSchema,
//     category: categorySchema.optional(),
//     subCategory: categorySchema.optional(),
//     productCategory: categorySchema.optional(),
//     categorySuggestion: categorySuggestionSchema.optional(),
//     productDescription: z.string().optional(),
//     additionalBuyingReqDetails: z.string().optional(),
//     rfqTitle: z.string().nonempty("RFQ Title is required"),
//     validityDate: z.date({
//       required_error: "RFQ date is required",
//       invalid_type_error: "Invalid  date",
//     }),
//     preferredUnitPrice: z.object({
//       currency: currencySchema,
//       priceRange: z.object({
//         minPrice: z
//           .number({ required_error: "MinPrice is required" })
//           .min(0, { message: "MinPrice must be greater than 0" }),
//         maxPrice: z
//           .number({ required_error: "MaxPrice is required" })
//           .min(0, { message: "MaxPrice must be greater than 0" }),
//       }),
//     }),

//     estOrderQuantity: z.object({
//       quantity: z
//         .number({ required_error: "Estimated Order Quantity is required" })
//         .min(0, { message: "Estimated Order Quantity is required" }),
//       unit: z
//         .string()
//         .nonempty({ message: "Estimated Order Quantity Unit is required" }),
//     }),

//     preferredSourcingRegion: z.nativeEnum(PreferredSourcingRegion).optional(),
//     preferredSourcingCountry: z.string().optional(),
//     preferredSourcingCity: z.string().optional(),
//     expectedDeliveryTime: z.nativeEnum(DeliveryTimeType).optional(),
//     destinationPort: z.string().optional(),
//     paymentTerms: z.nativeEnum(PaymentTerms).optional(),
//     supplyContractType: z.string().optional(),
//     shippingMethod: z.array(z.nativeEnum(ShippingMethod)).optional(),
//     annualPurchaseVolume: z
//       .object({
//         min: z.string().optional(),
//         max: z.string().optional(),
//       })
//       .optional(),
//     sourcingFrequency: z.nativeEnum(SourcingFrequency).optional(),
//     sampleRequired: z.boolean().optional(),
//     customizationRequired: z.boolean().optional(),
//     customizationDetails: z.string().optional(),
//     isDraft: z.boolean(),
//     productImage: z
//       .array(
//         z.object({
//           src: z.string(),
//           alt: z.string(),
//           exten: z.string(),
//           size: z.number(),
//         })
//       )
//       .optional(),
//   })
//   .refine(
//     (data) => {
//       const hasSelected = !!data.category?._id && !!data.subCategory?._id;
//       const hasSuggested =
//         !!data.categorySuggestion?.industry &&
//         !!data.categorySuggestion?.reason &&
//         !!data.categorySuggestion?.suggestedCategory;
//       return hasSelected || hasSuggested;
//     },
//     {
//       message: "Either select Category & SubCategory or fill Suggest Category",
//       path: ["formError"],
//     }
//   );



export const postBuyingRequestSchema = z
  .object({
    rfqTitle: z.string().nonempty("Title is required"),
    productName: productNameSchema,
    category: categorySchema,
    subCategory: categorySchema,
    productCategory: categorySchema,
    categorySuggestion: categorySuggestionSchema.optional(),

    productDescription: z.string().nonempty("Product Description is required"),
    additionalBuyingReqDetails: z.string().optional(),

    validityDate: z
      .date({ required_error: "Validity Date is required" })
      .refine((val) => val > new Date(), {
        message: "Date must be in the future",
      })
      .refine(
        (val) => {
          const today = new Date();
          const maxDate = new Date();
          maxDate.setDate(today.getDate() + 30);
          return val <= maxDate;
        },
        {
          message: "Date cannot be more than 30 days from today",
        }
      ),

    estOrderQuantity: z.object({
      quantity: z
        .number({ required_error: "Estimated Order Quantity is required" })
        .min(1, { message: "Quantity must be greater than 0" }),
      unit: z
        .string()
        .nonempty({ message: "Estimated Order Quantity Unit is required" }),
    }),

    preferredUnitPrice: z.object({
      currency: currencySchema,
      priceRange: z
        .object({
          minPrice: z
            .number({ required_error: "MinPrice is required" })
            .min(1, { message: "MinPrice must be at least 0" }),
          maxPrice: z
            .number({ required_error: "MaxPrice is required" })
            .min(1, { message: "MaxPrice must be at least 0" }),
        })
        .refine((data) => data.maxPrice >= data.minPrice, {
          message: "MaxPrice must be greater than or equal to MinPrice",
          path: ["maxPrice"],
        }),
    })
  })
  .refine(
    (data) => {
      const hasSelected = !!data.category?._id && !!data.subCategory?._id;
      const hasSuggested =
        !!data.categorySuggestion?.industry &&
        !!data.categorySuggestion?.reason &&
        !!data.categorySuggestion?.suggestedCategory;
      return hasSelected || hasSuggested;
    },
    {
      message: "Either select Category & SubCategory or fill Suggest Category",
      path: ["formError"],
    }
  );



export const postRequestDetailsSchema = z
  .object({
    rfqTitle: z.string().nonempty("Title is required"),
    productName: productNameSchema,
    category: categorySchema,
    subCategory: categorySchema,
    productCategory: categorySchema,
    categorySuggestion: categorySuggestionSchema.optional(),

    productDescription: z.string().optional(),
    additionalBuyingReqDetails: z.string().optional(),
    validityDate: z.preprocess(
      (val) => {
        if (val instanceof Date) return val;
        if (typeof val === "string") return new Date(val);
        return undefined;
      },
      z.date({
        required_error: "Validity Date is required",
        invalid_type_error: "Invalid date format",
      })
    )
    .refine((val) => val > new Date(), {
      message: "Date must be in the future",
    })
    .refine((val) => {
      const today = new Date();
      const maxDate = new Date();
      maxDate.setDate(today.getDate() + 30);
      return val <= maxDate;
    }, {
      message: "Date cannot be more than 30 days from today",
    })
,    
  

    estOrderQuantity: z.object({
      quantity: z
        .number({ required_error: "Estimated Order Quantity is required" })
        .min(1, { message: "Quantity must be greater than 0" }),
      unit: z
        .string()
        .nonempty({ message: "Estimated Order Quantity Unit is required" }),
    }),

    preferredUnitPrice: z.object({
      currency: currencySchema,
      priceRange: z
        .object({
          minPrice: z
            .number({ required_error: "MinPrice is required" })
            .min(1, { message: "MinPrice must be at least 0" }),
          maxPrice: z
            .number({ required_error: "MaxPrice is required" })
            .min(1, { message: "MaxPrice must be at least 0" }),
        })
        .refine((data) => data.maxPrice >= data.minPrice, {
          message: "MaxPrice must be greater than or equal to MinPrice",
          path: ["maxPrice"],
        }),
    }),

    productImage: z.array(z.object({
      src: z.string(),
      alt: z.string(),
      exten: z.string(),
      size: z.number(),
    })).optional(),

    preferredSourcingRegion: z.nativeEnum(PreferredSourcingRegion).optional(),
    preferredSourcingCountry: z.string().optional(),
    preferredSourcingCity: z.string().optional(),
    expectedDeliveryTime: z.nativeEnum(DeliveryTimeType).optional(),
    destinationPort: z.string().optional(),
    supplyContractType: z.string().optional(),
    paymentTerms: z.nativeEnum(PaymentTerms).optional(),
    shippingMethod: z.array(z.nativeEnum(ShippingMethod)).optional(),
    annualPurchaseVolume: z.object({
      min: z.string().optional(),
      max: z.string().optional(),
    }).optional(),
    sourcingFrequency: z.nativeEnum(SourcingFrequency).optional(),
    sampleRequired: z.boolean().optional(),
    customizationRequired: z.boolean().optional(),
    customizationDetails: z.string().optional(),
    isDraft: z.boolean({ required_error: "Draft status is required" }),

  }).superRefine((data, ctx) => {
    if (data.customizationRequired && !data.customizationDetails) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Customization details are required when customization is enabled.",
        path: ["customizationDetails"], // highlight field in error
      });
    };
  })
  .refine(
    (data) => {
      const hasSelected = !!data.category?._id && !!data.subCategory?._id;
      const hasSuggested =
        !!data.categorySuggestion?.industry &&
        !!data.categorySuggestion?.reason &&
        !!data.categorySuggestion?.suggestedCategory;
      return hasSelected || hasSuggested;
    },
    {
      message: "Either select Category & SubCategory or fill Suggest Category",
      path: ["formError"],
    }
  );
