import React, { MouseEvent } from 'react';

import { IconButton } from '@mui/material';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';

type ScrollDownButtonProps = {
  /**
   * Click Event handler, 
   */
  onClick(event: MouseEvent<HTMLButtonElement>): void;
}

/**
 * Primary UI component to open emoji picker in the discussion-box
 */
export function ScrollDownButton({ onClick }: ScrollDownButtonProps) {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: 'sticky',
        left: '93%',
        bottom: 30,
        width: '30px',
        height: '30px',
        border: '1px solid #000',
        background: '#fff',
      }}
    >
      <KeyboardDoubleArrowDownIcon />
    </IconButton>
  )
}