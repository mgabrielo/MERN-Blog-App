import { Sidebar } from "flowbite-react";
import {
  HiArrowSmRight,
  HiChartPie,
  HiDocumentText,
  HiOutlineChatAlt2,
  HiOutlineUserGroup,
  HiUser,
} from "react-icons/hi";
import { useTabLocation } from "../hooks/useTabLocation";
import { Link } from "react-router-dom";
import useLogOut from "../hooks/useLogOut";
import { useSelector } from "react-redux";

export default function DashboardSideBar() {
  const { tab } = useTabLocation();
  const { handleSignOut } = useLogOut();
  const { currentUser } = useSelector((state) => state.user);

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="gap-3">
          {currentUser?.isAdmin && (
            <Link to="/dashboard?tab=dashboard-metrics">
              <Sidebar.Item
                className="mt-1"
                active={tab == "dashboard-metrics"}
                label={
                  currentUser.isAdmin && tab == "dashboard-metrics" && `Admin`
                }
                labelColor="dark"
                icon={HiChartPie}
                as={"div"}
              >
                Dashboard
              </Sidebar.Item>
            </Link>
          )}
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab == "profile"}
              icon={HiUser}
              label={
                (currentUser.isAdmin && tab == "profile" && `Admin`) ||
                (!currentUser.isAdmin && tab == "profile" && "User")
              }
              labelColor="dark"
              as={"div"}
            >
              Profile
            </Sidebar.Item>
          </Link>

          {currentUser?.isAdmin && (
            <Link to="/dashboard?tab=posts">
              <Sidebar.Item
                className="mt-1"
                active={tab == "posts"}
                label={currentUser.isAdmin && tab == "posts" && `Admin`}
                labelColor="dark"
                icon={HiDocumentText}
                as={"div"}
              >
                Posts
              </Sidebar.Item>
            </Link>
          )}
          {currentUser?.isAdmin && (
            <Link to="/dashboard?tab=users">
              <Sidebar.Item
                className="mt-1"
                active={tab == "users"}
                label={currentUser.isAdmin && tab == "users" && `Admin`}
                labelColor="dark"
                icon={HiOutlineUserGroup}
                as={"div"}
              >
                Users
              </Sidebar.Item>
            </Link>
          )}
          {currentUser?.isAdmin && (
            <Link to="/dashboard?tab=comments">
              <Sidebar.Item
                className="mt-1"
                active={tab == "comments"}
                label={currentUser.isAdmin && tab == "comments" && `Admin`}
                labelColor="dark"
                icon={HiOutlineChatAlt2}
                as={"div"}
              >
                Comments
              </Sidebar.Item>
            </Link>
          )}
          <Sidebar.Item
            icon={HiArrowSmRight}
            labelColor="dark"
            as={"div"}
            onClick={() => handleSignOut()}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
