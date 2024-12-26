"use client";
import SyncLoader from "react-spinners/SyncLoader";

const Loading = () => {
  return (
    <div className="h-screen w-full bg-black flex items-center justify-center">
      <SyncLoader loading={true} color={"#ffffff"} />
    </div>
  );
};

export default Loading;
