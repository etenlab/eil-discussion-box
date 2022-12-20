import React, { MouseEvent, useMemo } from "react";

import { Stack } from "@mui/material";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";

import { AddReactionIconButton } from "./styled";
import { IReaction } from "../utils/types";
import { sortByContent } from "../utils/helpers";
import { Reaction } from "./Reaction";

interface ReactionListProps {
  reactions: IReaction[];
  openEmojiPicker(event: MouseEvent<HTMLButtonElement>): void;
  onClickReaction(content: string): void;
}

/**
 * This component render Reactions with from unified strings.
 */
export function ReactionList({
  reactions,
  openEmojiPicker,
  onClickReaction,
}: ReactionListProps) {
  const contentReactions = useMemo(() => sortByContent(reactions), [reactions]);

  return (
    <Stack direction="row" sx={{ flexWrap: "wrap", gap: "10px" }}>
      {contentReactions.map(({ content, reactions }) => (
        <Reaction
          key={content}
          content={content}
          reactions={reactions}
          onClick={onClickReaction}
        />
      ))}
      <AddReactionIconButton onClick={openEmojiPicker}>
        <SentimentSatisfiedAltIcon />
      </AddReactionIconButton>
    </Stack>
  );
}
