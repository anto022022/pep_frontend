type ProductTabKeyType =
  | "description"
  | "specifications"
  | "applications"
  | "tradeDetail"
  | "paymentTerms"
  | "shippingLogistics"
  | "certificates";

interface ProductTabItemInterface {
  key: ProductTabKeyType;
  label: string;
}
