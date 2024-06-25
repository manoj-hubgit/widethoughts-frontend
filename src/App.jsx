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
import OnlyAdminPrivateRoute from './Components/OnlyAdminPrivateRoute';
import CreatePost from './Pages/CreatePost';
import EditPostPrivateRoute from './Components/EditPostPrivateRoute';
import EditPost from './Pages/EditPost';
import Post from './Pages/Post';


const App = () => {
  return (
    
    <BrowserRouter>
    <Header/>
    <Routes>
      <Route path='/about' element={<About/>}/>
      <Route path='/blogs' element={<Blogs/>} />
      <Route element={<PrivateRoute/>}>
      <Route path='/dashboard' element={<Dashboard/>} />
      </Route>
      <Route element={<OnlyAdminPrivateRoute/>}>
      <Route path='/create-post' element={<CreatePost/>} />
      </Route>
      <Route element={<EditPostPrivateRoute/>}>
      <Route path='/edit-post' element={<EditPost/>} />
      </Route>
      <Route path='/signin' element={<Signin/>} />
      <Route path='/signup' element={<Signup/>} />
      <Route path='/post/:id' element={<Post />} />
    </Routes>
    <FooterComp />
    </BrowserRouter>
  );
};

export default App;