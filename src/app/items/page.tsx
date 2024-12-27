import axios from "axios";
import ItemCard from "@/components/ItemCard";
import { IItem } from "@/models/item.model";
import { getBaseUrl } from "@/lib/getBaseUrl";

const getData = async () => {
  try {
    const baseUrl = getBaseUrl();
    const { data } = await axios.get(`${baseUrl}/api/items`);
    // const res = await fetch("/api/items");
    // const data = await res.json();
    // console.log(data);
    return data;
  } catch (e) {
    console.log(e);
  }
};

const Items = async () => {
  try {
    const items: IItem[] = await getData();
    if (!items) {
      return <div>No items found</div>;
    }

    return (
      <div className="min-h-screen h-fit w-full bg-black flex justify-center">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 justify-center">
          {items.map((i: IItem) => (
            <ItemCard item={i} key={i._id} />
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading items:", error);
    return <div>Error loading items. Please try again later.</div>;
  }
};

export default Items;
