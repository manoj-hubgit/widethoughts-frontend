import { Button } from 'flowbite-react';
import React from 'react';
import { AiFillGoogleSquare } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { app } from '../firebase';
import { signInFailure, signInSuccess } from '../Redux/Slice/UserSlice';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';

const OAuth = () => {
const auth=getAuth(app)
const dispatch=useDispatch()
const navigate=useNavigate()
const handleSubmit= async()=>{
    const provider=new GoogleAuthProvider();
    provider.setCustomParameters({prompt:'select_account'})
    try {
        const result=await signInWithPopup(auth,provider)
        const res=await fetch("https://widethoughts-backend.onrender.com/api/auth/google",{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                name:result.user.displayName,
                email:result.user.email,
                profilePic:result.user.photoURL
            })
        })
    const data=await res.json();
    if(res.ok){
        localStorage.setItem("Token",data.token)
        dispatch(signInSuccess(data))
        navigate('blogs')
    }
    } catch (error) {
        dispatch(signInFailure(error.message))
    }
}

    return (
        <div>
           <Button type='submit' gradientDuoTone="purpleToBlue" onClick={handleSubmit}>
            <AiFillGoogleSquare className='w-6 h-6 mr-2' />
            Continue With Google
           </Button>
        </div>
    );
};

export default OAuth;