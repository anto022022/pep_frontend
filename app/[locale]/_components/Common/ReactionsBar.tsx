'use client';
import EmojiPicker, { EmojiClickData, EmojiStyle } from 'emoji-picker-react';
import React, { useEffect, useState } from 'react';
import { PlusIcon } from '../Icons/SVGIcons';

const defaultReactions = ['👍', '❤️', '😀', '😢', '🙏', '👎', '😡'];

interface ReactionsBarProps {
  isReactionActive?: boolean;
  onReactionsChange?: (reactions: Record<string, number>) => void;
}

const ReactionsBar: React.FC<ReactionsBarProps> = ({
  isReactionActive,
  onReactionsChange,
}) => {
  const [showRecentPicker, setShowRecentPicker] = useState<boolean>(true);
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [reactions, setReactions] = useState<string[]>(defaultReactions);
  const [selected, setSelected] = useState<Record<string, number>>({});

  const addEmoji = (emoji: string) => {
    setSelected((prev) => ({
      ...prev,
      [emoji]: (prev[emoji] || 0) + 1,
    }));
  };

  useEffect(() => {
    onReactionsChange?.(selected);
  }, [selected, onReactionsChange]);

  const handleSuggestedClick = (emoji: string) => {
    addEmoji(emoji);
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const emoji = emojiData.emoji;

    if (!reactions.includes(emoji)) {
      setReactions((prev) => [...prev, emoji]);
    }

    addEmoji(emoji);
  };

  return (
    <div className="reaction-bar-comp">
      {isReactionActive && (
        <div>
          {showRecentPicker && (
            <div className="recent-reaction-box">
              {reactions.map((emoji, index) => (
                <button key={index} onClick={() => handleSuggestedClick(emoji)}>
                  {emoji}
                </button>
              ))}

              <button
                onClick={() => {
                  setShowRecentPicker(false);
                  setShowPicker((prev) => !prev);
                }}
                className="add-more-emoji"
              >
                <PlusIcon />
              </button>
            </div>
          )}

          {showPicker && (
            <div className="reaction-full-box">
              <EmojiPicker onEmojiClick={handleEmojiClick} emojiStyle={EmojiStyle.APPLE} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReactionsBar;
