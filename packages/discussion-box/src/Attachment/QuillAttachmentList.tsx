import React from 'react';

import { Stack } from '@mui/material';

import { QuillAttachment } from './QuillAttachment';
import { IFile } from '../utils/types';

type QuillAttachmentListProps = {
  attachments: IFile[];
  onCancel: (attachment: IFile) => void;
};

export function QuillAttachmentList({
  attachments,
  onCancel,
}: QuillAttachmentListProps) {
  return (
    <Stack gap={2} direction="row" sx={{ display: 'inline-flex' }}>
      {attachments.map((attachment) => (
        <QuillAttachment
          key={attachment.id}
          file={attachment}
          onCancel={() => {
            onCancel(attachment);
          }}
        />
      ))}
    </Stack>
  );
}
