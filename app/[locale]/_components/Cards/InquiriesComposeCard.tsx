"use client";
import Button from "@/app/[locale]/_components/Buttons/Button";
import ReactionsBar from "@/app/[locale]/_components/Common/ReactionsBar";
import AttachInput from "@/app/[locale]/_components/form/AttachInput";
import {
  EmojiIcon,
  GmailIcon,
  PepRedIcon,
  TrashIcon,
} from "@/app/[locale]/_components/Icons/SVGIcons";
import TextArea from "@/app/[locale]/_components/StoreFront/Forms/TextArea";
import { useState } from "react";
import ButtonIcon from "../Buttons/ButtonIcon";

const InquiriesComposeCard = () => {
  const [pepGmailSwitch, setPepGmailSwitch] = useState(1);

  const [isReactionActive, setIsReactionActive] = useState(false);

  const [emojiReactions, setEmojiReactions] = useState({});

  const handleReactionsChange = (updatedReactions: any) => {
    setEmojiReactions(updatedReactions);
  };

  return (
    <div className="compose-card-comp inquires-compose-card">
      <div className={`c-c-c-head remove-border`}>
        <div className="c-c-c-h-actions">
          <div className="pep-gmail-switch">
            {/* <ButtonIcon className={`${pepGmailSwitch == 0 ? 'active' : ''}`} onClick={() => setPepGmailSwitch(0)}>
                            <PepRedIcon />
                        </ButtonIcon> */}
            <ButtonIcon
              className={`${pepGmailSwitch == 1 ? "active" : ""}`}
              onClick={() => setPepGmailSwitch(1)}
            >
              <GmailIcon />
            </ButtonIcon>
          </div>
        </div>
      </div>
      <div className="c-c-c-body">
        <div className="compose-inputs-block">
          <TextArea
            placeholder={"Enter Message"}
            name="inquiryCompose"
            isActive
          />
        </div>

        <div className="compose-bottom-action-block">
          <div className="c-b-c-b-left">
            <Button className={"btn-c-primary"} text={"Send"} />
            <AttachInput />
            <div className="emoji-icon-trigger btm-left">
              <EmojiIcon
                onClick={() => setIsReactionActive(!isReactionActive)}
              />
              <ReactionsBar
                isReactionActive={isReactionActive}
                onReactionsChange={handleReactionsChange}
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

export default InquiriesComposeCard;
