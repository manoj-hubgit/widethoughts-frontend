import {
  Avatar,
  Button,
  Dropdown,
  DropdownDivider,
  Navbar,
  TextInput,
} from "flowbite-react";
import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toggleTheme } from "../Redux/Slice/ThemeSlice";
import { signOutSuccess } from "../Redux/Slice/UserSlice";
import "../index.css";

const Header = () => {
  const path = useLocation().pathname;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentuser } = useSelector((state) => state.user); //the user will be in current user
  const { theme } = useSelector((state) => state.theme);

  const handleSignout = () => {
    dispatch(signOutSuccess());
    localStorage.removeItem("Token");
    navigate("/signin");
  };
  return (
    <Navbar className="border-b-2 dark:bg-black">
      <Link
        to="/"
        className="pageNameColor self-center bg-gradient-to-r whitespace-nowrap text-lg sm:text-2xl md:text-3xl font-bold dark:text-white"
      >
        <span className="caps">W</span>
        <span className="pageName">ide</span>
        <span className="caps">T</span>
        <span className="pageName">houghts</span> {/* Application Name */}
      </Link>
      {/* <form action="">
        <TextInput
          type="text"
          placeholder="Search Blogs..." // This is a search box
          rightIcon={AiOutlineSearch} //used react icons for icon
          className="hidden lg:inline"
        />
      </form> */}
      <Button
        className="w-13 h-9 lg:hidden"
        gradientDuoTone="purpleToBlue"
        outline
      >
        <AiOutlineSearch />
      </Button>
      <div className="flex gap-2 md:order-2">
        {/* dark mode light mode */}
        <Button
          className="hidden sm:inline"
          gradientDuoTone="purpleToBlue"
          outline
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </Button>
        {/* navigation buttons */}
        {currentuser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar alt="user" img={currentuser.profilePicture} rounded />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">{currentuser.username}</span>
            </Dropdown.Header>
            <Link to="/dashboard?tab=profile">
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <DropdownDivider />
            <Dropdown.Item onClick={handleSignout}>Sign Out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Button gradientDuoTone="purpleToBlue" outline>
            <Link to="/signin">Signin</Link>
          </Button>
        )}

        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === "/blogs"} as={"div"}>
          <Link to="/blogs">Blogs</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to="/about">About</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
