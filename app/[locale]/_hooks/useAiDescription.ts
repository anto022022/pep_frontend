import useCookies from "@/app/[locale]/_hooks/useCookies";
import CryptoJS from "crypto-js";
import { useEffect } from "react";

interface UseDescriptiveMediaProps {
  lan: string;
  storageKey: string;
  apiEndpoint: string;
  requestBody: any;
  secretKey: string;
  aiEndpoint: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setDescription: any;
}

const useDescriptiveMedia = ({
  storageKey,
  apiEndpoint,
  requestBody,
  secretKey,
  setIsLoading,
  setDescription,
}: UseDescriptiveMediaProps) => {
  const cookies = useCookies();

  useEffect(() => {
    setIsLoading(true);

    const fetchDescription = async () => {
      const encryptedData = localStorage.getItem(storageKey);
      if (encryptedData) {
        try {
          const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
          const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
          const parsedData = JSON.parse(decryptedData);
          if (parsedData?.productDescription) {
            setDescription(parsedData.productDescription);
            return;
          }
        } catch (error) {
          console.error("Decryption failed:", error);
          localStorage.removeItem(storageKey);
        }
      }

      try {
        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            userSession: cookies.getCookie("userSession"),
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error(`API request failed with status: ${response.status}`);
        }

        const data = await response.json();
        const apiDescription = data?.data?.data?.description || "";
        setDescription(apiDescription);

        const dataToStore = JSON.stringify({
          productDescription: apiDescription,
        });
        const encrypted = CryptoJS.AES.encrypt(
          dataToStore,
          secretKey
        ).toString();
        localStorage.setItem(storageKey, encrypted);
      } catch (error) {
        console.error("API fetch failed:", error);
      }
    };

    fetchDescription();
    setIsLoading(false);
  }, [storageKey, apiEndpoint, requestBody, secretKey]);
};

export default useDescriptiveMedia;