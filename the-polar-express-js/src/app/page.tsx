import Link from "next/link";

const Home = () => {
  return (
    <div className="bg-black h-screen w-full text-white md:flex">
      <div className="py-8 pt-16 md:h-full w-full flex justify-end items-center px-4">
        <div className="bg-[url('/JIIT-Noida.png')] bg-no-repeat bg-cover h-[20rem] w-[35rem] rounded-md"></div>
      </div>
      <div className="py-8 md:h-full w-full flex items-center px-4">
        <div className="flex flex-col items-center">
          <div className="text-3xl font-bold">JIIT&apos;s Lost and Found</div>
          <div className="text-center text-lg">
            Your one-stop solution for reporting and finding lost items.
          </div>
          <div className="items-center">
            <button className="bg-red-500 text-white p-2 rounded-md hover:bg-red-700 mt-4">
              <Link href="/items">See all listed items</Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
