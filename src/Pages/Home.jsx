import React from 'react';
import 'flowbite';

import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-center text-gradient"><div className="pageNameColor"><span className="caps">W</span>
        <span className="pageName">ide</span>
        <span className="caps">T</span>
        <span className="pageName">houghts</span></div></h1>
            <p className="mt-4 text-lg text-center text-gradient">
                Discover articles, tutorials, and stories on a wide range of topics.
                Join our community and stay updated with the latest posts.
            </p>
            <div className="mt-6 text-center">
                <Link to='/blogs' className="inline-block px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" >
                Get Started
                </Link>
                
            </div>
        </div>
    );
};

export default Home;

