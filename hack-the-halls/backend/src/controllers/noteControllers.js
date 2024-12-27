import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Note } from "../models/noteModel.js";

export const getNote = AsyncHandler(async (req, res) => {
    console.log("******** getnote Function ********");
    const { lectureID, userID } = req.body;

    console.log("lectureId: ", lectureID);
    console.log("userId: ", userID);

    const note = await Note.find({ lectureId: lectureID, userId: userID });
    console.log("note: ", note);
    
    if (!note) {
        throw new ApiError(404, "note not found"); 
    };
    
    
    return res.status(200).json(
        new ApiResponse(
        200,
        {
            note,
        },
        "note fetched successfully"
        )
    );
});

export const postNote = AsyncHandler(async (req, res) => {
    console.log("******** postnote Function ********");
    const { notess, lectureID, userID } = req.body;
    
    console.log("notes: ", notess);
    console.log("lectureId: ", lectureID);
    console.log("userId: ", userID);

    const note = await Note.find({ lectureId: lectureID, userId: userID });
    if (note.length > 0) {
        throw new ApiError(400, "Note already exists");
    }

    const newNote = new Note({
        notes: notess,
        lectureId: lectureID,
        userId: userID,
    });

    await newNote.save();

    console.log("note: ", newNote);
    if (!newNote) {
        console.log("note not found");
        throw new ApiError(404, "note not created");  //change this error code??
    }

    return res.status(200).json(
        new ApiResponse(
        200,
        {
            newNote,
        },
        "notes created successfully"
        )
    );
});

export const updateNote = AsyncHandler(async (req, res) => {
    console.log("******** updatenote Function ********");
    const { notess, lectureID, userID } = req.body;

    console.log("notes: ", notess);
    console.log("lectureId: ", lectureID);
    console.log("userId: ", userID);
   
        
    const note = await Note.findOneAndUpdate({ lectureId: lectureID, userId: userID }, { notes: notess });

    console.log("note: ", note);
    
    if (!note) {
        throw new ApiError(404, "note not updated");  //change this error code??
    }
    return res.status(200).json(
        new ApiResponse(
        200,
        {
            note,
        },
        "note updated successfully"
        )
    );
      
    


});


// export const deleteNote = AsyncHandler(async (req, res) => {
//     console.log("******** deletenote Function ********");
//     const user = req.user;
//     const { lectureId } = req.body;

//     const note = await note.findOneAndDelete({ userId: user._id, lectureId });
    
    
//     if (!note) {
//         throw new ApiError(404, "note not found");  //change this error code??
//     }

//     return res.status(200).json(
//         new ApiResponse(
//         200,
//         {
//             note,
//         },
//         "note deleted successfully"
//         )
//     );
// });