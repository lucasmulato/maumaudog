import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' // Correct path relative to src/
import './index.css' // Path is now relative to src/

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>,
)