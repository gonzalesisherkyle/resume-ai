import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { ModalProvider } from './context/ModalContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ModalProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(10, 10, 10, 0.95)',
                color: '#e2e8f0',
                border: '1px solid rgba(20, 184, 166, 0.35)',
                borderRadius: '0px',
                fontFamily: "'Space Grotesk', 'JetBrains Mono', monospace",
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
              },
              success: {
                iconTheme: {
                  primary: '#10b981', // --terminal-green
                  secondary: '#050505',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444', // --terminal-red
                  secondary: '#050505',
                },
              },
            }}
          />
        </ModalProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
