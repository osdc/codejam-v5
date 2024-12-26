import axios from "axios";
import ItemCard from "@/components/ItemCard";
import { IItem } from "@/models/item.model";

const getData = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/items`
    );
    return data;
  } catch (e) {
    console.log(e);
  }
};

const Items = async () => {
  const items: IItem[] = await getData();

  return (
    <div className="min-h-screen h-fit w-full bg-black flex justify-center">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 justify-center">
        {items.map((i: IItem) => (
          <ItemCard item={i} key={i._id} />
        ))}
      </div>
    </div>
  );
};

export default Items;
