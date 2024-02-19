import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiUser } from "react-icons/hi";
import { useTabLocation } from "../hooks/useTabLocation";
import { Link } from "react-router-dom";
import useLogOut from "../hooks/useLogOut";

export default function DashboardSideBar() {
  const { tab } = useTabLocation();
  const { handleSignOut } = useLogOut();

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
            onClick={() => handleSignOut()}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
