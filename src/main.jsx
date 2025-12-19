import React from 'react'
import ReactDOM from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App.jsx'
import './index.css'
import 'animate.css'
import AOS from 'aos'
import 'aos/dist/aos.css'

// Initialize AOS
AOS.init({
  duration: 1000,
  once: true,
  offset: 100,
})

// Force dark mode on document root
document.documentElement.classList.add('dark')

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
