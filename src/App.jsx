import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import About from './Pages/About';
import Blogs from './Pages/Blogs';
import Dashboard from './Pages/Dashboard';
import Signin from './Pages/Signin';
import Signup from './Pages/Signup';
import Header from './Components/Header';
import FooterComp from './Components/Footer';
import PrivateRoute from './Components/PrivateRoute';


const App = () => {
  return (
    
    <BrowserRouter>
    <Header/>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/about' element={<About/>}/>
      <Route path='/blogs' element={<Blogs/>} />
      <Route element={<PrivateRoute/>}>
      <Route path='/dashboard' element={<Dashboard/>} />
      </Route>
      
      <Route path='/signin' element={<Signin/>} />
      <Route path='/signup' element={<Signup/>} />
    </Routes>
    <FooterComp />
    </BrowserRouter>
  );
};

export default App;