import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    gray: {
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

declare module '@mui/material/styles' {
  interface Palette {
    gray: Palette['primary'];
  }

  // allow configuration using `createTheme`
  interface PaletteOptions {
    gray?: PaletteOptions['primary'];
  }
}

// Update the Button's color prop options
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    gray: true;
  }
}
