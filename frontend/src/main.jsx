import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// finding the html element with id="root" and attach React app to it
createRoot(document.getElementById('root')).render(
  // StrictMode catchs errors during development
  <StrictMode>
    <App />{/* render the main App component */}
  </StrictMode>,
)
