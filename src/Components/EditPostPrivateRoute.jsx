import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';



const EditPostPrivateRoute = () => {
const {currentuser} = useSelector((state)=>state.user);
const canEditPosts = currentuser && currentuser.rest.isAdmin;  
return canEditPosts? <Outlet/> : <Navigate to='/signin' />
};

export default EditPostPrivateRoute;