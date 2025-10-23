import { useState } from "react";
import Image from "next/image";
import Logo from "../../../../favicon.ico";
import { useRouter } from "next/navigation";

interface ImageColumnProps {
  rowData: any;
  src: string;
  alt: string;
  concatData: string;
  redirect_url: string;
  redirect_id: string;
  isNotClickable?: boolean;
}

export const ImageColumn: React.FC<ImageColumnProps> = ({
  rowData,
  src,
  alt,
  concatData,
  redirect_url,
  redirect_id,
  isNotClickable,
}) => {
  const [imgSrc, setImgSrc] = useState<string | any>(() => {
    const imagePath = rowData[src];
    if (!imagePath) return Logo;

    const isFullUrl = isValidImageUrl(imagePath);
    const normalizedPath = normalizeImagePath(imagePath);
    // const encodedUrl = encodeURIComponent(path);
    // debugger;
    let a = isFullUrl
      ? normalizedPath
      : `${
          process.env.NEXT_PUBLIC_BUCKET_URL ||
          "https://pepupload.s3.ap-southeast-1.amazonaws.com/"
        }${normalizedPath}`;
    return a;
  });

  const [hasError, setHasError] = useState(false);
  const router = useRouter();
  function isValidImageUrl(url: string): boolean {
    try {
      const u = new URL(url);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  }

  function normalizeImagePath(path: string): string {
    return path.replace(/^\/+/, "");
  }

  const handleClick = () => {
    if (isNotClickable) {
      return;
    }
    router.push(`${redirect_url}/${rowData[redirect_id]}`);
  };
  const handleError = () => {
    if (!hasError) {
      setImgSrc(Logo);
      setHasError(true);
    }
  };

  return (
    <div className="table-product-img" onClick={handleClick}>
      <Image
        src={imgSrc}
        width={52}
        height={52}
        sizes="100vw"
        alt={rowData[alt] ?? "Fallback Image"}
        onError={handleError}
      />
      <span className="t-p-i-txt">{rowData[concatData] ?? "Product"}</span>
    </div>
  );
};
