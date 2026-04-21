// ============================================
// REACT APPLICATION ENTRY POINT
// ============================================
// Main file that bootstraps the React application
// Sets up routing and renders the root App component

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

// Mount React app to the DOM element with id 'root' in index.html
// Wrap the App with BrowserRouter to enable client-side routing
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
