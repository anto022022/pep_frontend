import {
  attributsVariantsFormValue,
  VariantAttribute,
} from "@/app/[locale]/(pages)/app/(sales)/sales-product/form/(forms)/AttributesVariants";
import {
  generateVariants,
  updateVariants,
} from "@/app/[locale]/_hooks/utility";
import { showToast } from "@/app/[locale]/_store/reducers/ui_store";
import { RootState, useAppSelector } from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import { FC } from "react";
import { UseFormGetValues, UseFormSetValue } from "react-hook-form";
import Buttons from "../../Buttons/Buttons";
import { EditVariantsIcon } from "../../Icons/SVGIcons";
import ChipInputs from "./ChipInputs";

interface VariantAttributeItemInterFace {
  item: VariantAttribute;
  index: number;
  formValue: attributsVariantsFormValue;
  setValue: UseFormSetValue<attributsVariantsFormValue>;
  getValues: UseFormGetValues<attributsVariantsFormValue>;
  dispatch: any;
  groupBy: string;
  setGroupBy: (key: string) => void;
}

const VariantAttributeItem: FC<VariantAttributeItemInterFace> = ({
  item,
  index,
  formValue,
  setValue,
  getValues,
  dispatch,
  groupBy,
  setGroupBy,
}) => {
  const { pricingType } = useAppSelector(
    (state: RootState) => state.preview?.pricing || {}
  );
  const t = useTranslations("salesProduct.specifications");
  if (!item.isEditing) {
    return (
      <div className="types-form-group" key={index}>
        <label htmlFor="" className="t-f-g-title">
          {item.key}
        </label>
        <div className="t-f-g-values">
          <div className="badge-group variants-badge-group">
            {item.values.length > 0 &&
              item.values.map((val, valIndex) => (
                <span className="badge-comp" key={valIndex}>
                  {val}
                </span>
              ))}
          </div>
          <EditVariantsIcon
            onClick={() => {
              setValue(`variantAttributes.${index}.isEditing`, true);
            }}
          />
        </div>
      </div>
    );
  }
  if (item.key) {
    return (
      <div className="types-form-group" key={index}>
        <label htmlFor="" className="t-f-g-title">
          {item.key}
        </label>
        <div className="variants-atrri-item-bottom">
          <ChipInputs
            value={item.values}
            onChange={() => { }}
            handleOnAdd={(value) => {
              const isExist = item.values.includes(value);
              if (isExist) {
                dispatch(
                  showToast({
                    title: "Error",
                    message: "Attribute Already Exist",
                    theme: "error",
                  })
                );
                return;
              }
              setValue(`variantAttributes.${index}.values`, [
                ...item.values,
                value,
              ]);
            }}
            handleOnRemove={(value) => {
              setValue(
                `variantAttributes.${index}.values`,
                item.values.filter((val) => val !== value)
              );
            }}
            itemTemplate={(attriValue: string) => (
              <span className="chip">
                <span className="chip-text">{attriValue}</span>
              </span>
            )}
          />
        </div>
        <div className="add-custom-option-btn-grp">
          <Buttons
            className={"btn-outline bg-outline-danger btn-c-sm"}
            text={t("fields.variants.fields.addCutomOption.optionDelete")}
            type="button"
            onClick={() => {
              const isSame = formValue.variantAttributes[index].key === groupBy;
              const newVariantAttributes = formValue.variantAttributes.filter(
                (_, i) => i !== index
              );
              setValue("variantAttributes", newVariantAttributes);
              if (isSame) {
                setGroupBy(newVariantAttributes[0]?.key || "");
              }
              if (item.key && item.values.length > 0) {
                const updatedVariantAttribute = getValues("variantAttributes");
                setValue(
                  "variants",
                  generateVariants(updatedVariantAttribute, pricingType)
                );
              }
            }}
          />
          <Buttons
            className={"btn-c-dark btn-c-sm"}
            text={t("fields.variants.fields.addCutomOption.optionSave")}
            type="button"
            onClick={() => {
              if ((!item.key && !item.tempKey) || item.values.length <= 0) {
                dispatch(
                  showToast({
                    title: "Error!",
                    message: "Please fill all the fields",
                    theme: "error",
                  })
                );
                return;
              }
              if (!item.key && item.tempKey) {
                setValue(`variantAttributes.${index}.key`, item.tempKey);
              }
              setValue(`variantAttributes.${index}.isEditing`, false);
              const updatedVariantAttribute = getValues("variantAttributes");
              if (item.tempKey) {
                setValue(
                  "variants",
                  generateVariants(updatedVariantAttribute, pricingType)
                );
                return;
              }
              const lastVariants = getValues("variants");
              setValue(
                "variants",
                updateVariants(
                  lastVariants,
                  updatedVariantAttribute,
                  pricingType
                )
              );
            }}
          />
        </div>
      </div>
    );
  }
  return (
    <div className="types-form-group">
      <div className="add-custom-option-inputs">
        <div className="forms-group left">
          <label className="f-g-label">
            {t("fields.variants.fields.addCutomOption.optionNameLabel")}
          </label>
          <input
            value={item.tempKey || ""}
            className="forms-input"
            onChange={(e) => {
              const newVariantAttributes = [...formValue.variantAttributes];
              newVariantAttributes[index].tempKey = e.target.value;
              setValue("variantAttributes", newVariantAttributes);
            }}
            placeholder={t(
              "fields.variants.fields.addCutomOption.optionNameLabel"
            )}
          />
        </div>
        <div className="forms-group right">
          <label className="f-g-label">
            {t("fields.variants.fields.addCutomOption.optionNamePlaceholder")}
          </label>
          <ChipInputs
            value={item.values}
            onChange={() => { }}
            handleOnAdd={(value) => {
              const isExist = item.values.includes(value);
              if (isExist) {
                dispatch(
                  showToast({
                    title: "Error",
                    message: "Attribute Already Exist",
                    theme: "error",
                  })
                );
                return;
              }
              setValue(`variantAttributes.${index}.values`, [
                ...item.values,
                value,
              ]);
            }}
            handleOnRemove={(value) => {
              setValue(
                `variantAttributes.${index}.values`,
                item.values.filter((val) => val !== value)
              );
            }}
            itemTemplate={(attriValue: string) => (
              <span className="chip">
                <span className="chip-text">{attriValue}</span>
              </span>
            )}
          />
        </div>
      </div>

      <div className="add-custom-option-btn-grp">
        <Buttons
          className={"btn-outline bg-outline-danger btn-c-sm"}
          text={t("fields.variants.fields.addCutomOption.optionDelete")}
          type="button"
          onClick={() => {
            const isSame = formValue.variantAttributes[index].key === groupBy;
            const newVariantAttributes = formValue.variantAttributes.filter(
              (_, i) => i !== index
            );
            setValue("variantAttributes", newVariantAttributes);
            if (isSame) {
              setGroupBy(newVariantAttributes[0]?.key || "");
            }
            if (item.key && item.values.length > 0) {
              const updatedVariantAttribute = getValues("variantAttributes");
              setValue(
                "variants",
                generateVariants(updatedVariantAttribute, pricingType)
              );
            }
          }}
        />
        <Buttons
          className={"btn-c-dark btn-c-sm"}
          text={t("fields.variants.fields.addCutomOption.optionSave")}
          type="button"
          onClick={() => {
            if ((!item.key && !item.tempKey) || item.values.length <= 0) {
              dispatch(
                showToast({
                  title: "Error!",
                  message: "Please fill all the fields",
                  theme: "error",
                })
              );
              return;
            }
            if (!item.key && item.tempKey) {
              setValue(`variantAttributes.${index}.key`, item.tempKey);
            }
            setValue(`variantAttributes.${index}.isEditing`, false);
            const updatedVariantAttribute = getValues("variantAttributes");
            if (item.tempKey) {
              setValue(
                "variants",
                generateVariants(updatedVariantAttribute, pricingType)
              );
              if (formValue?.variants.length === 0) {
                setGroupBy(item.tempKey);
              }
              return;
            }
            const lastVariants = getValues("variants");
            setValue(
              "variants",
              updateVariants(lastVariants, updatedVariantAttribute, pricingType)
            );
          }}
        />
      </div>
    </div>
  );
};

export default VariantAttributeItem;
