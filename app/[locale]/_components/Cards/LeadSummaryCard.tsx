"use client";
import React from "react";
import SelectWithItems from "@/app/[locale]/_components/form/SelectWithItems";
import { lifeCycleTagOption } from "@/app/[locale]/_models/StoreFront";
import Button from "@/app/[locale]/_components/Buttons/Button";
import { sourceList } from "@/app/[locale]/_models/common";
import Select from "@/app/[locale]/_components/StoreFront/Forms/Select";
import { useTranslations } from "next-intl";
import { CustomerInfo } from "@/app/[locale]/_interface/ConnectInterface";
import { CustomerLifeCycle } from "@/app/[locale]/_interface/CustomerInterface";
import DatePipe from "@/app/[locale]/_components/Pipe/DatePipe";

interface LeadProps {
  customer: CustomerInfo;
  onTagChange?: (value: any) => void;
  onSourceChange?: (value: any) => void;
}
const LeadSummaryCard: React.FC<LeadProps> = ({
  customer,
  onTagChange,
  onSourceChange,
}) => {
  const t = useTranslations("salesConnect.summaryCard");

  const customTemplate = (option: any) => {
    if (!option) {
      return <span className="c-t-i-placeholder">{t("lifeCycle")}</span>;
    }
    return (
      <div className="custom-template-item">
        {option.icon && typeof option.icon === "object" ? (
          <span className="c-t-i-icon">{option.icon}</span>
        ) : null}
        <span
          className={`colored-txt ${
            option.value == CustomerLifeCycle.BULK_BUYER && "txt-brown"
          } ${
            option.value == CustomerLifeCycle.HIGH_VALUE_CUSTOMER && "txt-pink"
          }`}
        >
          {option.name}
        </span>
      </div>
    );
  };

  return (
    <div className="lead-summary-card-comp">
      <div className="forms-block">
        <div className="forms-group">
          <label className="f-g-label">{t("tag")}</label>
          <SelectWithItems
            options={lifeCycleTagOption}
            placeholder={t("selectTag")}
            itemTemplate={customTemplate}
            valueTemplate={customTemplate}
            value={customer?.lifeCycle}
            appendTo={false}
            onChange={(e: any) => onTagChange?.(e.value)}
          />
        </div>
        <div className="forms-group">
          <label className="f-g-label">{t("source")}</label>
          <Select
            placeholder={"Select Source"}
            options={sourceList}
            onChange={(value: any) => onSourceChange?.(value)}
            value={customer?.source}
          />
        </div>
        <div className="two-col-layout">
          <div className="tabs-form-group label-value-grey">
            <label htmlFor="Product Name" className="l-v-g-label">
              {t("contacted")}
            </label>
            {customer?.lastContactedAt ? (
              <span className="l-v-g-value">
                <DatePipe value={customer?.lastContactedAt} />
              </span>
            ) : (
              <span className="l-v-g-value">-</span>
            )}
          </div>
          <div className="tabs-form-group label-value-grey">
            <label htmlFor="Product Name" className="l-v-g-label">
              {t("modified")}
            </label>
            <span className="l-v-g-value">{customer?.contactName}</span>
          </div>
        </div>
      </div>
      <div className="button-group-block flex-col">
        <Button
          disabled
          className={"btn-outline bg-outline-grey"}
          text={t("convert")}
        />
        <Button disabled className={"btn-c-primary"} text={t("quote")} />
      </div>
    </div>
  );
};

export default LeadSummaryCard;
