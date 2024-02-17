import axios from "axios";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, errorMessage } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData?.email || !formData?.password) {
      dispatch(signInFailure("fill out all fields"));
    }
    try {
      dispatch(signInStart());
      await axios
        .post("/api/auth/signin", formData)
        .then((res) => {
          if (res.status == 200) {
            dispatch(signInSuccess(res.data?.user));
            navigate("/");
          }
        })
        .catch((res) => {
          if (res?.response?.data?.success == false) {
            dispatch(signInFailure(res?.response?.data?.message));
          }
        });
    } catch (error) {
      dispatch(signInFailure(error?.message));
    }
  };
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-4xl mx-auto gap-5 flex-col md:flex-row md:items-center">
        <div className="flex-1">
          <Link
            to="/"
            className="text-sm sm:text-4xl font-bold dark:text-white"
          >
            <span className="px-2 py-1 rounded-lg text-white bg-gradient-to-tr from-indigo-600 via-purple-500 to-pink-400">
              Grey's
            </span>
            &nbsp;Blog
          </Link>
          <p className="mt-4 text-sm">
            This Demo Project for React Development and Research to Drive
            Innovation
          </p>
        </div>
        <div className="flex-1">
          <form className="flex flex-col gap-3 w-full">
            <div className="">
              <Label value="Your Email" />
              <TextInput
                type="text"
                onChange={handleChange}
                placeholder="Your Email"
                id="email"
              />
            </div>
            <div className="">
              <Label value="Your Password" />
              <TextInput
                type="password"
                onChange={handleChange}
                placeholder="*********"
                id="password"
              />
            </div>
            <Button
              type="button"
              gradientDuoTone={"purpleToPink"}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size={"sm"} />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-3 my-3">
            <span>Don't Have An Account ...?</span>
            <Link to={"/signup"} className=" text-blue-500 hover:underline">
              Sign Up
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color={"failure"}>
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
