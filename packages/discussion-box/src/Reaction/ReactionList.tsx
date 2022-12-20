import React, { MouseEvent, useMemo } from 'react';

import { Stack } from '@mui/material';
import AddReactionOutlinedIcon from '@mui/icons-material/AddReactionOutlined';

import { AddReactionIconButton } from './styled';
import { IReaction } from '../utils/types';
import { sortByContent } from '../utils/helpers';
import { Reaction } from './Reaction';

interface ReactionListProps {
  reactions: IReaction[];
  user_id: number;
  openEmojiPicker(event: MouseEvent<HTMLButtonElement>): void;
  addReaction(content: string): void;
  deleteReaction(reaction_id: number): void;
}

/**
 * This component render Reactions with from unified strings.
 */
export function ReactionList({
  reactions,
  user_id,
  openEmojiPicker,
  addReaction,
  deleteReaction,
}: ReactionListProps) {
  if (reactions?.length === 0) {
    return null;
  }

  const handleclick = (content: string) => {
    const reaction = reactions.find(
      (reaction) =>
        reaction.content === content && reaction.user_id === user_id,
    );

    if (reaction) {
      deleteReaction(reaction.id);
    } else {
      addReaction(content);
    }
  };

  const contentReactions = useMemo(() => sortByContent(reactions), [reactions]);

  return contentReactions?.length > 0 ? (
    <Stack direction="row" sx={{ flexWrap: 'wrap' }}>
      {contentReactions.map((contentReaction) => (
        <Reaction
          key={contentReaction.content}
          content={contentReaction.content}
          reactions={contentReaction.reactions}
          onClick={handleclick}
        />
      ))}

      <AddReactionIconButton onClick={openEmojiPicker}>
        <AddReactionOutlinedIcon />
      </AddReactionIconButton>
    </Stack>
  ) : null;
}
