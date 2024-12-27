import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Tag } from "../models/tagModel.js";

export const getAllTags = AsyncHandler(async (req, res) => {
    console.log("******** getAllTags Function ********");
    const { userID, courseID } = req.body;

    
    console.log("userId: ", userID);

    const tag = await Tag.find({ courseId: courseID, userId: userID });
    console.log("getTag tag: ", tag);

    const groupedByLecture = tag.reduce((acc, current) => {
        const lectureId = current.lectureId.toString(); // Ensure it's a string for consistency
        const tag = current.Tag; // Extract the Tag array
        const existingLecture = acc.find(item => item.lectureId === lectureId);
      
        if (existingLecture) {
          existingLecture.tags = [...existingLecture.tags, ...tag]; // Merge tags
        } else {
          acc.push({ lectureId, tags: [...tag] }); // Add a new object
        }
        return acc;
      }, []);
      
      console.log("grouped by lecture tags:", groupedByLecture);
    
    if (!tag) {
        throw new ApiError(404, "All tags not found"); 
    };
    
    
    return res.status(200).json(
        new ApiResponse(
        200,
        {
            groupedByLecture,
        },
        "All tags fetched successfully"
        )
    );
});

export const postTag = AsyncHandler(async (req, res) => {
    console.log("******** getTag Function ********");
    const { TAGS, lectureID, courseID, userID  } = req.body;
    console.log("TAGS: ", TAGS);
    console.log("lectureId: ", lectureID);
    console.log("courseId: ", courseID);
    console.log("userId: ", userID);

    const tagsExist = await Tag.find({ lectureId: lectureID, courseId: courseID, userId: userID });
    console.log("tagsExist: ", tagsExist);
        if (tagsExist.length > 0) {
            const tags = await Tag.findOneAndUpdate({ lectureId: lectureID, courseId: courseID, userId: userID }, { Tag: TAGS });

            console.log("tags updated: ", tags);
    
            if (!tags) {
                throw new ApiError(404, "tags not updated");  
            }
            return res.status(200).json(
                new ApiResponse(
                200,
                {
                    tags,
                },
                "tags updated successfully"
                )
            );
        }

    const tags = await Tag.create({ tags: TAGS, lectureId: lectureID, courseId: courseID, userId: userID });
    console.log("tags created: ", tags);

    if (!tags) {
        throw new ApiError(404, "Tags not created");  //change this error code??
    }

    return res.status(200).json(
        new ApiResponse(
        200,
        {
            tags,
        },
        "Tag created successfully"
        )
    );
});

export const updateTag = AsyncHandler(async (req, res) => {
    console.log("******** updateTag Function ********");
    const { TAGS, lectureID, courseID, userID  } = req.body;

    const tags = await Tag.findOneAndUpdate({ lectureId: lectureID, courseId: courseID, userId: userID }, { TAGS });
    

    if (!tags) {
        throw new ApiError(404, "Tags not updated");  //change this error code??
    }

    return res.status(200).json(
        new ApiResponse(
        200,
        {
            tags,
        },
        "Tag updated successfully"
        )
    );
});

