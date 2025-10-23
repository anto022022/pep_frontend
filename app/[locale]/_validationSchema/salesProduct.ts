import * as z from "zod";
import { Incoterms, PaymentTerm, PricingType } from "../_models/StoreFront";

export const productNameSchema = z
  .string()

  .nonempty({ message: "Product Name is required" })
  .min(3, { message: "Product Name must be at least 3 characters" })
  .max(100, { message: "Product Name must not exceed 100 characters" })
  // .regex(/^[a-zA-Z0-9\s]+$/, {
  //   message: "Product Name must not contain special characters (%,$,@)",
  // })
  .refine((val) => val !== val.toUpperCase(), {
    message: "Product Name must not be in all caps",
  });

export const productKeywordSchema = z
  .array(z.string().nonempty("Keyword cannot be empty"))
  .min(1, { message: "At least one keyword is required" });

// export const categorySchema = z.union([
//     z.object({
//         _id: z.string().nonempty({ message: "ID is required" }),
//         value: z.string().nonempty({ message: "Value is required" }),
//     }),
//     z.string().nonempty({ message: "Category is required" }), // Allow strings
// ]);

// export const categorySchema = z.object({
//   _id: z.string().nonempty({ message: "Category ID is required" }),
//   name: z.string().nonempty({ message: "Category name is required" }),
// });

// export const categorySuggestionSchema = z.object({
//   industry: z.string(),
//   reason: z.string(),
//   suggestedCategory: z.string(),
// });

// export const salesProductInformationSchema = z
//   .object({
//     productName: productNameSchema,
//     category: categorySchema.optional(),
//     subCategory: categorySchema.optional(),
//     productCategory: categorySchema.optional(),
//     categorySuggestion: categorySuggestionSchema.optional(),
//     productGroup: z.string().optional(),
//     productBrochure: z.string().optional(),
//   })
//   .refine(
//     (data) => {
//       return !!data.category || !!data.categorySuggestion;
//     },
//     {
//       message: "Please select the categories",
//       path: ["category"],
//     }
//   );

// Category: only validate _id and name if the object is not empty

// Category structure - validated only if used

export const categorySchema = z
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
    industry: z.string().nonempty("Industry is required"),
    reason: z.string().nonempty("Reason is required"),
    suggestedCategory: z.string().nonempty("Suggested category is required"),
  })
  .partial()
  .refine(
    (val) => {
      const isEmpty = !val.industry && !val.reason && !val.suggestedCategory;
      const isValid = !!val.industry && !!val.reason && !!val.suggestedCategory;
      return isEmpty || isValid;
    },
    {
      message: "All suggest category fields are required when used",
    }
  )
  .optional();

export const productImageSchema = z
  .array(
    z.object({
      src: z.string().nonempty({ message: "src is required" }),
      alt: z.string(),
      exten: z.string().nonempty({ message: "Extension is required" }),
      size: z
        .number({ required_error: "Size is required" })
        .min(1, { message: "File size must be greater than 1" }),
    })
  )
  .min(1, { message: "At least one image is required." })
  .max(7, { message: "Maximum  images allowed." });

export const productBrochureSchema = z.object({
  src: z.string(),
  alt: z.string(),
  exten: z.string(),
  size: z.number(),
});

export const safeProductBrochureSchema = z.preprocess((val) => {
  // Accept undefined, null, or empty object as undefined
  if (
    val === undefined ||
    val === null ||
    (typeof val === "object" && Object.keys(val).length === 0)
  ) {
    return undefined;
  }
  return val;
}, productBrochureSchema.optional());

export const countryOfOriginSchema = z
  .object({
    name: z.string().nonempty({ message: "Country name is required" }),
    code: z.string().nonempty({ message: "Country code is required" }),
  })
  .strict();

