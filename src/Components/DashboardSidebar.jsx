import React, { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiDocumentText, HiUser } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { signOutSuccess } from "../Redux/Slice/UserSlice";
import { useDispatch, useSelector } from "react-redux";

const DashboardSidebar = () => {
  const { currentuser } = useSelector((state) => state.user);
  const location = useLocation();
  const dispatch = useDispatch();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search); //this returns params
    const tabUrl = urlParams.get("tab"); // this returns what is in the tab in our case tab=profile
    if (tabUrl) {
      setTab(tabUrl);
    }
  }, [location.search]);
  const handleSignout = () => {
    dispatch(signOutSuccess());
    localStorage.removeItem("Token");
  };
  return (
    <Sidebar className="w-full md:w-58">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-2">
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={currentuser.rest.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
          {currentuser && (
            <Link to="/create-post">
              <Sidebar.Item
                active={tab === "posts"}
                icon={HiDocumentText}
                labelColor="dark"
                as="div"
              >
                Posts
              </Sidebar.Item>
            </Link>
          )}
          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignout}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashboardSidebar;
