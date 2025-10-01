import React from "react";
import {HoverEffect} from "./ui/card-hover-effect";

const Feautres = () => {
  return (
    <div className="w-full p-4 bg-black ">
        <div className="flex gap-5 items-center flex-col">
            <div className="font-mono text-4xl font-bold text-center text-white">
                Advanced ML Technology
            </div>
            <div className="text-lg w-[70%] font-light text-center text-white">
                Our advanced ML model is expertly trained to detect and analyze faults in Low Tension lines with high accuracy, ensuring faster response and improved reliability.
            </div>
        </div>
        <div className="max-w-5xl mx-auto px-8 ">
            <  HoverEffect items={features} />
        </div>
    </div>
  );
};

import {
  ShieldCheck,
  Radio,
  Construction,
  MessageCircleWarning,
  Layers,
  LayoutDashboard,
} from "lucide-react";

// Icon mapping
export const icons = {
  ShieldCheck: ShieldCheck,
  Radio: Radio,
  Construction: Construction,
  MessageCircleWarning: MessageCircleWarning,
  Layers: Layers,
  LayoutDashboard: LayoutDashboard,
};

// Features with icon names
export const features = [
  {
    title: "Fault Detection",
    description:
      "An ML-powered system capable of detecting anomalies and faults in Low Tension (LT) lines with high accuracy and reliability.",
    link: "#",
    icon: "ShieldCheck",
  },
  {
    title: "Real-time Monitoring",
    description:
      "Continuous monitoring of LT line data streams using advanced machine learning models for instant fault identification.",
    link: "#",
    icon: "Radio",
  },
  {
    title: "Predictive Maintenance",
    description:
      "AI-driven predictions that forecast potential faults before they occur, minimizing downtime and improving safety.",
    link: "#",
    icon: "Construction",
  },
  {
    title: "Automated Alerts",
    description:
      "Instant notifications and alerts generated when unusual patterns are detected in the LT line signals.",
    link: "#",
    icon: "MessageCircleWarning",
  },
  {
    title: "Scalable Architecture",
    description:
      "A flexible ML system designed to handle large datasets and adapt to multiple fault detection scenarios.",
    link: "#",
    icon: "Layers",
  },
  {
    title: "Visualization Dashboard",
    description:
      "An interactive dashboard to visualize real-time data, detected faults, and maintenance insights powered by ML analytics.",
    link: "#",
    icon: "LayoutDashboard",
  },
];


export default Feautres;
