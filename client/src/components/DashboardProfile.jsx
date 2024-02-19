import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { app } from "../../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import axios from "axios";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
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
import { HiExclamationCircle } from "react-icons/hi";
import useLogOut from "../hooks/useLogOut";
import { Link } from "react-router-dom";

export default function DashboardProfile() {
  const dispatch = useDispatch();
  const { currentUser, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileURL, setImageFileURL] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateMsg, setUpdateMsg] = useState(null);
  const [noChanges, setNoChanges] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { handleSignOut } = useLogOut();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      setNoChanges(true);
      setUpdateMsg("No Changes Made for Update");
      return;
    }
    if (imageFileUploadProgress !== null) {
      return;
    }
    try {
      dispatch(updateStart());
      await axios
        .put(`/api/user/update/${currentUser?._id}`, formData)
        .then((res) => {
          if (res.status == 200) {
            dispatch(updateSuccess(res.data?.user));
            setUpdateMsg("Profile Update Successful");
            setNoChanges(false);
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

  useEffect(() => {
    if (updateMsg !== null) {
      setTimeout(() => {
        setUpdateMsg(null);
      }, 2500);
    }
  }, [updateMsg]);

  const handleDelete = async (e) => {
    e.preventDefault();

    try {
      dispatch(deleteUserStart());
      await axios
        .delete(`/api/user/delete/${currentUser._id}`)
        .then((res) => {
          if (res.status === 200) {
            setShowModal(false);
            dispatch(deleteUserSuccess());
            handleSignOut();
          }
        })
        .catch((res) => {
          if (res?.response?.data?.success == false) {
            dispatch(updateFailure(res?.response?.data?.message));
          }
        });
    } catch (error) {
      dispatch(deleteUserFailure(error?.message));
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-5 text-center font-semibold text-2xl">Profile</h1>
      {updateMsg && noChanges && (
        <Alert color={"failure"} className="my-3">
          {updateMsg}
        </Alert>
      )}
      {updateMsg && !noChanges && (
        <Alert color={"success"} className="my-3">
          {updateMsg}
        </Alert>
      )}

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
          disabled={loading || imageFileUploadProgress}
        >
          {loading || imageFileUploadProgress
            ? "Update In Progess..."
            : "Update"}
        </Button>
        {currentUser?.isAdmin && (
          <Link to={"/create-post"}>
            <Button
              type="button"
              gradientDuoTone={"purpleToPink"}
              className="w-full"
            >
              Create Post
            </Button>
          </Link>
        )}
      </form>
      <div className="text-red-500 dark:text-red-400 flex justify-between mt-5">
        <span className="cursor-pointer" onClick={() => setShowModal(true)}>
          Delete Account
        </span>
        <span className="cursor-pointer" onClick={() => handleSignOut()}>
          Sign Out
        </span>
      </div>
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size={"md"}
      >
        <Modal.Header
          title="Delete Account"
          className=" text-gray-500 dark:text-gray-300"
        />
        <Modal.Body>
          <div className="text-center">
            <HiExclamationCircle className="h-14 w-14 mb-3 text-gray-500 dark:text-gray-300 mx-auto" />
            <h3 className=" text-gray-500 dark:text-gray-300 text-lg font-semibold">
              Are You Sure You want to Delete Account ?
            </h3>
            <div className="flex gap-3 my-3 justify-center">
              <Button color="failure" onClick={handleDelete}>
                Yes, I'm Sure
              </Button>
              <Button
                className="bg-gray-400"
                onClick={() => setShowModal(false)}
              >
                No, Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
