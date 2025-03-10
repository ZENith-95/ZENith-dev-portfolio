"use client";
import { motion } from "framer-motion";
import { FlipWords } from "./FlipWords";
import { Spotlight } from "./ui/Spotlight";
import Link from "next/link";
import { BackgroundLines } from "./BackgroundLines";
import MagicButton from "./MagicButton";
import { FaLocationArrow } from "react-icons/fa6";

export const Hero = () => {
  const words = [
    "ZENith",
    "A Web Developer",
    "A Tech Nerd",
    "A Web3 Enthusiast",
  ];

  return (
    <>
      <div className="pb-0 pt-36 xl:pt-0 lg:pt-10 md:pt-20">
        <BackgroundLines className=" flex relative items-center justify-center w-full flex-col px-8 bg-transparent font-kanit">
          <div className="spotlight">
            <Spotlight
              className="-top-40 -left-1 md:-left-32 md:-top-28 h-screen"
              fill="white"
            />
            <Spotlight
              className="top-10 left-full h-[80vh] w-[50vw]"
              fill="purple"
            />
            <Spotlight
              className="-top-20 left-60 h-[80vh] w-[70vw]"
              fill="blue"
            />
          </div>
          <div className="h-screen w-full dark:bg-transparent dark:bg-grid-white/[0.07] flex items-center justify-center absolute top-0 left-0">
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black-100 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
          </div>
          <div className="flex justify-center relative  my-20 z-10">
            
            <div className="flex flex-col items-center justify-center gap-5">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl py-2 sm:py-4 md:py-8 lg:py-10 relative z-20 font-bold tracking-tight text-neutral-900 dark:text-white">
                Hello World, <br /> I am <FlipWords words={words} />
              </motion.h2>
              <p className="max-w-lg sm:max-w-xl mx-auto text-xs sm:text-sm md:text-lg text-neutral-800 dark:text-neutral-200 text-center pb-2 sm:pb-10 md:pb-6">
                Front-end Web Dev with 6 months of experience in building
                beautiful and modern frameworks. Passionate about Web3, design,
                exploring new techniques and contributing to open-source projects.
              </p>
              <a href="" target="_blank">
                <MagicButton
                  title="View Resume"
                  icon={<FaLocationArrow />}
                  position="right"
                />
              </a>
            </div>
          </div>
        </BackgroundLines>
      </div>
    </>
  );
};
