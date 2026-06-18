import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { Toaster } from 'react-hot-toast'
import store from './redux/store'
import { getTheme } from './styles/theme'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={getTheme('light')}>
          <CssBaseline />
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: '12px',
                background: '#fff',
                color: '#0f172a',
                boxShadow: '0 8px 32px rgba(15, 23, 42, 0.12)',
                fontFamily: 'Inter, sans-serif',
              },
            }}
          />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
