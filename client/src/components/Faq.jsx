import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion"

const Faq = () => {
    return  (
        <div id="faq"  className="flex-1 items-center justify-center p-32 border-t border-b border-zinc-800 bg-zinc-900  text-white mt-32" >
            <div className="font-mono text-4xl font-bold text-center ">
                Frequently Asked Questions
            </div>
            <div>
                <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto mt-12">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>
                        How accurate is the ML fault detection system?
                        </AccordionTrigger>
                        <AccordionContent className="text-zinc-400">
                        Our ML model achieves up to <b>98% accuracy</b> in detecting faults
                        in LT lines, ensuring reliability and safety.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem className="mt-2" value="item-2">
                        <AccordionTrigger>
                        Can the system monitor LT lines in real-time?
                        </AccordionTrigger>
                        <AccordionContent className="text-zinc-400">
                        Yes. It supports <b>real-time monitoring</b> of LT line signals,
                        allowing instant fault detection and faster response times.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem className="mt-2" value="item-3">
                        <AccordionTrigger>
                        Does it provide predictive maintenance features?
                        </AccordionTrigger>
                        <AccordionContent className="text-zinc-400">
                        Absolutely. The system uses <b>predictive analytics</b> to forecast
                        potential issues before they occur, reducing downtime.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem className="mt-2" value="item-4">
                        <AccordionTrigger>
                        How are users notified about detected faults?
                        </AccordionTrigger>
                        <AccordionContent className="text-zinc-400">
                        Automated <b>alerts and notifications</b> are sent instantly whenever
                        anomalies are detected, ensuring quick action can be taken.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
            
        </div>
    )
}

export default Faq;