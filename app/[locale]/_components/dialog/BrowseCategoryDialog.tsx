import { useTranslations } from "next-intl";
import { Dialog } from "primereact/dialog";
import React, { useEffect, useState } from "react";
import {
  CategoriesListArrayInterface,
  CategoriesListInterface,
} from "../../_interface/common";
import {
  useGetCategoryListQuery,
  useLazyGetMappedProductCategoriesQuery,
  useLazyGetMappedSubCategoriesQuery,
} from "../../_store/apiReducer/commonApi";
import Typography from "../Base/Typography";
import Buttons from "../Buttons/Buttons";
import { NestedCategorySelectList } from "../form/NestedCategorySelectList";
import { SadIcon } from "../Icons/SVGIcons";

interface BrowseCategoryDialogProps {
  show: boolean;
  onHide: () => void;
  setValue: (field: any, value: any) => void;
  initialValue?: {
    category: CategoriesListInterface;
    subCategory: CategoriesListInterface;
    productCategory: CategoriesListInterface;
  };
  openSuggestion: () => void;
}

const BrowseCategoryDialog: React.FC<BrowseCategoryDialogProps> = ({
  show,
  onHide,
  setValue,
  initialValue,
  openSuggestion,
}) => {
  const t = useTranslations(
    "salesProduct.productInformation.fields.browseCategory"
  );
  const [searchQuery, setSearchQuery] = useState({
    category: "",
    subcategory: "",
    prodCategory: "",
  });
  const [errors, setErrors] = useState<{
    categoryMissing: boolean;
    subCategoryMissing: boolean;
  }>({
    categoryMissing: false,
    subCategoryMissing: false,
  });

  const { data: categoriesList, isLoading: categoryLoading } =
    useGetCategoryListQuery({ search: searchQuery.category });
  const [triggerSubCategoryFetch, { isLoading: subCategoryLoading }] =
    useLazyGetMappedSubCategoriesQuery();
  const [triggerProductCategoryFetch] =
    useLazyGetMappedProductCategoriesQuery();
  const [subCategoriesListRender, setSubCategoriesListRender] =
    useState<CategoriesListArrayInterface>([]);
  const [productCategoriesListRender, setProductCategoriesListRender] =
    useState<CategoriesListArrayInterface>([]);
  const [clickTriggered, setClickTriggered] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoriesListInterface>();
  const [selectedSubCategory, setSelectedSubCategory] =
    useState<CategoriesListInterface>();
  const [selectedProductCategory, setSelectedProductCategory] =
    useState<CategoriesListInterface>();

  useEffect(() => {
    if (show) initializeValues();
  }, [show]);

  const initializeValues = async () => {
    if (initialValue?.category?._id) {
      setSelectedCategory(initialValue.category);
    }
    if (initialValue?.subCategory?._id) {
      fetchSubCategoryList("", initialValue?.category?._id);
      setSelectedSubCategory(initialValue.subCategory);
    }
    if (initialValue?.productCategory?._id) {
      fetchProductCategoryList("", initialValue?.subCategory?._id);
      setSelectedProductCategory(initialValue.productCategory);
    }
  };

  const handleCategoryClick = async (data: CategoriesListInterface) => {
    setErrors((prev) => ({ ...prev, categoryMissing: false }));
    setSelectedCategory(data);
    setSelectedSubCategory(undefined);
    setSelectedProductCategory(undefined);
    setSearchQuery((prev) => ({ ...prev, subcategory: "", prodCategory: "" }));
    setProductCategoriesListRender([]);
    await fetchSubCategoryList("", data._id);
  };

  const fetchSubCategoryList = async (search: string, id: string) => {
    if (!clickTriggered) setClickTriggered(true);
    let response = await triggerSubCategoryFetch({
      search: search ?? "",
      id: id,
    });
    if ("data" in response) {
      setSubCategoriesListRender(response?.data?.data || []);
    }
  };

  const fetchProductCategoryList = async (search: string, id: string) => {
    if (!clickTriggered) setClickTriggered(true);
    let response = await triggerProductCategoryFetch({
      search: search,
      id: id,
    });
    if ("data" in response) {
      setProductCategoriesListRender(response?.data?.data || []);
    }
  };

  const handleSubCategoryClick = async (data: CategoriesListInterface) => {
    setErrors((prev) => ({ ...prev, subCategoryMissing: false }));
    setSelectedSubCategory(data);
    setSelectedProductCategory(undefined);
    setSearchQuery((prev) => ({ ...prev, prodCategory: "" }));
    await fetchProductCategoryList("", data._id);
  };

  const onSubCategorySearch = async (value: string) => {
    setSearchQuery((prev) => ({
      ...prev,
      subcategory: value,
    }));
    if (!selectedCategory?._id) return;
    await fetchSubCategoryList(value, selectedCategory._id);
  };

  const onProductCategorySearch = async (value: any) => {
    setSearchQuery((prev) => ({
      ...prev,
      prodCategory: value,
    }));
    if (!selectedSubCategory?._id) return;
    await fetchProductCategoryList(value, selectedSubCategory._id);
  };

  const setCategoryValues = () => {
    let categoryErrors: any = {};
    if (!selectedCategory?._id) {
      categoryErrors["categoryMissing"] = true;
    }
    if (!selectedSubCategory?._id) {
      categoryErrors["subCategoryMissing"] = true;
    }
    setErrors(categoryErrors);
    if (!selectedCategory?._id || !selectedSubCategory?._id) return;
    setValue("category", selectedCategory);
    setValue("subCategory", selectedSubCategory);
    setValue("productCategory", selectedProductCategory);
    setValue("categorySuggestion", {});
    closeDialog();
  };

  const clearForm = () => {
    setSearchQuery({ category: "", subcategory: "", prodCategory: "" });
    setSelectedCategory(undefined);
    setSelectedSubCategory(undefined);
    setSelectedProductCategory(undefined);
  };

  const closeDialog = () => {
    clearForm();
    onHide();
  };

  return (
    <div>
      <Dialog
        visible={show}
        modal
        className="modal-comp browse-category-modal"
        closable={true}
        onHide={onHide || (() => {})}
        content={() => (
          <>
            <div className="m-c-head">
              <Typography variant="h6" className="modal-title">
                {t("title")}
              </Typography>
            </div>
            <div className="m-c-body">
              <div className="selected-badge">
                <Typography variant="span" className="s-b-txt s-b-title">
                  {!selectedCategory?.name &&
                  selectedSubCategory?.name &&
                  selectedProductCategory?.name
                    ? t("searchLabel")
                    : `${t("selectLabel")}:  `}
                  {selectedCategory?.name ? selectedCategory.name : ""}
                  {selectedSubCategory?.name
                    ? ` > ${selectedSubCategory.name}`
                    : ""}
                  {selectedProductCategory?.name
                    ? ` > ${selectedProductCategory.name}`
                    : ""}
                </Typography>
              </div>

              <div className="category-group-block-comp">
                <NestedCategorySelectList
                  loading={categoryLoading}
                  list={categoriesList?.data}
                  searchQuery={searchQuery.category}
                  type="Category"
                  title={t("category")}
                  handleListClick={(val) => handleCategoryClick(val)}
                  selected={selectedCategory}
                  setSearchQuery={(val: string) =>
                    setSearchQuery((prev) => ({ ...prev, category: val }))
                  }
                  instructionText={t("categoryPlaceholder")}
                  errors={errors.categoryMissing}
                />
                <NestedCategorySelectList
                  loading={subCategoryLoading}
                  list={subCategoriesListRender}
                  searchQuery={searchQuery.subcategory}
                  type="Sub Category"
                  title={t("subCategory")}
                  handleListClick={(val) => handleSubCategoryClick(val)}
                  selected={selectedSubCategory}
                  setSearchQuery={(val: string) => onSubCategorySearch(val)}
                  instructionText={t("subCatPlaceholder")}
                  errors={errors.subCategoryMissing}
                />
                <NestedCategorySelectList
                  loading={categoryLoading}
                  list={productCategoriesListRender}
                  searchQuery={searchQuery.prodCategory}
                  type="Product Category"
                  title={t("prodCategory")}
                  handleListClick={(val) => setSelectedProductCategory(val)}
                  selected={selectedProductCategory}
                  setSearchQuery={(val: string) => onProductCategorySearch(val)}
                  instructionText={t("prodCatPlaceholder")}
                />
              </div>

              <div className="cant-find-category">
                <SadIcon />
                <Typography variant="span" className="c-f-c-txt">
                  {t("cantCat")}
                </Typography>
                <Buttons
                  className={"btn-outline bg-outline-grey btn-c-sm"}
                  text={t("sugCat")}
                  onClick={() => openSuggestion()}
                />
              </div>
            </div>
            <div className="m-c-footer">
              <Buttons
                className={"btn-outline bg-outline-grey"}
                text={t("cancel")}
                onClick={() => closeDialog()}
              />
              <Buttons
                className={"btn-c-primary"}
                text={t("choose")}
                onClick={() => setCategoryValues()}
              />
            </div>
          </>
        )}
      />
    </div>
  );
};

export default BrowseCategoryDialog;