export const salesProductInformationSchema = z
  .object({
    productName: productNameSchema,
    category: categorySchema,
    subCategory: categorySchema,
    productCategory: categorySchema,
    categorySuggestion: categorySuggestionSchema.optional(), // If optional in TS
    productBrochure: safeProductBrochureSchema, // ✅ Make optional
    productDescription: z
      .string()
      .nonempty({ message: "Description is required" })
      .max(300, {
        message: " Description must not exceed 300 characters",
      }),
    productImage: productImageSchema,
    skuCode: z
      .string()
      .regex(/^[A-Z0-9]+$/, {
        message:
          "The SKU code should contain only uppercase letters and numbers (no lowercase letters).",
      })
      .optional(),
    countryOfOrigin: countryOfOriginSchema,
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

export const productDescriptionSchema = z
  .string()
  .nonempty({ message: "Product Description is required" })
  .min(150, { message: "Product Description must be at least 150 characters" })
  .max(5000, {
    message: "Product Description must not exceed 5000 characters",
  });

export const productVideoSchema = z
  .string()
  .transform((val) => (val.trim() === "" ? undefined : val))
  .optional();

export const descriptiveMediaSchema = z.object({
  productDescription: productDescriptionSchema,
  productImage: productImageSchema,
  productVideo: productVideoSchema,
});

export const PricingTypeEnum = z.enum(
  Object.values(PricingType) as [string, ...string[]]
);

const fixedPriceSchema = z.object({
  pricingType: z.literal(PricingType.FIXED),
  // unitPrice: z.preprocess(
  //   (val) => (val === "" || val === null ? undefined : val),
  //   z
  //     .number({ required_error: "Unit price is required" })
  //     .min(1, { message: "Unit price is required" })
  // ),
  unitPrice: z.preprocess((val) => {
    if (val === "" || val === null || val === undefined) return undefined;
    const num = Number(val);
    if (isNaN(num)) return undefined;
    return parseFloat(num.toFixed(2));
  }, z.number({ required_error: "Unit price is required" }).min(1, "Unit price must be greater than 1")),
});

// Price range schema
const priceRangeSchema = z
  .object({
    pricingType: z.literal(PricingType.PRICE_RANGE),
    minPrice: z.preprocess(
      (val) => (val === "" || val === null ? undefined : val),
      z
        .number({ required_error: "Minimum price is required" })
        .min(1, { message: "Minimum price is required" })
    ),
    maxPrice: z.preprocess(
      (val) => (val === "" || val === null ? undefined : val),
      z
        .number({ required_error: "Maximum price is required" })
        .min(1, { message: "Maximum price is required" })
    ),
  })
  .refine(
    (data) =>
      data.minPrice === undefined ||
      data.maxPrice === undefined ||
      data.minPrice < data.maxPrice,
    {
      message: "Minimum price must be less than maximum price",
      path: ["maxPrice"],
    }
  );

// Bulk pricing schema
const bulkPriceItemSchema = z
  .object({
    minQty: z.preprocess(
      (val) => (val === "" || val === null ? undefined : val),
      z
        .number({ required_error: "Min Quantity is required" })
        .min(1, { message: "Min Quantity must be ≥ 1" })
    ),
    maxQty: z.preprocess(
      (val) => (val === "" || val === null ? undefined : val),
      z
        .number({ required_error: "Max Quantity is required" })
        .min(1, { message: "Max Quantity must be ≥ 1" })
    ),
    price: z.preprocess((val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      const num = Number(val);
      if (isNaN(num)) return undefined;
      return parseFloat(num.toFixed(2));
    }, z.number({ required_error: "Price is required" }).min(1, { message: "Price must be ≥ 1" })),
  })
  .refine(
    (data) =>
      data.minQty === undefined ||
      data.maxQty === undefined ||
      data.minQty < data.maxQty,
    {
      message: "maxQty must be greater minQty",
      path: ["maxQty"],
    }
  );

const bulkPricingSchema = z
  .object({
    pricingType: z.literal(PricingType.BULK),
    unit: z.string().nonempty({ message: "Unit is required" }),
    bulkPrices: z
      .array(bulkPriceItemSchema)
      .min(1, { message: "At least one bulk price is required" }),
  })
  .transform((data) => ({
    ...data,
    bulkPrices: [...data.bulkPrices].sort((a, b) => a.minQty - b.minQty),
  }))
  .superRefine((data, ctx) => {
    const ranges = data.bulkPrices.map((p) => [p.minQty, p.maxQty]);

    // Sort ranges by minQty
    ranges.sort((a, b) => a[0] - b[0]);

    for (let i = 0; i < ranges.length; i++) {
      const [minA, maxA] = ranges[i];

      for (let j = i + 1; j < ranges.length; j++) {
        const [minB, maxB] = ranges[j];

        const isOverlap = minB <= maxA && maxB >= minA;
        if (isOverlap) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Bulk price ranges must not overlap or be repeated.",
            path: ["bulkPrices"],
          });
          return;
        }
      }
    }
  });

