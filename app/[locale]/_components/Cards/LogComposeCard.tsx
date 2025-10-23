"use client";
import React, { useState } from "react";
import { EmojiIcon, TrashIcon } from "../Icons/SVGIcons";
import Buttons from "../Buttons/Buttons";

import ReactionsBar from "../Common/ReactionsBar";
import TextArea from "@/app/[locale]/_components/StoreFront/Forms/TextArea";
import AttachInput from "@/app/[locale]/_components/form/AttachInput";
import { useTranslations } from "next-intl";
interface LogCardProps {
  handleSubmit: (value: string) => void;
}

const LogComposeCard: React.FC<LogCardProps> = ({ handleSubmit }) => {
  const [isReactionActive, setIsReactionActive] = useState(false);
  const [content, setContent] = useState<string>("");
  const t = useTranslations("productDetailPage");
  return (
    <div className="compose-card-comp">
      <div className="c-c-c-body">
        <div className="compose-inputs-block">
          <TextArea
            placeholder={t("logNotes.placeholder")}
            name="logText"    
            isActive
            onChange={(e) => setContent(e)}
            value={content}
          />
        </div>

        <div className="compose-bottom-action-block">
          <div className="c-b-c-b-left">
            <Buttons
              className={"btn-c-primary"}
              text={t("logNotes.send")}
              onClick={() => {
                handleSubmit(content);
                setContent("");
              }}
            />
            <AttachInput />
            <div className="emoji-icon-trigger btm-left">
              <EmojiIcon
                onClick={() => setIsReactionActive(!isReactionActive)}
              />
              <ReactionsBar
                isReactionActive={isReactionActive}
                onReactionsChange={() => {}}
              />
            </div>
          </div>
          <div className="c-b-c-b-right">
            <TrashIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogComposeCard;
