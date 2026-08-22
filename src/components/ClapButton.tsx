'use client'

import { useState, useEffect } from 'react'
import { clapPost } from '@/actions/posts'
import { Flame } from 'lucide-react'

export default function ClapButton({ postId, initialClaps }: { postId: string, initialClaps: number }) {
  const [claps, setClaps] = useState(initialClaps)
  const [userClaps, setUserClaps] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Load user claps from localStorage to persist limit
    const stored = localStorage.getItem(`claps_${postId}`)
    if (stored) {
      setUserClaps(parseInt(stored))
    }
  }, [postId])

  const handleClap = async () => {
    if (userClaps >= 50) return // Max 50 claps per user per post

    // Optimistic UI update
    setClaps(prev => prev + 1)
    setUserClaps(prev => {
      const newClaps = prev + 1
      localStorage.setItem(`claps_${postId}`, newClaps.toString())
      return newClaps
    })
    
    // Animation trigger
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300)

    // Server update
    await clapPost(postId)
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <button 
          onClick={handleClap}
          disabled={userClaps >= 50}
          className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-300 ${userClaps > 0 ? 'bg-lime-500 border-lime-500 text-black' : 'bg-transparent border-zinc-700 text-zinc-400 hover:border-lime-500 hover:text-lime-500'} ${isAnimating ? 'scale-110' : 'scale-100'}`}
        >
          <Flame size={24} className={isAnimating ? 'animate-bounce' : ''} />
        </button>
        
        {/* +1 Bubble animation */}
        {isAnimating && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-lime-500 font-bold border border-lime-500 rounded-full w-10 h-10 flex items-center justify-center animate-out slide-out-to-top-8 fade-out duration-500">
            +{userClaps > 0 ? userClaps : 1}
          </div>
        )}
      </div>
      <span className="text-sm font-bold text-zinc-500">
        {claps}
      </span>
    </div>
  )
}
