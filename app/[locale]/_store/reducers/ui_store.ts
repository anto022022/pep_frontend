import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";

export interface ToastType {
  id: string;
  title: string;
  message: string;
  theme: "success" | "error" | "info" | "warn";
}

export interface UiState {
  toast: ToastType[];
  isRtl: boolean;
  isSidebarClose: boolean;
  showSuccessModel: boolean;
  showProductGroupDialog: boolean;
  isVariantsidebarOpen: boolean;
  showAddAttributeDialog: boolean;
  showProductionLeadTimeDialog: boolean;
  isAddNewProductSidebarOpen: boolean;
  newProductAddSuccessfullyDialog: boolean;
  sellOfferCreatedDialog: boolean;
  isAddPostBuyingRequestOpen: boolean;
  postBuyingRequestCreatedDialog: boolean;
  isPostBuyingRequestSidebarOpen: boolean;
  isEditBuyingRequestOpen: boolean;
  isAddLeadOpen: boolean;
  leadCreatedSuccessfullyPopup: boolean;
  isEditLeadOpen: boolean;
  isFilterSidebarOpen: boolean;
  addReviewDialog: boolean;
  successImportDialog: boolean;
  userSessionDialog: boolean;
  isAddNewContactOpen: boolean;
  newContactCreatedDialog: boolean;
  showContactQrCode: boolean;
  showRfqCartList: boolean;
  newMessageSent: boolean;
  messageUpdated: boolean;
  isAccountSettingOpen: boolean;
  isKycComplete: boolean;
  isKybComplete: boolean;
  isRFQCartSidebarOpen: boolean;
  isUboComplete: boolean;
  tableActiveId: string | null;
  getVerifiedDialog: boolean;
  isAccountSettingsSidebarOpen: boolean;
  isNavActive: boolean;
  isShowSearchDropDown: boolean;
  isBulkActionActive: boolean;
  productListView: "Grid" | "List";
  supplierListView: "Grid" | "List";
  offerListView: "Grid" | "List";
  rfqListView: "Grid" | "List";
}

