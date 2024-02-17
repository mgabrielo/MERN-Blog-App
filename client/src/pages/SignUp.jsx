import axios from "axios";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData?.username || !formData?.email || !formData?.password) {
      return setErrorMessage("fill out all fields");
    }
    try {
      setLoading(true);
      await axios
        .post("/api/auth/signup", formData)
        .then((res) => {
          if (res.status == 200) {
            setErrorMessage(null);
            navigate("/signin");
          }
        })
        .catch((res) => {
          if (res?.response?.data?.success == false) {
            setErrorMessage(res?.response?.data?.message);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
      setLoading(false);
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
              <Label value="Your Username" />
              <TextInput
                type="text"
                onChange={handleChange}
                placeholder="Username"
                id="username"
              />
            </div>
            <div className="">
              <Label value="Your Email" />
              <TextInput
                type="text"
                onChange={handleChange}
                placeholder="Email"
                id="email"
              />
            </div>
            <div className="">
              <Label value="Your Password" />
              <TextInput
                type="password"
                onChange={handleChange}
                placeholder="Password"
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
                "Sign Up"
              )}
            </Button>
          </form>
          <div className="flex gap-3 my-3">
            <span>Already Have An Account ...?</span>
            <Link to={"/signin"} className=" text-blue-500 hover:underline">
              Sign In
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
