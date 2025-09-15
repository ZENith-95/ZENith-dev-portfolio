"use client";

import Preloader from "../../components/Preloader";
import { Dock } from "@/components/ui/Dock";
import { Cover } from "@/components/ui/Cover";
import { Slider } from "@/components/ui/Slider";
import React, { useEffect, useState } from 'react';

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
        <Dock/></div>
        <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-purple via-neutral-800 to-neutral-700 dark:from-purple-800 dark:via-purple dark:to-white">
        Exceptional Websites at <Cover text-purple-500>Lightning Speed</Cover>
      </h1>
        <Slider/>
    </div>
      )}
    </div>
  ): null;
}