// Negotiable price schema
const negotiablePriceSchema = z.object({
  pricingType: z.literal(PricingType.NEGOTIABLE),
});

// Request quote schema
const requestQuoteSchema = z.object({
  pricingType: z.literal(PricingType.REQUEST_QUOTE),
});

// Final union schema
export const pricingSchema = z.union([
  fixedPriceSchema,
  priceRangeSchema,
  bulkPricingSchema,
  negotiablePriceSchema,
  requestQuoteSchema,
]);

//OfferProductDetailsFormSchema
export const currencySchema = z.object({
  code: z
    .string({ required_error: "Currency is required" })
    .nonempty({ message: "Currency is required" }),
  name: z
    .string({ required_error: "Currency is required" })
    .nonempty({ message: "Currency is required" }),
  symbol: z
    .string({ required_error: "Currency is required" })
    .nonempty({ message: "Currency is required" }),
});

export const offerProductDetailsSchema = z
  .object({
    productName: productNameSchema,
    category: categorySchema,
    subCategory: categorySchema,
    productCategory: categorySchema,
    categorySuggestion: categorySuggestionSchema.optional(),
    productDescription: z.string().nonempty("Description is required"),
    // .regex(/^[a-zA-Z0-9\s.,'-]+$/, {
    //   message: "Description must not contain special characters",
    // }),
    productImage: productImageSchema,
    brandName: z
      .string()
      .max(150, { message: "Brand Name must not exceed 150 characters" })
      .transform((val) => (val.trim() === "" ? undefined : val)),
    currency: currencySchema,
    pricing: pricingSchema,
    minOrderQuantity: z
      .number({ required_error: "Minimum Order Quantity is required" })
      .min(1, { message: "Minimum Order Quantity is required" }),
    moqUnit: z
      .string()
      .nonempty({ message: "Minimum Order Quantity Unit is required" }),
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

export const AttributeValueSchema = z.object({
  name: z.string(),
  isSelected: z.boolean(),
  isRemoved: z.boolean(),
});

export const AttributeSchema = z.object({
  key: z.string(),
  values: z.array(AttributeValueSchema),
  isSuggested: z.boolean(),
  isValid: z.number(),
});

export const VariantAttributeSchema = z.object({
  key: z.string(),
  values: z.array(z.string()),
});

const unavailableVariantSchema = z.object({
  _id: z
    .string()
    .transform((val) => (val.trim() === "" ? undefined : val))
    .optional(),
  variantName: z.string().nonempty("Variant Name is required"),
  variantImg: z.array(
    z.object({
      src: z.string().nonempty({ message: "src is required" }),
      alt: z.string(),
      exten: z.string().nonempty({ message: "Extension is required" }),
      size: z
        .number({ required_error: "Size is required" })
        .min(1, { message: "File size must be greater than 1" }),
    })
  ),
  pricing: z.any().optional(),
  attributes: z.record(z.string()),
  available: z.literal(false),
  skuCode: z
    .string()
    // .regex(/^[A-Z0-9]+$/, {
    //   message:
    //     "The SKU code should contain only uppercase letters and numbers (no lowercase letters).",
    // })
    .optional(),
  minOrderQuantity: z
    .number()
    .min(1, { message: "Minimum Order Quantity is required" })
    .optional(),
  moqUnit: z
    .string()
    .transform((val) => (val.trim() === "" ? undefined : val))
    .optional(),
});

const availableVariantSchema = z.object({
  _id: z.string().optional(),
  variantName: z.string().nonempty("Variant Name is required"),
  variantImg: productImageSchema,
  pricing: pricingSchema,
  attributes: z.record(z.string()),
  available: z.literal(true),
  skuCode: z
    .string()
    .regex(/^[A-Z0-9]+$/, {
      message:
        "The SKU code should contain only uppercase letters and numbers (no lowercase letters).",
    })
    .optional(),
  minOrderQuantity: z
    .number({ required_error: "Minimum order quantity is required" })
    .min(1, { message: "Minimum Order Quantity is required" }),
  moqUnit: z
    .string()
    .nonempty({ message: "Minimum order quantity unit is required" }),
});

// export const VariantSchema = z
//   .object({
//     _id: z.string().optional(),
//     variantName: z.string().nonempty("Variant Name is required"),
//     variantImg: z.array(
//       z.object({
//         src: z.string().nonempty({ message: "src is required" }),
//         alt: z.string(),
//       })
//     ),
//     pricing: z.any().optional(),
//     attributes: z.record(z.string()),
//     available: z.boolean(),
//     skuCode: z.string().optional(),
//     minOrderQuantity: z.number().min(0, { message: "Minimum Order Quantity is required" }).optional(),
//     moqUnit: z.string().optional(),
//   })
//   .superRefine((data, ctx) => {
//     if (data.available) {
//       if (!data.variantImg || data.variantImg.length === 0) {
//         ctx.addIssue({
//           path: ["variantImg"],
//           code: z.ZodIssueCode.custom,
//           message: "At least one image is required when available is true",
//         });
//       }

//       if (!data.pricing) {
//         ctx.addIssue({
//           path: ["pricing"],
//           code: z.ZodIssueCode.custom,
//           message: "Pricing is required when available is true",
//         });
//       } else {
//         // Validate the contents of pricing if present
//         const result = pricingSchema.safeParse(data.pricing);
//         if (!result.success) {
//           for (const issue of result.error.issues) {
//             ctx.addIssue({
//               ...issue,
//               path: ["pricing", ...(issue.path ?? [])], // correctly nest issues in pricing
//             });
//           }
//         }
//       }

//       if (!data.skuCode || data.skuCode.trim() === "") {
//         ctx.addIssue({
//           path: ["skuCode"],
//           code: z.ZodIssueCode.custom,
//           message: "SKU Code is required when available is true",
//         });
//       }

//       if (data.minOrderQuantity === undefined || data.minOrderQuantity === null) {
//         ctx.addIssue({
//           path: ["minOrderQuantity"],
//           code: z.ZodIssueCode.custom,
//           message: "Minimum Order Quantity is required when available is true",
//         });
//       }

//       if (!data.moqUnit || data.moqUnit.trim() === "") {
//         ctx.addIssue({
//           path: ["moqUnit"],
//           code: z.ZodIssueCode.custom,
//           message: "MOQ Unit is required when available is true",
//         });
//       }
//     }
//   });

export const VariantSchema = z.union([
  availableVariantSchema,
  unavailableVariantSchema,
]);

export const attributesVariantSchema = z.object({
  attributes: z.array(AttributeSchema),
  variantAttributes: z.array(VariantAttributeSchema),
  variants: z.array(VariantSchema),
});

export const variantsArraySchema = z.object({
  variants: z.array(VariantSchema), // VariantSchema must match Variant type
});

export const descriptiveSpecificationSchema = z.object({
  detailedDescription: z
    .string()
    .max(25000, {
      message: "Detailed description must not exceed 25000 characters",
    })
    .transform((val) => (val.trim() === "" ? undefined : val))
    .optional(),
  productApplications: z
    .string()
    .max(4000, {
      message: "Product applications must not exceed 4000 characters",
    })
    .transform((val) => (val.trim() === "" ? undefined : val))
    .optional(),
});

const productCapacitySchema = z
  .object({
    quantity: z.number().optional(),
    unit: z.string().optional(),
    duration: z.string().optional(),
  })
  .transform((val) => (Object.keys(val).length === 0 ? undefined : val))
  .optional()
  .superRefine((data, ctx) => {
    if (!data) return; // If the whole object is undefined, it's valid

    const { quantity, unit, duration } = data;
    const filledFields = [quantity, unit, duration].filter(
      (value) => value !== undefined && value !== "" && value !== 0
    ).length;

    if (filledFields > 0 && filledFields < 3) {
      if (quantity === undefined || quantity === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["quantity"],
          message: "Quantity is required ",
        });
      }
      if (!unit) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["unit"],
          message: "Unit is required ",
        });
      }
      if (!duration) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["duration"],
          message: "Duration is required ",
        });
      }
    }
  });

