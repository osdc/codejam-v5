"use client";

import axios from "axios";

const handleClick = async (id: string) => {
  try {
    const { data } = await axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/items/${id}`
    );
    console.log(data);
  } catch (e) {
    console.log(e);
  }
};

const DeleteButton = ({ id }: { id: string }) => {
  return (
    <button
      onClick={() => {
        handleClick(id);
      }}
    >
      Delete?
    </button>
  );
};

export default DeleteButton;
