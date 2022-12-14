import React from "react";
import { Emoji, EmojiStyle } from "emoji-picker-react";

import {
  EmojiWrapper,
  CustomTooltip,
  EmojiCount,
  EmojiContainer,
} from "./styled";
import { IReaction } from "../utils/types";
import { TooltipContent } from "./TooltipContent";

interface ReactionProps {
  /**
   * Emoji unified string ex: 1f606
   */
  content: string;
  /**
   * Collection of Reactions which has same content
   */
  reactions: IReaction[];
  /**
   * Callback function which runs whenever component clicked
   */
  onClick(content: string): void;
}

/**
 * Primary UI component for render Reaction result with Emoji icon and number of users who react
 */
export function Reaction({ content, reactions, onClick }: ReactionProps) {
  return (
    <CustomTooltip
      title={<TooltipContent reactions={reactions} emoji={content} />}
      arrow
    >
      <EmojiWrapper
        onClick={() => {
          onClick(content);
        }}
      >
        <EmojiContainer>
          <Emoji unified={content} emojiStyle={EmojiStyle.APPLE} size={17} />
        </EmojiContainer>
        <EmojiCount>{reactions.length}</EmojiCount>
      </EmojiWrapper>
    </CustomTooltip>
  );
}
