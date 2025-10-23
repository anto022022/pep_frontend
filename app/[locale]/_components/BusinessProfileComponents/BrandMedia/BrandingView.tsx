import Typography from "@/app/[locale]/_components/Base/Typography";
import {
  BrochureIcon,
  PlaceholderImageIcon,
} from "@/app/[locale]/_components/Icons/SVGIcons";
import { Award, NamedImage } from "@/app/[locale]/_interface/BusinessProfile";
import { ProductImage } from "@/app/[locale]/_interface/MarketPlaceInterface";
import Image from "next/image";
import Link from "next/link";
import FacebookIcon from "@/public/img/facebook-icon.svg";
import YoutubeIcon from "@/public/img/youtube-icon.svg";
import InstagramIcon from "@/public/img/instagram-icon.svg";
import LinkedInIcon from "@/public/img//linkedin-icon.svg";
import { brandingMediaFormValue } from "@/app/[locale]/_components/BusinessProfileComponents/BrandMedia/BrandMediaSection";
import { getImageUrl } from "@/app/[locale]/_hooks/utility";

import { useTranslations } from "next-intl";

interface BrandingProps {
  data: brandingMediaFormValue;
}
export const BrandingView: React.FC<BrandingProps> = ({ data }) => {
  const t = useTranslations("businessProfile.brandingMedia");


  const handleURL = (value: string) => {
    const ytUrlRegex =
      /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?[\w\?=]*)?/;
    const urlPattern =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

    if (ytUrlRegex.test(value)) {
      const match = value.match(urlPattern);
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0`;
      }
    }
    return "";
  };


  const fileNameFn = (path: string) => {
    const fileNameWithExt = path.split("/").pop();
    const fileName = fileNameWithExt?.split(".").slice(0, -1).join(".");
    return fileName;
  };
  return (
    <div className="c-f-b-t-body label-grey-reverse">
      <div className="accordion-form-block-group">
        <div className="accordion-form-block">
          <div className="tabs-content">
            <div className="tabs-content tabs-split-main">
              <div className="tabs-form-group">
                <div className="a-f-b-txt-block">
                  <Typography variant="span" className="a-f-b-subtxt">
                    {t("companyLogo")}
                  </Typography>
                </div>
                {data?.companyLogo?.src &&
                  Object.keys(data.companyLogo).length > 0 && (
                    <div className="t-f-g-img certification-img bordered">
                      <Image
                        src={getImageUrl(data?.companyLogo?.src)}
                        alt={data?.companyLogo?.alt ?? ""}
                        width={100}
                        height={195}
                        sizes="100vw"
                      />
                    </div>
                  )}
              </div>
              <div className="tabs-form-group">
                <div className="a-f-b-txt-block">
                  <Typography variant="span" className="a-f-b-subtxt">
                    {t("companyVideo")}
                  </Typography>
                </div>
                {(data?.companyVideo || data?.companyVideoLink!=="") && (
                  <div className="t-f-g-video">
                    {data?.companyVideo?.src && (
                      <video autoPlay muted playsInline>
                        <source
                          src={getImageUrl(data?.companyVideo?.src)}
                          type="video/mp4"
                        ></source>
                      </video>
                    )}
                    {data?.companyVideoLink && (
                    
                      <iframe
                        className="img-fluid c-c-cover-img"
                        width="300"
                        height="240"
                        frameBorder="0"
                        allow=" encrypted-media"
                        allowFullScreen
                        src={handleURL(data?.companyVideoLink)}
                      ></iframe>
                    )}
                  </div>

                )}
                
              </div>
            </div>
          </div>
        </div>
        <div className="accordion-form-block">
          <div className="a-f-b-txt-block">
            <Typography variant="span" className="a-f-b-subtxt">
              {t("brochures")}
            </Typography>
          </div>
          <div className="tabs-content col-2-layout flex-dir-row">
            {data?.brochures?.map((item: ProductImage, index: number) => (
              <div className="tabs-form-group" key={index}>
                <div className="brochure-document-block remv-bg px-unset">
                  <div className="b-d-b-left">
                    <BrochureIcon />
                    <span className="b-d-b-filename">
                      {fileNameFn(item?.src)}.pdf
                    </span>
                  </div>
                  <div className="b-d-b-right">
                    {item.size && (
                      <span className="b-d-b-size">
                        {(item.size / (1024 * 1024)).toFixed(1)} MB
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="accordion-form-block">
          <div className="a-f-b-txt-block">
            <Typography variant="span" className="a-f-b-subtxt">
              {t("ownBrands.title")}
            </Typography>
          </div>
          <div className="tabs-content col-2-layout flex-dir-row">
            {data?.ownBrands?.map((item: NamedImage, index: number) => (
              <div className="tabs-form-group" key={index}>
                <div className="t-f-g-img certification-img">
                  {item?.image?.src &&
                  item?.image?.exten !== "application/pdf" ? (
                    <Image
                      src={getImageUrl(item?.image?.src)}
                      alt="Brand Image"
                      width={100}
                      height={195}
                      sizes="100vw"
                    ></Image>
                  ) : (
                    <PlaceholderImageIcon />
                  )}
                  
                </div>
                <div className="brochure-document-block remv-bg px-unset">
                  <div className="b-d-b-left">
                    <span className="b-d-b-filename">{item.name}</span>
                  </div>
                  <div className="b-d-b-right">
                    {item?.image?.size && (
                      <span className="b-d-b-size">
                        {(item?.image.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="accordion-form-block">
          <div className="a-f-b-txt-block">
            <Typography variant="span" className="a-f-b-subtxt">
              {t("otherBrands.title")}
            </Typography>
          </div>
          <div className="tabs-content col-2-layout flex-dir-row">
            {data?.otherBrands?.map((item: NamedImage, index: number) => (
              <div className="tabs-form-group" key={index}>
                <div className="t-f-g-img certification-img">
                  {item?.image?.src &&
                  item?.image?.exten !== "application/pdf" ? (
                    <Image
                      src={getImageUrl(item?.image?.src)}
                      alt="Brand Image"
                      width={100}
                      height={195}
                      sizes="100vw"
                    ></Image>
                  ) : (
                    <PlaceholderImageIcon />
                  )}
                  
                </div>
                <div className="brochure-document-block remv-bg px-unset">
                  <div className="b-d-b-left">
                    <span className="b-d-b-filename">{item.name}</span>
                  </div>
                  <div className="b-d-b-right">
                    {item?.image?.size && (
                      <span className="b-d-b-size">
                        {(item?.image.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="accordion-form-block">
          <div className="a-f-b-txt-block">
            <Typography variant="span" className="a-f-b-subtxt">
              {t("awards.title")}
            </Typography>
          </div>
          <div className="tabs-content col-2-layout flex-dir-row">
            {data?.awards?.map((item: Award, index: number) => (
              <div className="tabs-form-group" key={index}>
                <label htmlFor="ISO" className="t-f-g-label">
                  {item.name}
                </label>
                <div className="t-f-g-img certification-img">
                  {item?.image?.src ? (
                    <Image
                      src={getImageUrl(item?.image?.src)}
                      alt="Award Image"
                      width={100}
                      height={195}
                      sizes="100vw"
                    ></Image>
                  ) : (
                    <PlaceholderImageIcon />
                  )}
                </div>
                <div className="brochure-document-block remv-bg px-unset">
                  {item?.image?.alt && item?.image?.exten && (
                    <div className="b-d-b-left">
                      <span className="b-d-b-filename">
                        {fileNameFn(item?.image?.alt)}.
                        {item?.image?.exten.split("/").pop()}
                      </span>
                    </div>
                  )}

                  <div className="b-d-b-right">
                    {item?.image?.size && (
                      <span className="b-d-b-size">
                        {(item?.image.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="accordion-form-block">
          <div className="a-f-b-txt-block">
            <Typography variant="span" className="a-f-b-subtxt">
              {t("certificates.title")}
            </Typography>
          </div>
          <div className="tabs-content col-2-layout flex-dir-row">
            {data?.certificates?.map((item: NamedImage, index: number) => (
              <div className="tabs-form-group" key={index}>
                <div className="t-f-g-img certification-img">
                 {item?.image?.src &&
                  item?.image?.exten !== "application/pdf" ? (
                    <Image
                      src={getImageUrl(item?.image?.src)}
                      alt="Certificate Image"
                      width={100}
                      height={195}
                      sizes="100vw"
                    ></Image>
                  ) : (
                    <PlaceholderImageIcon />
                  )}
                </div>
                <div className="brochure-document-block remv-bg px-unset">
                  <div className="b-d-b-left">
                    <span className="b-d-b-filename">{item.name}</span>
                  </div>
                  <div className="b-d-b-right">
                    {item?.image?.size && (
                      <span className="b-d-b-size">
                        {(item?.image.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="accordion-form-block">
          <div className="a-f-b-txt-block">
            <Typography variant="span" className="a-f-b-subtxt">
              {t("social")}
            </Typography>
          </div>
          <div className="tabs-content">
            <div className="social-links-group">
              {data?.socialMediaLinks?.facebook && (
                <Link
                  href={data?.socialMediaLinks?.facebook}
                  className="s-l-g-item"
                >
                  <Image
                    src={FacebookIcon}
                    width={28}
                    height={28}
                    alt="Facebook"
                  ></Image>
                  <Typography variant="span" className="s-l-g-i-txt">
                    {t("facebook")}
                  </Typography>
                </Link>
              )}
              {data?.socialMediaLinks?.youtube && (
                <Link
                  href={data?.socialMediaLinks?.youtube}
                  className="s-l-g-item"
                >
                  <Image
                    src={YoutubeIcon}
                    width={28}
                    height={28}
                    alt="YouTube"
                  ></Image>
                  <Typography variant="span" className="s-l-g-i-txt">
                    {t("youtube")}
                  </Typography>
                </Link>
              )}
              {data?.socialMediaLinks?.instagram && (
                <Link
                  href={data?.socialMediaLinks?.instagram}
                  className="s-l-g-item"
                >
                  <Image
                    src={InstagramIcon}
                    width={28}
                    height={28}
                    alt="Instagram"
                  ></Image>
                  <Typography variant="span" className="s-l-g-i-txt">
                    {t("instagram")}
                  </Typography>
                </Link>
              )}
              {data?.socialMediaLinks?.instagram && (
                <Link
                  href={data?.socialMediaLinks?.instagram}
                  className="s-l-g-item"
                >
                  <Image
                    src={LinkedInIcon}
                    width={28}
                    height={28}
                    alt="LinkedIn"
                  ></Image>
                  <Typography variant="span" className="s-l-g-i-txt">
                    {t("linkedin")}
                  </Typography>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
