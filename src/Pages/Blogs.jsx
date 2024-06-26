
import React, { useEffect, useState } from "react";
import { Button, Card } from "flowbite-react";
import { FaComment, FaShare, FaThumbsUp } from "react-icons/fa";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [comments, setComments] = useState({});
  const [likedPost, setLikedPosts] = useState([]);
  const [expandPost,setExpandPost] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetch("https://widethoughts-backend.onrender.com/api/post/getposts");
    const data = await response.json();
    setBlogs(data);
    setLikedPosts(
      data.filter((post) =>
        (post.likes || []).includes(localStorage.getItem("userId"))
      )
    );
  };

  const handleLike = async (postId) => {
    try {
      const response = await fetch(
        `https://widethoughts-backend.onrender.com/api/post/likepost/${postId}`,
        {
          method: "POST",
          headers: {
            Authorization: localStorage.getItem("Token"),
          },
        }
      );
      if (response.ok) {
        fetchData(); // Refresh posts after liking
      }
    } catch (error) {
      console.log("Failed to like post", error);
    }
  };

  const handleShare = async (post) => {
    const postUrl = `${window.location.origin}/post/${post._id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.content,
          url: postUrl,
        });
      } catch (error) {
        console.log("Error sharing", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(postUrl);
        alert("Post URL copied to clipboard");
      } catch (error) {
        console.log("Failed to copy", error);
      }
    }
  };

  const handleComment = async (postId, comment) => {
    try {
      const response = await fetch(
        `https://widethoughts-backend.onrender.com/api/post/comment/${postId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Token"),
          },
          body: JSON.stringify({ comment }),
        }
      );
      if (response.ok) {
        fetchData(); // Refresh posts after commenting
        setComments({ ...comments, [postId]: "" }); // Clear comment input
      }
    } catch (error) {
      console.log("Failed to post comment:", error);
    }
  };

  const handleCommentChange = (postId, value) => {
    setComments((prevComments) => ({
      ...prevComments,
      [postId]: value,
    }));
  };
  const toggleExpand = (postId) => {
    setExpandPost((prevExpandedPosts) => ({
      ...prevExpandedPosts,
      [postId]: !prevExpandedPosts[postId],
    }));
  };
  
  return (
    <div className="flex flex-col items-center space-y-8 p-4">
      {blogs.map((ele, index) => (
        <div key={index} className="w-full max-w-2xl mb-8">
          <Card>
            <div className="flex items-center mb-4">
              {ele.userId && (
                <img
                  className="w-10 h-10 rounded-full"
                  src={ele.userId.profilePicture}
                  alt={ele.userId.username}
                />
              )}
              <div className="ml-2">
                {ele.userId && (
                  <h4 className="text-lg font-semibold">{ele.userId.username}</h4>
                )}
              </div>
            </div>
            <h3 className="text-center text-3xl font-semibold mb-4">{ele.title}</h3>
            <img
              src={ele.image}
              alt="Post"
              className="w-full h-64 object-cover mb-4 rounded"
            />
            <p className="text-lg mb-6">
              {expandPost[ele._id] ? ele.content :`${ele.content.substring(0,350)}...` }
                <button 
                className="text-blue-500 ml-2"
                onClick={()=>toggleExpand(ele._id)}
                >
                  {expandPost[ele._id] ? "Show Less" : "Show More"}
                </button>
              </p>

            <div className="flex justify-between items-center">
              <Button color="blue" onClick={() => handleLike(ele._id)}>
                <FaThumbsUp className="inline-block mr-2" />
                {ele.likes ? ele.likes.length : 0} Likes
              </Button>
              <Button color="green" onClick={() => handleShare(ele)}>
                <FaShare className="inline-block mr-2" />
                Share
              </Button>
            </div>
            <div className="mt-4 max-h-20 overflow-y-auto">
              <h3 className="text-xl font-semibold mb-2">Comments</h3>
              {ele.comments.map((comment, index) => (
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
                value={comments[ele._id] || ""}
                onChange={(e) => handleCommentChange(ele._id, e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-2 border rounded mb-2"
              />
              <Button
                color="blue"
                onClick={() => handleComment(ele._id, comments[ele._id])}
              >
                <FaComment className="inline-block mr-2" />
                Comment
              </Button>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default Blogs;
