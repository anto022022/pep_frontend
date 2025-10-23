import React from "react";
import Image from "next/image";
import Logo from "../../../../public/img/site-logo.svg";

const SettingTopBar = () => {
  return (
    <div className="dashboard-navbar-comp">
      <div className="d-n-c-left">
        <Image src={Logo} alt="Logo" width={"125"} height={23}></Image>
      </div>
    </div>
  );
};

export default SettingTopBar;
