import AWS from "../config/aws.js";
import fs from "fs/promises";
import { ApiError } from "./ApiError.js";

// Initialize S3 client
const s3 = new AWS.S3();

export const uploadToS3 = async (filePath, bucketName, objectKey) => {
  try {
    // Add validation
    if (!bucketName) throw new Error("Bucket name is required");
    if (!objectKey) throw new Error("Object key is required");
    if (!filePath) throw new Error("File path is required");

    // Check if file already exists
    try {
      await s3
        .headObject({
          Bucket: bucketName,
          Key: objectKey,
        })
        .promise();

      // If file exists, get the URL from AWS using getSignedUrl
      const url = await s3.getSignedUrl("getObject", {
        Bucket: bucketName,
        Key: objectKey,
        Expires: 3600, // URL expires in 1 hour
      });

      // Remove the signature part to get the public URL
      const publicUrl = url.split("?")[0];
      console.log(`File already exists. URL: ${publicUrl}`);
      return publicUrl;
    } catch (error) {
      // File doesn't exist, proceed with upload
      if (error.code === "NotFound") {
        const fileContent = await fs.readFile(filePath);

        const params = {
          Bucket: bucketName,
          Key: objectKey,
          Body: fileContent,
          ACL: "public-read",
        };

        const data = await s3.upload(params).promise();
        console.log(`File uploaded successfully. URL: ${data.Location}`);
        return data.Location;
      }

      // If error is not NotFound, throw it
      throw error;
    }
  } catch (error) {
    console.error("Error handling file:", error);
    throw error;
  }
};

export const downloadFromS3 = async (bucketName, objectKey, downloadPath) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: objectKey,
    };

    const data = await s3.getObject(params).promise();
    await fs.writeFile(downloadPath, data.Body);
    console.log(`File downloaded successfully to ${downloadPath}`);
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
};

export const downloadFromURL = async (url, downloadPath) => {
  try {
    return new Promise((resolve, reject) => {
      https
        .get(url, (response) => {
          // Check if response is successful
          if (response.statusCode !== 200) {
            reject(
              new Error(`Failed to download file: ${response.statusCode}`)
            );
            return;
          }

          // Create write stream
          const fileStream = fs.createWriteStream(downloadPath);

          // Pipe the response to the file
          response.pipe(fileStream);

          // Handle stream events
          fileStream.on("finish", () => {
            fileStream.close();
            console.log(`File downloaded successfully to ${downloadPath}`);
            resolve();
          });

          fileStream.on("error", (err) => {
            // Clean up the file if there was an error
            fs.unlink(downloadPath).catch(console.error);
            reject(err);
          });
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
};