const initialState: UiState = {
  toast: [],
  isRtl: false,
  isSidebarClose: false,
  showSuccessModel: false,
  showProductGroupDialog: false,
  isVariantsidebarOpen: false,
  showAddAttributeDialog: false,
  showProductionLeadTimeDialog: false,
  isAddNewProductSidebarOpen: false,
  isRFQCartSidebarOpen: false,
  newProductAddSuccessfullyDialog: false,
  sellOfferCreatedDialog: false,
  postBuyingRequestCreatedDialog: false,
  isAddPostBuyingRequestOpen: false,
  isPostBuyingRequestSidebarOpen: false,
  isEditBuyingRequestOpen: false,
  isAddLeadOpen: false,
  leadCreatedSuccessfullyPopup: false,
  isEditLeadOpen: false,
  isFilterSidebarOpen: false,
  addReviewDialog: false,
  successImportDialog: false,
  userSessionDialog: false,
  isAddNewContactOpen: false,
  newContactCreatedDialog: false,
  showContactQrCode: false,
  showRfqCartList: false,
  newMessageSent: false,
  messageUpdated: false,
  isAccountSettingOpen: false,
  isKycComplete: false,
  isKybComplete: false,
  isUboComplete: false,
  tableActiveId: null,
  getVerifiedDialog: false,
  isAccountSettingsSidebarOpen: false,
  isNavActive: false,
  isShowSearchDropDown: false,
  isBulkActionActive: false,
  productListView: "Grid",
  supplierListView: "Grid",
  offerListView: "Grid",
  rfqListView: "Grid",
};
const normalize = (str: string) => str.trim().toLowerCase();

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    // showToast: (state, action) => {
    //   state.toast.push({ ...action.payload, id: nanoid() });
    // },
    showToast: (state, action: PayloadAction<Omit<any, "id">>) => {
      const { title, message, theme } = action.payload;
      const isDuplicate = state.toast.some(
        (toast) =>
          normalize(toast.title) === normalize(title) &&
          normalize(toast.message) === normalize(message)
      );

      if (!isDuplicate) {
        state.toast.push({
          id: nanoid(),
          title: title.trim(),
          message: message.trim(),
          theme,
        });
      }
    },
    hideToast: (state, action) => {
      const toastIdsToRemove = action.payload.map(
        (toast: ToastType) => toast.id
      );
      state.toast = state.toast.filter(
        (toast) => !toastIdsToRemove.includes(toast.id)
      );
    },
    clearToasts: (state) => {
      state.toast = [];
    },
    setIsRtl: (state, action) => {
      state.isRtl = action.payload;
    },
    setIsSidebarClose: (state, action) => {
      state.isSidebarClose = action.payload;
    },
    setShowSuccessModel: (state, action) => {
      state.showSuccessModel = action.payload;
    },
    setShowProductGroupDialog: (state, action) => {
      state.showProductGroupDialog = action.payload;
    },
    setShowProductionLeadTimeDialog: (state, action) => {
      state.showProductionLeadTimeDialog = action.payload;
    },
    setShowAddAttributeDialog: (state, action) => {
      state.showAddAttributeDialog = action.payload;
    },
    setIsVariantsidebarOpen: (state, action) => {
      state.isVariantsidebarOpen = action.payload;
    },
    setSellOfferCreatedDialog: (state, action) => {
      state.sellOfferCreatedDialog = action.payload;
    },
    setIsAddNewProductSidebarOpen: (state, action) => {
      state.isAddNewProductSidebarOpen = action.payload;
    },
    setNewProductAddSuccessfullyDialog: (state, action) => {
      state.newProductAddSuccessfullyDialog = action.payload;
    },
    setIsAddPostBuyingRequestOpen: (state, action) => {
      state.isAddPostBuyingRequestOpen = action.payload;
    },
    setPostBuyingRequestCreatedDialog: (state, action) => {
      state.postBuyingRequestCreatedDialog = action.payload;
    },
    setIsPostBuyingRequestSidebarOpen: (state, action) => {
      state.isPostBuyingRequestSidebarOpen = action.payload;
    },
    setIsEditBuyingRequestOpen: (state, action) => {
      state.isEditBuyingRequestOpen = action.payload;
    },
    setIsAddLeadOpen: (state, action) => {
      state.isAddLeadOpen = action.payload;
    },
    setIsEditLeadOpen: (state, action) => {
      state.isEditLeadOpen = action.payload;
    },
    setLeadCreatedSuccessfullyPopup: (state, action) => {
      state.leadCreatedSuccessfullyPopup = action.payload;
    },
    setIsFilterSideBarOpen: (state, action) => {
      state.isFilterSidebarOpen = action.payload;
    },
    setAddReviewDialog: (state, action) => {
      state.addReviewDialog = action.payload;
    },
    setSuccessImportDialog: (state, action) => {
      state.successImportDialog = action.payload;
    },
    setUserSessionDialog: (state, action) => {
      state.userSessionDialog = action.payload;
    },
    setIsAddNewContactOpen: (state, action) => {
      state.isAddNewContactOpen = action.payload;
    },
    setNewContactCreatedDialog: (state, action) => {
      state.newContactCreatedDialog = action.payload;
    },
    setShowContactQrCode: (state, action) => {
      state.showContactQrCode = action.payload;
    },
    setShowRfqCartList: (state, action) => {
      state.showRfqCartList = action.payload;
    },
    setNewMessageSent: (state, action) => {
      state.newMessageSent = action.payload;
    },
    setMessageUpdated: (state, action) => {
      state.messageUpdated = action.payload;
    },
    setIsAccountSettingOpen: (state, action) => {
      state.isAccountSettingOpen = action.payload;
    },
    setIsKycComplete: (state, action) => {
      state.isKycComplete = action.payload;
    },
    setIsKybComplete: (state, action) => {
      state.isKybComplete = action.payload;
    },
    setIsUboComplete: (state, action) => {
      state.isUboComplete = action.payload;
    },
    setTableActiveId: (state, action) => {
      state.tableActiveId = action.payload;
    },
    setIsRFQCartSidebarOpen: (state, action) => {
      state.isRFQCartSidebarOpen = action.payload;
    },
    setGetVerifiedDialog: (state, action) => {
      state.getVerifiedDialog = action.payload;
    },
    setIsAccountSettingsSidebarOpen: (state, action) => {
      state.isAccountSettingsSidebarOpen = action.payload;
    },
    setIsNavActive: (state, action) => {
      state.isNavActive = action.payload;
    },
    setIsShowSearchDropDown: (state, action) => {
      state.isShowSearchDropDown = action.payload;
    },
    setIsBulkActionActive: (state, action) => {
      state.isBulkActionActive = action.payload;
    },
    setProductListView: (state, action) => {
      state.productListView = action.payload;
    },
    setSupplierListView: (state, action) => {
      state.supplierListView = action.payload;
    },
    setOfferListView: (state, action) => {
      state.offerListView = action.payload;
    },
    setRfqListView: (state, action) => {
      state.rfqListView = action.payload;
    },
  },
});

export const {
  showToast,
  hideToast,
  clearToasts,
  setIsRtl,
  setIsSidebarClose,
  setShowSuccessModel,
  setShowProductGroupDialog,
  setShowAddAttributeDialog,
  setIsVariantsidebarOpen,
  setShowProductionLeadTimeDialog,
  setIsAddNewProductSidebarOpen,
  setNewProductAddSuccessfullyDialog,
  setSellOfferCreatedDialog,
  setIsAddPostBuyingRequestOpen,
  setIsEditBuyingRequestOpen,
  setPostBuyingRequestCreatedDialog,
  setIsRFQCartSidebarOpen,

  setIsPostBuyingRequestSidebarOpen,
  setIsAddLeadOpen,
  setIsEditLeadOpen,
  setLeadCreatedSuccessfullyPopup,
  setIsFilterSideBarOpen,
  setAddReviewDialog,
  setSuccessImportDialog,
  setIsAddNewContactOpen,
  setNewContactCreatedDialog,
  setShowContactQrCode,
  setUserSessionDialog,
  setShowRfqCartList,
  setNewMessageSent,
  setMessageUpdated,
  setIsAccountSettingOpen,
  setIsKycComplete,
  setIsKybComplete,
  setIsUboComplete,
  setTableActiveId,
  setGetVerifiedDialog,
  setIsNavActive,
  setIsShowSearchDropDown,
  setIsAccountSettingsSidebarOpen,
  setIsBulkActionActive,
  setProductListView,
  setOfferListView,
  setRfqListView,
  setSupplierListView,
} = uiSlice.actions;

export default uiSlice.reducer;
