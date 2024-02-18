import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiUser } from "react-icons/hi";
import { useTabLocation } from "../hooks/useTabLocation";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function DashboardSideBar() {
  const { tab } = useTabLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const handleSignOut = async (e) => {
    e.preventDefault();
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
  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab == "profile"}
              icon={HiUser}
              label={"User"}
              labelColor="dark"
              as={"div"}
            >
              Profile
            </Sidebar.Item>
          </Link>
          <Sidebar.Item
            icon={HiArrowSmRight}
            labelColor="dark"
            as={"div"}
            onClick={handleSignOut}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
