import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import './lib/posthog.js'
import WriteUpPage from './components/writeup/WriteUpPage.jsx'

const root = document.getElementById('root')
const page = (
  <StrictMode>
    <WriteUpPage />
  </StrictMode>
)

if (root.hasChildNodes()) hydrateRoot(root, page)
else createRoot(root).render(page)
