"use client";
import ButtonIcon from "@/app/[locale]/_components/Buttons/ButtonIcon";
import ReusableSidebar from "@/app/[locale]/_components/OverLay/ReUsableSidebar";
import useIsMobile from "@/app/[locale]/_hooks/useIsMobile";
import { setTableActiveId } from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";
import { useTranslations } from "next-intl";
import { OverlayPanel } from "primereact/overlaypanel";
import { useEffect, useRef } from "react";
import {
  ArchiveIcon,
  CloseIcon,
  DuplicateIcon,
  EditIcon,
  OptionsIcon,
  ViewDetailsIcon,
} from "../../Icons/SVGIcons";

interface DataTableOptionsProps {
  viewProduct?: (id: any) => void;
  editProduct?: (id: any) => void;
  archiveProduct?: (id: any) => void;
  draftProduct?: (id: any) => void;
  duplicateItem?: (id: any) => void;
  connectNow?: (id: any) => void;
  createReminder?: (id: any) => void;
  convertCustomer?: (id: any) => void;
  sendQuotation?: (id: any) => void;
  createVariant?: (id: any) => void;
  rowData: any;
}

export const DataTableOptions: React.FC<DataTableOptionsProps> = ({
  rowData,
  viewProduct,
  editProduct,
  archiveProduct,
  duplicateItem,
  connectNow,
  createReminder,
  convertCustomer,
  sendQuotation,
  createVariant,
}) => {
  const optionsRef = useRef<HTMLDivElement>(null);
  const overLayRef = useRef<OverlayPanel>(null);
  const t = useTranslations("salesOffer.offerTable");
  const o = useTranslations("salesConnect.connectTable");
  const activeId = useAppSelector(
    (state: RootState) => state.uiData.tableActiveId
  );
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile(1200);

  useEffect(() => {
    if (!isMobile && activeId !== rowData?._id && overLayRef.current) {
      overLayRef.current?.hide();
    }
  }, [activeId, rowData, isMobile]);

  const handleToggle = (e: any) => {
    e.stopPropagation();
    if (rowData._id === activeId) {
      dispatch(setTableActiveId(null));
      if (!isMobile) overLayRef.current?.hide();
    } else {
      dispatch(setTableActiveId(rowData._id));
      if (!isMobile) overLayRef.current?.toggle(e);
    }
  };

  const optionsConfig = [
    viewProduct && {
      onClick: () => viewProduct(rowData),
      icon: <ViewDetailsIcon />,
      label: t("viewDetails"),
    },
    editProduct && {
      onClick: () => editProduct(rowData),
      icon: <EditIcon />,
      label: t("edit"),
    },
    archiveProduct && {
      onClick: () => archiveProduct(rowData),
      icon: <ArchiveIcon />,
      label: rowData?.isArchived ? t("unarchive") : t("archive"),
    },
    duplicateItem && {
      onClick: () => duplicateItem(rowData),
      icon: <DuplicateIcon />,
      label: t("duplicate"),
    },
    createVariant && {
      onClick: () => createVariant(rowData),
      icon: <EditIcon />,
      label: t("createVariant"),
    },
    connectNow && {
      onClick: () => connectNow(rowData),
      icon: <EditIcon />,
      label: o("connect"),
    },
    createReminder && {
      onClick: () => createReminder(rowData),
      icon: <EditIcon />,
      label: o("reminder"),
    },
    convertCustomer && {
      onClick: () => convertCustomer(rowData),
      icon: <EditIcon />,
      label: o("convert"),
    },
    sendQuotation && {
      onClick: () => sendQuotation(rowData),
      icon: <EditIcon />,
      label: o("quotation"),
    },
  ].filter(Boolean); // remove falsy entries

  const isVisible = activeId === rowData?._id;

  return (
    <div ref={optionsRef} onClick={handleToggle}>
      <span className="cursor-pointer">
        <OptionsIcon className="trigger-icon" />
      </span>

      {/* Web - Overlay */}
      {!isMobile && (
        <OverlayPanel
          ref={overLayRef}
          className={`table-options-block overlay-table-options ${isVisible ? "active" : ""
            }`}
          onHide={() => {
            if (isVisible) dispatch(setTableActiveId(null));
          }}
        >
          <div className="t-o-b-dropdown">
            {optionsConfig.map((option, idx) => (
              <button key={idx} className="t-o-btn" onClick={option?.onClick}>
                {option?.icon}
                <span className="t-o-b-txt">{option?.label}</span>
              </button>
            ))}
          </div>
        </OverlayPanel>
      )}

      {/* Mobile - Sidebar */}
      {isMobile && (
        <ReusableSidebar
          visible={isVisible}
          onHide={() => {
            // if (isVisible) dispatch(setTableActiveId(null));
          }}
          position="bottom"
          className={"max-height sort-bottom-sheet"}
        >
          <div className="b-s-c-header">
            <div className="b-s-c-h-left"></div>
            <div className="b-s-c-h-right">
              <ButtonIcon
                className={"btn-icon"}
                onClick={() => dispatch(setTableActiveId(null))}
              >
                <CloseIcon />
              </ButtonIcon>
            </div>
          </div>
          <div className="b-s-c-body pad-unset">
            <ul className="three-dots-options-ul">
              {optionsConfig.map((option, idx) => (
                <li key={idx}>
                  <button
                    key={idx}
                    className="t-o-btn"
                    onClick={option?.onClick}
                  >
                    {option?.icon}
                    <span className="t-o-b-txt">{option?.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </ReusableSidebar>
      )}
    </div>
  );
};
