"use client";
import DatePipe from "@/app/[locale]/_components/Pipe/DatePipe";
import { Attachment } from "@/app/[locale]/_interface/ConnectInterface";
import Image from "next/image";
import { Accordion, AccordionTab } from "primereact/accordion";
import React, { useState } from "react";
import Typography from "../Base/Typography";
import ButtonIcon from "../Buttons/ButtonIcon";
import ButtonIconLeftOutline from "../Buttons/ButtonIconLeftOutline";
import {
  EditIcon,
  InboxStarIcon,
  MessageCollapseIcon,
  MessageOptionsIcon,
  OptionBlockIcon,
  OptionDownloadAttachIcon,
  OptionEyeIcon,
  OptionForwardIcon,
  OptionReplyIcon,
  OptionReportIcon,
  ReplyIcon,
} from "../Icons/SVGIcons";
import ComposeCard from "./ComposeCard";

interface MessageCardProps {
  variantOne?: boolean;
  variantTwo?: boolean;
  quotation?: boolean;
  newBadge?: boolean;
  subject: string;
  to: string[];
  content: string;
  date: Date;
  mail: string;
  attachments: Attachment[];
  markRead: (id: any) => void;
  isDeleted: (id: any) => void;
  threadId: string;
  listData: any[];
  pageId: string;
  id: string;
}

