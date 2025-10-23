"use client";

// -------------------------------------------
// Core React & Next.js
// -------------------------------------------
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// -------------------------------------------
// Redux & Store
// -------------------------------------------
import { showToast } from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";

// -------------------------------------------
// API Hooks
// -------------------------------------------
import {
  useGetAllProductsListQuery,
  useUpdatCatalogSelectionMutation,
  useUpdateCatalogFormMutation,
} from "@/app/[locale]/_store/apiReducer/catalogApi";
import { useUpdateProductArchiveMutation } from "@/app/[locale]/_store/apiReducer/productsApi";

// -------------------------------------------
// Interfaces & Enums
// -------------------------------------------
import {
  listStatusIntersection,
  SalesProductListInterface,
} from "@/app/[locale]/_interface/SalesProductInterface";

import { FreeCatalogStageKey } from "@/app/[locale]/_models/StoreFront";

// -------------------------------------------
// UI Components
// -------------------------------------------
// import Typography from "@/app/[locale]/_components/Base/Typography";
import FormTitle from "@/app/[locale]/_components/StoreFront/Forms/FormTitle";
// import ButtonIconLeft from "@/app/[locale]/_components/Buttons/ButtonIconLeft";
import ButtonIconRight from "@/app/[locale]/_components/Buttons/ButtonIconRight";
import { RightArrowIcon } from "@/app/[locale]/_components/Icons/SVGIcons";

// -------------------------------------------
// Data Table & Utilities
// -------------------------------------------
import DataTableFilter, {
  Product,
} from "@/app/[locale]/_components/Common/dataTable/CatalogTableComponent";
import { ImageColumn } from "@/app/[locale]/_components/Common/dataTable/ImageColumn";
import NoDataScreen from "@/app/[locale]/_components/Common/dataTable/NoDataScreen";
import { DataTablePageEvent } from "primereact/datatable";

// -------------------------------------------
// Hooks & Utilities
// -------------------------------------------
import { useClearLocalStorageOnExit } from "@/app/[locale]/_hooks/useRemoveAiLocalStorage";
import { ProductSelect } from "./ProductSelect";

// -------------------------------------------
// Assets
// -------------------------------------------
import NoProductImg from "../../../../../../../assets/img/no-product.png";

import CatalogSubDomain from "@/app/[locale]/(pages)/app/catalog/form/(forms)/Catalog-SubDomain";
import "@/app/[locale]/catlog.css";
import popimg from "@/assets/img/pophd.png";

