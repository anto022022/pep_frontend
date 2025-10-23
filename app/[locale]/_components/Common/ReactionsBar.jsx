'use client'
import EmojiPicker from 'emoji-picker-react';
import React, { useEffect, useState } from 'react'
import { PlusIcon } from '../Icons/SVGIcons';

const defaultReactions = ['👍', '❤️', '😀', '😢', '🙏', '👎', '😡'];

const ReactionsBar = ({ onReactionsChange }) => {
    const [showRecentPicker, setShowRecentPicker] = useState(true);
    const [showPicker, setShowPicker] = useState(false);
    const [reactions, setReactions] = useState(defaultReactions);
    const [selected, setSelected] = useState([]);

    const addEmoji = (emoji) => {

        setSelected((prev) => ({
            ...prev,
            [emoji]: (prev[emoji] || 0) + 1,
        }));
    };

    useEffect(() => {
        onReactionsChange?.(selected);
    }, [selected]);

    const handleSuggestedClick = (emoji) => {
        addEmoji(emoji);
    };

    const handleEmojiClick = (emojiData) => {
        const emoji = emojiData.emoji;

        if (!reactions.includes(emoji)) {
            setReactions((prev) => [...prev, emoji]);
        }

        addEmoji(emoji);
    };

    return (
        <div className="reaction-bar-comp">

            <div className="">
                {showRecentPicker &&
                    <div className='recent-reaction-box'>
                        {reactions.map((emoji, index) => (
                            <button
                                key={index}
                                onClick={() => handleSuggestedClick(emoji)}
                            >
                                {emoji}
                            </button>
                        ))}

                        <button
                            onClick={() => {
                                setShowRecentPicker(false)
                                setShowPicker((prev) => !prev)
                            }}
                            className='add-more-emoji'
                        >
                            <PlusIcon />
                        </button>
                    </div>
                }

                {showPicker && (
                    <div className="reaction-full-box">
                        <EmojiPicker onEmojiClick={handleEmojiClick} emojiStyle='Apple' />
                    </div>
                )}
            </div>

        </div>
    )
}

export default ReactionsBar