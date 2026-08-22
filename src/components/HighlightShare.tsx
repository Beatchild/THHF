'use client'

import { useEffect, useState } from 'react'
import { MessageCircle as Twitter } from 'lucide-react'

export default function HighlightShare() {
  const [show, setShow] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [text, setText] = useState('')

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection()
      if (selection && !selection.isCollapsed) {
        const text = selection.toString().trim()
        if (text.length > 5) {
          const range = selection.getRangeAt(0)
          const rect = range.getBoundingClientRect()
          
          setText(text)
          setPosition({
            x: rect.left + rect.width / 2,
            y: rect.top - 10
          })
          setShow(true)
          return
        }
      }
      setShow(false)
    }

    document.addEventListener('selectionchange', handleSelection)
    
    // Hide on scroll
    const handleScroll = () => setShow(false)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      document.removeEventListener('selectionchange', handleSelection)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  if (!show) return null

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text="${encodeURIComponent(text)}" &url=${encodeURIComponent(window.location.href)}`
    window.open(url, '_blank', 'width=550,height=420')
    setShow(false)
  }

  return (
    <button
      onClick={shareToTwitter}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -100%)',
      }}
      className="z-50 bg-black text-white border border-zinc-800 px-4 py-2 rounded-lg shadow-2xl flex items-center gap-2 hover:bg-lime-500 hover:text-black hover:border-lime-500 transition-colors group cursor-pointer animate-in fade-in zoom-in duration-200"
    >
      <Twitter size={16} className="text-[#1DA1F2] group-hover:text-black" />
      <span className="text-sm font-bold">Share</span>
      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-black border-r border-b border-zinc-800 rotate-45 group-hover:bg-lime-500 group-hover:border-lime-500" />
    </button>
  )
}
