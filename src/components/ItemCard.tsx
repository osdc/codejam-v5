"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IItem } from "@/models/item.model";
import Image from "next/image";
import styles from "@/components/ItemCard.module.css";

const ItemCard = ({ item }: { item: IItem }) => {
  const pathname = usePathname();
  return (
    <div className="w-[22rem] sm:w-[23rem] p-4">
      <Link href={`${pathname}/${item._id}`}>
        <div
          className="h-[25rem] rounded-t-lg relative bg-cover bg-center "
          style={{
            backgroundImage: `url(${
              item.image
                ? item.image
                : "https://res.cloudinary.com/ddmjczaqq/image/upload/v1735214192/jiit-lost-and-found/t7u0zqotcli7zvma9pn3.png"
            })`,
          }}
        >
          <div
            className={`h-fit w-fit absolute top-4 right-4 p-2 rounded-lg text-white ${
              item.category === "lost" ? "bg-red-600" : "bg-green-600"
            }`}
          >
            {item.category.toUpperCase()}
          </div>
        </div>
        <div className="flex flex-col bg-black border border-t-0 p-4 rounded-b-lg">
          <span className="text-2xl font-bold text-white">{item.name}</span>
          <span className={`text-gray-500 ${styles.description}`}>
            {item.description}
          </span>
          <span></span>
        </div>
      </Link>
    </div>
  );
};

export default ItemCard;
