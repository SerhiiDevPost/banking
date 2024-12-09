'use client'
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useState } from "react";

export function Navbar({id}: {id: string | undefined}) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="w-full bg-slate-400 h-10 flex items-center justify-between px-5">
      <Button variant={'ghost'} onClick={() => router.push('/')}>Main</Button>
      {/* desktop  */}
      <div className="hidden md:flex gap-3 ">
        <Button onClick={() => router.push('/deposit')}>Deposit</Button>
        <Button onClick={() => router.push(!id ? '/deposit' : '/transfer')}>Transfer</Button>
        <Button onClick={() => router.push(!id ? '/deposit' : '/withdraw')}>Withdraw</Button>
      </div>

      {/* mobile */}
      <div className="flex md:hidden">
        <Button onClick={() => setMenuOpen(true)}>Menu</Button>
      </div>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMenuOpen(false)}
      ></div>
      <div
        className={`fixed top-0 left-0 w-full h-full bg-white z-50 transform transition-transform duration-300 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col p-5 gap-4 h-full">
          <Button variant="ghost" onClick={() => setMenuOpen(false)}>
            Close
          </Button>
          <Button onClick={() => { router.push('/deposit'); setMenuOpen(false); }}>Deposit</Button>
          <Button onClick={() => { router.push(!id ? '/deposit' : '/transfer'); setMenuOpen(false); }}>Transfer</Button>
          <Button onClick={() => { router.push(!id ? '/deposit' : '/withdraw'); setMenuOpen(false); }}>Withdraw</Button>
        </div>
      </div>
    </div>
  )
}