import React from 'react'

export default function About() {
  return (
    <div id = "about" className='flex flex-col gap-14 items-center justify-center mx-auto text-white'>
        <div className='text-4xl font-mono font-bold text-center mt-40'>
            About
        </div>
        <div className='flex flex-col gap-8 text-xl w-[50%] text-justify font-light text-zinc-400'>
            <div>Our project focuses on building an advanced ML-based fault detection system for Low Power (LP) lines. The model is capable of identifying not only line failures but also other critical issues such as low impedance, abnormal fluctuations, and potential overloads. By leveraging real-time monitoring and predictive analytics, the system ensures early detection of faults, reducing downtime and improving overall grid reliability.</div>

            <div>To make it truly useful in real-world applications, the solution is integrated with a live interactive dashboard, where operators can monitor LP line health, visualize detected anomalies, and receive instant alerts. This approach bridges the gap between cutting-edge AI and power infrastructure safety, making fault management more efficient, proactive, and scalable.</div>
        </div>
    </div>
  )
}
