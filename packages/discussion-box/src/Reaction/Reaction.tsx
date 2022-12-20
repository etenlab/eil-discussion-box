import React from 'react';
import { Emoji, EmojiStyle } from 'emoji-picker-react';

import {
  EmojiWrapper,
  CustomTooltip,
  EmojiCount,
  EmojiContainer,
} from './styled';
import { IReaction } from '../utils/types';
import { TooltipContent } from './TooltipContent';

interface ReactionProps {
  content: string;
  reactions: IReaction[];
  onClick(content: string): void;
}

/**
 * This component render a Reaction with Emoji icon.
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
