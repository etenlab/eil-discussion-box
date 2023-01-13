import React from 'react';

import { Stack, Button } from '@mui/material';

import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import VideoCallOutlinedIcon from '@mui/icons-material/VideoCallOutlined';

import { useDiscussionContext } from '../hooks/useDiscussionContext';

const sxObj = {
  width: '100px',
  height: '38px',
};

export function InputModeSelector() {
  const {
    actions: { changeEditorKind },
  } = useDiscussionContext();

  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      gap="16px"
    >
      <Button variant="contained" color="gray" sx={sxObj} onClick={() => changeEditorKind('quill')}>
        T
      </Button>
      <Button variant="contained" color="gray" sx={sxObj} onClick={() => changeEditorKind('audio')}>
        <MicNoneOutlinedIcon />
      </Button>
      <Button variant="contained" color="gray" sx={sxObj} onClick={() => changeEditorKind('video')}>
        <VideoCallOutlinedIcon />
      </Button>
    </Stack>
  );
}
