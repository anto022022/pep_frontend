import { useTranslations } from "next-intl";
import { Dialog } from "primereact/dialog";
import React, { useState } from "react";
import { useAddProductGroupMutation } from "../../_store/apiReducer/productsApi";
import {
  setShowProductGroupDialog,
  showToast,
} from "../../_store/reducers/ui_store";
import { RootState, useAppDispatch, useAppSelector } from "../../_store/store";
import Typography from "../Base/Typography";
import Buttons from "../Buttons/Buttons";

const ProductGroupDialog = () => {
  const dispatch = useAppDispatch();
  const showProductGroupDialog = useAppSelector(
    (state: RootState) => state.uiData.showProductGroupDialog
  );
  const [groupName, setGroupName] = useState<string>("");
  const [addProductGroup] = useAddProductGroupMutation();
  const t = useTranslations("salesProduct.dailogBoxes.addProductGroupDialog");

  const handleSubmit = async () => {
    try {
      await addProductGroup({ groupName }).unwrap();
      dispatch(setShowProductGroupDialog(false));
    } catch (err) {
      console.log(err);
      dispatch(
        showToast({
          title: "Error",
          message: err.data.message || "Something went wrong",
          theme: "error",
        })
      );
      dispatch(setShowProductGroupDialog(false));
    }
  };

  return (
    <div>
      <Dialog
        visible={showProductGroupDialog}
        modal
        className="modal-comp add-new-group-modal"
        closable={true}
        onHide={() => {
          if (!showProductGroupDialog) return;
          dispatch(setShowProductGroupDialog(false));
        }}
        content={() => (
          <>
            <div className="m-c-head">
              <Typography variant="h6" className="modal-title">
                {t("tittle")}
              </Typography>
            </div>
            <div className="m-c-body">
              <input
                type="text"
                className="forms-input wid-100"
                placeholder={t("placeholder")}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setGroupName(e.target.value)
                }
              />
            </div>
            <div className="m-c-footer">
              <Buttons
                className={"btn-outline bg-outline-grey btn-c-sm"}
                text={t("cancelBtn")}
                onClick={() => {
                  dispatch(setShowProductGroupDialog(false));
                }}
              />
              <Buttons
                className={"btn-c-primary btn-c-sm"}
                text={t("submitBtn")}
                onClick={handleSubmit}
              />
            </div>
          </>
        )}
      ></Dialog>
    </div>
  );
};

export default ProductGroupDialog;
