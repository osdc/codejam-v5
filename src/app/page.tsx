import Image from "next/image";

const Home = () => {
  return (
    <div className="bg-black h-screen w-full text-white flex">
      <div className="h-full w-1/2 flex flex-col items-end justify-center ">
        <h1 className="text-3xl text-center">JIIT's Lost and Found</h1>
        <p>Your one-stop solution for reporting and finding lost items.</p>
      </div>
      <div className="h-full w-1/2 flex items-center ml-32">
        <Image
          src="/logo-jiit.png"
          width={250}
          height={250}
          alt="logo"
          className="rounded-lg"
        />
      </div>
    </div>
  );
};

export default Home;
