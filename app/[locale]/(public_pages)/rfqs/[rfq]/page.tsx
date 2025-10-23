import { RfqDetailPage } from "@/app/[locale]/_components/MarketComponents/Requests/RfqDetailPage";
import { RfqData } from "@/app/[locale]/_interface/MarketPlaceInterface";

type Props = {
  params: Promise<{ rfq: string; locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale, rfq } = await params;
  const domain = "https://pepagora.com";
  return {
    title: `${rfq} | Pepagora`,
    description: `Request made for quote in  ${rfq}.`,
    alternates: {
      canonical: `${domain}/${locale}/rfqs/${(await params).rfq}`,
    },
  };
}

const page = async ({ params }: Props) => {
  const id = (await params).rfq;

  let rfqData: RfqData;

  // try {
  //   const response = await serverFetcher(`get-buying-request/${id}`);
  //   rfqData = response.data;
  //   if (!rfqData) throw new Error("Invalid data");
  // } catch (error) {
  //   // handle fallback or 404
  //   console.error("Failed to fetch rfq:", error);
  //   return <>Something went wrong..</>;
  // }

  return (
    <>
      <RfqDetailPage id={id} />
    </>
  );
};

export default page;
