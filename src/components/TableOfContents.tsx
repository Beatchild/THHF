'use client'

import { useEffect, useState } from 'react'

interface TOCItem {
  id: string
  text: string
  level: number
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // Find all H2 and H3 elements inside the prose-editor
    const elements = Array.from(document.querySelectorAll('.prose-editor h2, .prose-editor h3'))
    
    const items: TOCItem[] = elements.map((elem) => ({
      id: elem.id,
      text: elem.textContent || '',
      level: elem.tagName === 'H2' ? 2 : 3,
    }))
    
    setHeadings(items)

    // Setup intersection observer to highlight active heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '0px 0px -80% 0px' }
    )

    elements.forEach((elem) => observer.observe(elem))

    return () => observer.disconnect()
  }, [])

  if (headings.length === 0) return null

  return (
    <div className="sticky top-24 hidden xl:block w-64 bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 self-start ml-8">
      <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">In this article</h4>
      <nav className="flex flex-col gap-3">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className={`text-sm transition-colors duration-200 ${
              activeId === heading.id 
                ? 'text-lime-400 font-bold translate-x-2' 
                : 'text-zinc-500 hover:text-white hover:translate-x-1'
            } ${heading.level === 3 ? 'ml-4' : ''} block transform`}
          >
            {heading.text}
          </a>
        ))}
      </nav>
    </div>
  )
}
