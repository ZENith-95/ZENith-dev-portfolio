"use client";

import Preloader from "../../components/Preloader";
import { Dock } from "@/components/ui/Dock";
import { Cover } from "@/components/ui/Cover";
import { Slider } from "@/components/ui/Slider";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Project() {
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
      setIsClient(true);
  }, []);

  return isClient ? (
    <div>
      {isLoading ? (
        <Preloader />
      ) : (
        <div className="bg-transparent">
          <div className="sticky z-[100]">
            <Dock />
          </div>
          <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-purple via-neutral-800 to-neutral-700 dark:from-purple-800 dark:via-purple dark:to-white">
            Exceptional Websites at <Cover text-purple-500>Lightning Speed</Cover>
          </h1>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.35, ease: "easeOut" }}
            className="md:hidden mt-2 flex justify-center px-4"
          >
            <div className="relative flex w-full max-w-xs items-center gap-2 rounded-full border border-white/15 bg-gradient-to-r from-white/10 via-purple-500/10 to-transparent px-4 py-2 text-sm text-white/80 shadow-[0_0_18px_rgba(147,51,234,0.3)] backdrop-blur">
              <span className="font-semibold">Swipe</span>
              <span className="text-white/60">through the projects</span>
              <motion.span
                animate={{ x: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
                className="text-purple-300"
                aria-hidden="true"
              >
                ➜
              </motion.span>
            </div>
          </motion.div>
          <Slider />
        </div>
      )}
    </div>
  ): null;
}
