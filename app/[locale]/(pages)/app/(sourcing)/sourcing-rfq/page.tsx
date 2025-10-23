"use client";
import Typography from "@/app/[locale]/_components/Base/Typography";
import ButtonIconLeft from "@/app/[locale]/_components/Buttons/ButtonIconLeft";
import ApprovalStatus from "@/app/[locale]/_components/Common/dataTable/ApprovalStatus";
import DataTableComponent from "@/app/[locale]/_components/Common/dataTable/DataTableComponent";
import { DataTableOptions } from "@/app/[locale]/_components/Common/dataTable/DataTableOptions";
import { ImageColumn } from "@/app/[locale]/_components/Common/dataTable/ImageColumn";
import NoDataScreenWrapper from "@/app/[locale]/_components/Common/dataTable/NoDataScreenWrapper";
import ProfileGroup from "@/app/[locale]/_components/Common/dataTable/ProfileGroup";
import CheckBoxInputs from "@/app/[locale]/_components/form/CheckBoxInputs";
import MobileTableListing from "@/app/[locale]/_components/MobileComponents/MobileTableListing";
import CreateBuyingRequestDialog from "@/app/[locale]/_components/OverLay/CreateBuyingRequestDialog";
import { PricePipe } from "@/app/[locale]/_components/Pipe/PricePipe";
import { TableDatePipe } from "@/app/[locale]/_components/Pipe/TableDatePipe";
import useIsMobile from "@/app/[locale]/_hooks/useIsMobile";
import { TableHeaders } from "@/app/[locale]/_interface/common";
import {
  BuyingRequestListItem,
  ListInterface,
  listStatusIntersection,
} from "@/app/[locale]/_interface/RfqInterface";
import { tabsName } from "@/app/[locale]/_models/common";
import { PricingType } from "@/app/[locale]/_models/StoreFront";
import {
  useGetBuyingRequestListQuery,
  useUpdateBuyingRequestArchiveMutation,
} from "@/app/[locale]/_store/apiReducer/buyingRequestApi";
import {
  setIsAddPostBuyingRequestOpen,
  setIsBulkActionActive,
  showToast,
} from "@/app/[locale]/_store/reducers/ui_store";
import { useAppDispatch, useAppSelector } from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { DataTablePageEvent } from "primereact/datatable";
import { useRef, useState } from "react";
import NoRequestImg from "../../../../../../assets/img/icons/buying-request-noData-icon.svg";
import Plus from "../../../../../../public/img/icons/plus.svg";

