import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button } from "flowbite-react";
import { FaComment, FaShare, FaThumbsUp } from "react-icons/fa";
import "../index.css"
const Post = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchPostById();
  }, []);

  const fetchPostById = async () => {
    try {
      const response = await fetch(`https://widethoughts-backend.onrender.com/api/post/getpost/${id}`, {
        headers: {
          Authorization: localStorage.getItem("Token"),
        },
      });
      const data = await response.json();
      setPost(data);
    } catch (error) {
      console.error("Failed to fetch post by ID", error);
    }
  };

  const handleLike = async () => {
    try {
      const response = await fetch(`https://widethoughts-backend.onrender.com/api/post/likepost/${id}`, {
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("Token"),
        },
      });
      if (response.ok) {
        fetchPostById(); // Refresh post after liking
      }
    } catch (error) {
      console.error("Failed to like post", error);
    }
  };

  const handleShare = async () => {
    const token = localStorage.getItem("Token");
    if (!token) {
      alert("You need to sign in to share a post.");
      navigate("/signin");
      return;
    }
    const postUrl = `${window.location.origin}/post/${post._id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.content,
          url: postUrl,
        });
      } catch (error) {
        console.error("Error sharing", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(postUrl);
        alert("Post URL copied to clipboard");
      } catch (error) {
        console.error("Failed to copy", error);
      }
    }
  };

  const handleComment = async () => {
    const token = localStorage.getItem("Token");
    if (!token) {
      alert("You need to sign in to comment.");
      navigate("/signin");
      return;
    }
    try {
      const response = await fetch(`https://widethoughts-backend.onrender.com/api/post/comment/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("Token"),
        },
        body: JSON.stringify({ comment }),
      });
      if (response.ok) {
        fetchPostById(); // Refresh post after commenting
        setComment(""); // Clear comment input
      }
    } catch (error) {
      console.error("Failed to post comment", error);
    }
  };

  return (
    post && (
      <div className="flex flex-col items-center space-y-8 p-4">
        <div className="w-full max-w-2xl mb-8">
          <Card className="cardStyle">
            <div className="flex items-center mb-4">
              {post.userId && (
                <img
                  className="w-10 h-10 rounded-full"
                  src={post.userId.profilePicture}
                  alt={post.userId.username}
                />
              )}
              <div className="ml-2">
                {post.userId && (
                  <h4 className="usename text-lg font-semibold">{post.userId.username}</h4>
                )}
              </div>
            </div>
            <h3 className="titles text-center text-3xl font-semibold mb-4">{post.title}</h3>
            <img
              src={post.image}
              alt="Post"
              className="w-full h-64 object-cover mb-4 rounded"
            />
            <p className="text-lg mb-6">{post.content}</p>
            <div className="flex justify-between items-center">
              <Button color="blue" onClick={handleLike}>
                <FaThumbsUp className="inline-block mr-2" />
                {post.likes.length} Likes
              </Button>
              <Button color="green" onClick={handleShare}>
                <FaShare className="inline-block mr-2" />
                Share
              </Button>
            </div>
            <div className="mt-4 max-h-20 overflow-y-auto">
              <h3 className="text-xl font-semibold mb-2">Comments</h3>
              {post.comments.map((comment, index) => (
                <div key={index} className="mb-4 flex items-start">
                  {comment.postedBy && (
                    <img
                      className="w-8 h-8 rounded-full"
                      src={comment.postedBy.profilePicture}
                      alt={comment.postedBy.username}
                    />
                  )}
                  <div className="ml-2">
                    {comment.postedBy && (
                      <h4 className="text-md font-semibold">{comment.postedBy.username}</h4>
                    )}
                    <p className="text-md">{comment.text}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-2 border rounded mb-2"
              />
              <Button
                color="blue"
                onClick={handleComment}
              >
                <FaComment className="inline-block mr-2" />
                Comment
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  );
};

export default Post;
