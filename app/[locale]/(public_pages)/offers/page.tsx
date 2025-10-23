import PageBarTitle from "@/app/[locale]/_components/Common/PageBarTitle";
import { OfferComponent } from "@/app/[locale]/_components/MarketComponents/Offers/OfferComponent";
import BarImage from "@/public/img/page-bar-img.svg";
export default async function OffersPage() {
  return (
    <div className="p-l-m-t-body">
      <PageBarTitle name={'Sell Offers'} image={BarImage}/>
      <OfferComponent />
    </div>
  );
}
