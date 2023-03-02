import React from 'react';

import { DiscussionBoxUI, MuiMaterial } from '@eten-lab/ui-kit';
import { IFile } from '../utils/types';

const { Attachment } = DiscussionBoxUI;
const { Stack } = MuiMaterial;

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
        <Attachment
          key={attachment.id}
          file={attachment}
          mode="quill"
          onRemove={() => {
            onCancel(attachment);
          }}
        />
      ))}
    </Stack>
  );
}
