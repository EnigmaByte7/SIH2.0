import React from "react";

export default function Navbar() {
  return (
    <div className="fixed top-8 left-1/2 translate-x-[-50%]   z-50  w-[70%] p-2 bg-transparent backdrop-blur-xl text-zinc-200 rounded-full shadow-lg border border-zinc-700">
      <ul className="flex items-center justify-center gap-10 px-8 py-4 text-sm font-medium">
        <li><a href="#features" className="hover:text-white">Features</a></li>
        <li><a href="#faq" className="hover:text-white">FAQ</a></li>
        <li><a href="#about" className="hover:text-white">About</a></li>
        <li>
          <a
            href="#dashboard"
            className="bg-white text-black px-4 py-2 rounded-full font-semibold hover:bg-zinc-200"
          >
            Dashboard
          </a>
        </li>
      </ul>
    </div>
  );
}
