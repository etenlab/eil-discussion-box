import { MouseEvent } from "react";

import { Stack } from "@mui/material";
import AddReactionOutlinedIcon from "@mui/icons-material/AddReactionOutlined";

import { AddReactionIconButton } from "./styled";
import { IReaction } from "../utils/types";
import { Reaction } from "./Reaction";

interface ReactionListProps {
  reactions: Array<IReaction> | [];
  openEmojiPicker(event: MouseEvent<HTMLButtonElement>): void;
  deleteReaction(reaction_id: number): void;
}

/**
 * This component render Reactions with from unified strings.
 */
export function ReactionList({
  reactions,
  openEmojiPicker,
  deleteReaction,
}: ReactionListProps) {
  if (reactions?.length === 0) {
    return null;
  }

  return reactions?.length > 0 ? (
    <Stack direction="row" sx={{ flexWrap: "wrap" }}>
      {reactions?.map((reaction) => (
        <Reaction
          key={reaction.id}
          {...reaction}
          deleteReaction={deleteReaction}
        />
      ))}

      <AddReactionIconButton onClick={openEmojiPicker}>
        <AddReactionOutlinedIcon />
      </AddReactionIconButton>
    </Stack>
  ) : null;
}