// -------------------------------------------
// Interfaces
// -------------------------------------------
interface SelectedProdType {
  _id: string;
}
export interface TableHeaders {
  id: number;
  field?: string;
  visible: boolean;
  header?: string;
  props?: any;
  disabled: boolean;
  selectedProd?: any;
}
const Products = () => {
  const row: number = 7;
  const router = useRouter();
  const [selectedProducts, setSelectedProducts] = useState<SelectedProdType[]>(
    []
  );
  const dispatch = useAppDispatch();
  const [queryParams, setQueryParams] = useState<SalesProductListInterface>({
    sortBy: "",
    sortOrder: 0,
    page: 1,
    limit: row,
    searchQuery: "",
    itemStatus: "",
  });
  const t = useTranslations("salesProduct.noProductsScreen");
  const common = useTranslations("common");
  const prod = useTranslations("freeCatalog");

  const { data, isLoading, refetch } = useGetAllProductsListQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });

  const currentStepperStatus = useAppSelector(
    (state: RootState) => state.stepperStatus.stepperStatus
  );
  // const [showCompletedModal, setShowCompletedModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedProd] = useState<any[]>([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [updateCatalogSelection] = useUpdatCatalogSelectionMutation();
  const [updateProductArchive] = useUpdateProductArchiveMutation();
  const [updateCatalog] = useUpdateCatalogFormMutation();
  const [showPackageSelection, setShowPackageSelection] = useState(false);
  const subDomainName = useAppSelector(
    (state: RootState) => state.location.domain
  );

  useEffect(() => {
    refetch();
  }, []);

  const onSort = () => {
    setQueryParams((prev) => ({
      ...prev,
      sortBy: "productName",
      sortOrder: !prev.sortOrder ? 1 : prev.sortOrder === -1 ? 1 : -1,
    }));
  };

  const viewProduct = (data: any) => {
    router.push(`sales-product/${data?._id}`);
  };

  const editProduct = (data: any) => {
    router.push(`sales-product/form?id=${data?._id}`);
  };

  const archiveProduct = async (id: any) => {
    await updateProductArchive({
      id: [id?._id],
      isArchived: !id?.isArchived,
    }).unwrap();
  };

  const draftProduct = (id: string) => {
    // console.log(id);
  };

  const switchProductSelection = async (val: any) => {
    await updateCatalogSelection({
      id: val?._id,
      ...data,
    }).unwrap();
  };

  const changeQueryParams = (
    field: string,
    val: string | number | listStatusIntersection
  ) => {
    setQueryParams((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  const columnData: Array<TableHeaders> = [
    {
      id: 1,
      props: { className: "checkbox-row", selectionMode: "multiple" },
      visible: true,
      disabled: true,
    },
    {
      id: 2,
      field: "productName",
      header: t("table-headers.productName"),
      visible: true,
      disabled: true,
      props: {
        sortable: true,
        body: (val: any) => (
          <ImageColumn
            rowData={val}
            src={"productImageSrc"}
            alt="productName"
            concatData="productName"
            redirect_id="_id"
            redirect_url="sales-product"
            isNotClickable={true}
          />
        ),
      },
    },
    {
      id: 3,
      field: "",
      header: prod("products.tableHeaders.addRemove"),
      props: {
        body: (data: any) => {
          return (
            <ProductSelect
              key={data._id}
              id={data._id}
              value={data?.showInCatalog ?? false}
              onToggle={() => switchProductSelection(data)}
            />
          );
        },
      },
      visible: true,
      disabled: true,
    },
  ];

  const handleAddProduct = () => {
    router.push("sales-product/form");
    useClearLocalStorageOnExit();
  };
  const handleClose = () => {
    setSidebarVisible(false);
  };
  const initiateBulkArchive = async () => {
    let filteredIds = selectedProducts.map((ele) => ele._id);
    await updateProductArchive({
      id: filteredIds,
      isArchived: true,
    })
      .unwrap()
      .then((res) => {
        if (res?.statusCode !== 201) return;
        setSelectedProducts([]);
        dispatch(
          showToast({
            title: "Success",
            message: `${filteredIds.length} Items Archived`,
            theme: "success",
          })
        );
      })
      .catch(() => {
        dispatch(
          showToast({
            title: "Error",
            message: `Items failed to Archived`,
            theme: "error",
          })
        );
      });
  };
  const onSubmit = () => {
    updateHomepage();
  };

  const updateHomepage = async () => {
    try {
      const payload = { ...data };
      const response = await updateCatalog({
        payload,
        stage: FreeCatalogStageKey.products,
      });
      if (response?.error) {
        return dispatch(
          showToast({
            title: "Error!",
            message: "Updating Products Data Failed",
            theme: "error",
          })
        );
      }
      // dispatch(setCurrentForm(FreeCatalogStageKey.products));
      setSidebarVisible(true);
      return;
      // return dispatch(
      //   showToast({
      //     title: "Success!",
      //     message: "Products Data Updated",
      //     theme: "success",
      //   })
      // );
    } catch (error) {
      console.log("Updating Products Error", error);
      dispatch(
        showToast({
          title: "Error!",
          message:
            error?.response?.data?.error?.join(", ") ||
            "Updating Products Data Failed",
          theme: "error",
        })
      );
    }
  };
  const handlePackageChange = () => {
    setShowSuccessModal(false);
    setSidebarVisible(true);
    setShowPackageSelection(true);
  };

  const handleSubdomainChange = () => {
    setShowSuccessModal(false);
    setSidebarVisible(true);
    // Navigate back to subdomain setup or handle as needed
    setShowPackageSelection(false);
  };

  const handleLaunchClick = () => {
    // Navigate first
    sessionStorage.setItem("showCompletedModal", "true");
    router.push("./");
    // Then trigger modal
    setShowSuccessModal(false); // close existing one if needed
  };

  const handleSubdomainSuccess = () => {
    setSidebarVisible(false);
    setShowSuccessModal(true);
  };

  // Success Modal Component
  const SuccessModal = () => (
    <div className="popup-overlay">
      {/* className="popup-container" */}
      <div className="popup-container-change-width">
        {/* Close Button */}
        <button
          className="popup-close-change"
          onClick={() => setShowSuccessModal(false)}
        >
          ×
        </button>

        {/* Header Image */}
        <div className="popup-header">
          <img
            src={popimg.src}
            alt="popup header"
            className="popup-header-img"
          />
        </div>

        {/* Body */}
        <div className="popup-body-change">
          {/* <h3>{prod("products.modal.title")}</h3> */}

          {/* Row 1 */}
          <div className="popup-row">
            <div className="popup-col-change">
              <span className="popup-label-change">
                {prod("products.modal.planLabel")}
              </span>
              <span className="popup-value-change">
                {prod("products.modal.planValueFree")}
              </span>
            </div>
            <button className="popup-change-btn" onClick={handlePackageChange}>
              {prod("products.modal.change")}
            </button>
          </div>

          {/* Row 2 */}
          <div className="popup-row">
            <div className="popup-col">
              <span className="popup-label-change">
                {prod("subdomain.goPublicTitle")}
              </span>
              <span className="popup-link-change">
                {process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "")}/
                {subDomainName}
              </span>
            </div>
            <button
              className="popup-change-btn"
              onClick={handleSubdomainChange}
            >
              {prod("products.modal.change")}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="popup-footer-change">
          <button className="popup-launch-change" onClick={handleLaunchClick}>
            {prod("products.modal.launchCta")}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {" "}
      <div className="center-form-block">
        <div className="c-f-b-top">
          <div className="c-f-b-t-header">
            <FormTitle variant={"h1"} text={prod("products.title")} />
            {/* <AlertMessage showMessage={showAlertMessage} /> */}
          </div>
          <div className="c-f-b-t-body">
            <>
              {!isLoading &&
                data?.data?.totalItems &&
                data.data.totalItems > 0 ? (
                <>
                  <div className="b-p-body catalog-products-tables">
                    <DataTableFilter
                      columnData={columnData.map((col) => ({
                        ...col,
                        sortable: false,
                      }))}
                      listCounts={{
                        totalArchived: data?.data?.totalArchived,
                        totalDrafted: data?.data?.totalDrafted,
                        totalItems: data?.data?.totalItems,
                      }}
                      totalRecords={data?.data?.listData?.totalListCount ?? 0}
                      sortField="productName"
                      searchPlaceHolder={t("table-headers.searchProduct")}
                      uniqueKey="_id"
                      sortOrder={queryParams.sortOrder as 1 | -1 | 0}
                      tableData={data?.data?.listData?.result ?? []}
                      searchQuery={queryParams.searchQuery as string}
                      onSort={onSort}
                      viewData={(e: any) => viewProduct(e)}
                      editData={(e: any) => editProduct(e)}
                      archiveData={(e: any) => archiveProduct(e)}
                      onPageChange={(e: DataTablePageEvent) =>
                        changeQueryParams("page", (e?.page ? e.page : 0) + 1)
                      }
                      first={(queryParams.page - 1) * row}
                      rows={row}
                      setSearchQuery={(e: string) =>
                        changeQueryParams("searchQuery", e)
                      }
                      setListStatus={(val: string) =>
                        setQueryParams({
                          sortBy: "",
                          sortOrder: 0,
                          page: 1,
                          limit: row,
                          searchQuery: "",
                          itemStatus: val as listStatusIntersection,
                        })
                      }
                      draftData={(e: any) => draftProduct(e)}
                      checkedItems={selectedProducts}
                      setCheckedItem={(val: Product[]) =>
                        setSelectedProducts(val)
                      }
                      initiateBulkArchive={() => initiateBulkArchive()}
                      noHeaderRequired={false}
                      selectedProd={selectedProd}
                    />{" "}
                    {/* </DataTableFilter> */}
                  </div>{" "}
                </>
              ) : (
                <>
                  {isLoading ? (
                    <div>Loading...</div>
                  ) : (
                    <NoDataScreen
                      image={NoProductImg}
                      title={t("title")}
                      subTitle={t("subtitle")}
                      buttonTitle={t("buttonTitle")}
                      onClickAdd={handleAddProduct}
                      stageData={{
                        data: undefined,
                      }} // onClickImport={}
                    />
                  )}
                </>
              )}
            </>
          </div>
        </div>
        { }
        <div className="c-f-b-bottom">
          <div className="c-f-b-b-left"></div>
          <div className="c-f-b-b-right">
            <ButtonIconRight
              name={common("Continue")}
              onClick={onSubmit}
              disabled={
                currentStepperStatus[FreeCatalogStageKey.products] ===
                "pending" ||
                currentStepperStatus[FreeCatalogStageKey.homepage] === "active"
              }
            >
              <RightArrowIcon />
            </ButtonIconRight>
          </div>
        </div>
      </div>
      <CatalogSubDomain
        visible={sidebarVisible}
        onHide={() => handleClose()}
        onSuccess={handleSubdomainSuccess}
        showPackageSelection={showPackageSelection}
        setShowPackageSelection={setShowPackageSelection}
      />
      {showSuccessModal && <SuccessModal />}
    </>
  );
};

export default Products;
