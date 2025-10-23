import { SuggestCategory } from "@/app/[locale]/_interface/SalesProductInterface";
import { industryOption } from "@/app/[locale]/_models/sales/product";
import { useTranslations } from "next-intl";
import { Dialog } from "primereact/dialog";
import React, { useEffect, useState } from "react";
import Typography from "../../Base/Typography";
import CustomButton from "../../Buttons/Button";
import SuccessDialog from "../../dialog/SuccessDialog";
import { RegularCheckBox } from "../../form/RegularCheckBox";
import RegularInputs from "../../form/RegularInputs";
import Select from "../Forms/Select";

interface SuggestCategoryFormProps {
  onHide: (val: boolean) => void;
  show: boolean;
  setSuggestedValue: (val: any) => void;
  initialValue?: SuggestCategory;
}

export const SuggestCategoryForm: React.FC<SuggestCategoryFormProps> = ({
  show,
  onHide,
  setSuggestedValue,
  initialValue,
}) => {
  const t = useTranslations(
    "salesProduct.productInformation.fields.categoryModal"
  );
  const [values, setValues] = useState<SuggestCategory>({
    industry: "",
    reason: "",
    suggestedCategory: "",
  });

  const [errors, setErrors] = useState<{
    industry?: string;
    reason?: string;
    suggestedCategory?: string;
  }>({});

  const [showOtherInput, setShowOtherInput] = useState<boolean>(false);
  const [otherReason, setOtherReason] = useState<string>("");

  const reasonOptions = [
    "I cannot find the category.",
    "This is a related category, but it isn’t quite right.",
    "Searching method is inconvenient.",
    "Other.",
  ];

  useEffect(() => {
    initializeForm();
  }, []);

  const initializeForm = () => {
    if (!initialValue) return;
    setValues(initialValue);
  };

  const handleChange = (field: keyof SuggestCategory, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const clearForm = () => {
    setValues({ industry: "", reason: "", suggestedCategory: "" });
    setErrors({ industry: "", reason: "", suggestedCategory: "" });
    setOtherReason("");
    setShowOtherInput(false);
  };

  const handleReasonChange = (reason: string) => {
    if (reason === "Other.") {
      setShowOtherInput(true);
      handleChange("reason", otherReason);
    } else {
      setShowOtherInput(false);
      setOtherReason("");
      handleChange("reason", reason);
    }
  };

  const submitValues = () => {
    const trimmed = {
      industry: values.industry.trim(),
      reason: showOtherInput ? otherReason.trim() : values.reason.trim(),
      suggestedCategory: values.suggestedCategory.trim(),
    };

    const newErrors: typeof errors = {};
    if (!trimmed.industry) newErrors.industry = "Industry is required";
    if (!trimmed.reason) newErrors.reason = "Reason is required";
    if (!trimmed.suggestedCategory)
      newErrors.suggestedCategory = "Category is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSuggestedValue(trimmed);
    closeForm();
  };

  const closeForm = () => {
    clearForm();
    onHide(false);
  };

  return (
    <div>
      <Dialog
        visible={show}
        modal
        className="modal-comp category-modal"
        closable={true}
        onHide={() => onHide(false)}
        content={() => (
          <>
            <div className="m-c-head">
              <Typography variant="h6" className="modal-title">
                {t("cantCat")}
              </Typography>
            </div>
            <div className="m-c-body">
              <div className="forms-group">
                <label className="f-g-label" htmlFor="Choose Industry">
                  {t("chooseIndus")}
                </label>
                <Select
                  value={values.industry}
                  onChange={(value: string) => handleChange("industry", value)}
                  options={industryOption}
                  placeholder={t("chooseIndus")}
                  className={errors.industry ? "error-input" : ""}
                />
                {errors.industry && (
                  <div className="error-txt">{errors.industry}</div>
                )}
              </div>
              {/* <div className="forms-group">
                <label className="f-g-label" htmlFor="Product Name">
                  Product Name
                </label>
                <RegularInputs
                  type={"text"}
                  value=""
                  placeholder={"Enter Product Name"}
                  readOnly
                />
              </div> */}
              <div className="forms-group">
                <label className="f-g-label">{t("reasonLable")}</label>
                <div className="relevant-option-block">
                  {reasonOptions.map((option) => (
                    <RegularCheckBox
                      key={option}
                      label={option}
                      className={"sm"}
                      value={option}
                      checked={
                        (showOtherInput && option === "Other.") ||
                        values.reason === option
                      }
                      onChange={() => handleReasonChange(option)}
                    />
                  ))}
                  {showOtherInput && (
                    <div className="forms-group" style={{ marginTop: "8px" }}>
                      <RegularInputs
                        type="text"
                        placeholder={t("reasonPlaceholder")}
                        value={otherReason}
                        onChange={(e: any) => {
                          setOtherReason(e.target.value);
                          handleChange("reason", e.target.value);
                        }}
                        className={errors.reason ? "error-input" : ""}
                      />
                    </div>
                  )}
                </div>
                {errors.reason && (
                  <div className="error-txt">{errors.reason}</div>
                )}
              </div>
              <div className="forms-group">
                <label className="f-g-label" htmlFor="Suggest category name">
                  {t("sugCatNameLabel")}
                </label>
                <RegularInputs
                  type={"text"}
                  value={values?.suggestedCategory ?? ""}
                  placeholder={t("sugCatNameLabel")}
                  onChange={(e: any) =>
                    handleChange("suggestedCategory", e.target.value)
                  }
                  className={errors.suggestedCategory ? "error-input" : ""}
                />
                {errors.suggestedCategory && (
                  <div className="error-txt">{errors.suggestedCategory}</div>
                )}
              </div>
            </div>
            <div className="m-c-footer">
              <CustomButton
                className={"btn-outline bg-outline-grey"}
                text={t("cancel")}
                onClick={() => closeForm()}
              />
              <CustomButton
                className={"btn-c-primary"}
                text={t("submit")}
                onClick={submitValues}
              />
            </div>
          </>
        )}
      />
      <SuccessDialog title={"Response Submitted"} visible={false} />
    </div>
  );
};

export default SuggestCategoryForm;
