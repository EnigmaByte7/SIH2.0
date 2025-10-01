import React from "react";
import { motion } from "framer-motion";
import { AuroraBackground } from "./ui/aurora-background";
import HeroButton from "./HeroButton";

const Hero = () => {
  return (
    <AuroraBackground className="bg-black text-white">
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.1,
          duration: 1.0,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
          ML based Fault detection
        </div>
        <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
          Our third attempt for SIH ...moye moye
        </div>
      <HeroButton />
      </motion.div>
    </AuroraBackground>
  );
};

export default Hero;
