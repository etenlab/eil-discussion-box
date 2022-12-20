import React from 'react';
import { styled } from '@mui/material/styles';
import { Tooltip, TooltipProps, tooltipClasses } from '@mui/material';

export const EmojiWrapper = styled('span')({
  display: 'inline-flex',
  border: '1px solid #000',
  borderRadius: '4px',
  height: '25px',
  lineHeight: '25px',
  width: '41px',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '4px',
  fontFamily: 'Inter',
  fontStyle: 'normal',
  fontWeight: '600',
});

export const EmojiContainer = styled('span')({
  display: 'inline-flex',
  fontSize: '16px',
  lineHeight: '22px',
});

export const EmojiCount = styled('span')({
  fontSize: '12px',
  lineHeight: '18px',
});

export const TooltipUserName = styled('div')({
  margin: 'auto',
  padding: '2px 0',
});

export const EmojiBigWrapper = styled('div')({
  borderRadius: '8px',
  marginBottom: '8px',
  width: '50px',
  height: '50px',
  background: '#fff',
});

export const AddReactionIconButton = styled('span')({
  display: 'inline-flex',
  border: '1px solid #000',
  borderRadius: '4px',
  padding: '4px',
  background: '#fff',
  color: '#000',
  '&: hover': {
    background: '#eee',
    borderColor: '#222',
  },
  '& svg': {
    fontSize: '16px',
  },
  fontFamily: 'Inter',
  fontStyle: 'normal',
  fontWeight: '600',
});

export const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    display: 'flex',
    backgroundColor: '#000',
    color: '#f5f5f5',
    width: 200,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
    borderRadius: '16px',
  },
  [`& .${tooltipClasses.arrow}`]: {
    '&::before': {
      backgroundColor: '#000',
    },
  },
}));
