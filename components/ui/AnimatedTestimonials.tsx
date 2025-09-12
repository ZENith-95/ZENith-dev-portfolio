"use client";

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";

type Testimonial = {
  quote: string;
  name: string;
  redirect: string;
  pic: string;
};

interface TestimonialNavigationButtonProps {
  onClick: () => void;
  icon: React.ElementType;
  ariaLabel: string;
  direction: 'left' | 'right';
  title: string;
  className?: string;
}

const TestimonialNavigationButton: React.FC<TestimonialNavigationButtonProps> = ({
  onClick,
  icon: Icon,
  ariaLabel,
  direction,
  title,
  className,
}) => {
  const rotationClass = direction === 'left' ? 'group-hover/button:rotate-12' : 'group-hover/button:-rotate-12';
  const iconPosition = direction === 'left' ? 'left' : 'right';

  return (
    <button
      onClick={onClick}
      className={`relative inline-flex h-12 w-32 overflow-hidden rounded-lg p-[1px] focus:outline-none group/button focus:ring-2 focus:ring-offset-2 focus:purple ${className}`}
      aria-label={ariaLabel}
    >
      {/* Magic border span */}
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />

      {/* Inner content span */}
      <span
        className={`inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg
             bg-slate-950 px-7 text-sm font-medium text-white backdrop-blur-3xl gap-2`}
      >
        {iconPosition === "left" && <Icon className={`h-5 w-5 text-white ${rotationClass} transition-transform duration-300`} />}
        {title}
        {iconPosition === "right" && <Icon className={`h-5 w-5 text-white ${rotationClass} transition-transform duration-300`} />}
      </span>
    </button>
  );
};

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index: number) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay]);

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10;
  };

  const touchStartX = useRef(0);
  const handleSwipe = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    if (touchStartX.current - touchEndX > 50) {
      // Swiped left
      handleNext();
    } else if (touchEndX - touchStartX.current > 50) {
      // Swiped right
      handlePrev();
    }
  };

  return (
    <div
      className="w-full antialiased font-sans py-20 relative"
      onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
      onTouchEnd={handleSwipe}
    >
      {" "}
      {/* Changed to w-full and relative */}
      <div className="max-w-sm md:max-w-4xl mx-auto px-4 md:px-8 lg:px-20">
        {" "}
        {/* New wrapper for content */}
        <div className="relative grid grid-cols-1 md:grid-cols-2  gap-20">
          <div>
            <div className="relative h-80 w-full">
              <AnimatePresence>
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.pic}
                    initial={{
                      opacity: 0,
                      scale: 0.9,
                      z: -100,
                      rotate: randomRotateY(),
                    }}
                    animate={{
                      opacity: isActive(index) ? 1 : 0.7,
                      scale: isActive(index) ? 1 : 0.95,
                      z: isActive(index) ? 0 : -100,
                      rotate: isActive(index) ? 0 : randomRotateY(),
                      zIndex: isActive(index)
                        ? 999
                        : testimonials.length + 2 - index,
                      y: isActive(index) ? [0, -80, 0] : 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.9,
                      z: 100,
                      rotate: randomRotateY(),
                    }}
                    transition={{
                      duration: 0.4,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 origin-bottom"
                  >
                    <Image
                      src={testimonial.pic}
                      alt={testimonial.name}
                      width={500}
                      height={500}
                      draggable={false}
                      className="h-full w-full rounded-3xl object-cover object-center"
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
          <div className="flex justify-between flex-col py-4">
            <motion.div
              key={active}
              initial={{
                y: 20,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: -20,
                opacity: 0,
              }}
              transition={{
                duration: 0.2,
                ease: "easeInOut",
              }}
            >
              <h3 className="text-2xl font-bold dark:text-white text-black">
                {testimonials[active].name}
              </h3>
              <motion.p className="text-lg text-gray-500 mt-8 dark:text-neutral-300">
                {testimonials[active].quote.split(" ").map((word, index) => (
                  <motion.span
                    key={index}
                    initial={{
                      filter: "blur(10px)",
                      opacity: 0,
                      y: 5,
                    }}
                    animate={{
                      filter: "blur(0px)",
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.2,
                      ease: "easeInOut",
                      delay: 0.02 * index,
                    }}
                    className="inline-block"
                  >
                    {word}&nbsp;
                  </motion.span>
                ))}
              </motion.p>
              <a
                href={testimonials[active].redirect}
                className="relative inline-flex items-center justify-center mt-4 px-8 py-2 overflow-hidden font-mono font-medium tracking-tighter text-white bg-gray-800 rounded-lg group"
              >
                <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-purple rounded-full group-hover:w-56 group-hover:h-56"></span>
                <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-700"></span>
                <span className="relative">Visit Now</span>
              </a>
            </motion.div>
          </div>
        </div>
      </div>
      {/* Navigation buttons positioned absolutely */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 hidden md:flex items-center justify-between w-full pointer-events-none">
        <TestimonialNavigationButton
          onClick={handlePrev}
          icon={IconArrowLeft}
          ariaLabel="Previous testimonial"
          direction="left"
          title="Previous"
          className="pointer-events-auto ml-4 md:ml-8 lg:ml-20"
        />
        <TestimonialNavigationButton
          onClick={handleNext}
          icon={IconArrowRight}
          ariaLabel="Next testimonial"
          direction="right"
          title="Next"
          className="pointer-events-auto mr-4 md:mr-8 lg:mr-20"
        />
      </div>
    </div>
  );
};
