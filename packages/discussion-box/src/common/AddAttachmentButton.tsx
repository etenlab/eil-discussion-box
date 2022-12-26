import React, { ChangeEventHandler } from "react";
import AddIcon from "@mui/icons-material/Add";
import { AddButtonWrapper } from "./styled";

type AddAttachmentButtoonProps = {
  /**
   * Disable input
   */
  disabled: boolean;
  /**
   * Click Event handler,
   */
  onChange: ChangeEventHandler;
};

/**
 * Primary UI component to open emoji picker in the discussion-box
 */
export function AddAttachmentButton({
  onChange,
  disabled,
}: AddAttachmentButtoonProps) {
  return (
    <AddButtonWrapper sx={{ borderColor: (disabled) ? "#555" : "#000" }}>
      <label htmlFor="file-upload" style={{ height: "16px" }}>
        <AddIcon sx={{ color: (disabled) ? "#555" : "#000" }} />
      </label>
      <input
        id="file-upload"
        hidden
        type="file"
        onChange={onChange}
        disabled={disabled}
      />
    </AddButtonWrapper>
  );
}
