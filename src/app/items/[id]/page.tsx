import axios from "axios";

const getData = async (id: string) => {
  try {
    const { data } = await axios.get(`http://localhost:3000/api/items/${id}`);
    return data;
  } catch (e) {
    console.log(e);
  }
};

const ItemDetails = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const item = await getData(id);
  return <div>{item.name}</div>;
};

export default ItemDetails;
