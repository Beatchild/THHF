'use client'

import { useEffect, useState } from 'react'

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const currentScroll = window.scrollY
      const currentProgress = (currentScroll / totalHeight) * 100
      setProgress(Math.min(100, Math.max(0, currentProgress)))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Init

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 w-full h-1.5 bg-zinc-900 z-50">
      <div 
        className="h-full bg-lime-500 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
