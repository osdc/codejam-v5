"use client";

import axios from "axios";
import { getBaseUrl } from "@/lib/getBaseUrl";

const handleClick = async (id: string) => {
  try {
    const baseUrl = getBaseUrl();
    const { data } = await axios.delete(`${baseUrl}/api/items/${id}`);
    // const res = await fetch(`/api/items/${id}`);
    // const data = await res.json();
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
