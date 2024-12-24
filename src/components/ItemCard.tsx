"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ItemCard = ({ item }) => {
  const pathname = usePathname();
  return (
    <div>
      <li>
        <Link href={`${pathname}/${item._id}`}>{item.name}</Link>
      </li>
    </div>
  );
};

export default ItemCard;
