import { setIsRFQCartSidebarOpen } from "@/app/[locale]/_store/reducers/ui_store";
import { useAppDispatch } from "@/app/[locale]/_store/store";
import Link from "next/link";
import React, { MouseEvent, ReactNode } from "react";
import Typography from "../Base/Typography";
import {
  CartIcon,
  ChevronLeftIcon,
  RFQIcon,
  SearchIcon,
} from "../Icons/SVGIcons";
// import RFQCartDialog from '../Overlay/RFQCartDialog';
import Image from "next/image";
import SiteImage from '../../../../assets/img/site-logo.svg';

interface MobileNavBarProps {
  path?: string;
  title?: string;
  children?: ReactNode | boolean;
  headIcon?: ReactNode;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  isRFQActive?: boolean;
  isLogoShow?: boolean;
}

const MobileNavBar: React.FC<MobileNavBarProps> = ({
  path = "/",
  title = "",
  children,
  headIcon,
  onClick,
  isRFQActive = false,
  isLogoShow = false,
}) => {
  const dispatch = useAppDispatch();

  const shouldRenderRight = children !== false;

  return (
    <>
      <div className="mob-page-navbar-comp">
        <div className="m-p-n-c-left">
          {!isLogoShow && (
            <>
              <Link href={path} onClick={onClick}>
                <ChevronLeftIcon />
              </Link>
              {headIcon}
            </>
          )}
          {!isLogoShow ? (
            <Typography className="m-b-n-c-l-title" variant="h1">
              {title}
            </Typography>
          ) : (
            <Link href={"/"} className="site-logo-head">
              <Image
                // src={"/img/site-logo.svg"}
                src={SiteImage}
                alt="Logo"
                width={125}
                height={23}
              />
            </Link>
          )}
        </div>

        {shouldRenderRight && (
          <div className="m-p-n-c-right">
            {children === true || children === undefined ? (
              <>
                <SearchIcon className="search-icon" />
                {isRFQActive && (
                  <div
                    className="rfq-cart-trigger"
                    onClick={() => dispatch(setIsRFQCartSidebarOpen(true))}
                  >
                    <RFQIcon />
                    <span className="r-c-t-count">5</span>
                  </div>
                )}
                <CartIcon />
              </>
            ) : (
              children
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {/* <RFQCartDialog /> */}
    </>
  );
};

export default MobileNavBar;
