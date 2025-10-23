// useClearLocalStorageOnExit.ts

/**
 * Clears a predefined list of localStorage keys on mount/unmount or page unload.
 * Won’t throw if a key isn’t present or if run during SSR.
 */
export function useClearLocalStorageOnExit(): void {
  localStorage.removeItem("pt_sd");
  localStorage.removeItem("pt_dd");
  localStorage.removeItem("pt_sd_ap");
  localStorage.removeItem("pt_sd_tech");
  localStorage.removeItem("prod=at");
  localStorage.removeItem("pt_ad");
  localStorage.removeItem("pt_qa");
}
