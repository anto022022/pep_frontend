import React from "react";
import {
  BellIcon,
  MenuIcon,
  PhotographIcon,
  ProfileIcon,
  VoiceIcon,
} from "../Icons/SVGIcons";
import LanguageSelectInputs from "./Forms/LanguageSelectInputs";
import Image from "next/image";
import Logo from "../../../../public/img/site-logo.svg";
import GridIcon from "../../../../public/img/icons/grid-icon.svg";
import useLogout from "@/app/[locale]/_hooks/useLogout";
import { useRef } from "react";
import { Menu as MenuType } from "primereact/menu";
import { Menu } from "primereact/menu";
import ButtonIcon from "@/app/[locale]/_components/Buttons/ButtonIcon";
import { MenuItem } from "primereact/menuitem";
import { MenuItemOptions } from "primereact/menuitem";

const WebNavBar = () => {
  const { logout } = useLogout();
  const menuRight = useRef<MenuType>(null);
  let items = [
    {
      label: "Logout",
      icon: "pi pi-plus",
      template: (item: MenuItem, options: MenuItemOptions) => {
        return (
          // <div className="t-o-b-dropdown">
          <button
            className="t-o-btn"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px",
              border: "unset",
              background: "unset",
              width: "100%",
              borderBottom: "1px solid #ebebeb",
              cursor: "pointer",
            }}
            onClick={options.onClick}
          >
            <span className="t-o-b-txt">{item.label}</span>
          </button>
          // </div>
        );
      },
      command: () => logout(),
    },
  ];
  return (
    <div className="dashboard-navbar-comp">
      <div className="d-n-c-left">
        <Image src={Logo} alt="Logo" width={"125"} height={23}></Image>
        <div className="all-category-wrap">
          <MenuIcon />
          <span className="a-c-w-txt">All Categories</span>
        </div>
      </div>
      <div className="d-n-c-center">
        <div className="search-product-comp">
          <input
            type="text"
            className="s-p-c-input"
            placeholder="Search for Product and Services"
          ></input>
          <div className="s-p-c-icons">
            <VoiceIcon />
            <PhotographIcon />
          </div>
        </div>
      </div>
      <div className="d-n-c-right">
        <div className="nav-right-actions">
          <div className="side-line"></div>
          <LanguageSelectInputs />
          <BellIcon />
          <Image src={GridIcon} width={"18"} height={"18"} alt="Grid"></Image>
          <ButtonIcon
            onClick={(event) => {
              menuRight.current?.toggle(event);
            }}
          >
            <ProfileIcon />
          </ButtonIcon>
          <Menu
            model={items}
            popup
            ref={menuRight}
            id="popup_menu_right"
            className="t-o-b-dropdown"
            popupAlignment="right"
          />
        </div>
      </div>
    </div>
  );
};

export default WebNavBar;
