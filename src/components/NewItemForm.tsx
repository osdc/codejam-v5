"use client";
import axios from "axios";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";

const NewItemForm = () => {
  const [image, setImage] = useState<File | null>(null);
  const router = useRouter();

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
      if (data.status === 200) {
        toast.success("Your item has been listed successfully!", {
          position: "bottom-right",
          theme: "dark",
        });
        router.push("/items");
      } else {
        toast.error("Something went wrong! Please try again", {
          position: "bottom-right",
          theme: "dark",
        });
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="my-4 flex flex-col items-center w-full">
      <h1 className="text-3xl font-bold mb-8 text-red-500">Report Item</h1>
      <div className="h-fit border border-gray-800 rounded-xl p-4 w-full md:w-1/3">
        <form
          action=""
          onSubmit={handleSubmit}
          method="POST"
          encType="multipart/form-data"
          className="flex flex-col"
        >
          <Label htmlFor="category" className="text-white py-2">
            Category
          </Label>

          <Select name="category">
            <SelectTrigger className="w-full text-white my-2">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="lost">Lost</SelectItem>
                <SelectItem value="found">Found</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Label htmlFor="name" className="text-white py-2">
            Name
          </Label>
          <Input
            type="name"
            placeholder="Item name"
            name="name"
            id="name"
            className="text-white"
          />

          <Label htmlFor="description" className="text-white py-2">
            Description (Optional)
          </Label>
          <Textarea
            placeholder="A short and detailed description of the item."
            className="text-white"
          />
          <Label htmlFor="contactInformation" className="text-white py-2">
            Contact Information
          </Label>
          <Input
            type="text"
            placeholder="Phone number or Email"
            name="contactInformation"
            className="text-white"
            id="contactInformation"
          />
          <Label htmlFor="date" className="text-white py-2">
            Date (lost/found this item)
          </Label>
          <input
            type="date"
            name="date"
            className="border rounded-sm p-1 w-3/4"
            id="date"
          />
          <Label htmlFor="campus" className="text-white py-2">
            Campus
          </Label>
          <Select name="campus">
            <SelectTrigger className="w-full text-white">
              <SelectValue placeholder="Select campus" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="62">Campus-62</SelectItem>
                <SelectItem value="128">Campus-128</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Label htmlFor="location" className="text-white py-2">
            Location
          </Label>
          <Input
            type="text"
            placeholder="Where did you find/lose this item?"
            name="location"
            className="text-white"
            id="location"
          />
          <Label htmlFor="image" className="text-white py-2">
            Image (Optional)
          </Label>
          <input
            type="file"
            accept="image/*"
            name="image"
            onChange={handleFileChange}
            className="text-white"
            id="image"
          />
          <button
            type="submit"
            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-700 my-2"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewItemForm;
