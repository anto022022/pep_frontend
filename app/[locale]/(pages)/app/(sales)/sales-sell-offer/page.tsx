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
import { PricePipe } from "@/app/[locale]/_components/Pipe/PricePipe";
import { TableDatePipe } from "@/app/[locale]/_components/Pipe/TableDatePipe";
import { TableDisplayToggle } from "@/app/[locale]/_components/Pipe/TableDisplayToggle";
import { TableEnumPipe } from "@/app/[locale]/_components/Pipe/TableEnumPipe";
import { useClearLocalStorageOnExit } from "@/app/[locale]/_hooks/useRemoveAiLocalStorage";
import { TableHeaders } from "@/app/[locale]/_interface/common";
import {
  listStatusIntersection,
  SalesProductListInterface,
} from "@/app/[locale]/_interface/SalesProductInterface";
import {
  useAddOfferDuplicateMutation,
  useGetOffersListQuery,
  useUpdateOfferArchiveMutation,
  useUpdateOfferVisibilityMutation,
} from "@/app/[locale]/_store/apiReducer/sellOfferApi";
import {
  setIsBulkActionActive,
  showToast,
} from "@/app/[locale]/_store/reducers/ui_store";
import { useAppDispatch, useAppSelector } from "@/app/[locale]/_store/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DataTablePageEvent } from "primereact/datatable";
import { useEffect, useRef, useState } from "react";
import Plus from "../../../../../../public/img/icons/plus.svg";
// import NoOfferImg from "../../../../../../assets/img/sell-offer-empty-product.png";
import CheckBoxInputs from "@/app/[locale]/_components/form/CheckBoxInputs";
import MobileTableListing from "@/app/[locale]/_components/MobileComponents/MobileTableListing";
import useIsMobile from "@/app/[locale]/_hooks/useIsMobile";
import { getImageUrl } from "@/app/[locale]/_hooks/utility";
import { OfferTypeEnum } from "@/app/[locale]/_interface/SellOfferInterface";
import { tabsName } from "@/app/[locale]/_models/common";
import { setPreview } from "@/app/[locale]/_store/reducers/preview_store";
import { setStepperStatus } from "@/app/[locale]/_store/reducers/stepper_status_store";
import NoOffersImg from "@/assets/img/no-seller-offers.png";
import { useTranslations } from "next-intl";
import Image from "next/image";

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
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const t = useTranslations("salesOffer.noOffersScreen");
  const o = useTranslations("salesOffer.offerTable");

  const { data, isLoading, refetch } = useGetOffersListQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
  // const [updateProductVisibility] = useUpdateProductVisibilityMutation();
  const [updateOfferVisibility] = useUpdateOfferVisibilityMutation();
  const [updateOfferArchive] = useUpdateOfferArchiveMutation();
  const [useOfferDuplicate] = useAddOfferDuplicateMutation();

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

  const handleMobileSort = (field: string) => {
    setQueryParams((prev) => ({
      ...prev,
      sortBy: prev.sortBy === field ? "" : field,
      sortOrder: prev.sortBy === field ? 0 : 1,
    }));
  };

  const viewProduct = (data: any) => {
    router.push(`sales-sell-offer/${data?._id}`);
  };

  const editProduct = (data: any) => {
    router.push(`sales-sell-offer/form?id=${data?._id}`);
    // http://localhost:3000/en/app/sales-product/form?id=67f776c87bf0efcd2b0bcd09
  };

  const archiveProduct = async (id: any) => {
    try {
      await updateOfferArchive({
        id: [id?._id],
        // isArchived: !id?.isArchived,
      }).unwrap();
      dispatch(
        showToast({
          title: "Success",
          message: "Offer Archived Successfully",
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

  const duplicateItem = async (id: any) => {
    await useOfferDuplicate(id?._id).unwrap();
  };

  const draftProduct = (id: string) => {
    // console.log(id);
  };

  const switchVisibility = async (toggle: any, val: any) => {

    await updateOfferVisibility({
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
            src="productImageSrc"
            alt="productName"
            concatData="productName"
            redirect_url="sales-sell-offer"
            redirect_id="_id"
          />
        ),
      },
    },
    {
      id: 3,
      field: "offerType",
      header: t("table-headers.offer-type"),
      props: {
        body: (data: any) => {
          return (
            <TableEnumPipe
              value={data?.offerType ?? ""}
              enumType={OfferTypeEnum}
            />
          );
        },
      },
      visible: true,
      disabled: false,
    },
    {
      id: 4,
      field: "offerTitle",
      header: t("table-headers.offer-title"),
      visible: true,
      disabled: true,
    },
    {
      id: 5,
      field: "price",
      header: t("table-headers.offer-price"),
      props: {
        body: (val: any) => (
          <PricePipe
            pricing={val?.price ?? {}}
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
      visible: true,
      disabled: true,
    },
    {
      id: 6,
      field: "minQty",
      header: t("table-headers.minQty"),
      visible: true,
      disabled: true,
    },
    {
      id: 7,
      field: "",
      header: t("table-headers.display"),
      props: {
        body: (data: any) => {
          return (
            <TableDisplayToggle
              key={data._id}
              id={data._id}
              value={data?.showcase ?? false}
              disabled={data?.status !== "live"}
              onToggle={(toggle) => switchVisibility(toggle, data)}
            />
          );
        },
      },
      visible: true,
      disabled: true,
    },
    {
      id: 8,
      field: "createdAt",
      header: t("table-headers.createdAt"),
      visible: true,
      props: {
        body: (val: any) => (
          <TableDatePipe key={val._id} date={val?.createdAt} />
        ),
      },
      disabled: false,
    },
    {
      id: 9,
      field: "offerEndDate",
      header: t("table-headers.offerEndDate"),
      visible: true,
      props: {
        body: (val: any) => (
          <TableDatePipe key={val._id} date={val?.offerEndDate} />
        ),
      },
      disabled: false,
    },
    {
      id: 10,
      field: "status",
      header: t("table-headers.status"),
      visible: true,
      props: {
        body: (val: any) => (
          <RowStatus key={val._id} rowData={val} status={val?.status} />
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
            duplicateItem={(e: any) => duplicateItem(e)}
            archiveProduct={
              queryParams.itemStatus === "archive"
                ? undefined
                : (e: any) => archiveProduct(e)
            }
          />
        ),
      },
      disabled: true,
    },
  ];

  const handleAddOffer = () => {
    dispatch(setPreview(null));
    dispatch(setStepperStatus({}));
    useClearLocalStorageOnExit();
    router.push("sales-sell-offer/form");
  };

  const initiateBulkArchive = async () => {
    let filteredIds = selectedProducts.map((ele) => ele._id);
    await updateOfferArchive({
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

  const isAllSelected =
    selectedProducts.length === data?.data?.listData?.result.length;

  const handleAllCheckboxChange = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(data?.data?.listData?.result || []);
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
                {o("sellOffers")}
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
                <Link href={"sales-sell-offer/form"} onClick={handleAddOffer}>
                  <ButtonIconLeft
                    name={o("newSellOffer")}
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
                  searchPlaceHolder={o("selectProduct")}
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
                  image={NoOffersImg}
                  title={t("title")}
                  buttonTitle={t("buttonTitle")}
                  subTitle={t("subtitle")}
                  onClickAdd={handleAddOffer}
                // onClickImport={}
                />
              )}
            </>
          )}
        </div>
      ) : (
        <MobileTableListing
          navTitle={o("sellOffers")}
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
          searchPlaceholder={o("selectProduct")}
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
          handleAdd={() => router.push("sales-sell-offer/form")}
          sortOptions={sortOptions}
          handleSort={handleMobileSort}
          activeSort={queryParams.sortBy}
          isEmpty={isLoading || (data?.data?.totalItems ?? 0) === 0}
        >
          {!isLoading ? (
            data?.data?.totalItems && data.data.totalItems > 0 ? (
              data?.data?.listData?.result.length > 0 ? (
                data?.data?.listData?.result.map((item, index) => (
                  <div
                    className="table-card-comp"
                    key={index}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={handleTouchCancel}
                  >
                    <div className="t-c-c-left">
                      <CheckBoxInputs
                        id={item?._id}
                        className="sm light-bg"
                        checked={selectedProducts.some(
                          (i) => i._id === item._id
                        )}
                        onchange={(e) =>
                          handleCheckboxChange(e.target.checked, item)
                        }
                      />
                      {item?.productImageSrc && (
                        <div className="t-c-c-img">
                          <Image
                            src={getImageUrl(item?.productImageSrc)}
                            alt={item?.productName}
                            width={48}
                            height={48}
                            sizes="100vw"
                          />
                        </div>
                      )}
                      <div className="t-c-c-info">
                        <RowStatus rowData={item} status={item.status} />
                        <span className="t-c-c-txt txt-bold">
                          {item?.productName}
                        </span>
                        <span className="t-c-c-txt">{item?.offerTitle}</span>
                        <span className="t-c-c-txt">
                          {item?.minQty && `${item?.minQty} ${item?.unit} | `}
                          {item?.offerEndDate && (
                            <TableDatePipe date={item?.offerEndDate} />
                          )}
                        </span>
                        <span className="t-c-c-txt txt-bold">
                          <PricePipe
                            pricing={item?.price ?? {}}
                            currency={
                              item?.currency
                                ? typeof item?.currency === "string"
                                  ? item?.currency
                                  : item?.currency?.symbol
                                : "₹"
                            }
                          />
                        </span>
                      </div>
                    </div>
                    <div className="t-c-c-right">
                      <DataTableOptions
                        rowData={item}
                        viewProduct={(e: any) => viewProduct(e)}
                        editProduct={(e: any) => editProduct(e)}
                        duplicateItem={(e: any) => duplicateItem(e)}
                        archiveProduct={
                          queryParams.itemStatus === "archive"
                            ? undefined
                            : (e: any) => archiveProduct(e)
                        }
                      />
                    </div>
                  </div>
                ))
              ) : (
                <>No Offers Found</>
              )
            ) : (
              <NoDataScreen
                image={NoOffersImg}
                title={t("title")}
                buttonTitle={t("buttonTitle")}
                subTitle={t("subtitle")}
                onClickAdd={handleAddOffer}
              // onClickImport={}
              />
            )
          ) : (
            <>Loading...</>
          )}
        </MobileTableListing>
      )}
    </>
  );
};

export default page;
