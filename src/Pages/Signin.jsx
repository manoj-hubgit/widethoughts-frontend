import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { HiInformationCircle } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFailure,
  signInSuccess,
  signinStart,
} from "../Redux/Slice/UserSlice";
import OAuth from "../Components/OAuth";
import "../index.css"

const Signin = () => {
  const dispatch = useDispatch();
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const initialValues = {
    email: "",
    password: "",
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
      password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),

  });

  const handleSubmit = async (values) => {
    try {
      dispatch(signinStart());
      const response = await fetch(
        "https://widethoughts-backend.onrender.com/api/auth/login-user",
        {
          method: "POST",
          headers: {
            "content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        if (data.message === "Invalid Credentials") {
          dispatch(signInFailure(data.message));
        } else if (data.message === "User not found") {
          dispatch(signInFailure(data.message));
          navigate("/signup");
        }
        return;
      }
      localStorage.setItem("Token", data.token);
      dispatch(signInSuccess(data));
      navigate("/blogs");

      // if(data.success===false){
      //   return dispatch(signInFailure((data.message)));
      // }
      // if(response.ok){
      //
      // }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

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
            You can signin using email and password or signin with google
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
                {loading ? (
                  <>
                    <Spinner
                      color="info"
                      aria-label="Info spinner example"
                      size="sm"
                    />
                    <span className="pl-2">Loading...</span>
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
              <OAuth />
            </Form>
          </Formik>
          <div>
            <span>Don't Have An Account? </span>
            <Link to="/signup" className="text-blue-600">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
