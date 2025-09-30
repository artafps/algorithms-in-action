import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Button } from './components/ui/button.tsx'
import MergeSortVisualizer from './common/MergeSortVisualizer.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Button variant="secondary">Click me</Button>
    <MergeSortVisualizer></MergeSortVisualizer>
  </StrictMode>,
)
