import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import useLogOut from "../hooks/useLogOut";
import { useEffect, useState } from "react";

export default function Header() {
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.themes);
  const { handleSignOut } = useLogOut();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
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
      <form onSubmit={handleSearch}>
        <TextInput
          type="text"
          placeholder="search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <Button type="submit" className="flex lg:hidden" pill>
        <AiOutlineSearch className="w-5 h-5 " color="white" />
      </Button>

      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to="/about">About</Link>
        </Navbar.Link>
        {currentUser && (
          <Navbar.Link active={path === "/dashboard"} as={"div"}>
            <Link to="/dashboard?tab=profile">Dashboard</Link>
          </Navbar.Link>
        )}
      </Navbar.Collapse>

      <div className="flex gap-2 space-y-2 md:space-y-0">
        <Button
          className="w-12 h-10 hidden sm:inline order-2 mt-2 md:mt-0 "
          color="gray"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme == "light" ? <FaSun /> : <FaMoon />}
        </Button>
        {currentUser ? (
          <div className="w-full hidden md:flex items-center gap-2">
            <Link to="/dashboard?tab=profile">
              <p>{currentUser.username}</p>
            </Link>
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
          </div>
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
