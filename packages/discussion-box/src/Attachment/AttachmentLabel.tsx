import React from 'react';

import { AttachmentContainer } from './styled';

import { IFile } from '../utils/types';

type AttachmentLabelProps = {
  file: IFile;
  onCancel: () => void;
};

export function AttachmentLabel({ file, onCancel }: AttachmentLabelProps) {
  return (
    <AttachmentContainer onClick={onCancel}>
      {file.filename}
    </AttachmentContainer>
  );
}
