import { styled } from '@mui/material/styles';

import { Stack, Button } from '@mui/material';

export const AttachmentListContainer = styled('div')({
  display: 'flex',
  gap: '10px',
  alignItems: 'center',
  marginBottom: '-8px',
  overflowX: 'auto',
  border: '1px solid #000',
  borderBottom: 'none',
  borderRadius: '8px 8px 0 0',
  padding: '16px',
});

export const QuillContainer = styled('div')({
  position: 'relative',
  '& .ql-toolbar': {
    borderRadius: '8px 8px 0 0',
    border: '1px solid #000',
    '& span.ql-formats': {
      paddingRight: '10px',
      borderRight: '1px solid #555',
      '&:last-child': {
        border: 'none',
      },
    },
  },
  '& .ql-container': {
    maxHeight: '500px',
    overflowY: 'auto',
    borderRadius: '0 0 8px 8px',
    border: '1px solid #000',
    '& .ql-editor': {
      margin: 'auto 50px',
    },
  },
});

export const QuillTitleContainer = styled(Stack)({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  border: '1px solid #000',
  borderBottom: 'none',
  borderRadius: '8px 8px 0 0',
  padding: '0 8px 0 16px',
  marginBottom: '-4px',
  fontSize: '14px',
});

export const AttachmentButtonContainer = styled('div')({
  position: 'absolute',
  top: '50px',
  left: '16px',
});

export const ReactionButtonContainer = styled('div')({
  position: 'absolute',
  top: '50px',
  right: '16px',
});

export const ReplyButtonContainer = styled('div')({
  position: 'absolute',
  top: '10px',
  right: '16px',
});

export const CircleCloseButton = styled(Button)({
  position: 'absolute',
  top: '-40px',
  right: '13px',
  padding: '0px',
  minWidth: '35px',
  minHeight: '35px',
  borderRadius: '50%',
});
