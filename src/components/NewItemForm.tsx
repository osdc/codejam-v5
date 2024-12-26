"use client";
import axios from "axios";
import { useState } from "react";

const NewItemForm = () => {
  const [image, setImage] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);

      const { data } = await axios.post(
        "http://localhost:3000/api/items",
        formData
      );
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <form
      action=""
      onSubmit={handleSubmit}
      method="POST"
      encType="multipart/form-data"
    >
      <select name="category" id="">
        <option value="lost">Lost</option>
        <option value="found">Found</option>
      </select>
      <input type="text" placeholder="item name" name="name" />
      <input type="text" placeholder="description" name="description" />
      <input
        type="text"
        placeholder="contact information"
        name="contactInformation"
      />
      <input type="date" name="date" />
      <select name="campus" id="">
        <option value="62">62</option>
        <option value="128">128</option>
      </select>
      <input
        type="text"
        placeholder="where did you find this item?"
        name="location"
      />
      <input
        type="file"
        accept="image/*"
        name="image"
        onChange={handleFileChange}
      />
      <button type="submit">Add</button>
    </form>
  );
};

export default NewItemForm;
