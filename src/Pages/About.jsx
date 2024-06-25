import React from "react";
import "flowbite";
import "../index.css";
const About = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-center text-gradient">
        About <div className="pageNameColor"><span className="caps">W</span>
        <span className="pageName">ide</span>
        <span className="caps">T</span>
        <span className="pageName">houghts</span></div>
      </h1>
      <p className="mt-4 text-lg text-center text-gradient max-w-2xl">
        Welcome to our blog! Here, you can discover a variety of articles,
        tutorials, and stories. Our platform allows you to engage with content
        through features such as commenting, sharing, posting, editing, and
        deleting posts. Join our community and start exploring today!
      </p>
      <img
        src="https://img.freepik.com/free-vector/online-document-concept-illustration_114360-5453.jpg?size=626&ext=jpg&ga=GA1.1.1412446893.1719187200&semt=sph"
        alt="Blog illustration"
        className="mt-6 rounded-lg shadow-md"
      />
      <div className="mt-6 text-left max-w-2xl">
        <h2 className="text-2xl font-semibold text-gray-800">Features</h2>
        <ul className="mt-4 text-lg text-gray-600 list-disc list-inside">
          <li>
            <strong>Commenting:</strong> Engage with posts by leaving comments.
          </li>
          <li>
            <strong>Sharing:</strong> Share your favorite posts with your
            friends on social media.
          </li>
          <li>
            <strong>Posting:</strong> Create and publish your own articles and
            stories.
          </li>
          <li>
            <strong>Editing:</strong> Edit your posts to keep them up to date.
          </li>
          <li>
            <strong>Deleting:</strong> Remove posts that are no longer relevant.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default About;
