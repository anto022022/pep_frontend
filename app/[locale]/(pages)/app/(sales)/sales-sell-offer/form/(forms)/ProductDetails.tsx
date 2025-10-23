import ButtonIconLeftOutline from "@/app/[locale]/_components/Buttons/ButtonIconLeftOutline";
import ButtonIconRight from "@/app/[locale]/_components/Buttons/ButtonIconRight";
import {
  AddNewProductIcon,
  ExistingProductIcon,
  InfoIcon,
  RightArrowIcon,
  SelectProductIcon,
} from "@/app/[locale]/_components/Icons/SVGIcons";
import AlertMessage from "@/app/[locale]/_components/Messages/AlertMessage";
import AddNewProductDialog from "@/app/[locale]/_components/OverLay/AddNewProductDialog";
import AlertDialog from "@/app/[locale]/_components/OverLay/AlertDialog";
import FormTitle from "@/app/[locale]/_components/StoreFront/Forms/FormTitle";
import SearchDropdown from "@/app/[locale]/_components/StoreFront/Forms/SearchDropdown";
import { getImageUrl } from "@/app/[locale]/_hooks/utility";
import { DropdownlistInterface } from "@/app/[locale]/_interface/SalesProductInterface";
import { ProductOfferKey } from "@/app/[locale]/_models/StoreFront";
import { useLazyGetProductDropdownListQuery } from "@/app/[locale]/_store/apiReducer/productsApi";
import {
  useAddCreateOfferMutation,
  useGetOfferFormDetailsQuery,
} from "@/app/[locale]/_store/apiReducer/sellOfferApi";
import { setCurrentForm } from "@/app/[locale]/_store/reducers/stepper_status_store";
import { setIsAddNewProductSidebarOpen } from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Messages } from "primereact/messages";

import { useEffect, useState } from "react";

export interface quickProd {
  productName?: string;
  _id: string | undefined;
}

