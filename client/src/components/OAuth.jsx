import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../../firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = getAuth(app);
  async function handleClick(e) {
    e.preventDefault();
    const provider = new GoogleAuthProvider();
    provider.getCustomParameters({ prompt: "select_account" });
    try {
      const res = await signInWithPopup(auth, provider);
      if (res.user) {
        dispatch(signInStart());
        await axios
          .post("/api/auth/google", {
            name: res.user.displayName,
            email: res.user.email,
            googlePhotoURL: res.user.photoURL,
          })
          .then((res) => {
            if (res.status === 200 && res.data) {
              dispatch(signInSuccess(res?.data?.user));
              navigate("/");
            }
          })
          .catch((error) => {
            dispatch(signInFailure(error?.message));
          });
      }
    } catch (error) {
      dispatch(signInFailure(error?.message));
    }
  }
  return (
    <Button
      type="button"
      gradientDuoTone={"pinkToOrange"}
      outline
      onClick={handleClick}
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      Continue with Google
    </Button>
  );
}
