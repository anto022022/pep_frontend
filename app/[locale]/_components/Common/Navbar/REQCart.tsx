"use client";
import Typography from "@/app/[locale]/_components/Base/Typography";
import Buttons from "@/app/[locale]/_components/Buttons/Buttons";
import CartItems from "@/app/[locale]/_components/Common/Navbar/CartItems";
import CartSnippet from "@/app/[locale]/_components/Common/Navbar/CartSnippet";
import { RFQIcon } from "@/app/[locale]/_components/Icons/SVGIcons";
import { checkUserSessionAndRedirect } from "@/app/[locale]/_hooks/checkUserSession";
import {
  useGetRfqCartCountQuery,
  useLazyGetRfqCartListQuery,
} from "@/app/[locale]/_store/apiReducer/rfqCartApi";
import { setCartCount } from "@/app/[locale]/_store/reducers/user_store";
import { useAppDispatch, useAppSelector } from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OverlayPanel } from "primereact/overlaypanel";
import React, { useEffect, useRef } from "react";

const REQCart = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const op = useRef<OverlayPanel>(null);
  const cartItemCount = useAppSelector((state) => state.userData.cartCount);
  const isLoggedIn = useAppSelector((state) => state.userData.isLoggedIn);
  const t = useTranslations("common.navbar");

  const currencyCode = useAppSelector((state) => state.location.currency);

  const [rfqCartList, { data: rfqCartData }] = useLazyGetRfqCartListQuery();
  const { data, isSuccess } = useGetRfqCartCountQuery(undefined, {
    skip: !isLoggedIn,
  });
  const total = rfqCartData?.data?.length ?? 0;

  useEffect(() => {
    if (isSuccess && data !== undefined) {
      dispatch(setCartCount(data?.data ?? 0));
    }
  }, [isSuccess, data]);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    checkUserSessionAndRedirect({
      authenticated: () => {
        op.current?.toggle(e);
        rfqCartList({ rfqType: "short", currencyCode: currencyCode ?? "" });
      },
      onUnauthenticated: () => {
        router.push("/authenticate");
      },
    });
  };

  return (
    <div className="rfq-summary-block">
      <div className="rfq-cart-trigger" onClick={handleClick}>
        <RFQIcon />
        {cartItemCount ? (
          <span className="r-c-t-count">{cartItemCount}</span>
        ) : null}
      </div>
      <OverlayPanel ref={op} className="rfq-summary-overlay">
        <div className="rfq-summary-dropdown-block">
          <Typography variant="span" className="r-s-d-b-title">
            {total ? t("rfqListTotal", { count: total }) : t("rfqNoData")}
          </Typography>
          <div className="order-summary-item-block">
            {rfqCartData?.data.map((item: any) => {
              return (
                <CartItems
                  selectedVariants={item?.selectedVariants}
                  variants={item?.variants}
                  currency={item?.productInfo?.currency}
                  totalOrderQuantity={item?.totalOrderQuantity}
                  offer={item?.offerDetails?.pricing}
                  key={item._id}
                  productInfoPricing={item?.productInfo}
                >
                  <CartSnippet
                    productInfo={item?.productInfo}
                    businessName={item?.businessInfo?.businessName}
                    key={item._id}
                  />
                </CartItems>
              );
            })}
          </div>
          <Link href={"/enquiry-cart"} onClick={() => op.current?.hide()}>
            <Buttons className={"btn-c-primary"} text={t("goToRfqBtn")} />
          </Link>
        </div>
      </OverlayPanel>
    </div>
  );
};

export default REQCart;
