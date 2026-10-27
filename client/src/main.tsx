import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './services/pwaService';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
