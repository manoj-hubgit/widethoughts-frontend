import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useLocation, useNavigate } from "react-router-dom";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { HiInformationCircle } from "react-icons/hi";

const EditPost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const postId = new URLSearchParams(location.search).get("id");
  const [file, setFile] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "Uncategorized",
    content: "",
    image: "",
  });
  const [editError, setEditError] = useState(null);

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const fetchPost = async () => {
    try {
      const response = await fetch(
        `https://widethoughts-backend.onrender.com/api/post/getpost/${postId}`,
        {
          headers: {
            Authorization: localStorage.getItem("Token"),
          },
        }
      );
      if (!response.ok) {
        console.log("Failed to fetch post");
        return;
      }
      const postData = await response.json();
      setFormData({
        title: postData.title,
        category: postData.category,
        content: postData.content,
        image: postData.image,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleUploadImage = async () => {
    if (!file) return; // Return if no file is selected

    try {
      setImageFileUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageFileUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageFileUploadError("Image upload failed");
          setImageFileUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageFileUploadProgress(null);
            setImageFileUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageFileUploadError("Image failed to upload");
      setImageFileUploadProgress(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      await handleUploadImage(); // Upload the image first if there is a new file
    }

    try {
      const response = await fetch(`http://localhost:5000/api/post/updatepost/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("Token"),
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        setEditError(data.message);
        return;
      }
      navigate(`/create-post?id=${postId}`);
    } catch (error) {
      setEditError("Something went wrong");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Edit Post</h1>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Enter the Title"
            id="title"
            className="flex-1"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />

          <Select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="Uncategorized">Uncategorized</option>
            <option value="Technology">Technology</option>
            <option value="Sports">Sports</option>
            <option value="Politics">Politics</option>
            <option value="Business">Business</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Health">Health</option>
            <option value="Science">Science</option>
            <option value="Education">Education</option>
            <option value="Lifestyle">Lifestyle</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            onClick={handleUploadImage}
            disabled={imageFileUploadProgress}
          >
            {imageFileUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageFileUploadProgress}
                  text={`${imageFileUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {imageFileUploadError && (
          <Alert color="failure" icon={HiInformationCircle} className="mt-5">
            <span className="font-medium me-2">🙇‍♂️ OOPS!</span>
            {imageFileUploadError}
          </Alert>
        )}
        {formData.image && !file && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
          theme="snow"
          placeholder="Write Something"
          required
          className="h-72 mb-12"
          value={formData.content}
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button type="submit" gradientDuoTone="purpleToBlue">
          Update Post
        </Button>
        {editError && (
          <Alert color="failure" icon={HiInformationCircle} className="mt-5">
            <span className="font-medium me-2">🙇‍♂️ OOPS!</span>
            {editError}
          </Alert>
        )}
      </form>
    </div>
  );
};

export default EditPost;
