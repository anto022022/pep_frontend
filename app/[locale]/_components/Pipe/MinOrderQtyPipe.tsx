import {
  OfferInfo,
  OfferType,
} from "@/app/[locale]/_interface/SellOfferInterface";

interface MinOrderQtyPipeProps {
  minOrderQty: number;
  offerInfo?: OfferInfo;
}

const MinOrderQtyPipe = ({
  minOrderQty = 1,
  offerInfo,
}: MinOrderQtyPipeProps) => {
  if (offerInfo && offerInfo?.offerType === OfferType.LOW_MOQ) {
    return offerInfo?.minQty ?? minOrderQty;
  }
  if (offerInfo && (offerInfo?.minQty ?? 1) < minOrderQty) {
    return offerInfo?.minQty ?? minOrderQty;
  }
  return minOrderQty;
};

export default MinOrderQtyPipe;
