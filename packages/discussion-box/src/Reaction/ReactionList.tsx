import React, { MouseEvent, useMemo } from "react";

import { Stack } from "@mui/material";

import { IReaction } from "../utils/types";
import { sortByContent } from "../utils/helpers";
import { Reaction } from "./Reaction";
import { AddReactionButton } from "../common/AddReactionButton";

interface ReactionListProps {
  /**
   * Lists of reactions about specific post
   */
  reactions: IReaction[];
  /**
   * Event handler to control emoji picker
   */
  openEmojiPicker(event: MouseEvent<HTMLButtonElement>): void;
  /**
   * Event handler to control Reaction component's click event.
   * @param content This is a unified emoji string
   */
  onClickReaction(content: string): void;
}

/**
 * List of Reactions
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
      <AddReactionButton onClick={openEmojiPicker} />
    </Stack>
  );
}
