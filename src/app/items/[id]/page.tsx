import { IItem } from "@/models/item.model";
import axios from "axios";

const getData = async (id: string) => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/items/${id}`
    );
    return data;
  } catch (e) {
    console.log(e);
  }
};
export type PageProps = {
  params: { id: string };
};

const ItemDetails = async ({ params }: PageProps) => {
  const { id } = await params;
  const item: IItem = await getData(id);
  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Item not found
      </div>
    );
  }

  const date = new Date(item.date);
  return (
    <div className="min-h-screen h-fit w-full bg-black md:flex md:pt-12">
      <div className="h-fit w-full px-2 sm:w-3/4 md:w-1/2 py-4 flex justify-end">
        <div
          className="h-[25rem] w-full md:w-[25rem] rounded-lg bg-cover bg-center relative"
          style={{
            backgroundImage: `url(${
              item.image
                ? item.image
                : "https://res.cloudinary.com/ddmjczaqq/image/upload/v1735214192/jiit-lost-and-found/t7u0zqotcli7zvma9pn3.png"
            })`,
          }}
        >
          <div
            className={`h-fit w-fit absolute p-2 top-4 right-4 text-white rounded-lg ${
              item.category === "lost" ? "bg-red-600" : "bg-green-600"
            }`}
          >
            {item.category.toUpperCase()}
          </div>
        </div>
      </div>
      <div className="h-fit w-full px-2 sm:w-3/4 md:w-1/2 py-4 flex text-white">
        <div className="min-h-[25rem] h-fit w-full md:w-[25rem] border-2 border-gray-600 rounded-lg p-4">
          <div className="text-3xl text-center break-words">{item.name}</div>
          <hr className="border-gray-600 my-2" />
          <div className="py-2 text-center w-[23rem] break-words ">
            {item.description}
          </div>
          <div className="">
            <div className="mt-6">
              <span className="w-fit p-2 bg-red-500 rounded-lg">
                Contact Information
              </span>{" "}
              {item.contactInformation}
            </div>
            <div className=" mt-6">
              <span className="bg-blue-500 p-2 rounded-lg">
                {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
              </span>{" "}
              {date.toDateString()}
            </div>
            <div className=" mt-6">
              <span className="bg-green-500 p-2 rounded-lg">Location</span>{" "}
              {item.location}
            </div>
            <div className=" mt-6">
              <span className="bg-slate-600 p-2 rounded-lg">Campus</span>{" "}
              {item.campus}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;
