import { FaLocationArrow } from "react-icons/fa6";

import { socialMedia } from "@/data";
import MagicButton from "./MagicButton";

const Footer = () => {
  return (
    <footer className="w-full pt-20 pb-5" id="contact">
      {/* background grid */}
      <div className="w-full absolute left-0 -bottom-2 min-h-96">
        <img
          src="/footer-grid.svg"
          alt="grid"
          className="w-full h-full opacity-80 "
        />
      </div>

      <div className="flex flex-col items-center">
        <h1 className="heading lg:max-w-[45vw]">
          Want to Take <span className="text-purple">Your</span> Digital
          Presence to the Next Level?
        </h1>
        <p className="text-white-200 md:mt-10 my-5 text-center">
          Reach out to me today and let&apos;s discuss how I can help you
          achieve your goals.
        </p>
        <a href="mailto:dz.korbla@gmail.com">
          <MagicButton
            title="Let's get in touch"
            icon={<FaLocationArrow />}
            position="right"
          />
        </a>
      </div>
      <div className="flex mt-16 md:flex-row flex-col justify-between items-center gap-10">
        <div className="flex items-center md:gap-3 gap-6">
          {socialMedia.map((info) => (
            <a
              href={info.link}
              target="_blank"
              rel="noopener noreferrer"
              key={info.id}>
              <div className="w-10 h-10 cursor-pointer flex hover:bg-[rgba(33, 1, 92, 0.44)] justify-center items-center backdrop-filter backdrop-blur-lg bg-[rgb(7, 3, 252)] rounded-lg border border-black-300">
                <img src={info.img} alt="icons" width={25} height={25} />
              </div>
            </a>
          ))}
        </div>
        <p className="md:text-base text-sm md:font-normal font-light">
          Copyright, © 2025 ZENith.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
