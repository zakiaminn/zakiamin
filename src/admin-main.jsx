import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AdminPage from './components/admin/AdminPage.jsx'

// No PostHog here: visits to the admin page are never counted.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminPage />
  </StrictMode>
)
