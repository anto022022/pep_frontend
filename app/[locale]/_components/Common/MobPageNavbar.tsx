import { type OverlayPanel as OverlayPanelType } from "primereact/overlaypanel";
import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import AllCategory from "@/app/[locale]/_components/Common/Navbar/AllCategory";
import CurrencySelectInput from "@/app/[locale]/_components/Common/Navbar/CurrencySelectInput";
import ProfileWithMenus from "@/app/[locale]/_components/Common/Navbar/ProfileWithMenus";
import REQCart from "@/app/[locale]/_components/Common/Navbar/REQCart";
import { MenuIcon } from "@/app/[locale]/_components/Icons/SVGIcons";
import LanguageSelectInputs from "@/app/[locale]/_components/StoreFront/Forms/LanguageSelectInputs";
import useCookies from "@/app/[locale]/_hooks/useCookies";
import { useLazyGetRfqCartListQuery } from "@/app/[locale]/_store/apiReducer/rfqCartApi";
import { useAppSelector } from "@/app/[locale]/_store/store";
import Logo from "@/public/img/site-logo.svg";


interface MobPageNavbarProps {
  path: string;
  title: string;
  onClick?: () => void;
}

const MobPageNavbar: React.FC<MobPageNavbarProps> = (props) => {
  const { path, title, onClick } = props;
  const op = useRef<OverlayPanelType | null>(null);
  const [rfqCartList, { data: rfqCartData }] = useLazyGetRfqCartListQuery();
  const cookies = useCookies();
  const currencyCode = cookies.getCookie("currencyCode");
  const cartItemCount = useAppSelector((state) => state.userData.cartCount);
  const total = rfqCartData?.data?.length ?? "No Items";
  const [isCategoryActive, setIsCategoryActive] = useState<boolean>(false);

  // Check if we're on the home page
  const isHomePage =
    path === "/" ||
    path === "./" ||
    path === "" ||
    path === "/en" ||
    path === "/en";

  const handleCategoryActive = () => {
    setIsCategoryActive((prev) => !prev);
  };
  return (
    <>
      <div className="mob-page-navbar-comp">
        <div className="m-p-n-c-left">
          {/* <Link href={path} onClick={onClick}>
            <ChevronLeftIcon />
          </Link> */}
          {/* {!isHomePage && (
            <Typography className='m-b-n-c-l-title' variant='h1'>
              {title}
            </Typography>
          )} */}
          <div
            onClick={handleCategoryActive}
            className="p-icon-text-link  p-all-categories"
            id="p-all-categories"
          >
            
            <MenuIcon />
            <span>All Categories</span>
          </div>
          {/* <Link href={"/"} className="site-logo-head">
            <Image src={Logo} alt="Logo" width={"125"} height={23}></Image>
          </Link> */}
        </div>
        <div className="m-p-n-c-right">
          {/* <SearchIcon className='search-icon' /> */}
          {/* <CartIcon /> */}
          {/* <LanguageSelectInputs /> */}
          {/* <REQCart /> */}
          {/* <CurrencySelectInput /> */}
          <ProfileWithMenus />
        </div>
      </div>
      <AllCategory
        isCategoryActive={isCategoryActive}
        setIsCategoryActive={handleCategoryActive}
      />
    </>
  );
};

export default MobPageNavbar;
