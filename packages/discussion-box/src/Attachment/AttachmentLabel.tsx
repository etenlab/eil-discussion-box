import React from 'react';

import { AttachmentContainer } from './styled';

import { IFileDB } from '../utils/types';

type AttachmentLabelProps = {
  file: IFileDB;
  onCancel: () => void;
};

export function AttachmentLabel({ file, onCancel }: AttachmentLabelProps) {
  return (
    <AttachmentContainer onClick={onCancel}>
      {file.filename}
    </AttachmentContainer>
  );
}
