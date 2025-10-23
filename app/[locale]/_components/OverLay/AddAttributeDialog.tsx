import { useTranslations } from "next-intl";
import { Dialog } from "primereact/dialog";
import React, { FC, useState } from "react";
import { setShowAddAttributeDialog } from "../../_store/reducers/ui_store";
import { RootState, useAppDispatch, useAppSelector } from "../../_store/store";
import Typography from "../Base/Typography";
import Buttons from "../Buttons/Buttons";

interface AddAttributeDialogInterface {
  onSubmit: (attributeName: string) => void;
}

const AddAttributeDialog: FC<AddAttributeDialogInterface> = ({ onSubmit }) => {
  const dispatch = useAppDispatch();
  const showAddAttributeDialog = useAppSelector(
    (state: RootState) => state.uiData.showAddAttributeDialog
  );
  const [attributeName, setAttributeName] = useState<string>("");
  const t = useTranslations("salesProduct.dailogBoxes.addAttributDialog");
  const handleSubmit = async () => {
    onSubmit(attributeName);
    dispatch(setShowAddAttributeDialog(false));
  };

  return (
    <div>
      <Dialog
        visible={showAddAttributeDialog}
        modal
        className="modal-comp add-new-group-modal"
        closable={true}
        onHide={() => {
          if (!showAddAttributeDialog) return;
          dispatch(setShowAddAttributeDialog(false));
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
                  setAttributeName(e.target.value)
                }
              />
            </div>
            <div className="m-c-footer">
              <Buttons
                className={"btn-outline bg-outline-grey btn-c-sm"}
                text={t("cancelBtn")}
                onClick={() => {
                  dispatch(setShowAddAttributeDialog(false));
                }}
              />
              <Buttons
                className={"btn-c-primary btn-c-sm"}
                disabled={!attributeName}
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

export default AddAttributeDialog;