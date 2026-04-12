import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { UIProvider } from './context/UIContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { FeedProvider } from './context/FeedContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <UIProvider>
        <ThemeProvider>
          <FeedProvider>
            <App />
          </FeedProvider>
        </ThemeProvider>
      </UIProvider>
    </AuthProvider>
  </StrictMode>,
);
