import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { HiInformationCircle } from "react-icons/hi";
import OAuth from "../Components/OAuth";
import "../index.css"
const Signup = () => {
   const [loading,setLoading]=useState(false)
   const [errorMessage,setErrorMessage]=useState(null)
   const navigate=useNavigate()
   const initialValues = {
    username: "",
    email: "",
    password: "",
  };
  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .matches(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain alphanumeric characters and underscores"
      )
      .min(3, "Name must Atleast have 3 characters")
      .max(36, "Name must not exceed 36 characters")
      .required("Username is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      // .matches(
      //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      //   "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      // )

      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

const handleSubmit=async (values)=>{
  try {
    setLoading(true)
    setErrorMessage(null)
    const response=await fetch('https://widethoughts-backend.onrender.com/api/auth/register-user',{
      method:'POST',
      headers:{
        'content-Type':'application/json'
      },
    body:JSON.stringify(values)
  })
  const data=await response.json();
  if(data.success===false){
    return setErrorMessage(data.message);
  }
  if(response.ok){
    navigate('/signin')
  }
  } catch (error) {
      setErrorMessage(error.message)
      setLoading(false)
  }
}

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        <div className="flex-1">
        <div className="pageNameColor font-bold dark:text-white text-4xl">
            <span className="caps">W</span>
            <span className="pageName">ide</span>
            <span className="caps">T</span>
            <span className="pageName">houghts</span>
          </div>
          <p className="text-sm mt-6">
            You can signup using email and password or signin with google
            <br /> **This is a demo project**
          </p>
        </div>
        <div className="flex-1">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
          
              <Form className="flex flex-col gap-4">
                <div>
                  <Label htmlFor="username" value="Username" />
                  <Field
                    as={TextInput}
                    type="text"
                    name="username"
                    placeholder="Enter your User Name"
                    id="username"
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="email" value="Email" />
                  <Field
                    as={TextInput}
                    type="email"
                    name="email"
                    placeholder="Enter your Email"
                    id="email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="password" value="Password" />
                  <Field
                    as={TextInput}
                    type="password"
                    name="password"
                    placeholder="Enter your Password"
                    id="password"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <Button
                  gradientDuoTone="purpleToBlue"
                  type="submit"
                  disabled={loading}
                >
                  {loading ?
                  <>
                  <Spinner color="info" aria-label="Info spinner example" size='sm' /><span className="pl-2">Loading...</span>
                  </> :"Sign Up"}
                </Button>
                <OAuth/>
              </Form>
        
          </Formik>
          <div>
            <span>Already Have An Account? </span>
            <Link to="/signin" className="text-blue-600">
              Sign In
            </Link>
          </div>
          {/* {errorMessage &&(
             <Alert color="failure" icon={HiInformationCircle}>
             <span className="font-medium">Info alert!</span>{errorMessage}
           </Alert>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default Signup;
