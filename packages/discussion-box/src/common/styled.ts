import { styled } from '@mui/material/styles';

export const AddButtonWrapper = styled('span')({
  display: 'inline-flex',
  border: '1px solid #000',
  borderRadius: '4px',
  padding: '4px',
  background: '#fff',
  color: '#000',
  '&:hover, & > label:hover': {
    background: '#eee',
    borderColor: '#222',
    cursor: 'pointer',
  },
  '&.disabled: hover, &.disabled > label: hover': {
    borderColor: '#ccc',
    cursor: 'not-allowed',
  },
  '& svg': {
    fontSize: '16px',
  },
  fontFamily: 'Inter',
  fontStyle: 'normal',
  fontWeight: '600',
});

export const SendButtonWrapper = styled('span')({
  display: 'inline-flex',
  border: '1px solid #c2c2c',
  borderRadius: '4px',
  padding: '5px',
  background: '#006762',
  color: '#fff',
  '&: hover': {
    background: '#007A71',
    borderColor: '#222',
  },
  '& svg': {
    fontSize: '16px',
  },
  fontFamily: 'Inter',
  fontStyle: 'normal',
  fontWeight: '600',
  cursor: 'pointer',
});
