import React, { MouseEvent } from 'react';
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";

import { AddReactionIconButton } from "./styled";

type AddReacitonButtoonProps = {
  openEmojiPicker(event: MouseEvent<HTMLButtonElement>): void;
}

export function AddReactionButton({ openEmojiPicker }: AddReacitonButtoonProps) {
  return (
    <AddReactionIconButton onClick={openEmojiPicker}>
      <SentimentSatisfiedAltIcon />
    </AddReactionIconButton>
  )
}