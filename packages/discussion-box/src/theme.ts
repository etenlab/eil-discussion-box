import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#ededed',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          borderRadius: '6px',
          boxShadow: 'none',
          color: '#000',
          fontWeight: 600,
          fontSize: '20px',
        },
      },
    },
  },
});
