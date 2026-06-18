import { createTheme } from '@mui/material/styles'

export const getTheme = (mode = 'light') =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#1e40af',
        light: '#3b82f6',
        dark: '#1e3a8a',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#d4af37',
        light: '#f5e6a3',
        dark: '#b8960c',
        contrastText: '#1e293b',
      },
      background: {
        default: mode === 'light' ? '#ffffff' : '#0f172a',
        paper: mode === 'light' ? '#f8fafc' : '#1e293b',
      },
      text: {
        primary: mode === 'light' ? '#0f172a' : '#f8fafc',
        secondary: '#64748b',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
      h2: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
      h3: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
      h4: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
      h5: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
      h6: { fontFamily: '"Poppins", sans-serif', fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            boxShadow: 'none',
            '&:hover': { boxShadow: '0 4px 12px rgba(30, 64, 175, 0.2)' },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: '0 4px 24px rgba(15, 23, 42, 0.06)',
          },
        },
      },
      MuiTextField: {
        defaultProps: { variant: 'outlined', size: 'small' },
      },
    },
  })

export default getTheme('light')
