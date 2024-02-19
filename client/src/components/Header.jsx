import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import useLogOut from "../hooks/useLogOut";

export default function Header() {
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.themes);
  const { handleSignOut } = useLogOut();

  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-lg font-semibold dark:text-white"
      >
        <span className="px-2 py-1 rounded-lg text-white bg-gradient-to-tr from-indigo-600 via-purple-500 to-pink-400">
          Grey's
        </span>
        &nbsp;Blog
      </Link>
      <form>
        <TextInput
          type="text"
          placeholder="search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
        />
      </form>
      <Button className="flex lg:hidden" pill>
        <AiOutlineSearch className="w-5 h-5 " color="white" />
      </Button>

      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to="/about">About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/projects"} as={"div"}>
          <Link to="/projects">Projects</Link>
        </Navbar.Link>
        {currentUser && (
          <Navbar.Link active={path === "/dashboard"} as={"div"}>
            <Link to="/dashboard?tab=profile">Dashboard</Link>
          </Navbar.Link>
        )}
      </Navbar.Collapse>

      <div className="flex gap-2">
        <Button
          className="w-12 h-10 hidden sm:inline order-2"
          color="gray"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme == "light" ? <FaSun /> : <FaMoon />}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="user" img={currentUser?.profilePicture} rounded />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser?.username}</span>
              <span className="block text-sm font-medium truncate">
                {currentUser?.email}
              </span>
            </Dropdown.Header>

            <Link to={"/dashboard?tab=profile"}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item as={"div"} onClick={() => handleSignOut()}>
              Sign Out
            </Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/signin">
            <Button gradientDuoTone={"purpleToBlue"} outline>
              Sign-In
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>
    </Navbar>
  );
}