const productionLeadTimeSchema = z
  .object({
    unit: z.string().optional(),
    min_day: z.number().optional(),
    max_day: z.number().optional(),
    min_quantity: z.number().optional(),
    max_quantity: z.number().optional(),
  })
  .superRefine((val, ctx) => {
    if (!val || Object.keys(val).length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Production lead time is required",
        path: [], // optional, defaults to object level
      });
    }
  });

export const SampleAvailabilityEnum = z.enum([
  "free",
  "refundable",
  "paid",
  "noSample",
]);

// export const availabilityOriginSchema = z.object({
//   brandName: z
//     .string()
//     .max(100, { message: "Brand Name must not exceed 100 characters" })
//     .optional(),
//   productionCapacity: productCapacitySchema,
//   stockAvailability: z.enum(["outOfStock", "inStock"]).optional(),
//   countryOfOrigin: z
//     .object({
//       name: z.string().nonempty({ message: "Country name is required" }),
//       code: z.string().nonempty({ message: "Country code is required" }),
//     })
//     .strict(),
//     productionLeadTime:productionLeadTimeSchema,
// });

export const dispatchLeadTimeSchema = z.object({
  min_day: z.number().nullable().optional(),
  max_day: z.number().nullable().optional(),
});
export const availabilityOriginSchema = z.object({
  productionCapacity: productCapacitySchema,

  stockAvailability: z.enum(["outOfStock", "inStock"], {
    required_error: "Stock availability is required",
    invalid_type_error: "Invalid stock availability value",
  }),
  productionLeadTime: productionLeadTimeSchema,

  samplesAvailability: z
    .object({
      availabilityType: SampleAvailabilityEnum,
      samplePrice: z.number().optional(),
      sampleUnit: z.string().optional(),
      sampleLeadTime: dispatchLeadTimeSchema.optional(),
    })
    .superRefine((data, ctx) => {
      const { availabilityType, samplePrice, sampleUnit, sampleLeadTime } =
        data;
      const requiresFields = ["paid", "refundable"].includes(availabilityType);

      if (requiresFields) {
        if (!samplePrice) {
          ctx.addIssue({
            path: ["samplePrice"],
            code: z.ZodIssueCode.custom,
            message: "Sample price is required",
          });
        }

        if (!sampleUnit) {
          ctx.addIssue({
            path: ["sampleUnit"],
            code: z.ZodIssueCode.custom,
            message: "Sample unit is required",
          });
        }

        if (!sampleLeadTime) {
          ctx.addIssue({
            path: ["sampleLeadTime"],
            code: z.ZodIssueCode.custom,
            message: "Sample lead time is required",
          });
        }
      }
    }),
});

