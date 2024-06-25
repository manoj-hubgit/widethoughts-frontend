import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import About from './Pages/About';
import Blogs from './Pages/Blogs';
import Dashboard from './Pages/Dashboard';
import Signin from './Pages/Signin';
import Signup from './Pages/Signup';
import Header from './Components/Header';
import FooterComp from './Components/Footer';
import PrivateRoute from './Components/PrivateRoute';
import CreatePost from './Pages/CreatePost';
import EditPostPrivateRoute from './Components/EditPostPrivateRoute';
import EditPost from './Pages/EditPost';
import Post from './Pages/Post';
import BlogPrivateRoute from './Components/BlogsPrivateRoute';
import Home from './Pages/Home';


const App = () => {
  return (
    
    <BrowserRouter>
    <Header/>
    <Routes>
    <Route path='/' element={<Home/>} />
      <Route path='/about' element={<About/>}/>
      <Route element={<PrivateRoute/>}>
      <Route path='/dashboard' element={<Dashboard/>} />
      </Route>
      <Route element={<EditPostPrivateRoute/>}>
      <Route path='/edit-post' element={<EditPost/>} />
      </Route>
      <Route element={<BlogPrivateRoute/>}>
      <Route path='/blogs' element={<Blogs/>} />
        <Route path='/post/:id' element={<Post />} />
      </Route>
      <Route path='/signin' element={<Signin/>} />
      <Route path='/signup' element={<Signup/>} />  
      <Route path='/create-post' element={<CreatePost/>} />
    
    </Routes>
    <FooterComp />
    </BrowserRouter>
  );
};

export default App;