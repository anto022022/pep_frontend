import ButtonIconLeftOutline from "@/app/[locale]/_components/Buttons/ButtonIconLeftOutline";
import ButtonIconRight from "@/app/[locale]/_components/Buttons/ButtonIconRight";
import { useRouter } from "next/navigation";
import React from "react";
import { useTranslations } from "next-intl";
import useIsMobile from "@/app/[locale]/_hooks/useIsMobile";
import {
  ChevronLeftIcon,
  RightArrowIcon,
} from "@/app/[locale]/_components/Icons/SVGIcons";

interface SettingsButtonsProps {
  onSubmit?: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
  disabled?: boolean;
  cancelRoute: string;
}

const SettingsButtons: React.FC<SettingsButtonsProps> = ({
  onSubmit,
  saveLabel = "Save",
  cancelLabel = "Cancel",
  isSubmitting = false,
  disabled,
  cancelRoute,
}) => {
  const router = useRouter();
  const t = useTranslations("common");
  const isMobile = useIsMobile(1200);

  return (
    <div className="profile-footer">
      <div className="profile-fot-btn-group">
        {!isMobile ? (
          <>
            {" "}
            <ButtonIconLeftOutline
              name={t("cancel") || cancelLabel}
              className="btn-comp btn-outline bg-outline-dark st-footer-btn"
              onClick={() => router.push(cancelRoute)}
            />
            <ButtonIconRight
              className="st-footer-btn"
              name={t("save") || saveLabel}
              type="submit"
              onClick={onSubmit}
              disabled={isSubmitting || disabled}
            />
          </>
        ) : (
          <>
            <div className="c-f-b-bottom">
              <div className="c-f-b-b-left"></div>
              <div className="c-f-b-b-right">
                <ButtonIconLeftOutline
                  name={t("previous")}
                  onClick={() => router.push(cancelRoute)}
                  className="btn-comp btn-outline btn-left bg-outline-grey custom-width mob-previous-btn "
                >
                  <ChevronLeftIcon />
                </ButtonIconLeftOutline>
                <ButtonIconRight
                  name={t("save") || saveLabel}
                  type="submit"
                  onClick={onSubmit}
                  disabled={isSubmitting || disabled}
                >
                  <RightArrowIcon />
                </ButtonIconRight>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SettingsButtons;
