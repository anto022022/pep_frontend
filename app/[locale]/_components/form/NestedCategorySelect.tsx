"use client";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { FieldErrors, useWatch } from "react-hook-form";
import {
  AiCategorySelectInterface,
  SuggestCategory,
} from "../../_interface/SalesProductInterface";
import CustomButton from "../Buttons/Button";
import { NoCategoryIcon } from "../Icons/SVGIcons";
import CategoryDropdown from "../StoreFront/Forms/CategoryDropdown";
import SuggestCategoryForm from "../StoreFront/SuggestCategory/SuggestCategoryForm";
import BrowseCategoryDialog from "../dialog/BrowseCategoryDialog";
interface NestedCategorySelectProps {
  setValue: (field: any, value: any) => void;
  errors: FieldErrors;
  aiGeneratedContent: any[];
  isFormActive: boolean;
  control: any;
  placeholder: string;
}

const NestedCategorySelect: React.FC<NestedCategorySelectProps> = ({
  setValue,
  aiGeneratedContent,
  errors,
  control,
  placeholder,
}) => {
  const t = useTranslations("salesProduct.productInformation.fields");
  const selectedCategory = useWatch({ control, name: "category" });
  const suggestedCategory = useWatch({ control, name: "categorySuggestion" });
  const selectedSubCategory = useWatch({
    control,
    name: "subCategory",
  });
  const selectedProductCategory = useWatch({
    control,
    name: "productCategory",
  });
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openBrowseCategory, setOpenBrowseCategory] = useState<boolean>(false);
  const [aiSearchQuery, setAiSearchQuery] = useState<string>();
  const [filteredAiContent, setFilteredAiContent] = useState<Array<any>>();

  useEffect(() => {
    setFilteredAiContent(aiGeneratedContent);
  }, [aiGeneratedContent]);

  const searchFunc = (e: any) => {
    const query = e?.toLowerCase();

    setAiSearchQuery(e);
    if (!query) {
      setFilteredAiContent(aiGeneratedContent);
      return;
    }
    const filtered = aiGeneratedContent.filter((item) => {
      return (
        item?.category?.name?.toLowerCase()?.includes(query) ||
        item?.subCategory?.name?.toLowerCase()?.includes(query) ||
        item?.productCategory?.name?.toLowerCase()?.includes(query)
      );
    });

    const formatted = filtered.map((item) => ({
      ...item,
      value: `${item?.category?.name ?? ""} > ${item?.subCategory?.name ?? ""
        } > ${item?.productCategory?.name ?? ""}`,
    }));

    setFilteredAiContent(formatted);
  };

  const itemTemplate = (item: any) => {
    return (
      <span>
        {`${item?.category?.name ?? ""} > ${item?.subCategory?.name ?? ""} > ${item?.productCategory?.name ?? ""
          }`}
      </span>
    );
  };

  const filterAiContent = (data: AiCategorySelectInterface) => {
    setValue("category", data?.category ?? undefined);
    setValue("subCategory", data?.subCategory ?? undefined);
    setValue("productCategory", data?.productCategory ?? undefined);
    setValue("categorySuggestion", {});
    setAiSearchQuery("");
  };

  const emptyList = () => {
    return (
      <div className="no-category-found">
        <NoCategoryIcon />
        <span className="n-c-f-txt">{t("categoryModal.emptyMsg")}</span>
        <CustomButton
          className={"btn-outline bg-outline-grey btn-c-sm"}
          text="Suggest Category"
          type="button"
          onClick={() => setOpenDialog(true)}
        />
      </div>
    );
  };

  const setSuggestedValue = (val: SuggestCategory) => {
    setValue("category", {});
    setValue("subCategory", {});
    setValue("productCategory", {});
    setValue("categorySuggestion", val);
  };

  return (
    <div className="autocomplete-dropdown-comp browse-category">
      <div className="selected-badge-edit">
        {suggestedCategory?.suggestedCategory ? (
          <div className="selected-badge">
            <span className="s-b-txt s-b-title">
              {t("categoryModal.suggestLable")}:
            </span>
            <span className="s-b-txt s-b-selected-txt">
              {suggestedCategory?.suggestedCategory}
            </span>
          </div>
        ) : (
          <>
            {" "}
            {(selectedCategory?.name ||
              selectedSubCategory?.name ||
              selectedProductCategory?.name) && (
                <div className="selected-badge">
                  <span className="s-b-txt s-b-title">
                    {t("categoryModal.selectLabel")}:
                  </span>
                  <span className="s-b-txt s-b-selected-txt">
                    {selectedCategory?.name}
                    {selectedSubCategory?.name &&
                      ` > ${selectedSubCategory.name}`}
                    {selectedProductCategory?.name &&
                      ` > ${selectedProductCategory.name}`}
                  </span>
                </div>
              )}{" "}
          </>
        )}
      </div>

      <CategoryDropdown
        value={aiSearchQuery}
        suggestions={filteredAiContent}
        onChange={(filter) => filterAiContent(filter)}
        name="{field.name}"
        searchFunc={searchFunc}
        itemTemplate={itemTemplate}
        emptyList={emptyList()}
        placeholder={placeholder}
      />
      <div className="or-browse-category">
        <span className="or-txt">{t("categoryModal.or")}</span>
        <CustomButton
          type="button"
          className={"btn-outline bg-outline-grey btn-c-sm"}
          text={t("category.btn")}
          onClick={() => setOpenBrowseCategory(true)}
        />
      </div>
      <SuggestCategoryForm
        show={openDialog}
        onHide={() => setOpenDialog(false)}
        setSuggestedValue={(val: SuggestCategory) => setSuggestedValue(val)}
        initialValue={suggestedCategory}
      />
      <BrowseCategoryDialog
        show={openBrowseCategory}
        onHide={() => setOpenBrowseCategory(false)}
        setValue={setValue}
        initialValue={{
          category: selectedCategory,
          subCategory: selectedSubCategory,
          productCategory: selectedProductCategory,
        }}
        openSuggestion={() => {
          setOpenBrowseCategory(false);
          setOpenDialog(true);
        }}
      />
      {errors?.formError?.message && (
        <span className="error-txt">{String(errors.formError.message)}</span>
      )}
    </div>
  );
};

export default NestedCategorySelect;
