import Button from "@/app/[locale]/_components/Buttons/Button";
import {
  SupplierListItemInterface,
  TopProduct,
} from "@/app/[locale]/_interface/MarketPlaceInterface";
import tueBasic from "@/public/img/TruBasic.svg";
import trueVerified from "@/public/img/true-verified.png";
import Image from "next/image";
import { FC, useState } from "react";

import AlertDialog from "@/app/[locale]/_components/OverLay/AlertDialog";
import { getImageUrl } from "@/app/[locale]/_hooks/utility";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

interface SupplierDetailsProps {
  supplier: SupplierListItemInterface;
  // supplier: SupplierListInterface;
}
const SupplierDetails: FC<SupplierDetailsProps> = ({ supplier }) => {
  const router = useRouter();
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
    <div className="supplier-details-card">
      <div className="s-d-c-body">
        <div className="s-d-c-b-left">
          <div className="company-info">
            {supplier?.companyLogo?.src && (
              <div className="c-i-img">
                <Image
                  src={
                    supplier?.companyLogo?.src
                      ? `${
                          process.env.NEXT_PUBLIC_BUCKET_URL ||
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
                {supplier?.businessName ?? "Company name"}
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
                      alt={supplier?.businessLocation?.name}
                      sizes="100vw"
                    ></Image>
                    <span className="c-m-b-i-country">
                      {supplier?.businessLocation?.name}
                    </span>
                  </div>
                )}
                {supplier?.years && (
                  <div className="c-m-b-item">
                    <span className="c-m-b-i-txt">{supplier?.years} yrs</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="supplier-features-list">
            <div className="s-f-l-item">
              <span className="s-f-l-i-txt s-f-l-i-label">
                {t("businessType")}
              </span>
              {supplier?.businessTypeSpecific?.length > 0 ? (
                <span className="s-f-l-i-txt s-f-l-i-value">
                  {supplier?.businessTypeSpecific?.join(", ")}
                </span>
              ) : (
                <span className="s-f-l-i-txt s-f-l-i-value">--</span>
              )}
            </div>
            <div className="s-f-l-item">
              <span className="s-f-l-i-txt s-f-l-i-label">
                {t("mainProducts")}
              </span>
              {supplier?.mainProducts?.length > 0 ? (
                <span className="s-f-l-i-txt s-f-l-i-value">
                  {supplier?.mainProducts?.join(", ")}
                </span>
              ) : (
                <span className="s-f-l-i-txt s-f-l-i-value">--</span>
              )}
            </div>
            <div className="s-f-l-item">
              <span className="s-f-l-i-txt s-f-l-i-label">{t("contract")}</span>
              {supplier?.contractManufacturing?.length > 0 ? (
                <span className="s-f-l-i-txt s-f-l-i-value">
                  {supplier?.contractManufacturing?.join(", ")}
                </span>
              ) : (
                <span className="s-f-l-i-txt s-f-l-i-value">--</span>
              )}
            </div>
            <div className="s-f-l-item">
              <span className="s-f-l-i-txt s-f-l-i-label">
                {t("mainMarkets")}
              </span>
              {supplier?.mainMarkets?.length > 0 ? (
                <span className="s-f-l-i-txt s-f-l-i-value">
                  {supplier?.mainMarkets?.map((item) => item.name).join(", ")}
                </span>
              ) : (
                <span className="s-f-l-i-txt s-f-l-i-value">--</span>
              )}
            </div>
            <div className="s-f-l-item">
              <span className="s-f-l-i-txt s-f-l-i-label">
                {t("employees")}
              </span>

              <span className="s-f-l-i-txt s-f-l-i-value">
                {supplier?.noOfEmployees ?? "--"}
              </span>
            </div>
          </div>
        </div>
        <div className="s-d-c-b-right">
          {supplier?.topProducts?.length > 0 ? (
            <div className="product-image-card-group-comp">
              {supplier?.topProducts?.map((item: TopProduct, index: number) => {
                return (
                  item?.image !== null && (
                    <div className="p-i-c-g-c-item" key={index}>
                      <div className="p-i-c-g-c-i-img">
                        <Image
                          src={getImageUrl(item?.image?.src) ?? ""}
                          width={140}
                          height={135}
                          alt={item?.image?.alt}
                          sizes="100vw"
                        ></Image>
                      </div>
                      <span className="p-i-c-g-c-i-txt">
                        {item?.productName}
                      </span>
                    </div>
                  )
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
      <div className="s-d-c-footer">
        {/* <div className="s-d-c-f-left trusted-img-group">
          <Image
            src={trusted1}
            alt="Trusted"
            width={30}
            height={30}
            sizes="100vw"
          ></Image>
          <Image
            src={trusted2}
            alt="Trusted"
            width={24}
            height={24}
            sizes="100vw"
          ></Image>
          <Image
            src={trusted3}
            alt="Trusted"
            width={32}
            height={32}
            sizes="100vw"
          ></Image>
        </div> */}
        <div className="s-d-c-f-right">
          {/* <ButtonIcon className={"b-c-i-outline b-c-i-dark b-c-i-rounded"}>
            <ChatIcon />
          </ButtonIcon>
          <Button
            className={"btn-outline bg-outline-dark"}
            text={"Contact Supplier"}
          /> */}

          <Button
            onClick={handleSupplierContact}
            className={"btn-c-primary"}
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

export default SupplierDetails;
