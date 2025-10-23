import React, { ReactNode } from "react";
import AuthFooter from "../../_components/Authentication/AuthFooter";
import AuthNavBar from "../../_components/Authentication/AuthNavbar";

function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="auth-layout">
      <AuthNavBar />
      <div className="body-wrapper">{children}</div>
      <AuthFooter />
    </div>
  );
}

export default AuthLayout;
