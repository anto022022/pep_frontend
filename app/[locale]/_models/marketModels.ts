export const productTabKeyToFields: Record<string, string[]> = {
  description: ["description"],
  specifications: [
    "attributes",
    "brandName",
    "skuCode",
    "countryOfOrigin",
    "isCustomizable",
  ],
  applications: ["productApplications"],
  tradeDetail: ["productionCapacity", "samplesAvailability"], // example nested
  paymentTerms: ["paymentTerms"],
  certificates: ["certificates"],
  shippingLogistics: [
    "shippingMethod",
    "internationalShipping",
    "incoTerms",
    "portOfDispatch",
    "shippingUnit",
    "shippingQty",
    "shipmentIdentifier",
    "productionLeadTime",
  ],
};

export const rfqTabKeyToFields:Record<string,string[]> ={
  buyingPreference:[
    "preferredSourcingRegion",
    "expectedDeliveryTime",
    "destinationPort",
    "supplyContractType",
    "paymentTerms"
  ],
  customization:[
    "customizationRequired",
    "sampleRequired"
  ]
}
