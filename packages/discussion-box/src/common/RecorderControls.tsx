import React from 'react';

import { Stack, IconButton } from '@mui/material';

import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';

import { RecorderStatus } from '../utils/types';

type RecorderControlsProps = {
  onCancel(): void;
  onSave(): void;
  color: string;
  recorderStatus: RecorderStatus;
  startButton: JSX.Element;
  pauseButton: JSX.Element;
  resumeButton: JSX.Element;
};

export function RecorderControls({
  onCancel,
  onSave,
  color,
  recorderStatus,
  startButton,
  pauseButton,
  resumeButton,
}: RecorderControlsProps) {
  let mainButton;

  switch (recorderStatus) {
    case 'new': {
      mainButton = startButton;
      break;
    }
    case 'paused': {
      mainButton = resumeButton;
      break;
    }
    case 'recording': {
      mainButton = pauseButton;
      break;
    }
  }

  const disabled = recorderStatus === 'new';

  return (
    <Stack direction="row" alignItems="center" gap="30px">
      <IconButton onClick={onCancel}>
        <CloseOutlinedIcon
          sx={{ fontSize: 28, color, fontWeight: 700 }}
        />
      </IconButton>
      {mainButton}
      <IconButton onClick={onSave} disabled={disabled}>
        <CheckOutlinedIcon
          sx={{ fontSize: 28, color, fontWeight: 700 }}
        />
      </IconButton>
    </Stack>
  );
}