import { useTranslations } from "next-intl";
import React from "react";

interface TableEnumPipeProps {
  enumType: any;
  value: string;
}

export const TableEnumPipe: React.FC<TableEnumPipeProps> = ({
  enumType,
  value,
}) => {
  const t = useTranslations();
  return <div>{value ? t(enumType[value]) : "-"}</div>;
};
