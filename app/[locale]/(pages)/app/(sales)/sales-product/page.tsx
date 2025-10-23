"use client";

import Typography from "@/app/[locale]/_components/Base/Typography";
import ButtonIconLeft from "@/app/[locale]/_components/Buttons/ButtonIconLeft";
import DataTableFilter, {
  Product,
} from "@/app/[locale]/_components/Common/dataTable/DataTableComponent";
import { DataTableOptions } from "@/app/[locale]/_components/Common/dataTable/DataTableOptions";
import { ImageColumn } from "@/app/[locale]/_components/Common/dataTable/ImageColumn";
import NoDataScreen from "@/app/[locale]/_components/Common/dataTable/NoDataScreen";
import { RowStatus } from "@/app/[locale]/_components/Common/dataTable/RowStatus";
import MobileProductCard from "@/app/[locale]/_components/MobileComponents/MobileProductCard";
import MobileTableListing from "@/app/[locale]/_components/MobileComponents/MobileTableListing";
import { PricePipe } from "@/app/[locale]/_components/Pipe/PricePipe";
import { TableDatePipe } from "@/app/[locale]/_components/Pipe/TableDatePipe";
import { TableDisplayToggle } from "@/app/[locale]/_components/Pipe/TableDisplayToggle";
import { TableEnumPipe } from "@/app/[locale]/_components/Pipe/TableEnumPipe";
import useIsMobile from "@/app/[locale]/_hooks/useIsMobile";
import { useClearLocalStorageOnExit } from "@/app/[locale]/_hooks/useRemoveAiLocalStorage";
import { TableHeaders } from "@/app/[locale]/_interface/common";
import {
  listStatusIntersection,
  SalesProductListInterface,
  StockAvailabilityEnum,
} from "@/app/[locale]/_interface/SalesProductInterface";
import { tabsName } from "@/app/[locale]/_models/common";
import { ProductStageKey } from "@/app/[locale]/_models/StoreFront";
import {
  useGetProductsListQuery,
  useUpdateProductArchiveMutation,
  useUpdateProductVisibilityMutation,
} from "@/app/[locale]/_store/apiReducer/productsApi";
import {
  setIsBulkActionActive,
  showToast,
} from "@/app/[locale]/_store/reducers/ui_store";
import { useAppDispatch, useAppSelector } from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DataTablePageEvent } from "primereact/datatable";
import { useEffect, useRef, useState } from "react";
import NoProductImg from "../../../../../../assets/img/no-product.png";
import Plus from "../../../../../../public/img/icons/plus.svg";

