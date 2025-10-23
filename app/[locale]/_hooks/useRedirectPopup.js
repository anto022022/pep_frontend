import { useConfirmDialog } from "./useConfirmationModel";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "react-redux";
import { toggleSlider } from "../store/reducers/settings_store";

export const useRedirectPopup = () => {
  const dispatch = useAppDispatch();
  const businessId = useAppSelector(
    (state) => state.userData.businessDetails.BusinessID
  );
  const [dialogueActions, setDialogueActions] = useState();
  const [message, setMessage] = useState("");
  const { ConfirmDialog, openModal } = useConfirmDialog();

  const checkBusinessCompleted = async (event, link) => {
    dispatch(toggleSlider({ open: false }));
    if (link === "dashboard" || link === "business") return;
    if (businessId) return;
    event.preventDefault();
    setDialogueActions({
      onCancel: {
        tittle: "Close",
      },
    });
    setMessage("Please complete Business Details to access this page");
    await openModal();
    return (
      <ConfirmDialog
        dialogueActions={dialogueActions}
        message={message}
        note=""
      />
    );
  };

  return { checkBusinessCompleted };
};
