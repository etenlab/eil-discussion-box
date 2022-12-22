import React, { MouseEvent } from 'react';
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";

import { AddReactionIconButton } from "./styled";

type AddReacitonButtoonProps = {
  /**
   * Click Event handler, 
   */
  onClick(event: MouseEvent<HTMLButtonElement>): void;
}

/**
 * Primary UI component to open emoji picker in the discussion-box
 */
export function AddReactionButton({ onClick }: AddReacitonButtoonProps) {
  return (
    <AddReactionIconButton onClick={onClick}>
      <SentimentSatisfiedAltIcon />
    </AddReactionIconButton>
  )
}