const page = () => {
  const row: number = 7;
  const router = useRouter();
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const isMobile = useIsMobile(1200);
  const dispatch = useAppDispatch();
  const [queryParams, setQueryParams] = useState<SalesProductListInterface>({
    sortBy: "",
    sortOrder: 0,
    page: 1,
    limit: row,
    searchQuery: "",
    itemStatus: "",
  });
  const isBulkActionActive = useAppSelector(
    (state) => state.uiData.isBulkActionActive
  );
  const [mobileProducts, setMobileProducts] = useState<any[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const t = useTranslations("salesProduct.noProductsScreen");

  const { data, isLoading, refetch } = useGetProductsListQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
  const [updateProductVisibility] = useUpdateProductVisibilityMutation();
  const [updateProductArchive] = useUpdateProductArchiveMutation();

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    if (data?.data?.listData?.result) {
      setMobileProducts(data.data.listData.result);
    }
  }, [isMobile, data]);

  const onSort = () => {
    setQueryParams((prev) => ({
      ...prev,
      sortBy: "productName",
      sortOrder: !prev.sortOrder ? 1 : prev.sortOrder === -1 ? 1 : -1,
    }));
  };

  const handleMobileSort = (field: string) => {
    setQueryParams((prev) => ({
      ...prev,
      sortBy: prev.sortBy === field ? "" : field,
      sortOrder: prev.sortBy === field ? 0 : 1,
    }));
  };

  const viewProduct = (data: any) => {
    router.push(`sales-product/${data?._id}`);
  };

  const editProduct = (data: any) => {
    router.push(`sales-product/form?id=${data?._id}`);
    // http://localhost:3000/en/app/sales-product/form?id=67f776c87bf0efcd2b0bcd09
  };

  const archiveProduct = async (id: any) => {
    try {
      await updateProductArchive({
        id: [id?._id],
        // isArchived: !id?.isArchived,
      }).unwrap();
      dispatch(
        showToast({
          title: "Success",
          message: "Product Status Updated Successfully",
          theme: "success",
        })
      );
    } catch (error) {
      dispatch(
        showToast({
          title: "Error",
          message: `Item failed to Archived`,
          theme: "error",
        })
      );
    }
  };

  const draftProduct = (id: string) => {
    // console.log(id);
  };

  const switchVisibility = async (val: any) => {
    await updateProductVisibility({
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

  const handleCreateVariant = (val: any) => {
    router.push(
      `sales-product/form?id=${val?._id}&currentForm=${ProductStageKey.Specification}`
    );
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
            src="productImageSrc"
            alt="productName"
            concatData="productName"
            redirect_id="_id"
            redirect_url="sales-product"
          />
        ),
      },
    },
    {
      id: 3,
      field: "variantsCount",
      header: t("table-headers.variantsCount"),
      props: {
        body: (data: any) => {
          return data?.variantsCount > 0
            ? data?.variantsCount
            : t("noVariants");
        },
      },
      visible: true,
      disabled: false,
    },
    {
      id: 4,
      field: "categoryName",
      header: t("table-headers.category"),
      // props: {
      //   body: (data: any) => {
      //     return data?.variantsCount > 0
      //       ? data?.variantsCount
      //       : t("noVariants");
      //   },
      // },
      visible: true,
      disabled: true,
    },
    {
      id: 5,
      field: "stockAvailability",
      header: t("table-headers.stockAvailability"),
      props: {
        body: (data: any) => {
          return (
            <TableEnumPipe
              value={data?.stockAvailability ?? ""}
              enumType={StockAvailabilityEnum}
            />
          );
        },
      },
      visible: true,
      disabled: true,
    },
    {
      id: 6,
      field: "",
      header: "Display",
      props: {
        body: (data: any) => {
          return (
            <TableDisplayToggle
              key={data._id}
              id={data._id}
              value={data?.showcase ?? false}
              disabled={data?.status !== "live"}
              onToggle={() => switchVisibility(data)}
            />
          );
        },
      },
      visible: true,
      disabled: true,
    },
    {
      id: 7,
      field: "createdAt",
      header: t("table-headers.createdAt"),
      visible: false,
      props: {
        body: (val: any) => (
          <TableDatePipe key={val._id} date={val?.createdAt} />
        ),
      },
      disabled: false,
    },
    {
      id: 8,
      field: "minPrice",
      header: t("table-headers.minPrice"),
      visible: true,
      props: {
        body: (val: any) => (
          <PricePipe
            pricing={val?.pricing ?? {}}
            key={val._id}
            currency={
              val?.currency
                ? typeof val?.currency === "string"
                  ? val?.currency
                  : val?.currency?.symbol
                : "₹"
            }
          />
        ),
        className: "price-tr",
      },
      disabled: false,
    },
    {
      id: 9,
      field: "skuCode",
      header: t("table-headers.skuCode"),
      visible: true,
      disabled: false,
    },
    {
      id: 10,
      field: "status",
      header: t("table-headers.status"),
      visible: true,
      props: {
        body: (val: any) => (
          <RowStatus key={val._id} rowData={val} status={val.status} />
        ),
      },
      disabled: false,
    },
    {
      id: 11,
      visible: true,
      props: {
        body: (data: any) => (
          <DataTableOptions
            key={data._id}
            rowData={data}
            viewProduct={(e: any) => viewProduct(e)}
            editProduct={(e: any) => editProduct(e)}
            archiveProduct={
              queryParams.itemStatus === "archive"
                ? undefined
                : (e: any) => archiveProduct(e)
            }
            createVariant={
              data.productStage[ProductStageKey.Specification] !== "pending"
                ? (e: any) => handleCreateVariant(e)
                : undefined
            }
          />
        ),
      },
      disabled: true,
    },
  ];

  const handleAddProduct = () => {
    router.push("sales-product/form");
    useClearLocalStorageOnExit();
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

  const handleTouchStart = () => {
    timerRef.current = setTimeout(() => {
      dispatch(setIsBulkActionActive(true));
    }, 1000);
  };

  const handleTouchEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (!isBulkActionActive) {
      // console.log("Short tap");
    }
  };

  const handleTouchCancel = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const handleCheckboxChange = (checked: boolean, item: any) => {
    setSelectedProducts((prev) => {
      if (checked) {
        return [...prev, item]; // add item
      } else {
        return prev.filter((i) => i._id !== item._id); // remove item
      }
    });
  };

  const sortOptions = [
    {
      label: t("table-headers.productName"),
      field: "productName",
    },
    {
      label: t("table-headers.createdAt"),
      field: "createdAt",
    },
  ];

  const isAllSelected = selectedProducts.length === mobileProducts.length;

  const handleAllCheckboxChange = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(mobileProducts);
    } else {
      setSelectedProducts([]);
    }
  };

  return (
    <>
      {!isMobile ? (
        <div className="body-preview">
          <div className="b-p-header">
            <div className="b-p-left">
              <Typography variant="h1" className="b-p-title">
                {t("productsISell")}
              </Typography>
            </div>

            {!isLoading && data?.data?.totalItems ? (
              <div className="b-p-right">
                {/* <ButtonIconLeftOutline
              name={"Import"}
              className={"bg-outline-grey custom-width"}
            >
              <ImportIcon width={17} height={18} />
            </ButtonIconLeftOutline> */}
                <Link href={"sales-product/form"} onClick={handleAddProduct}>
                  <ButtonIconLeft
                    name={t("buttonTitle")}
                    icon={Plus}
                  ></ButtonIconLeft>
                </Link>
              </div>
            ) : null}
          </div>
          {!isLoading && data?.data?.totalItems && data.data.totalItems > 0 ? (
            <>
              <div className="b-p-body">
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
                  setCheckedItem={(val: Product[]) => setSelectedProducts(val)}
                  initiateBulkArchive={() => initiateBulkArchive()}
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
                  extraTitle={t('secondTitle')}
                  subTitle={t("subtitle")}
                  buttonTitle={t("buttonTitle")}
                  onClickAdd={handleAddProduct}
                // onClickImport={}
                />
              )}
            </>
          )}
        </div>
      ) : (
        <>
          <MobileTableListing
            navTitle={t("productsISell")}
            navPath="/app"
            activeTab={queryParams?.itemStatus ?? ""}
            listCounts={{
              totalArchived: data?.data?.totalArchived,
              totalDrafted: data?.data?.totalDrafted,
              totalItems: data?.data?.totalItems,
            }}
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
            tabsName={tabsName}
            searchValue={queryParams.searchQuery as string}
            setSearchQuery={(e: string) => changeQueryParams("searchQuery", e)}
            searchPlaceholder={t("table-headers.searchProduct")}
            selectedLength={selectedProducts.length}
            isAllSelected={isAllSelected}
            handleSelectAll={handleAllCheckboxChange}
            initiateBulkArchive={initiateBulkArchive}
            first={(queryParams.page - 1) * row}
            rows={row}
            totalRecords={data?.data?.listData?.totalListCount ?? 0}
            onPageChange={(e: DataTablePageEvent) =>
              changeQueryParams("page", (e?.page ? e.page : 0) + 1)
            }
            handleAdd={() => router.push("sales-product/form")}
            sortOptions={sortOptions}
            handleSort={handleMobileSort}
            activeSort={queryParams.sortBy}
            isEmpty={isLoading || (data?.data?.totalItems ?? 0) === 0}
          >
            {!isLoading ? (
              (data?.data?.totalItems ?? 0) > 0 ? (
                mobileProducts.length > 0 ? (
                  mobileProducts.map((item, index) => (
                    <MobileProductCard
                      key={item._id || index}
                      item={item}
                      selectedProducts={selectedProducts}
                      handleCheckboxChange={handleCheckboxChange}
                      handleTouchStart={handleTouchStart}
                      handleTouchEnd={handleTouchEnd}
                      handleTouchCancel={handleTouchCancel}
                      viewProduct={viewProduct}
                      editProduct={editProduct}
                      archiveProduct={(e) => archiveProduct(e)}
                      handleCreateVariant={(e) => handleCreateVariant(e)}
                      queryParams={queryParams}
                    />
                  ))
                ) : (
                  <>No Products Found</>
                )
              ) : (
                <NoDataScreen
                  image={NoProductImg}
                  title={t("title")}
                  extraTitle={t('secondTitle')}
                  subTitle={t("subtitle")}
                  buttonTitle={t("buttonTitle")}
                  onClickAdd={handleAddProduct}
                // onClickImport={}
                />
              )
            ) : (
              <>Loading...</>
            )}
          </MobileTableListing>
        </>
      )}
    </>
  );
};

export default page;
