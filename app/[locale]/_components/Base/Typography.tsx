import React from "react";

type TypographyProps = {
  variant?:
    | "p"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "span"
    | "div"
    | "pre";
  className?: string;
  children?: React.ReactNode;
  htmlContent?: string; // new prop to support raw HTML
} & React.HTMLAttributes<HTMLElement>;

const Typography: React.FC<TypographyProps> = ({
  variant = "p",
  className = "",
  children,
  htmlContent,

  ...props
}) => {
  if (htmlContent) {
    return React.createElement(variant, {
      className,
      dangerouslySetInnerHTML: { __html: htmlContent },
      ...props,
    });
  }
  return React.createElement(variant, { className, ...props }, children);
};

export default Typography;
