import axios from "axios";
import { Item } from "@/models/item.model";

const getData = async () => {
  try {
    const { data } = await axios.get("http://localhost:3000/api/items");
    return data;
  } catch (e) {
    console.log(e);
  }
};

const Items = async () => {
  const items = await getData();

  return (
    <div>
      {items.map((i: typeof Item) => (
        <div>{i.name}</div>
      ))}
    </div>
  );
};

export default Items;
