import { businessProfileApi } from "@/app/[locale]/_store/apiReducer/businessProfileApi";
import { connectApi } from "@/app/[locale]/_store/apiReducer/connectApi";
import { onBoardingApi } from "@/app/[locale]/_store/apiReducer/onBoardingApi";
import { rfqCartApi } from "@/app/[locale]/_store/apiReducer/rfqCartApi";
import connectReducer from "@/app/[locale]/_store/reducers/connect_store";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";
import { buyingRequestApi } from "./apiReducer/buyingRequestApi";
import { catalogApi } from "./apiReducer/catalogApi";
import { commonApi } from "./apiReducer/commonApi";
import { customerApi } from "./apiReducer/customerApi";
import { fileUploadApi } from "./apiReducer/fileUploadApi";
import { leadsApi } from "./apiReducer/leadsApi";
import { marketApi } from "./apiReducer/marketApi";
import { postBuyingRequestApi } from "./apiReducer/postBuyingRequestApi";
import { productApi } from "./apiReducer/productsApi";
import { reviewsApi } from "./apiReducer/reviewsApi";
import { sellOfferApi } from "./apiReducer/sellOfferApi";
import { settingApi } from "./apiReducer/settingsApi";
import AuthReducer from "./reducers/auth_store";
import BusinessProfileReducer from './reducers/businessProfile_store';
import filterReducer from "./reducers/filters_store";
import locationReducer from "./reducers/location_store";
import navbarReducer from "./reducers/navbar_store";
import OnboardingReducer from "./reducers/onboarding_store";
import previewReducer from "./reducers/preview_store";
import requestQuoteReducer from "./reducers/requestQuote_slice";
import settingsReducer from "./reducers/settings_store";
import stepperStatusReducer from "./reducers/stepper_status_store";
import UiReducer from "./reducers/ui_store";
import UserReducer from "./reducers/user_store";
import { paymentsApi } from "./apiReducer/paymentsApi";

const reducers = combineReducers({
  [productApi.reducerPath]: productApi.reducer,
  [sellOfferApi.reducerPath]: sellOfferApi.reducer,
  [commonApi.reducerPath]: commonApi.reducer,
  [fileUploadApi.reducerPath]: fileUploadApi.reducer,
  [buyingRequestApi.reducerPath]: buyingRequestApi.reducer,
  [marketApi.reducerPath]: marketApi.reducer,
  [leadsApi.reducerPath]: leadsApi.reducer,
  [customerApi.reducerPath]: customerApi.reducer,
  [reviewsApi.reducerPath]: reviewsApi.reducer,
  [connectApi.reducerPath]: connectApi.reducer,
  [postBuyingRequestApi.reducerPath]: postBuyingRequestApi.reducer,
  [rfqCartApi.reducerPath]: rfqCartApi.reducer,
  [businessProfileApi.reducerPath]: businessProfileApi.reducer,
  [onBoardingApi.reducerPath]: onBoardingApi.reducer,
  [settingApi.reducerPath]: settingApi.reducer,
  [catalogApi.reducerPath]: catalogApi.reducer,
  [paymentsApi.reducerPath]: paymentsApi.reducer,
  userData: UserReducer,
  onboardingData: OnboardingReducer,
  uiData: UiReducer,
  location: locationReducer,
  authData: AuthReducer,
  stepperStatus: stepperStatusReducer,
  settings: settingsReducer,
  preview: previewReducer,
  navbar: navbarReducer,
  filterData: filterReducer,
  requestQuoteData: requestQuoteReducer,
  connect: connectReducer,
  businessProfile: BusinessProfileReducer,
  payments: paymentsApi.reducer
});

export const makeStore = () =>
  configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware: any) =>
      getDefaultMiddleware()
        .concat(productApi.middleware)
        .concat(fileUploadApi.middleware)
        .concat(commonApi.middleware)
        .concat(sellOfferApi.middleware)
        .concat(buyingRequestApi.middleware)
        .concat(marketApi.middleware)
        .concat(leadsApi.middleware)
        .concat(customerApi.middleware)
        .concat(postBuyingRequestApi.middleware)
        .concat(reviewsApi.middleware)
        .concat(connectApi.middleware)
        .concat(rfqCartApi.middleware)
        .concat(businessProfileApi.middleware)
        .concat(onBoardingApi.middleware)
        .concat(settingApi.middleware)
        .concat(catalogApi.middleware)
        .concat(paymentsApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