export const productCapacityPricingSchema = z.object({
  currency: currencySchema,
  pricing: pricingSchema,
  minOrderQuantity: z
    .number({ required_error: "Minimum Order Quantity is required" })
    .min(1, { message: "Minimum Order Quantity is required" }),
  moqUnit: z
    .string()
    .nonempty({ message: "Minimum Order Quantity Unit is required" }),
});

export const paymentDeliverySchema = z
  .object({
    paymentMethods: z
      .array(z.string())
      .min(1, { message: "At least one payment method must be selected" }),
    paymentTerms: z
      .enum(Object.values(PaymentTerm) as [PaymentTerm, ...PaymentTerm[]])
      .optional(),
    otherPaymentMethod: z
      .string()
      .transform((val) => (val.trim() === "" ? undefined : val))
      .optional(),
    customPaymentTerm: z
      .string()
      .transform((val) => (val.trim() === "" ? undefined : val))
      .optional(),
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
        message: "Required",
      });
    }
  });

export const productionLeadTimeOptionSchema = z.object({
  // _id: z.string().optional(),
  min_day: z.number(),
  max_day: z.number(),
  min_quantity: z.number(),
  max_quantity: z.number(),
});

export const shippingDetailsSchema = z
  .object({
    internationalShipping: z
      .string()
      .nonempty("Please select International Shipping"),
    shippingMethod: z
      .array(z.string())
      .min(1, { message: "At least one shipping method must be selected" }),
    incoTerms: z.enum(Object.values(Incoterms) as [string, ...string[]], {
      required_error: "Incoterms required",
      invalid_type_error: "Incoterms required",
    }),
    portOfDispatch: z
      .string()
      .transform((val) => (val.trim() === "" ? undefined : val))
      .optional(),
    shippingUnit: z.string().optional(),
    shippingQty: z
      .number()
      .min(1, "Unit per package must be greater than 1")
      .optional(),
    shipmentIdentifier: z.string().optional(),
    dispatchLeadTime: dispatchLeadTimeSchema,
  })
  .superRefine((data, ctx) => {
    if (
      data.dispatchLeadTime.max_day === undefined ||
      data.dispatchLeadTime.min_day === undefined
    ) {
      ctx.addIssue({
        path: ["dispatchLeadTime"],
        code: z.ZodIssueCode.custom,
        message: "Dispatch Lead Time is required",
      });
    }
  });

