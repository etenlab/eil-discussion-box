import React, { MouseEvent } from "react";
import SendIcon from "@mui/icons-material/Send";
import { SendButtonWrapper } from "./styled";

type SendButtonProps = {
  /**
   * Click Event handler,
   */
  onClick(event: MouseEvent<HTMLButtonElement>): void;
};

/**
 * Primary UI component
 */
export function SendButton({ onClick }: SendButtonProps) {
  return (
    <SendButtonWrapper onClick={onClick}>
      <SendIcon />
    </SendButtonWrapper>
  );
}
