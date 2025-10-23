"use client";
import { usePathname, useRouter } from "next/navigation";

export default function useFormRouting() {
  const router = useRouter();
  const pathname = usePathname();

  const formRouting = (parameter: string | null, path: string) => {
    if (parameter) {
      const resolvedPath = path;
      if (pathname !== resolvedPath) {
        router.push(resolvedPath);
        return true;
      }
    }
    return false;
  };

  return { formRouting };
}
