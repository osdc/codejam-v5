import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadToS3 } from "../utils/aws-utils.js";
import fs from "fs/promises";
import { Course } from "../models/courseModel.js";
import { Lecture } from "../models/lectureModel.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { pptxParser, pdfParser, docxParser } from "../utils/parsers.js";
import { storeLecture } from "../utils/pinecone.js";

export const postLecture = AsyncHandler(async (req, res) => {
  console.log("******** postLecture Function ********");
  const { batch, branch } = req.user;

  if (!req.file) {
    throw new ApiError(400, "No file uploaded");
  }

  const objectKey = req.body.course + req.file.originalname;

  const url = await uploadToS3(
    req.file.path,
    process.env.AWS_BUCKET_NAME,
    objectKey
  );

  let flag = false;

  let course = await Course.findOne({ name: req.body.course });

  if (!course) {
    console.log("Course not found, creating new course");
    course = await Course.create({
      name: req.body.course,
      branch,
      batch,
    });
  }

  let lecture = await Lecture.findOne({
    name: req.file.originalname,
    course: course._id,
  });

  if (!lecture) {
    flag = true;
    console.log("Lecture not found, creating new lecture");
    lecture = await Lecture.create({
      name: req.file.originalname,
      course: course._id,
      link: url,
      batch,
      branch,
    });
  }
  const fileExtension = req.file.originalname.split(".").pop().toLowerCase();

  if (!flag) {
    return res.status(200).json({
      message: "File uploaded successfully",
      filename: req.file.filename,
    });
  }

  let fileContent = "";
  try {
    switch (fileExtension) {
      case "pptx":
        fileContent = await pptxParser(req.file.path);
        break;
      case "pdf":
        fileContent = await pdfParser(req.file.path);
        break;
      case "docx":
        fileContent = await docxParser(req.file.path);
        break;
    }
  } catch (error) {
    throw new ApiError(500, "Error parsing file content");
  }

  if (fileContent !== "") {
    console.log("File content: ", fileContent);
    await storeLecture(fileContent, lecture._id, lecture.name);
  }

  fs.unlink(req.file.path, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        message: "Error deleting file from server",
      });
    }
  });

  return res.status(200).json({
    message: "File uploaded successfully",
    filename: req.file.filename,
  });
});

export const getLectures = AsyncHandler(async (req, res) => {
  console.log("******** getLecture Function ********");
  const { courseId, batch, branch } = req.body;

  console.log("courseId: ", courseId);

  const lectures = await Lecture.find({ course: courseId, batch, branch });

  if (!lectures) {
    throw new ApiError(404, "No lectures found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, lectures, "Lectures fetched successfully"));
});
