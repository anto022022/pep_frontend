import { Dialog } from "primereact/dialog";
import React from "react";

import Typography from "../Base/Typography";
import Buttons from "../Buttons/Buttons";

interface CommonInputDialogInterface {
  title: string;
  placeholderText: string;
  cancelBtnText: string;
  submitBtnText: string;
  value: string;
  handleSubmit: (value: string) => void;
  handleCancel: () => void;
}

const CommonInputDialog: React.FC<CommonInputDialogInterface> = (props) => {
  const {
    title,
    placeholderText,
    cancelBtnText,
    submitBtnText,
    value,
    handleSubmit,
    handleCancel,
  } = props;
  const [inputValue, setInputValue] = React.useState(value || "");
  const onChangeValue = (value: string) => {
    setInputValue(value);
  };

  return (
    <Dialog
      visible={true}
      modal
      className="modal-comp add-new-group-modal"
      closable={true}
      onHide={handleCancel}
      content={() => (
        <>
          <div className="m-c-head">
            <Typography variant="h6" className="modal-title">
              {title}
            </Typography>
          </div>
          <div className="m-c-body">
            <input
              type="text"
              className="forms-input wid-100"
              placeholder={placeholderText}
              value={inputValue}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChangeValue(e.target.value)
              }
            />
          </div>
          <div className="m-c-footer">
            <Buttons
              className={"btn-outline bg-outline-grey btn-c-sm"}
              text={cancelBtnText}
              onClick={handleCancel}
            />
            <Buttons
              className={"btn-c-primary btn-c-sm"}
              text={submitBtnText}
              onClick={() => handleSubmit(inputValue)}
            />
          </div>
        </>
      )}
    ></Dialog>
  );
};

export default CommonInputDialog;
