import { ReactNode } from "react";
// import styles from "@/app/[locale]/dashboard.module.css";

const layout = ({
  children,
}: {
  children: ReactNode;
  params: Promise<any>;
}) => {
  // return <div className={styles.layout}>{children}</div>;
  return <div className="dashboard-layout">{children}</div>;
};

export default layout;
