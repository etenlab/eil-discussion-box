import React from 'react';

import { Stack, Button } from "@mui/material";
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import VideoCallOutlinedIcon from '@mui/icons-material/VideoCallOutlined';

const sxObj = {
  width: "100px",
  height: "38px",
}

export function InputButtonList() {

  return (
    <Stack direction="row" justifyContent="center" alignItems="center" gap="16px">
      <Button variant="contained" sx={sxObj}>
        T
      </Button>
      <Button variant="contained" sx={sxObj}>
        <MicNoneOutlinedIcon />
      </Button>
      <Button variant="contained" sx={sxObj}>
        <VideoCallOutlinedIcon />
      </Button>
    </Stack>
  )
}