const page = () => {
  const dispatch = useAppDispatch();
  const row: number = 7;
  const router = useRouter();
  const t = useTranslations("rfq");
  const br = useTranslations("rfq.buyingRequest");
  const [selectedEditRfq, setSelectedEditRfq] = useState<string>("");

  const isMobile = useIsMobile(1200);
  const isBulkActionActive = useAppSelector(
    (state) => state.uiData.isBulkActionActive
  );
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [queryParams, setQueryParams] = useState<ListInterface>({
    sortBy: "",
    sortOrder: 0,
    page: 1,
    limit: row,
    searchQuery: "",
    isArchived: false,
    isDraft: false,
  });
  const { data, isLoading } = useGetBuyingRequestListQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });

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

  const changeQueryParams = (
    field: string,
    val: string | number | listStatusIntersection
  ) => {
    setQueryParams((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  const handlePostBuyingRequest = () => {
    dispatch(setIsAddPostBuyingRequestOpen(true));
    setSelectedEditRfq("");
  };

  const [selectedRequests, setSelectedRequests] = useState<
    BuyingRequestListItem[]
  >([]);

  const viewRequest = (request: BuyingRequestListItem) => {
    router.push(`sourcing-rfq/br/${request?._id}`);
  };

  const editRequest = (data: BuyingRequestListItem) => {
    setSelectedEditRfq(data._id);
    dispatch(setIsAddPostBuyingRequestOpen(true));
  };

  const [updateArchive] = useUpdateBuyingRequestArchiveMutation();

  const archiveRequest = async (request: BuyingRequestListItem) => {
    await updateArchive({
      id: [request._id],
      isArchived: !request.isArchived,
    });
  };

  const initiateBulkArchive = async () => {
    let filteredIds = selectedRequests.map((ele) => ele._id);
    await updateArchive({
      id: filteredIds,
      isArchived: true,
    })
      .unwrap()
      .then((res) => {
        if (res?.statusCode !== 201) return;
        setSelectedRequests([]);
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

  const columnData: Array<TableHeaders> = [
    {
      id: 1,
      props: { className: "checkbox-row", selectionMode: "multiple" },
      visible: true,
      disabled: true,
    },
    {
      id: 2,
      field: "rfqId",
      header: br("buyingRequestTable.rfqId"),
      visible: true,
      disabled: true,
    },
    {
      id: 3,
      field: "productName",
      header: br("buyingRequestTable.productName"),
      visible: true,
      disabled: true,
      props: {
        sortable: true,
        body: (val: BuyingRequestListItem) => (
          <ImageColumn
            rowData={val}
            src={val?.productImageSrc}
            alt="productName"
            concatData="productName"
            redirect_url="sourcing-rfq"
            redirect_id="_id"
          />
        ),
      },
    },
    {
      id: 4,
      field: "estOrderQuantity",
      header: br("buyingRequestTable.estOrderQty"),
      visible: true,
      disabled: false,
      props: {
        body: (val: BuyingRequestListItem) => (
          <div>
            {val?.estOrderQuantity?.min && val?.estOrderQuantity?.max
              ? `${val?.estOrderQuantity?.min} - ${val?.estOrderQuantity?.max} ${val?.estOrderQuantity?.unit}`
              : val?.estOrderQuantity?.quantity
                ? `${val?.estOrderQuantity?.quantity}-${val?.estOrderQuantity?.unit}`
                : `${val?.estOrderQuantity}`}
          </div>
        ),
      },
    },
    {
      id: 4,
      field: "totalOrderQuantity",
      header: br("buyingRequestTable.orderQty"),
      visible: true,
      disabled: false,
      props: {
        body: (val: BuyingRequestListItem) => (
          <div>
            {val?.totalOrderQuantity?.orderedQuantity &&
              val?.totalOrderQuantity?.orderedUnit
              ? `${val.totalOrderQuantity.orderedQuantity} ${val.totalOrderQuantity.orderedUnit}`
              : 0}
          </div>
        ),
      },
    },
    {
      id: 5,
      field: "preferredUnitPrice",
      header: br("buyingRequestTable.preferredUnitPrice"),
      props: {
        body: (val: BuyingRequestListItem) => (
          <>
            {val?.preferredUnitPrice?.priceRange ? (
              <PricePipe
                pricing={{
                  pricingType: PricingType.PRICE_RANGE,
                  minPrice: val?.preferredUnitPrice?.priceRange?.minPrice,
                  maxPrice: val?.preferredUnitPrice?.priceRange?.maxPrice,
                }}
                currency={val?.preferredUnitPrice?.currency?.symbol}
              />
            ) : (
              <PricePipe
                pricing={val?.pricing}
                currency={val?.preferredUnitPrice?.currency?.symbol}
              />
            )}
          </>
        ),
        className: "price-tr",
      },
      visible: true,
      disabled: true,
    },
    {
      id: 6,
      field: "validTill",
      header: br("buyingRequestTable.validTill"),
      visible: true,
      props: {
        body: (val: BuyingRequestListItem) => (
          <TableDatePipe key={val._id} date={val?.validityDate} />
        ),
      },
      disabled: false,
    },
    {
      id: 7,
      field: "responses",
      header: br("buyingRequestTable.responses"),
      visible: true,
      disabled: true,
      props: {
        body: (val: BuyingRequestListItem) => (
          <div>{val?.leads?.length || "no leads yet"}</div>
        ),
      },
    },
    {
      id: 8,
      field: "status",
      header: br("buyingRequestTable.status"),
      visible: true,
      props: {
        body: (val: BuyingRequestListItem) => (
          <ApprovalStatus key={val._id} status={val?.status} />
        ),
      },
      disabled: false,
    },
    {
      id: 9,
      visible: true,
      props: {
        body: (data: BuyingRequestListItem) => (
          <DataTableOptions
            key={data._id}
            rowData={data}
            viewProduct={(e: BuyingRequestListItem) => viewRequest(e)}
            // editProduct={editRequest}
            archiveProduct={
              queryParams.isArchived
                ? undefined
                : (e: BuyingRequestListItem) => archiveRequest(e)
            }
          />
        ),
      },
      disabled: true,
    },
  ];

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
    setSelectedRequests((prev) => {
      if (checked) {
        return [...prev, item]; // add item
      } else {
        return prev.filter((i) => i._id !== item._id); // remove item
      }
    });
  };

  const sortOptions = [
    {
      label: br("buyingRequestTable.productName"),
      field: "productName",
    },
  ];

  const isAllSelected =
    selectedRequests.length === data?.data?.listData?.result.length;

  const handleAllCheckboxChange = (checked: boolean) => {
    if (checked) {
      setSelectedRequests(data?.data?.listData?.result || []);
    } else {
      setSelectedRequests([]);
    }
  };

  return (
    <>
      {!isMobile ? (
        <div className="body-preview">
          <div className="b-p-header">
            <div className="b-p-left">
              <Typography variant="h1" className="b-p-title">
                {t("buyingRequest.pageTitle")}
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
                <ButtonIconLeft
                  name={t("buyingRequest.requestForQuote.button")}
                  icon={Plus}
                  onClick={handlePostBuyingRequest}
                ></ButtonIconLeft>
              </div>
            ) : null}
          </div>
          {!isLoading && data?.data?.totalItems && data.data.totalItems > 0 ? (
            <>
              <div className="b-p-body">
                <DataTableComponent
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
                  searchPlaceHolder="Search Product"
                  uniqueKey="_id"
                  sortOrder={queryParams.sortOrder as 1 | -1 | 0}
                  tableData={data?.data?.listData?.result ?? []}
                  searchQuery={queryParams.searchQuery as string}
                  onSort={onSort}
                  viewData={(e: BuyingRequestListItem) => viewRequest(e)}
                  editData={editRequest}
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
                      isDraft: val === "draft",
                      isArchived: val === "archive",
                    })
                  }
                  checkedItems={selectedRequests}
                  setCheckedItem={(val: BuyingRequestListItem[]) =>
                    setSelectedRequests(val)
                  }
                  initiateBulkArchive={() => initiateBulkArchive()}
                />{" "}
              </div>{" "}
            </>
          ) : (
            <>
              {isLoading ? (
                <div>Loading...</div>
              ) : (
                <NoDataScreenWrapper
                  title={t("buyingRequest.title")}
                  subTitle={t("buyingRequest.subTitle")}
                  image={NoRequestImg}
                  className="no-bottom-attach"
                >
                  <div>
                    <ButtonIconLeft
                      name={t("buyingRequest.requestForQuote.button")}
                      icon={Plus}
                      onClick={() => handlePostBuyingRequest()}
                    />
                  </div>
                </NoDataScreenWrapper>
              )}
            </>
          )}
        </div>
      ) : (
        <MobileTableListing
          navTitle={t("buyingRequest.pageTitle")}
          navPath="/app"
          activeTab={
            queryParams.isArchived
              ? "archive"
              : queryParams.isDraft
                ? "draft"
                : ""
          }
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
              isDraft: val === "draft",
              isArchived: val === "archive",
            })
          }
          tabsName={tabsName}
          searchValue={queryParams.searchQuery as string}
          setSearchQuery={(e: string) => changeQueryParams("searchQuery", e)}
          searchPlaceholder="Search Product"
          selectedLength={selectedRequests.length}
          isAllSelected={isAllSelected}
          handleSelectAll={handleAllCheckboxChange}
          initiateBulkArchive={initiateBulkArchive}
          first={(queryParams.page - 1) * row}
          rows={row}
          totalRecords={data?.data?.listData?.totalListCount ?? 0}
          onPageChange={(e: DataTablePageEvent) =>
            changeQueryParams("page", (e?.page ? e.page : 0) + 1)
          }
          handleAdd={handlePostBuyingRequest}
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
                        checked={selectedRequests.some(
                          (i) => i._id === item._id
                        )}
                        onchange={(e) =>
                          handleCheckboxChange(e.target.checked, item)
                        }
                      />
                      {item?.productImageSrc && (
                        <div className="t-c-c-img">
                          <Image
                            src={item.productImageSrc}
                            alt={item.productName}
                            width={48}
                            height={48}
                          />
                        </div>
                      )}
                      <div className="t-c-c-info">
                        <ApprovalStatus status={item?.status} />
                        <span className="t-c-c-txt">{item.rfqId}</span>
                        <span className="t-c-c-txt txt-bold">
                          {item?.productName}
                        </span>
                        <span
                          className="t-c-c-txt gap-5px"
                          style={{ display: "flex" }}
                        >
                          {item?.estOrderQuantity?.min &&
                            item?.estOrderQuantity?.max
                            ? `${item?.estOrderQuantity?.min} - ${item?.estOrderQuantity?.max} ${item?.estOrderQuantity?.unit}`
                            : item?.estOrderQuantity?.quantity
                              ? `${item?.estOrderQuantity?.quantity}-${item?.estOrderQuantity?.unit}`
                              : `${item?.estOrderQuantity}`}{" "}
                          {item?.preferredUnitPrice?.priceRange ? (
                            <PricePipe
                              pricing={{
                                pricingType: PricingType.PRICE_RANGE,
                                minPrice:
                                  item?.preferredUnitPrice?.priceRange
                                    ?.minPrice,
                                maxPrice:
                                  item?.preferredUnitPrice?.priceRange
                                    ?.maxPrice,
                              }}
                              currency={
                                item?.preferredUnitPrice?.currency?.symbol
                              }
                            />
                          ) : (
                            <PricePipe
                              pricing={item?.pricing}
                              currency={
                                item?.preferredUnitPrice?.currency?.symbol
                              }
                            />
                          )}
                        </span>
                        <ProfileGroup totalResponses={item?.leads?.length} />
                      </div>
                    </div>
                    <div className="t-c-c-right">
                      <DataTableOptions
                        rowData={item}
                        viewProduct={(e: BuyingRequestListItem) =>
                          viewRequest(e)
                        }
                        editProduct={editRequest}
                        archiveProduct={
                          queryParams.isArchived
                            ? undefined
                            : (e: BuyingRequestListItem) => archiveRequest(e)
                        }
                      />
                    </div>
                  </div>
                ))
              ) : (
                <>No Requests Found</>
              )
            ) : (
              <NoDataScreenWrapper
                title={t("buyingRequest.title")}
                subTitle={t("buyingRequest.subTitle")}
                image={NoRequestImg}
                className="no-bottom-attach"
              >
                <div>
                  <ButtonIconLeft
                    name={t("buyingRequest.requestForQuote.button")}
                    icon={Plus}
                    onClick={() => handlePostBuyingRequest()}
                  />
                </div>
              </NoDataScreenWrapper>
            )
          ) : (
            <>Loading...</>
          )}
        </MobileTableListing>
      )}
      <CreateBuyingRequestDialog selectedEditRfq={selectedEditRfq} />
    </>
  );
};

export default page;
