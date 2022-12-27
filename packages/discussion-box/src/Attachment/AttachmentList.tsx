import React from 'react';

import { Stack } from '@mui/material';

import { Attachment } from './Attachment';
import { IFile } from '../utils/types';

type RelationshipFile = {
  id: number;
  file: IFile;
};

type AttachmentListProps = {
  files: RelationshipFile[];
  onRemove(id: number): void;
};

export function AttachmentList({ files, onRemove }: AttachmentListProps) {
  return (
    <Stack gap={2}>
      {files.map((file) => (
        <Attachment key={file.id} file={file.file} onRemove={() => { onRemove(file.id) }} />
      ))}
    </Stack>
  );
}
