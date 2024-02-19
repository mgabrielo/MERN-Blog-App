import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
} from "../redux/user/userSlice";

export default function useLogOut() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const handleSignOut = async () => {
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

  return { handleSignOut };
}
