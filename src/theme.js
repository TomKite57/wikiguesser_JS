const lightPalette2 = {
  primary: {
    300: '#ffffff',
    400: '#86585a',
    500: '#cf6d5a',
    600: '#8f351e',
  },
  secondary: {
    300: '#9b605e',
  }
};

const lightPalette = {
  primary: {
    300: '#ffffff',
    400: '#414244',
    500: '#D0A600',
    600: '#735C00',
    700: '#cecece',
    800: '#FFCB00',
  },
  secondary: {
    300: '#2A2A2B',
    400: '#b97b7b'
  }
};

export const lightTheme = {
  primary: {
    text: lightPalette.primary[300],
    highlight: lightPalette.primary[800],
    background: lightPalette.primary[400],
    logo: lightPalette.primary[700],
    button: {
        unpressed: lightPalette.primary[500],
        pressed: lightPalette.primary[600],
    } 
  },
  secondary: {
    background: lightPalette.secondary[300],
    button: {
        unpressed: lightPalette.secondary[400],
        pressed: lightPalette.primary[600],
    } 
  }
};