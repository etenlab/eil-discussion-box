import React from 'react';

import { Button } from '@mui/material';

import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

import { IFile } from '../utils/types';

type AttachmentProps = {
  file: IFile;
};

export function Attachment({ file }: AttachmentProps) {
  const handleDownload = () => {
    let hiddenElement = document.createElement('a');
    hiddenElement.href = encodeURI(file.url);
    hiddenElement.download = file.filename;
    hiddenElement.click();
  };

  return (
    <Button
      onClick={handleDownload}
      variant="outlined"
      startIcon={<InsertDriveFileOutlinedIcon />}
      endIcon={<FileDownloadOutlinedIcon />}
    >
      {file.filename}
    </Button>
  );
}
