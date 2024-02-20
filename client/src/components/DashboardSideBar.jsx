import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiDocumentText, HiUser } from "react-icons/hi";
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
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab == "profile"}
              icon={HiUser}
              label={currentUser.isAdmin ? `Admin` : `User`}
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
                icon={HiDocumentText}
                as={"div"}
              >
                Posts
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
