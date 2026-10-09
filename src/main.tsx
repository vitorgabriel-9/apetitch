
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './styles/theme.css'

// Recupera o tema salvo antes de mostrar a primeira tela
const savedTheme = localStorage.getItem('theme')
document.documentElement.classList.toggle(
  'dark-mode',
  savedTheme === 'dark'
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)