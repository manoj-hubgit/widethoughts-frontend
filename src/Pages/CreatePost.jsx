import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const handleUploadImage= async ()=>{
    try {
        if(!file){
            setImageFileUploadError("Plaese select an image")
            return
        }
        setImageFileUploadError(null)
        const storage=getStorage(app);
        const fileName= new Date().getTime()+ '-' + file.name;
        const storageRef = ref(storage,fileName);
        const uploadTask= uploadBytesResumable(storageRef,file);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
            const progress =
            (snapshot.bytesTransferred/snapshot.totalBytes)*100;
            setImageFileUploadProgress (progress.toFixed(0));
          
            },
            (error) => {
            setImageFileUploadError("Image upload failed");
            setImageFileUploadProgress (null);
            },
            
            () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downLoadURL) => {
            setImageFileUploadProgress(null);           
            setImageFileUploadError (null);           
            setFormData({...formData, image: downLoadURL});         
            });
        }
    )
    } catch (error) {
        setImageFileUploadError("Image Failed to upload")
    setImageFileUploadProgress(null);
    }
  }
  const handleSubmit=async(e)=>{
    e.preventDefault();
    try {
        //handling paragraph tag convertig html to normal file
        const strippedContent = formData.content.replace(/<[^>]+>/g,'');
        const response= await fetch ('http://localhost:5000/api/post/createpost',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                // "token":localStorage.getItem("Token")
                Authorization: localStorage.getItem("Token"),
            },
            body:JSON.stringify({...formData,content:strippedContent})   //without stripped content it return as paragraph
        })
        const data = await response.json();
        if(!response.ok){
            setPublishError(data.message)
            return
        }
        else{
            setPublishError(null)
            navigate('/blogs')
        }
    } catch (error) {
        setPublishError('Something went wrong')
    }
  }
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">createPost</h1>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Enter the Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />

          <select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="Technology">Technology</option>
            <option value="Sports">Sports</option>
            <option value="Politics">Politics</option>
            <option value="Business">Business</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Health">Health</option>
            <option value="Science">Science</option>
            <option value="Education">Education</option>
            <option value="Lifestyle">Lifestyle</option>
          </select>
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
        {imageFileUploadError && <Alert color="failure" icon={HiInformationCircle} className="mt-5">
          <span className="font-medium me-2">🙇‍♂️ OOPS!</span>
          {imageFileUploadError}
        </Alert>}
        {formData.image && (
            <img 
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-cover"/>
        )}
        <ReactQuill theme="snow" placeholder="write Something" required className="h-72 mb-12"
        onChange={(value)=>{setFormData({...formData,content:value})
    }}/>
    <Button
              type="submit"
              gradientDuoTone="purpleToBlue"
              
            >
              Publish
            </Button>
            {publishError && (
                <Alert color="failure" icon={HiInformationCircle} className="mt-5">
                <span className="font-medium me-2">🙇‍♂️ OOPS!</span>
                {publishError}
              </Alert>
            )}
      </form>
    </div>
  );
};

export default CreatePost;
