import axios from "axios";
import ItemCard from "@/components/ItemCard";

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
      {items.map((i: { _id: string; name: string }) => (
        <ItemCard item={i} key={i._id} />
      ))}
    </div>
  );
};

export default Items;
