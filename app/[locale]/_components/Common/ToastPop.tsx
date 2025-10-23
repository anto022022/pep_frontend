"use client";

import React, { useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { hideToast, ToastType } from "../../_store/reducers/ui_store";
import { useAppDispatch, useAppSelector } from "../../_store/store";

const ToastPop = () => {
  const toastRef = useRef<Toast>(null);
  const dispatch = useAppDispatch();
  const toasts = useAppSelector((state) => state.uiData.toast); // Fetch all toasts



  useEffect(() => {
    if (toasts.length > 0 && toastRef.current) {
      toasts.forEach((toast:ToastType) => {
        toastRef.current?.show({
          severity: toast.theme,
          summary: toast.title,
          detail: toast.message,
          life: 3000,
        });
      });
      setTimeout(() => {
        dispatch(hideToast(toasts)); 
      }, 3000);
    }
  }, [toasts]);

  return (
    <div className="toast-comp">
      <Toast ref={toastRef} />
    </div>
  );
};

export default ToastPop;
