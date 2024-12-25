import axios from "axios";
import ItemCard from "@/components/ItemCard";
import { IItem } from "@/models/item.model";

const getData = async () => {
  try {
    const { data } = await axios.get("http://localhost:3000/api/items");
    return data;
  } catch (e) {
    console.log(e);
  }
};

const Items = async () => {
  const items: IItem[] = await getData();

  return (
    <div>
      {items.map((i: IItem) => (
        <ItemCard item={i} key={i._id} />
      ))}
    </div>
  );
};

export default Items;
