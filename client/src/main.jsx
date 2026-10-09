import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { MotionConfig } from 'framer-motion';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            {/* Automatically dampens Framer Motion's transform/scale animations (not opacity)
                for visitors with prefers-reduced-motion enabled. */}
            <MotionConfig reducedMotion="user">
              <App />
            </MotionConfig>
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: { background: '#150f3d', color: '#F1E7D0', border: '1px solid rgba(255,255,255,0.1)' }
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
