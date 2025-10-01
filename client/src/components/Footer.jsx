import React from 'react'

export default function Footer() {
  return (
    <div className="bg-zinc-900 text-zinc-300 border-t border-zinc-800 mt-44 p-8">
      <div className="w-[70%] mx-auto px-6 py-10 flex flex-col items-center justify-between gap-14">

        <div className="flex flex-row gap-12 justify-between">
          <div className='flex flex-col gap-4'>
            <div className="text-3xl font-bold text-white">Some name</div>
            <div className="mt-2 text-ls font-light word-break">
              Advanced ML-powered fault detection for power line infrastructure.
            </div>
          </div>
          
          <div className='flex flex-col gap-4'> 
            <div className="mt-2 text-lg">
              Features
            </div>
            <div className="mt-2 text-lg">
              Faq
            </div>
          </div>

          <div className='flex flex-col gap-4'>
            <div className="mt-2 text-lg">About
            </div>
          </div>

        </div>
      </div>
      <div className="border-t w-[50%] mx-auto border-zinc-800 text-center py-4 text-lg text-zinc-400">
        <p>Developed by Team The Sleuths06.</p>
        <p className="mt-1">© 2025 Some name. </p>
      </div>
    </div>
  )
}
