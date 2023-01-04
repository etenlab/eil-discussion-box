import React from "react";

import { Emoji, EmojiStyle } from "emoji-picker-react";

import { IReaction } from "../utils/types";
import { EmojiBigWrapper, TooltipUserName } from "./styled";

type TooltipContentProps = {
  /**
   * Array of Reactions for specific emoji
   */
  reactions: IReaction[];
  /**
   * Unified emoji string
   */
  emoji: string;
};

/**
 * Primary UI component to render emoji icon and reaction guys
 */
export const TooltipContent = ({ reactions, emoji }: TooltipContentProps) => {
  return (
    <div style={{ margin: "auto" }}>
      <EmojiBigWrapper>
        <Emoji unified={emoji} emojiStyle={EmojiStyle.APPLE} size={50} />
      </EmojiBigWrapper>
      {reactions.map((reaction) => (
        <TooltipUserName key={reaction.id}>
          {reaction.user.username}
        </TooltipUserName>
      ))}
    </div>
  );
};