const MessageCard: React.FC<MessageCardProps> = ({
  variantOne = false,
  variantTwo = true,
  quotation = false,
  newBadge = false,
  subject,
  to,
  date,
  content,
  mail,
  attachments,
  markRead,
  isDeleted,
  threadId,
  listData,
  pageId,
  id,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [replyCompose, setReplyCompose] = useState<boolean>(false);
  const [optionActive, setOptionActive] = useState<boolean>(false);

  const handleTabChange = () => {
    // Controlled manually
  };

  const toggleAccordion = () => {
    setActiveIndex((prev) => (prev === 0 ? null : 0));
  };

  const handleCloseCompose = () => {
    setReplyCompose((prev) => !prev);
  };

  return (
    <Accordion
      activeIndex={activeIndex}
      className="message-card-comp"
      onTabChange={handleTabChange}
    >
      <AccordionTab
        header={
          <>
            <div className="message-card-head">
              {replyCompose && (
                <div className="m-c-h-compose">
                  <ComposeCard
                    handleCloseCompose={handleCloseCompose}
                    currentThreadId={threadId}
                    data={listData}
                    pageType="connect"
                    pageId={pageId}
                  />
                </div>
              )}
              <div className="m-c-h-info">
                <div className="m-c-h-i-left">
                  <ButtonIcon
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAccordion();
                    }}
                  >
                    <MessageCollapseIcon />
                  </ButtonIcon>
                </div>
                <div className="m-c-h-i-right">
                  <Typography
                    variant="span"
                    className="m-s-h-quote-txt"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAccordion();
                    }}
                  >
                    {subject}
                  </Typography>
                  <div className="message-profile-actions-block">
                    <div className="m-p-a-b-left">
                      <div className="message-profile-info">
                        <div className="m-p-i-img">
                          <Image
                            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
                            alt="Profile"
                            width={32}
                            height={32}
                          />
                        </div>
                        <div className="m-p-i-details">
                          <Typography variant="h4" className="profile-name">
                            {mail}
                          </Typography>
                          <Typography variant="h4" className="message-to-txt">
                            To:
                            {to?.map((item) => item)}
                          </Typography>
                        </div>
                      </div>
                    </div>

                    {variantOne && (
                      <div className="m-p-a-b-right">
                        <div className="msg-head-action-time">
                          <div className="msg-action-block">
                            <div className='m-a-b-wrapper'>
                              <ButtonIconLeftOutline
                                name="Reply"
                                className="bg-outline-grey"
                                onClick={handleCloseCompose}
                              >
                                <ReplyIcon />
                              </ButtonIconLeftOutline>
                              <ButtonIcon>
                                <InboxStarIcon />
                              </ButtonIcon>
                            </div>
                            <div
                              className={`table-options-block ${optionActive ? "active" : ""
                                }`}
                            >
                              <ButtonIcon
                                className="message-option-icon"
                                onClick={() => setOptionActive(!optionActive)}
                              >
                                <MessageOptionsIcon />
                              </ButtonIcon>
                              <div className="t-o-b-dropdown">
                                {/* <OptionList /> */}
                              </div>
                            </div>
                          </div>
                          <Typography variant="span" className="time-txt">
                            Apr 14, 2024 at 8.00 pm GMT+8
                          </Typography>
                        </div>
                      </div>
                    )}

                    {variantTwo && (
                      <div className="m-p-a-b-right">
                        <div className="msg-head-action-time">
                          <div className="msg-action-block">
                            <div className="m-a-b-wrapper">
                              <Typography variant="span" className="time-txt">
                                <DatePipe value={date} />
                              </Typography>
                              {newBadge && (
                                <span className="inbox-badge new">New</span>
                              )}
                              {quotation && (
                                <span className="inbox-badge quotation">
                                  Quotation
                                </span>
                              )}
                            </div>
                            <div
                              className={`table-options-block ${optionActive ? "active" : ""
                                }`}
                            >
                              <ButtonIcon
                                className="message-option-icon"
                                onClick={() => setOptionActive(!optionActive)}
                              >
                                <MessageOptionsIcon />
                              </ButtonIcon>

                              <div className="t-o-b-dropdown">
                                <button
                                  className="t-o-btn"
                                  onClick={handleCloseCompose}
                                >
                                  <OptionReplyIcon />
                                  <span className="t-o-b-txt">Reply</span>
                                </button>
                                <button className="t-o-btn">
                                  <OptionForwardIcon />
                                  <span className="t-o-b-txt">Forward</span>
                                </button>
                                <button
                                  className="t-o-btn"
                                  onClick={() => markRead(id)}
                                >
                                  <OptionEyeIcon />
                                  <span className="t-o-b-txt">
                                    Mark as Read
                                  </span>
                                </button>
                                <button className="t-o-btn">
                                  <OptionDownloadAttachIcon />
                                  <span className="t-o-b-txt">
                                    Download Attachments
                                  </span>
                                </button>
                                <button className="t-o-btn">
                                  <OptionReportIcon />
                                  <span className="t-o-b-txt">Report</span>
                                </button>
                                <button className="t-o-btn">
                                  <OptionBlockIcon />
                                  <span className="t-o-b-txt">Block</span>
                                </button>
                                <button
                                  className="t-o-btn"
                                  onClick={() => isDeleted(id)}
                                >
                                  <EditIcon />
                                  <span className="t-o-b-txt">Delete</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="m-c-h-message">
                <Typography variant="span" className="short-msg-txt">
                  {content}
                </Typography>
              </div>
            </div>
          </>
        }
      >
        <div className="m-c-body">
          <Typography variant="p" className="message-content">
            {content}
          </Typography>
          {attachments?.length > 0 && (
            <div className="message-attachment-block">
              <Typography variant="span" className="m-a-b-title-txt">
                {attachments?.length} Attachments
              </Typography>
              <div className="m-a-b-items-block">
                <ImageBlock src="https://media.istockphoto.com/id/1394440950/photo/natural-view-cosmos-filed-and-sunset-on-garden-background.webp?b=1&s=612x612&w=0&k=20&c=o3n-h2j4aBnaDqKeY-876cTRm1DLOsZcCjcfDZf_9TQ=" />
                <ImageBlock src="https://hips.hearstapps.com/hmg-prod/images/cosmos-flowers-against-the-blue-sky-low-angle-royalty-free-image-1720283935.jpg?crop=0.536xw:1.00xh;0.141xw,0&resize=980:*" />
              </div>
            </div>
          )}
        </div>
      </AccordionTab>
    </Accordion>
  );
};

export default MessageCard;

// 🔽 Helper: Image block
const ImageBlock = ({ src }: { src: string }) => (
  <div className="m-a-b-i-b-img">
    <Image src={src} width={110} height={80} alt="Attachment" />
  </div>
);
