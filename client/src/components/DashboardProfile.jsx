import { Alert, Button, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { app } from "../../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import axios from "axios";
import {
  updateFailure,
  updateStart,
  updateSuccess,
} from "../redux/user/userSlice";
import "react-circular-progressbar/dist/styles.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

export default function DashboardProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileURL, setImageFileURL] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});

  const filePickRef = useRef();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileURL(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      const uploadImage = async () => {
        setImageFileUploadError(null);
        const storage = getStorage(app);
        const filename = new Date().getTime() + imageFile?.name;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setImageFileUploadProgress(progress.toFixed(0));
          },
          (error) => {
            setImageFileUploadProgress(null);
            setImageFileURL(null);
            setImageFileUploadError(
              "Could Not Upload , file size must be less than 2mb"
            );
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
              setImageFileURL(downloadUrl);
              setFormData({ ...formData, profilePicture: downloadUrl });
              setImageFileUploadProgress(null);
            });
          }
        );
      };
      uploadImage();
    }
  }, [imageFile]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      return;
    }
    try {
      dispatch(updateStart());
      await axios
        .put(`/api/user/update/${currentUser?._id}`, formData)
        .then((res) => {
          if (res.status == 200) {
            dispatch(updateSuccess(res.data?.user));
          }
        })
        .catch((res) => {
          if (res?.response?.data?.success == false) {
            dispatch(updateFailure(res?.response?.data?.message));
          }
        });
    } catch (error) {
      dispatch(updateFailure(error?.message));
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-5 text-center font-semibold text-2xl">Profile</h1>
      <form className="flex flex-col gap-4 w-full">
        <input
          className="hidden"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickRef}
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md rounded-full"
          onClick={() => filePickRef.current.click()}
        >
          <img
            src={imageFileURL ? imageFileURL : currentUser.profilePicture}
            alt="user-avatar"
            className="relative rounded-full w-full h-full border-8 border-gray-200 object-cover"
          />
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(0, 230, 64, ${imageFileUploadProgress / 100})`,
                },
              }}
            />
          )}
        </div>
        {imageFileUploadProgress && (
          <p className="text-green-400 dark:text-white text-center">{`${imageFileUploadProgress}%`}</p>
        )}
        {imageFileUploadError && (
          <Alert color={"failure"}>{imageFileUploadError}</Alert>
        )}
        <TextInput
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={currentUser?.username}
          onChange={handleChange}
        />
        <TextInput
          type="text"
          id="email"
          placeholder="email"
          defaultValue={currentUser?.email}
          onChange={handleChange}
        />
        <TextInput
          type="text"
          id="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <Button
          type="button"
          gradientDuoTone={"purpleToBlue"}
          outline
          onClick={handleSubmit}
        >
          Update
        </Button>
      </form>
      <div className="text-red-500 dark:text-red-400 flex justify-between mt-5">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}
