const lightPalette = {
  primary: {
    300: '#ffffff',
    400: '#323844',
    500: '#D0A600',
    600: '#735C00',
    700: '#ebebeb',
    800: '#FFCB00',
    900: '#121212'
  },
  secondary: {
    300: '#22252c',
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