const ProductDetails = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const t = useTranslations("salesOffer.productDetails");
  const common = useTranslations("common");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [value, setValue] = useState<quickProd | null>(null);
  const [_inputValue, setInputValue] = useState("");
  const [items, setItems] = useState([]);
  const [addOfferProduct] = useAddCreateOfferMutation();
  const [showOfferDialog, setShowOfferDialog] = useState(false);

  const currentStepperStatus = useAppSelector(
    (state: RootState) =>
      state.stepperStatus.stepperStatus as Record<string, string>
  );
  const isAddNewProductSidebarOpen = useAppSelector(
    (state: RootState) => state.uiData.isAddNewProductSidebarOpen
  );

  const [isExistingProduct, setIsExistingProduct] = useState(false);
  const [getProductDropdownlist] = useLazyGetProductDropdownListQuery();

  const [queryParams, setQueryParams] = useState<DropdownlistInterface>({
    page: 1,
    searchQuery: "",
  });

  const { data, isSuccess } = useGetOfferFormDetailsQuery(
    {
      id: id ?? "",
      stage: ProductOfferKey.ProductDetails,
    },
    {
      skip: !id,
    }
  );

  const search = async (event: any) => {
    let searchQuery = event.query.toLowerCase();

    setQueryParams((prev) => ({
      ...prev,
      searchQuery,
      page: 1,
    }));
    const { data } = await getProductDropdownlist({
      ...queryParams,
      searchQuery,
      page: 1,
    });

    setItems(data?.data || []);
  };

  const customOptionTemplate = (option: any) => {
    return (
      <div className="option-product-item">
        <div className="o-p-i-img">
          <Image
            src={getImageUrl(option.productImageSrc)}
            width={52}
            height={52}
            alt={option.productName}
            sizes="100vw"
          />
        </div>
        <div className="o-p-i-content">
          <span className="o-p-i-c-txt">{option.productName}</span>
        </div>
      </div>
    );
  };

  const showAlertMessage = (msgsRef: React.RefObject<Messages | null>) => {
    if (msgsRef.current) {
      msgsRef.current.clear();
      msgsRef.current.show([
        {
          sticky: true,
          severity: "info",
          icon: <InfoIcon className={"alert-icon"} />,
          detail: t("alert"),
        },
      ]);
    }
  };
  const handleClick = () => {
    if (currentStepperStatus.ProductDetails != "completed") {
      setIsExistingProduct(true);
    }
    getProductDropdownlist(queryParams);
  };

  const handleContinue = () => {
    if (value?._id) {
      moveToOffer(value?._id);
      // router.push("./");
    }
  };

  const moveToOffer = async (id: string, skipCacheUpdate = false) => {
    try {
      const response = await addOfferProduct({
        productId: id,
        skipCacheUpdate,
      }).unwrap();
      if (response) {
        const offerIdNew = response?.data?.sellOfferId;
        router.push(`?${new URLSearchParams({ id: offerIdNew })}`);

        // dispatch(setStepperStatus({ ...currentStepperStatus, [ProductOfferKey.ProductDetails]: "completed", [ProductOfferKey.OfferDetails]: "active" }));
        if (!skipCacheUpdate) {
          dispatch(setCurrentForm(ProductOfferKey.OfferDetails));
        }
      }
    } catch (error: any) {
      if (error.data.errorCode === 201998 || error.data.errorCode === 201999) {
        setShowOfferDialog(true);
      }
    }
  };
  useEffect(() => {
    if (isSuccess && data) {
      setValue(data.data);
    }
  }, [data, isSuccess]);

  return (
    <>
      <div className="center-form-block">
        <div className="c-f-b-top">
          <div className="c-f-b-t-header">
            <FormTitle variant={"h1"} text={t("selectProduct.title")}>
              <SelectProductIcon />
            </FormTitle>
            <AlertMessage showMessage={showAlertMessage} />
          </div>

          <div className="c-f-b-t-body">
            <div className="forms-block">
              {!(currentStepperStatus.ProductDetails == "completed") && (
                <div className="forms-group">
                  <div className="f-g-input-horiz">
                    <div
                      className={`select-product-comp ${isExistingProduct ? "active" : ""
                        }`}
                      onClick={handleClick}
                    >
                      <div className="s-p-c-icon">
                        <ExistingProductIcon />
                      </div>
                      <div className="s-p-c-content">
                        <span className="s-p-c-c-title">
                          {t("existingProduct.title")}
                        </span>
                        <span className="s-p-c-c-label">
                          {t("existingProduct.description")}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`select-product-comp ${isAddNewProductSidebarOpen ? "active" : ""
                        }`}
                      onClick={() => {
                        setIsExistingProduct(false);
                        if (
                          currentStepperStatus.ProductDetails != "completed"
                        ) {
                          dispatch(setIsAddNewProductSidebarOpen(true));
                        }
                      }}
                    >
                      <div className="s-p-c-icon">
                        <AddNewProductIcon />
                      </div>
                      <div className="s-p-c-content">
                        <span className="s-p-c-c-title">
                          {t("newProduct.title")}
                        </span>
                        <span className="s-p-c-c-label">
                          {t("newProduct.description")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {(isExistingProduct ||
                currentStepperStatus.ProductDetails == "completed") && (
                  <div className="forms-group">
                    <label className="f-g-label">
                      {t("existingProduct.dropdownTitle")}
                    </label>
                    <SearchDropdown
                      placeholder={t("selectProduct.title")}
                      items={items}
                      value={value}
                      onChange={(selected) => {
                        setValue(selected);
                        setInputValue(selected?.productName || "");
                      }}
                      disabled={
                        currentStepperStatus.ProductDetails == "completed"
                      }
                      search={search}
                      field="productName"
                      customOptionTemplate={customOptionTemplate}
                    />
                  </div>
                )}
            </div>
          </div>
        </div>
        <AlertDialog
          visible={showOfferDialog}
          subTxt={t("offerMessage")}
          continueOnclick={() => {
            setShowOfferDialog(false);
          }}
          continueLabel="Ok"
        />

        <div className="c-f-b-bottom">
          <div className="c-f-b-b-left"></div>
          <div className="c-f-b-b-right">
            <ButtonIconLeftOutline
              name={common("saveAndContinue")}
              className={"bg-outline-grey custom-width"}
              onClick={handleContinue}
            ></ButtonIconLeftOutline>
            <ButtonIconRight
              name={common("Continue")}
              disabled={currentStepperStatus.ProductDetails == "completed"}
              onClick={handleContinue}
            >
              <RightArrowIcon />
            </ButtonIconRight>
          </div>
        </div>
      </div>

      <AddNewProductDialog onContinue={moveToOffer} />
    </>
  );
};
export default ProductDetails;
