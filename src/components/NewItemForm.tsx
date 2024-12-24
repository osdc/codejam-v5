"use client";
import axios from "axios";

const NewItemForm = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const { data: resData } = await axios.post(
      "http://localhost:3000/api/items",
      data
    );
    console.log(resData);
  };
  return (
    <form action="" onSubmit={handleSubmit}>
      <input type="text" placeholder="item name" name="name" />
      <input type="text" placeholder="description" name="description" />
      <input type="text" placeholder="your name" name="founderName" />
      <input type="text" placeholder="your number" name="founderNumber" />
      <input type="text" placeholder="your email" name="founderEmail" />
      <input
        type="text"
        placeholder="where did you find this item?"
        name="foundAddress"
      />
      <button type="submit">Add</button>
    </form>
  );
};

export default NewItemForm;
