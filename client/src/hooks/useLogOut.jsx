import { useDispatch, useSelector } from "react-redux";
import {
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
} from "../redux/user/userSlice";
import axios from "axios";

export const handleSignOut = async () => {
  try {
    dispatch(signOutUserStart());
    await axios.post(`/api/user/signout/${currentUser._id}`).then((res) => {
      if (res.status === 200) {
        dispatch(signOutUserSuccess());
        navigate("/signin");
      }
    });
  } catch (error) {
    dispatch(signOutUserFailure());
  }
};
