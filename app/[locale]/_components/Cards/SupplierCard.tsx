import { getImageUrl } from "@/app/[locale]/_hooks/utility";
import Image from "next/image";
import React, { useState } from "react";
import tueBasic from "../../../../public/img/TruBasic.svg";
import trueVerified from "../../../../public/img/true-verified.png";
import {
  SupplierListItemInterface,
  TopProduct,
} from "../../_interface/MarketPlaceInterface";
// import ButtonIcon from "@/app/[locale]/_components/Buttons/ButtonIcon";
import Buttons from "@/app/[locale]/_components/Buttons/Buttons";
import AlertDialog from "@/app/[locale]/_components/OverLay/AlertDialog";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

interface SupplierListProps {
  supplier: SupplierListItemInterface;
  // supplier: SupplierListInterface;
}
const SupplierCard: React.FC<SupplierListProps> = ({ supplier }) => {
  const t = useTranslations("categoryPage.supplier");
  const [contactSupplier, setContactSupplier] = useState(false);
  

const handleSupplierContact = () => {
  if (supplier?.isCatalogPublished) {
    window.open(`/en/${supplier?.subDomain}`, "_blank");
  } else {
    setContactSupplier(true);
  }
};

  return (
    <div className="supplier-card-comp floating-bottom-hover">
      <div className="company-info">
        {supplier?.companyLogo?.src && (
          <div className="c-i-img">
            <Image
              src={
                supplier?.companyLogo?.src
                  ? `${process.env.NEXT_PUBLIC_BUCKET_URL ||
                  "https://pepupload.s3.ap-southeast-1.amazonaws.com/"
                  }${supplier.companyLogo.src}`
                  : "/default-logo.png"
              }
              width={48}
              height={48}
              sizes="100vw"
              alt={
                supplier?.companyLogo?.alt == "" ||
                  supplier?.companyLogo?.alt == undefined
                  ? supplier?.companyLogo?.src
                  : supplier?.companyLogo?.alt
              }
            ></Image>
          </div>
        )}

        <div className="c-i-details">
          <span
            className="c-i-d-title cursor-pointer"
            onClick={handleSupplierContact}
          >
            {supplier?.businessName ?? "Company Name"}
          </span>
          <div className="company-meta-badge">
            {supplier?.kybVerification && supplier?.uboVerification ? (
              <div className="c-m-b-item">
                <Image
                  src={trueVerified}
                  width={78}
                  height={15}
                  alt="Verified"
                  sizes="100vw"
                ></Image>
              </div>
            ) : (
              supplier?.kycVerified && (
                <div className="c-m-b-item">
                  <Image
                    src={tueBasic}
                    width={78}
                    height={15}
                    alt="Verified"
                    sizes="100vw"
                  ></Image>
                </div>
              )
            )}

            {supplier?.businessLocation && (
              <div className="c-m-b-item">
                <Image
                  src={`https://flagcdn.com/w320/${supplier?.businessLocation?.code.toLowerCase()}.png`}
                  width={19}
                  height={12}
                  alt={supplier?.businessLocation?.code ?? "country"}
                  sizes="100vw"
                ></Image>
                <span className="c-m-b-i-country">
                  {supplier?.businessLocation?.name}
                </span>
              </div>
            )}

            <div className="c-m-b-item">
              {/* <span className="c-m-b-i-txt">{supplier?.businessInfo?.years ?? "--"} yrs</span> */}
              <span className="c-m-b-i-txt">
                {supplier?.years ? `${supplier?.years} yrs` : ""}
              </span>
            </div>
          </div>
        </div>
      </div>
      {supplier?.topProducts?.length > 0 ? (
        <div className="product-image-card-group-comp">
          {supplier.topProducts?.map((item: TopProduct, index: number) => {
            return (
              item?.image !== null && (
                <div className="p-i-c-g-c-item" key={index}>
                  <div className="p-i-c-g-c-i-img">
                    <Image
                      src={getImageUrl(item?.image?.src ?? "")}
                      width={140}
                      height={135}
                      alt={
                        item?.image?.alt === "" ||
                          item?.image?.alt === undefined
                          ? item?.image?.src
                          : item?.image?.alt
                      }
                      sizes="100vw"
                    />
                  </div>
                  <span className="p-i-c-g-c-i-txt">{item.productName}</span>
                </div>
              )
            );
          })}
        </div>
      ) : null}
      <div className="floating-bottom-wrapper">
        <div className="floating-block">
          {/* <ButtonIcon
            className={"b-c-i-outline b-c-i-dark b-c-i-rounded b-c-i-sm"}
          >
            <ChatIcon />
          </ButtonIcon> */}
          {/* <Buttons
            onClick={() => {}}
            className={"btn-outline bg-outline-dark btn-c-sm"}
            text={t("contact")}
          /> */}
          <Buttons
            onClick={handleSupplierContact}
            className={"btn-c-primary btn-c-sm"}
            text={t("profile")}
          />
        </div>
      </div>
      <AlertDialog
        visible={contactSupplier}
        subTxt="Catalog of Supplier is not Published Yet"
        continueOnclick={() => {
          setContactSupplier(false);
        }}
      />
    </div>
  );
};

export default SupplierCard;
