import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import NotFoundPage from './components/NotFoundPage.jsx'

// No analytics on this page: a missing page isn't a page view.

const root = document.getElementById('root')
const page = (
  <StrictMode>
    <NotFoundPage />
  </StrictMode>
)

if (root.hasChildNodes()) hydrateRoot(root, page)
else createRoot(root).render(page)
