import { ReactNode } from "react";
// import styles from "@/assets/styles-modules/dashboard.module.css";

const layout = ({
  children,
}: {
  children: ReactNode;
  params: Promise<any>;
}) => {
  return <div className="dashboard-layout">{children}</div>;
};

export default layout;
