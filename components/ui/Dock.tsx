"use client";

import React from "react";
import { FloatingDock } from "./FloatingDock";
import {
  IconBrandGithub,
  IconBrandX,
  IconHome,
  IconSitemap,
  IconBook2,
  IconBrandLinkedin
} from "@tabler/icons-react";


export function Dock() {

  const links = [
    {
      title: "Home",
      icon: (
        <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: `/`,
    },
    {
      title: "Projects",
      icon: (
        <IconSitemap className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/projects",
    },
    {
      title: "Blog",
      icon: (
        <IconBook2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/blog",
    },
    {
      title: "LinkedIn",
      icon: (
        <IconBrandLinkedin className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://www.linkedin.com/in/dzorgbenyui-kudiabor-566b13371/",
    },
    {
      title: "Twitter",
      icon: (
        <IconBrandX className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://x.com/ArcJove",
    },
    {
      title: "GitHub",
      icon: <IconBrandGithub className="h-full w-full text-neutral-500" />,
      href: "https://github.com/zenith-95",
    },
  ];

  return (
    <div className="flex items-center justify-center h-16 w-full">
      <FloatingDock
        items={links}
      />
    </div>
  );
}