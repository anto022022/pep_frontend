// hooks/useAiGenerator.ts
import useCookies from "@/app/[locale]/_hooks/useCookies";
import CryptoJS from "crypto-js";
import { useCallback } from "react";
import { useGetAiDescriptionMutation } from "../_store/apiReducer/productsApi";

interface UseAiGeneratorProps {
  apiEndpoint: string;
  storageKey: string;
  secretKey: string;
  lan?: string;
  keyword: string;
  max_length: number;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setDescription: (value: any) => void;
  requestBody: any;
  value: string;
}

const useAiGenerator = ({
  apiEndpoint,
  storageKey,
  secretKey,
  lan = "en",
  setIsLoading,
  setDescription,
  requestBody,
  value,
}: UseAiGeneratorProps) => {
  const cookies = useCookies();
  const [getAiDescription] = useGetAiDescriptionMutation(); // ✅ move this to the top level

  const regenerate = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getAiDescription({
        url: apiEndpoint, // or any dynamic path like `/generate-ai-description`
        body: JSON.stringify({
          ...requestBody,
        }),
      });

      const apiDescription = response?.data?.data?.data?.[value] || "";
      setDescription(apiDescription);

      const dataToStore = JSON.stringify({
        productDescription: apiDescription,
      });
      const encrypted = CryptoJS.AES.encrypt(dataToStore, secretKey).toString();
      localStorage.setItem(storageKey, encrypted);
      setIsLoading(false);
      return apiDescription;
    } catch (error) {
      setIsLoading(false);
      console.error("AI generation error:", error);
      return "";
    }
  }, [apiEndpoint, storageKey, secretKey, lan, cookies]);

  const fetchDescription = async () => {
    setIsLoading(true);

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
      } finally {
        setIsLoading(false);
      }
    }

    try {
      const response = await getAiDescription({
        url: apiEndpoint,
        body: JSON.stringify(requestBody),
      });

      const apiDescription = response?.data?.data?.data?.[value] || "";
      setDescription(apiDescription);

      const dataToStore = JSON.stringify({
        productDescription: apiDescription,
      });
      const encrypted = CryptoJS.AES.encrypt(dataToStore, secretKey).toString();
      localStorage.setItem(storageKey, encrypted);
    } catch (error) {
      console.error("API fetch failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { regenerate, fetchDescription };
};

export default useAiGenerator;
