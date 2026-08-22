"use client";

import { useState } from "react";
import Image from "next/image";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "ABOUT", href: "https://tbilisihiphop.com/#about" },
    { label: "LINEUP", href: "https://tbilisihiphop.com/#lineup" },
    { label: "MAP", href: "https://tbilisihiphop.com/#map" },
    { label: "RADIO", href: "https://tbilisihiphop.com/#radio" },
    { label: "INFO", href: "https://tbilisihiphop.com/#info" },
  ];

  return (
    <>
      <nav className="flex justify-between items-center px-6 py-4 bg-black/50 backdrop-blur-md fixed w-full top-0 z-50">
        <a href="https://tbilisihiphop.com" className="relative w-48 h-12 hover:scale-105 transition-transform z-50">
          <Image src="/logo.png" alt="THHF Logo" fill className="object-contain object-left" priority />
        </a>
        
        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="text-white hover:text-lime-400 font-bold text-sm tracking-widest uppercase transition-colors">
              {link.label}
            </a>
          ))}
          <a href="https://tkt.ge/tbilisihiphop" target="_blank" rel="noopener noreferrer" className="ml-4 px-6 py-2 bg-lime-500 text-black font-black text-sm tracking-widest uppercase rounded hover:bg-lime-400 transition-colors">
            TICKETS
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button 
          className="lg:hidden z-50 p-2 text-white" 
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="w-6 h-5 relative flex flex-col justify-between">
            <span className={`w-full h-0.5 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
            <span className={`w-full h-0.5 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-full h-0.5 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </div>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-black/95 z-40 flex flex-col items-center justify-center gap-8 transition-transform duration-500 lg:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {navLinks.map((link) => (
          <a key={link.label} href={link.href} className="text-white hover:text-lime-400 font-black text-3xl tracking-widest uppercase transition-colors" onClick={() => setIsOpen(false)}>
            {link.label}
          </a>
        ))}
        <a href="https://tkt.ge/tbilisihiphop" target="_blank" rel="noopener noreferrer" className="mt-8 px-8 py-4 bg-lime-500 text-black font-black text-2xl tracking-widest uppercase rounded hover:bg-lime-400 transition-colors" onClick={() => setIsOpen(false)}>
          TICKETS
        </a>
      </div>
    </>
  );
}
