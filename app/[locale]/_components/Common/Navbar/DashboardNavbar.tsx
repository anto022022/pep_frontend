"use client";
import Buttons from "@/app/[locale]/_components/Buttons/Buttons";
import AllCategory from "@/app/[locale]/_components/Common/Navbar/AllCategory";
import CurrencySelectInput from "@/app/[locale]/_components/Common/Navbar/CurrencySelectInput";
import ProfileWithMenus from "@/app/[locale]/_components/Common/Navbar/ProfileWithMenus";
import REQCart from "@/app/[locale]/_components/Common/Navbar/REQCart";
import SearchDropdown from "@/app/[locale]/_components/Common/SearchDropdown";
import CountryFlag from "@/app/[locale]/_components/Pipe/CountryFlag";
import LanguageSelectInputs from "@/app/[locale]/_components/StoreFront/Forms/LanguageSelectInputs";
import useCookies from "@/app/[locale]/_hooks/useCookies";
import { RootState, useAppSelector } from "@/app/[locale]/_store/store";
import Logo from "@/public/img/site-logo.svg";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MenuIcon } from "../../Icons/SVGIcons";

const DashboardNavbar = ({
  searchDropdown = true,
  isActive = false,
}: {
  searchDropdown?: boolean;
  isActive?: boolean;
}) => {
  const cookies = useCookies();
  const [userSession, setUserSession] = useState(false);
  const [isCategoryActive, setIsCategoryActive] = useState<boolean>(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const categoryButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userSession = cookies.getCookie("userSession");
    if (userSession) setUserSession(true);
  }, []);

  // Handle click outside to close category menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isCategoryActive &&
        categoryRef.current &&
        !categoryRef.current.contains(event.target as Node) &&
        categoryButtonRef.current &&
        !categoryButtonRef.current.contains(event.target as Node)
      ) {
        setIsCategoryActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCategoryActive]);

  const countryFlag = useAppSelector(
    (state: RootState) => state.location.country_code
  );
  const userData = useAppSelector((state: RootState) => state.userData);
  const t = useTranslations("common.navbar");
  const router = useRouter();
  const handleCategoryActive = () => {
    setIsCategoryActive((prev) => !prev);
  };

  const handleRfqRoute = () => {
    alert(`userSession${userSession}`);
    if (userSession) {
      router.push("app/sourcing-rfq");
    } else {
      router.push("/authenticate");
    }
  };

  return (
    <>
      <div className={`dashboard-navbar-comp ${isActive ? "active" : ""}`}>
        <div className="d-n-c-left">
          {searchDropdown && (
            <Link href={"/"} className="site-logo-head">
              <Image src={Logo} alt="Logo" width={"125"} height={23}></Image>
            </Link>
          )}

          {/* <div className="all-category-wrap"> */}
          <div
            ref={categoryButtonRef}
            onClick={handleCategoryActive}
            className="p-icon-text-link  p-all-categories"
            id="p-all-categories"
          >
            <MenuIcon />
            <span>All Categories</span>
          </div>
          {/* </div> */}
        </div>
        <div className="d-n-c-center">
          {searchDropdown && <SearchDropdown />}
        </div>
        <div className="d-n-c-right">
          <div className="nav-right-actions gap-15px">
            <LanguageSelectInputs />
            <div className="flag">
              <CountryFlag countryCode={countryFlag} />
              <span>{countryFlag?.toUpperCase()}</span>
            </div>
            <CurrencySelectInput />
            <div className="side-line"></div>
            {!userSession && (
              <Buttons
                className={"btn-c-primary btn-c-sm"}
                text={t("getStarted")}
                onClick={() => router.push("/authenticate")}
              />
            )}
            {userSession && userData.userType !== "seller" && (
              <Buttons
                className={"p-btn-comp p-btn-secoundary p-btn-rounded p-btn-md"}
                text={t("postBuyingReq")}
                onClick={() => router.push("/app/sourcing-rfq")}
              // onClick={() => router.push("/authenticate")}
              // onClick={handleRfqRoute}
              />
            )}
            {userSession == false && (
              <Buttons
                className={"p-btn-comp p-btn-secoundary p-btn-rounded p-btn-md"}
                text={t("postBuyingReq")}
                // onClick={() => router.push("app/sourcing-rfq")}
                onClick={() => router.push("/authenticate")}
              // onClick={handleRfqRoute}
              />
            )}
            <REQCart />
            <ProfileWithMenus />
            {/* <ProfileWithMenus /> */}
          </div>
        </div>
      </div>
      <div ref={categoryRef} className={`backdrop ${isCategoryActive ? "active" : ""}`}>
        <AllCategory
          isCategoryActive={isCategoryActive}
          setIsCategoryActive={setIsCategoryActive}
        />
        <div className="backdrop-container" onClick={() => setIsCategoryActive(false)}></div>
      </div>
    </>
  );
};

export default DashboardNavbar;
