import React from 'react'
import { HoverBorderGradient } from './ui/hover-border-gradient'
import { ArrowRightIcon } from 'lucide-react'

export default function HeroButton() {
  return (
  <div className="m-5 flex justify-center text-center">
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="a"
        href="/login"
        className="bg-black text-white flex items-center space-x-2"
      >
        <span>Continue</span>
        <ArrowRightIcon size={20} color='white' />
      </HoverBorderGradient>
    </div>
  )
}
