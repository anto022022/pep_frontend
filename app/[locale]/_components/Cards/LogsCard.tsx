"use client";
import DatePipe from "@/app/[locale]/_components/Pipe/DatePipe";
import Image from "next/image";
import React, { useState } from "react";
import Typography from "../Base/Typography";
import ButtonIcon from "../Buttons/ButtonIcon";
import {
  InboxStarIcon,
  MessageOptionsIcon,
  OptionEyeIcon,
  OptionPinIcon,
  OptionReactionIcon,
  TrashIcon,
} from "../Icons/SVGIcons";

interface LogsCardProps {
  name: string;
  image?: string;
  id: string;
  date: Date | string;
  message: string;
  markRead: (id: any) => void;
  isDeleted: (id: any) => void;
  updateLog?: (action: string) => void;
  updateReactions?: (id: string, reactions: string[]) => void;
  reactions?: string[];
}

const LogsCard: React.FC<LogsCardProps> = ({
  name,
  image,
  date,
  message,
  id,
  markRead,
  isDeleted,
  reactions = [],
}) => {
  const [optionActive, setOptionActive] = useState(false);
  const [isReactionActive, setIsReactionActive] = useState(false);
  const [emojiReactions, setEmojiReactions] = useState<string[]>(reactions);

  return (
    <div className="message-card-comp logs-card-comp">
      <div className="message-card-head">
        <div className="m-c-h-info">
          <div className="m-c-h-i-right">
            <div className="message-profile-actions-block">
              <div className="m-p-a-b-left">
                <div className="message-profile-info">
                  {image && (
                    <div className="m-p-i-img">
                      <Image src={image} alt={name} width={32} height={32} />
                    </div>
                  )}

                  <div className="m-p-i-details">
                    <Typography variant="h4" className="profile-name">
                      {name}
                    </Typography>
                  </div>
                </div>
              </div>
              <div className="m-p-a-b-right">
                <div className="msg-head-action-time">
                  <div className="msg-action-block">
                    <Typography variant="span" className="time-txt">
                      <DatePipe value={date} type="longFormat" />
                    </Typography>
                    <ButtonIcon>
                      <InboxStarIcon />
                    </ButtonIcon>
                    <div
                      className={`table-options-block remv-overflow ${
                        optionActive ? "active" : ""
                      }`}
                    >
                      <ButtonIcon
                        className="message-option-icon"
                        onClick={() => {
                          setOptionActive(!optionActive);
                          setIsReactionActive(false);
                        }}
                      >
                        <MessageOptionsIcon />
                      </ButtonIcon>
                      <div className="t-o-b-dropdown">
                        <button
                          className="t-o-btn"
                          onClick={() => setIsReactionActive(!isReactionActive)}
                        >
                          <OptionReactionIcon />
                          <span className="t-o-b-txt">Reaction</span>
                        </button>
                        <button
                          className="t-o-btn"
                          onClick={() => markRead(id)}
                        >
                          <OptionEyeIcon />
                          <span className="t-o-b-txt">Mark as Read</span>
                        </button>
                        <button className="t-o-btn">
                          <OptionPinIcon />
                          <span className="t-o-b-txt">Pin</span>
                        </button>
                        <button
                          className="t-o-btn"
                          onClick={() => isDeleted(id)}
                        >
                          <TrashIcon />
                          <span className="t-o-b-txt">Delete</span>
                        </button>
                        {/* <ReactionsBar
                          onReactionsChange={handleReactionsChange}
                          isReactionActive={isReactionActive}
                        /> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="m-c-h-message">
          <Typography variant="span" className="short-msg-txt">
            {message}
          </Typography>

          {emojiReactions.length > 0 && (
            <div className="reaction-list-block">
              {emojiReactions.map((value, index) => (
                <div className="r-l-b-item" key={index}>
                  <span className="r-l-b-i-count">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogsCard;
