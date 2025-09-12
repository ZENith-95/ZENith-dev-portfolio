"use client";

import { AnimatedTestimonials } from "./AnimatedTestimonials";

export function Slider() {
  const testimonials = [
    {
      name: "Birthday Cruise Website",
      quote:
        "A visually appealing and user-friendly birthday cruise website developed for a client to showcase cruise options, booking details, and special offers for her mom's birthday cruise party.",
      redirect: "https://anastasienervais80thbirthdaycruise.vercel.app/",
      pic: "/Anas80th.png",
    },
    {
      name: "Alibi NFT-Ticketing",
      quote:
        "A cutting-edge NFT-ticketing platform that leverages blockchain technology to provide secure, verifiable, and easily transferable event tickets, enhancing the overall ticketing experience for both organizers and attendees.",
      redirect: "https://albi-ticketing.vercel.app/",
      pic: "/alibi.png",
    },
    {
      name: "GIF Generator",
      quote:
        "This project is a simple web application that helps you generator GIFs according to your choices.",
      redirect: "https://maybe-adev.github.io/GIF.gen/",
      pic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSu738w02z1_mHNHGDfoigI5D-0NhKSkK5LDA&s",
    },
    {
      name: "Tomato - Food Website",
      quote:
        "A website for browsing through delicacies and ordering meals from resturants ",
      redirect: "https://food-bytes.vercel.app",
      pic: "/p1.png",
    },
    {
      name: "Podcast - Audio Streaming",
      quote:
        "Simplify your Listening experience. Stay entertained and informed with exciting Podcasts.",
      redirect: "https://zenith-95.github.io/Podcast/",
      pic: "/p2.png",
    },
    {
      name: "To-Do-Matic - Task Scheduler",
      quote:
        "Stay Organized, add and schedule and complete your tasks all in one place..",
      redirect: "https://to-do-app-silk-kappa.vercel.app",
      pic: "/p7.png",
    },
    {
      name: "Mobile View - Travel Website",
      quote:
        "Discover the wonders of the world. All the hottest travel locations and trending travel lifestyle blogs.",
      redirect: "https://zenith-95.github.io/mobile-view/",
      pic: "/p3.png",
    },
    {
      name: "Productly - Brand Landing Page",
      quote:
        "Take your Products to the next level. Our expert Marketers and designers..",
      redirect: "https://zenith-95.github.io/Productly-/",
      pic: "/p4.png",
    },
    {
      name: "Coffee - Cafe Website",
      quote: "Order a hot coffee today. Browse through our unique and exciting flavours made with love..",
      redirect: "https://zenith-95.github.io/Coffee-shop-JESI-Project--0-/",
      pic: "/p5.png",
    },
    {
      name: "ZenCalc - Calculator App",
      quote:
        "A simple arithmetic Calculator with a stylish futuristic and sleek UI..",
      redirect: "https://zenith-95.github.io/calculator-Mini-Project-ZenCalc/",
      pic: "/p6.png",
    },
  ];
  return <AnimatedTestimonials testimonials={testimonials} />;
}