import DeleteButton from "@/components/DeleteButton";
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
  return (
    <div>
      <h1>{item.name} </h1>
      <p>{item.description}</p>
      <div>Found by: {item.founderName}</div>
      <div>
        Contact: {item.founderNumber} {item.founderEmail}
      </div>
      <div>Found at: {item.foundAddress}</div>
      <DeleteButton id={id} />
    </div>
  );
};

export default ItemDetails;
