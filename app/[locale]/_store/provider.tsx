"use client";

import { Provider } from "react-redux";
import { ReactNode, useRef } from "react";
import { AppStore, makeStore } from "./store";

export function ReduxProviders({ children }: { children: ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore(); // Create store instance once
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
