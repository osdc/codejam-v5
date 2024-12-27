import cloudinary from "cloudinary";
import { CloudinaryStorage } from "@fluidjs/multer-cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "jiit-lost-and-found", // Optional: Folder for uploaded files in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"], // Optional: Restrict allowed file types
  },
});

export const uploadImage = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const bytes = Buffer.from(buffer);

  return new Promise(async (resolve, reject) => {
    await cloudinary.v2.uploader
      .upload_stream(
        {
          resource_type: "image",
          folder: "jiit-lost-and-found",
        },
        async (err, result) => {
          if (err) {
            reject(err.message);
          }
          resolve(result);
        }
      )
      .end(bytes);
  });
};
