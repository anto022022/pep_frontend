"use client";
import React, { useEffect, useState } from "react";
import ButtonIcon from "../Buttons/ButtonIcon";
import { EmojiIcon, GmailIcon, PepRedIcon, TrashIcon } from "../Icons/SVGIcons";

import Typography from "@/app/[locale]/_components/Base/Typography";
import Button from "@/app/[locale]/_components/Buttons/Button";
import AttachInput from "@/app/[locale]/_components/form/AttachInput";
import MentionInputs from "@/app/[locale]/_components/form/MentionInputs";
import RegularInputs from "@/app/[locale]/_components/form/RegularInputs";
import TextArea from "@/app/[locale]/_components/StoreFront/Forms/TextArea";
import {
  Attachment,
  Dropdowndata,
} from "@/app/[locale]/_interface/ConnectInterface";
import { useAddContactMessageMutation } from "@/app/[locale]/_store/apiReducer/connectApi";
import { useTranslations } from "next-intl";
import ReactionsBar from "../Common/ReactionsBar";
import { showToast } from "@/app/[locale]/_store/reducers/ui_store";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/[locale]/_store/store";

interface ComposeCardProps {
  handleCloseCompose?: () => void;
  data: Dropdowndata[];
  pageType: string;
  pageId: string;
  currentThreadId?: string;
}
export interface NewMessage {
  threadId?: string;
  subject?: string;
  to?: string;
  cc?: string;
  bcc?: string;
  content: string;
  attachment?: Attachment[];
  type: string;
  pageType: string;
}
const ComposeCard: React.FC<ComposeCardProps> = ({
  handleCloseCompose,
  data,

  pageType,
  pageId,
}) => {
  const dispatch = useAppDispatch();
  const threadId = useAppSelector((state: RootState) => state.connect.threadId);
  const t = useTranslations("salesConnect.messageCard");
  const [pepGmailSwitch, setPepGmailSwitch] = useState<number>(1);
  const [ccToggle, setCcToggle] = useState<boolean>(false);
  const [ccInput, setCcInput] = useState("");
  const [bccToggle, setBccToggle] = useState<boolean>(false);
  const [isReactionActive, setIsReactionActive] = useState<boolean>(false);
  const [emojiReactions, setEmojiReactions] = useState<Record<string, number>>(
    {}
  );
  const [subject, setSubject] = useState<string>(" ");
  const [message, setMessage] = useState<string>("");
  const [selectedPeople, setSelectedPeople] = useState<Dropdowndata[]>([]);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [messageType, setMessageType] = useState<string>("");
  const [cc, setCc] = useState<string[]>([]);
  const [bcc, setBcc] = useState<string[]>([]);
  const [addNewMessage] = useAddContactMessageMutation();
  const handleReactionsChange = (updatedReactions: Record<string, number>) => {
    setEmojiReactions(updatedReactions);
  };
  const toEmails =
    selectedPeople?.length > 0 ? selectedPeople.map((p) => p.email) : [];
  useEffect(() => {
    if (pepGmailSwitch == 0) {
      setMessageType("chat");
    } else {
      setMessageType("email");
    }
    setAttachments([]);
    setBcc([]);
    setCc([]);
    setSelectedPeople([]);
    setSubject("");
    setMessage("");
  }, [pepGmailSwitch]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (ccInput.trim() !== "") {
        setCc([...cc, ccInput.trim()]);
        setCcInput(""); // clear input
      }
    }
  };

  const handleSend = async () => {
    if (!message.trim()) {
      // Optionally show error to user via toast or inline message
      dispatch(
        showToast({
          title: "Error",
          message: `Message is Required`,
          theme: "error",
        })
      );
      return;
    }
    if (messageType === "email") {
      if (!toEmails.length || toEmails.every((email) => !email.trim())) {
        dispatch(
          showToast({
            title: "Error",
            message: `At least one recipient is required`,
            theme: "error",
          })
        );
        return;
      }
    }
    try {
      const res = await addNewMessage({
        id: pageId,
        data: {
          subject,
          content: message,
          attachment: attachments,
          type: messageType,
          to: toEmails,
          threadId: threadId,
          // threadId:
          //   threadId?.length > 0
          //     ? threadId[0]
          //     : threadId
          //     ? threadId
          //     : undefined,
          cc: cc,
          bcc: bcc,
          pageType: pageType,
        },
      });
      if (res.data) {
        setSubject("");
        setMessage("");
        setAttachments([]);
        setSelectedPeople([]);
        setCc([]);
        setBcc([]);
        setCcToggle(false);
        setBccToggle(false);
        setEmojiReactions({});
        dispatch(
          showToast({
            title: "Success",
            message: `Email sent Successfully`,
            theme: "success",
          })
        );
      }
    } catch (error) {
      console.log(error);
       dispatch(
          showToast({
            title: "Error",
            message: `Email sending Failed`,
            theme: "error",
          })
        );
    }
  };

  return (
    <div className="compose-card-comp">
      <div
        className={`c-c-c-head ${ccToggle || bccToggle ? "remove-border" : ""}`}
      >
        <div className="c-c-c-h-actions">
          <div className="pep-gmail-switch">
            {/* <ButtonIcon
              className={pepGmailSwitch === 0 ? "active" : ""}
              onClick={() => setPepGmailSwitch(0)}
              disabled
            >
              <PepRedIcon />
            </ButtonIcon> */}
            <ButtonIcon
              className={pepGmailSwitch === 1 ? "active" : ""}
              onClick={() => setPepGmailSwitch(1)}
            >
              <GmailIcon />
            </ButtonIcon>
          </div>

          {pepGmailSwitch == 1 && (
            <>
              <div className="mention-input-block">
                <Typography variant="span" className="m-i-b-label">
                  {t("to")}:{" "}
                </Typography>
                <MentionInputs
                  chipValue={selectedPeople}
                  setChipValue={setSelectedPeople}
                  index={0}
                  data={data}
                />
              </div>

              <div className="cc-bcc-switch">
                <Button text={"Cc"} onClick={() => setCcToggle(!ccToggle)} />
                <Button text={"Bcc"} onClick={() => setBccToggle(!bccToggle)} />
              </div>
            </>
          )}
        </div>

        {(ccToggle || bccToggle) && (
          <div className="c-c-c-h-inputs">
            {ccToggle && (
              <div>
                <RegularInputs
                  placeholder="Cc"
                  value={ccInput}
                  onChange={(e) => setCcInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <div style={{ marginTop: "8px" }}>
                  {cc.map((email, index) => (
                    <span key={index}>{email}</span>
                  ))}
                </div>
              </div>
            )}

            {bccToggle && (
              <RegularInputs
                placeholder="Bcc"
                onChange={(e) => setBcc([...bcc, e.target.value])}
              />
            )}
          </div>
        )}
      </div>

      <div className="c-c-c-body">
        <div className="compose-inputs-block">
          {pepGmailSwitch == 1 && (
            <RegularInputs
              placeholder={t("subject")}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          )}
          <TextArea
            placeholder={t("textLabel")}
            label={t("message")}
            isActive
            name="Message"
            value={message}
            onChange={(value) => setMessage(value)}
          />
        </div>

        <div className="compose-bottom-action-block">
          <div className="c-b-c-b-left">
            <Button
              className="btn-c-primary"
              text={t("send")}
              onClick={handleSend}
            />
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
            <TrashIcon onClick={handleCloseCompose} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ComposeCard;
