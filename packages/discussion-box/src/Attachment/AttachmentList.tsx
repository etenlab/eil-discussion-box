import React from 'react';

import { Stack } from '@mui/material';

import { Attachment } from './Attachment';
import { IFile } from '../utils/types';

type AttachmentListProps = {
  files: IFile[];
};

export function AttachmentList({ files }: AttachmentListProps) {
  return (
    <Stack gap={2}>
      {files.map((file) => (
        <Attachment key={file.id} file={file} />
      ))}
    </Stack>
  );
}
