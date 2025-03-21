"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { FaLocationArrow } from "react-icons/fa6";

import { projects } from "@/data";
import { PinContainer } from "./ui/Pin";
import MagicButton from "./MagicButton";

const RecentProjects = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // or a loading skeleton
  }

  return (
    <div className="py-20 flex flex-col items-center justify-center">
      <h1 className="heading">
        A small selection of{" "}
        <span className="text-purple">recent projects</span>
      </h1>
      <div className="flex flex-wrap items-center justify-center p-4 gap-16 mt-10">
        {projects.map((item) => (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            key={item.id}>
            {item && (
              <div className="lg:min-h-[32.5rem] h-[25rem] flex items-center justify-center sm:w-96 w-[80vw] my-8">
                <PinContainer title={item?.link || ""} href={item?.link || ""}>
                  <div className="relative flex items-center justify-center sm:w-96 w-[80vw] overflow-hidden h-[40vh] lg:h-[35vh] mb-10">
                    <div
                      className="relative w-full h-full overflow-hidden lg:rounded-3xl"
                      style={{ backgroundColor: "#13162D" }}>
                      <Image
                        src="/bg.png"
                        alt="bgimg"
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <Image
                      src={item.img}
                      alt={`${item.title} cover`}
                      fill
                      style={{ objectFit: "contain" }}
                      className="z-10"
                    />
                  </div>
                  <h1 className="font-bold lg:text-2xl md:text-xl text-base line-clamp-1">
                    {item.title}
                  </h1>
                  <p
                    className="lg:text-xl lg:font-normal font-light text-sm line-clamp-2"
                    style={{
                      color: "#BEC1DD",
                      margin: "1vh 0",
                    }}>
                    {item.des}
                  </p>
                  <div className="flex items-center justify-between mt-7 mb-3">
                    <div className="flex items-center">
                      {item.iconLists.map((icon, index) => (
                        <div
                          key={index}
                          className="border border-white/[.2] rounded-full bg-black lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center"
                          style={{
                            transform: `translateX(-${5 * index + 2}px)`,
                          }}>
                          <img src={icon} alt="icon5" className="p-2" />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center items-center">
                      <p className="flex lg:text-xl md:text-xs text-sm text-purple">
                        Check Live Site
                      </p>
                      <FaLocationArrow className="ms-3" color="#CBACF9" />
                    </div>
                  </div>
                </PinContainer>
              </div>
            )}
          </a>
        ))}
      </div>
      <a
        className="flex justify-self-center mt-10"
        href="https://github.com/ZENith-95?tab=repositories"
        target="_blank">
        <MagicButton
          title="View More Projects"
          icon={<FaLocationArrow />}
          position="right"
        />
      </a>
    </div>
  );
};

export default RecentProjects;
