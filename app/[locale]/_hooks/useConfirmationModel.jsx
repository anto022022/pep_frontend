import { useState, useEffect, useRef } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

export const useConfirmDialog = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalPromiseResolver = useRef();

  const openModal = () => {
    setIsModalOpen(true);
    return new Promise((resolve, reject) => {
      modalPromiseResolver.current = { resolve, reject };
    });
  };

  const ConfirmDialog = ({ dialogueActions, message, note }) => {
    useEffect(() => {}, [dialogueActions]);

    const clearModelData = () => {
      setIsModalOpen(false);
      modalPromiseResolver.current = null;
    };

    const handleModalSubmit = (data) => {
      if (modalPromiseResolver.current) {
        modalPromiseResolver.current.resolve(data);
        clearModelData();
      }
    };

    const handleModalCancel = (data) => {
      if (modalPromiseResolver.current) {
        modalPromiseResolver.current.resolve(data);
        clearModelData();
      }
    };

    return (
      <Dialog open={isModalOpen}>
        <div className="otp-section">
          <div className="otp-card dev-card">
            <DialogContent className="otp-form">
              {message?.trim() ? (
                <DialogContentText
                  id="alert-dialog-description"
                  className="dev-msgPop-msg"
                >
                  {message}
                </DialogContentText>
              ) : null}
              {note?.trim() ? (
                <DialogContentText
                  id="alert-dialog-description"
                  className="dev-msgPop-note"
                >
                  {note}
                </DialogContentText>
              ) : null}
            </DialogContent>
            <DialogActions className="dev-card-actions">
              {dialogueActions?.onCancel ? (
                <button
                  className="btn-primary"
                  onClick={() => handleModalCancel(false)}
                >
                  {dialogueActions.onCancel.tittle}
                </button>
              ) : null}
              {dialogueActions?.onSubmit ? (
                <button
                  className="btn-primary"
                  onClick={() => handleModalSubmit(true)}
                >
                  {dialogueActions.onSubmit.tittle}
                </button>
              ) : null}
            </DialogActions>
          </div>
        </div>
      </Dialog>
    );
  };

  return { ConfirmDialog, openModal };
};
