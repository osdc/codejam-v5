import React from "react";
import { Button } from "../button";
import { Link } from "react-router-dom";
import ServicesSection from "./Section";
import Header from "./Header";

function Hero() {
  return (
    <div className="relative flex flex-col items-center  gap-9 ">
      <div className="relative w-full z-20">
      <Header />
      </div>

      {/* Background Video */}

      <video
        src="/bg2.mp4"
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover "
      ></video>

      {/* Content Section */}
      <div className="relative z-10">
        <h1 className="font-extrabold text-[50px] text-center mt-16">
          <span className="text-[#e86351]">
          Unleash Your Next Adventure with AI: 
          </span>{" "}
          <br /> Custom Itineraries Crafted Just for You!
        </h1>
        <p className="text-xl text-[#ffffff] text-center mt-4">
        Tailored travel experiences that match your style, interests, and budget – all at your fingertips.
        </p>
        
        <div className="mt-4 flex justify-center">
          <Link to={"/create-trip"}>
            <Button className="bg-[#177d80ae] w-64 h-16 mt-8">Get Started, It's Free</Button>
          </Link>
        </div>
       

        <div>
          <ServicesSection />
        </div>
      </div>
    </div>
  );
}

export default Hero;
