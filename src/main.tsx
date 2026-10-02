import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion'
import "./index.css"
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* LazyMotion + `m` components ship a much smaller animation bundle than `motion` */}
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </LazyMotion>
  </StrictMode>,
)
