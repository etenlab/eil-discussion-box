import React from 'react';

import { Emoji, EmojiStyle } from 'emoji-picker-react';

import { IReaction } from '../utils/types';
import { EmojiBigWrapper, TooltipUserName } from './styled';

type TooltipContentProps = {
  reactions: IReaction[];
  emoji: string;
};

export const TooltipContent = ({ reactions, emoji }: TooltipContentProps) => {
  return (
    <div style={{ margin: 'auto' }}>
      <EmojiBigWrapper>
        <Emoji unified={emoji} emojiStyle={EmojiStyle.APPLE} size={50} />
      </EmojiBigWrapper>
      {reactions.map((reaction) => (
        <TooltipUserName key={reaction.id}>{reaction.user_id}</TooltipUserName>
      ))}
    </div>
  );
};
