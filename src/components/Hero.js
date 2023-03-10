import React from "react";
import { Link } from "react-router-dom";
import sunbill from "../images/sunbill.png";
import { Player, Controls } from "@lottiefiles/react-lottie-player";

const Hero = () => {
  return (
    <div className="md:min-h-[90vh] w-full md:px-8 px-2 py-[80px] flex lg:flex-row items-center justify-center flex-col">
      <div
        className="pl-3 my-4 lg:mb-1 lg:text-left pr-6 mb-10"
        style={{ flex: 0.6 }}
      >
        <h2 className="text-3xl font-bold mb-4 md:text-4xl">
          <strong>SunBill</strong> <br></br>
          <br></br>
          developed by themikail
        </h2>
        <p className="opacity-70 mb-4 text-sm md:text-base leading-loose"></p>

        <Link to="/login">
          <button
            className="rounded w-[200px] px-2 py-3 text-gray-50"
            style={{ backgroundColor: "#1e2022" }}
          >
            LOG IN
          </button>
        </Link>
      </div>

      <div className="flex items-center justify-center" style={{ flex: 0.4 }}>
        <Player
          autoplay
          loop
          src="https://assets5.lottiefiles.com/packages/lf20_8blduqui.json"
          style={{ height: "500px", width: "500px" }}
        >
      
        </Player>
        {/* <img
          src={sunbill}
          alt="SunBill"
          className="w-2/3 lg:w-full "
          style={{ width: "300px" }}
        /> */}
      </div>
    </div>
  );
};

export default Hero;
