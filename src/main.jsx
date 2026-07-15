import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* basename matches vite.config.js's `base` so routing still works
        once this is deployed under github.io/sya_web/ instead
        of the root domain. */}
    <BrowserRouter basename="/sya_web/">
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)