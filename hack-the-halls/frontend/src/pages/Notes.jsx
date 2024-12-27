import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PostApiCall, PutApiCall } from "../utils/apiCall";
import { UserContext } from "../context/userContext";
import { ArrowLeft } from "lucide-react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { toast } from "react-toastify";

const Notes = () => {
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [requestType, setRequestType] = useState("put");

  const { user, selectedLecture } = useContext(UserContext);

  const fetchNotes = async () => {
    try {
      const response = await PostApiCall(
        "http://localhost:8000/api/note/getNotes",
        {
          lectureID: selectedLecture._id,
          userID: user._id,
        }
      );
      setNotes(response.data);
      console.log("getNotes response", response);
      console.log(response.data.note.length);
      if (response.data.note.length === 0) {
        setRequestType("post");
      } else {
        setNotes(response.data.note[0].notes);
      }
    } catch (err) {
      console.log("getNotes error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateNotes = async () => {
    const noteContent = notes;
    if (requestType === "put") {
      try {
        setLoading(true);

        const response = await PutApiCall("http://localhost:8000/api/note", {
          notess: noteContent,
          lectureID: selectedLecture._id,
          userID: user._id,
        });

        if (response.success) {
          // Update local state with new notes
          setNotes(noteContent);
          // You might want to show a success message here
          toast.success("Notes updated successfully");
        } else {
          toast.error("Failed to update notes");
        }
      } catch (err) {
        console.error("Update notes error:", err);
        toast.error("Error updating notes");
      } finally {
        setLoading(false);
      }
    }
    if (requestType === "post") {
      try {
        setLoading(true);

        const response = await PostApiCall("http://localhost:8000/api/note", {
          notess: noteContent,
          lectureID: selectedLecture._id,
          userID: user._id,
        });

        if (response.success) {
          // Update local state with new notes
          setNotes(noteContent);
          // You might want to show a success message here
          toast.success("Notes created successfully");
        } else {
          toast.error("Failed to create notes");
        }
      } catch (err) {
        console.error("Create notes error:", err);
        toast.error("Error creating notes");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!selectedLecture) {
      navigate("/home");
    }
    fetchNotes();
  }, []);

  // const handleResponseChange = (e) => {

  // };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-white font-sans">
        <div className="w-[400px] h-[600px] bg-gradient-to-b from-[#1e1e2f] via-[#302b63] to-[#24243e] shadow-lg flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-4 p-4 bg-[#302b63] text-white border-b border-white/20">
            <ArrowLeft
              className="text-gray-300 hover:text-white cursor-pointer transition-colors"
              size={20}
              onClick={() => navigate("/home")}
            />
            <h1 className="text-lg font-semibold m-0">Your Classrooms</h1>
          </div>

          {/* Course Name */}
          <div className="w-[95%] mx-auto flex justify-center items-center py-4">
            <h3 className="text-xl m-0">Your Notes</h3>
          </div>

          <div className="pt-0 p-6 overflow-auto flex-1">
            {/* Lecture List Skeleton */}
            <div className="space-y-4">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-[#92b3b3] h-[40px] rounded-lg"
                >
                  <SkeletonTheme baseColor="#92b3b3" highlightColor="#a8c5c5">
                    <div className="flex w-full h-full justify-between items-center">
                      <div className="h-[100%] w-[100%]">
                        <Skeleton height={35} className="rounded-lg" />
                      </div>
                    </div>
                  </SkeletonTheme>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header Start */}
      <div className="p-4 bg-[#302b63] text-white relative">
        <div className="flex items-center space-x-2">
          <button onClick={() => navigate("/lecture")}>
            <i className="ri-arrow-left-line text-xl text-gray-400 cursor-pointer hover:text-yellow-400 transition ease-in-out"></i>
          </button>
          <h2 className="text-md font-semibold m-0">Notes</h2>
        </div>
        <button
          onClick={handleUpdateNotes}
          className="absolute top-2 right-4 bg-yellow-400 text-[#000000] rounded-md hover:bg-yellow-500 transition my-2 px-4 py-0"
          style={{
            fontSize: "12px",
            width: "60px",
            height: "25px",
            lineHeight: "25px",
          }}
        >
          Save
        </button>
      </div>
      {/* Header End */}
      {/* Text Editor Start */}
      <ReactQuill theme="snow" value={notes} onChange={setNotes} />
      {/* Text Editor End */}
    </div>
  );
};

export default Notes;
