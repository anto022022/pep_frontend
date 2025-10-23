import { ReactNode, Fragment } from "react";

const layout = ({
  children,
}: {
  children: ReactNode;
  params: Promise<any>;
}) => {
  return <Fragment> {children} </Fragment>;
};

export default layout;