export const faqSchema = z
  .object({
    question: z.string(),
    answer: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.question && !data.answer) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Answer is required when question is provided",
        path: ["answer"],
      });
    }
    if (data.answer && !data.question) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Question is required when answer is provided",
        path: ["question"],
      });
    }
  });

const CertificateSchema = z
  .object({
    name: z.string().optional(),
    src: z.string().optional(),
    alt: z.string().optional(),
    exten: z.string().optional(),
    size: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    const { name, src, alt, exten, size } = data;

    // Helper to check if a value is "provided"
    const isProvided = (v: unknown) =>
      v !== undefined &&
      v !== null &&
      !(typeof v === "string" && v.trim() === "") &&
      !(typeof v === "number" && isNaN(v));

    const otherFields = [src, alt, exten, size];

    // Rule 1: If name is given, all others should be given
    if (isProvided(name) && otherFields.some((v) => !isProvided(v))) {
      ["src", "alt", "exten", "size"].forEach((field) => {
        if (!isProvided(data[field as keyof typeof data])) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Certificate file is required when name is provided`,
            path: [field],
          });
        }
      });
    }

    // Rule 2: If any others are given, name should be given
    if (!isProvided(name) && otherFields.every((v) => isProvided(v))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Name is required when other fields are provided",
        path: ["name"],
      });
    }
  });

// FAQ schema (assuming you have it)
// const faqSchema = z.object({
//   question: z.string().nonempty({ message: "Question is required" }),
//   answer: z.string().nonempty({ message: "Answer is required" }),
// });

// Main form schema
export const additionalDetailsSchema = z
  .object({
    isCustomizable: z.boolean(),

    customization: z.array(z.string().nonempty("Required")).optional(),

    brandName: z
      .string()
      .max(150, { message: "Brand Name must not exceed 150 characters" })
      .optional(),

    faqs: z
      .array(faqSchema)
      .max(5, { message: "Maximum five FAQs can be filled" })
      .transform((val) => {
        const cleaned = val.filter(
          (v) => v.question.trim() !== "" || v.answer.trim() !== ""
        );
        return cleaned.length === 0 ? undefined : cleaned;
      })
      .optional(),

    productGroup: z
      .string()
      .transform((val) => (val.trim() === "" ? undefined : val))
      .optional(),

    certificates: z.array(CertificateSchema).transform((data) => {
      // helper to check if object has at least one provided value
      const isProvided = (val: unknown) =>
        val !== undefined &&
        val !== null &&
        !(typeof val === "string" && val.trim() === "") &&
        !(typeof val === "number" && isNaN(val)); // 0 is allowed

      // keep only objects with at least one provided field
      const filtered = data.filter((v) => Object.values(v).every(isProvided));

      return filtered.length > 0 ? filtered : [];
    }),
    productVideo: safeProductBrochureSchema,

    youtubeUrl: z
      .union([
        z.string().url({ message: "Invalid YouTube URL" }),
        z.literal(""),
      ])
      .optional(),

    productKeyword: z.array(z.string().nonempty("Keyword cannot be empty")),
  })
  .superRefine((data, ctx) => {
    if (
      data.isCustomizable &&
      (!data.customization || data.customization.length === 0)
    ) {
      ctx.addIssue({
        path: ["customization"],
        code: z.ZodIssueCode.custom,
        message: "Customization must have at least one item",
      });
    }
  });

export const ProductionLeadTimeItemSchema = z.object({
  productionLeadTime: z.array(
    z
      .object({
        min_day: z
          .union([z.string(), z.number()])
          .refine((val) => !isNaN(Number(val)), {
            message: "Min day must be a number",
          }),
        max_day: z
          .union([z.string(), z.number()])
          .refine((val) => !isNaN(Number(val)), {
            message: "Max day must be a number",
          }),
        min_quantity: z
          .union([z.string(), z.number()])
          .refine((val) => !isNaN(Number(val)), {
            message: "Min quantity must be a number",
          }),
        max_quantity: z
          .union([z.string(), z.number()])
          .refine((val) => !isNaN(Number(val)), {
            message: "Max quantity must be a number",
          }),
        unit: z.string().min(1, "Unit is required"),
      })
      .refine((data) => Number(data.max_day) > Number(data.min_day), {
        message: "Max day must be greater than Min day",
        path: ["max_day"],
      })
      .refine((data) => Number(data.max_quantity) > Number(data.min_quantity), {
        message: "Max quantity must be greater than Min quantity",
        path: ["max_quantity"],
      })
  ),
});
