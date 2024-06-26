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

const CreatePost = () => {
  const [file, setFile] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const postId = new URLSearchParams(location.search).get("id");
  const isEditing = !!postId;

  // Fetch the specific post to edit if in edit mode
  useEffect(() => {
    if (isEditing) {
      fetchPost();
    }
  }, [isEditing]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`https://widethoughts-backend.onrender.com/api/post/getpost/${postId}`, {
        headers: {
          Authorization: localStorage.getItem("Token"),
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch post");
      }
      const data = await response.json();
      setFormData(data);
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  // Fetch all posts
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("https://widethoughts-backend.onrender.com/api/post/userposts", {
        headers: {
          Authorization: localStorage.getItem("Token"),
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await response.json();
      setPosts(data.posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageFileUploadError("Please select an image");
        return;
      }
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
    try {
      const strippedContent = formData.content.replace(/<[^>]+>/g, "");
      let response;
      if (isEditing) {
        // If editing, update the post
        response = await fetch(
          `https://widethoughts-backend.onrender.com/api/post/updatepost/${postId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("Token"),
            },
            body: JSON.stringify({ ...formData, content: strippedContent }),
          }
        );
      } else {
        // If creating a new post
        response = await fetch(
          "https://widethoughts-backend.onrender.com/api/post/createpost",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("Token"),
            },
            body: JSON.stringify({ ...formData, content: strippedContent }),
          }
        );
      }
      const data = await response.json();
      if (!response.ok) {
        setPublishError(data.message);
        return;
      } else {
        setPublishError(null);
        navigate("/blogs");
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `https://widethoughts-backend.onrender.com/api/post/deletepost/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: localStorage.getItem("Token"),
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete post");
      }
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">{isEditing ? "Edit Post" : "Create Post"}</h1>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Enter the Title"
            required
            id="title"
            value={formData.title || ""}
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />

          <Select
            value={formData.category || ""}
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
        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
          theme="snow"
          value={formData.content || ""}
          placeholder="Write Something"
          required
          className="h-72 mb-12"
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button type="submit" gradientDuoTone="purpleToBlue">
          {isEditing ? "Update" : "Publish"}
        </Button>
        {publishError && (
          <Alert color="failure" icon={HiInformationCircle} className="mt-5">
            <span className="font-medium me-2">🙇‍♂️ OOPS!</span>
            {publishError}
          </Alert>
        )}
      </form>

      {/* This will show the posts of the person */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">All Posts</h2>
        {posts.map((post) => (
          <div key={post._id} className="border p-4 mb-4">
            <h3 className="text-xl font-medium">{post.title}</h3>
            <p className="text-gray-600 mb-2">Category: {post.category}</p>
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-48 object-cover mb-2"
            />
            <div
              dangerouslySetInnerHTML={{ __html: post.content }}
              className="mb-2"
            />
            <div className="flex gap-2">
              <Button
                onClick={() => navigate(`/edit-post?id=${post._id}`)}
                gradientDuoTone="greenToBlue"
              >
                Edit
              </Button>
              <Button
                onClick={() => handleDelete(post._id)}
                gradientDuoTone="redToOrange"
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreatePost;
