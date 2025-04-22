import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, Outlet, Navigate, useLocation } from "react-router-dom";
import { Burger } from "../../utils/icons";
import { SideBar } from "./SideBar";
import { Card, Tooltip, IconButton } from "@material-tailwind/react";
import { BellIcon, UserIcon } from "@heroicons/react/24/solid";
import { useStateContext } from "../../contexts/NavigationContext";

export const MainLayout = () => {
  const [signOutVisible, setSignOutVisible] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const dropdownRef = useRef(null);
  const sideBardownRef = useRef(null);
  const sideBarButtondownRef = useRef(null);

  const { token, setUser, setToken, user } = useStateContext();
  const handleLogout = () => {
    setUser(null);
    setToken(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSignOutVisible(false);
      }

      if (
        sideBardownRef.current &&
        !sideBardownRef.current.contains(event.target)
      ) {
        if (
          sideBarButtondownRef.current &&
          sideBarButtondownRef.current.contains(event.target)
        ) {
          setSidebar(true);
        } else {
          setSidebar(false);
        }
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const userString = queryParams.get("user");
    const token = queryParams.get("token");
    if (userString) {
      const user = JSON.parse(userString);
      setUser(user);
      setToken(token);
    }
  }, [location.search]);

  if (!token) {
    return <Navigate to="/login" />;
  }

  const handleUserIconClick = () => {
    setSignOutVisible(!signOutVisible);
  };

  const handleSidebar = () => {
    setSidebar((pre) => !pre);
  };

  return (
    <section className="flex min-h-screen w-full">
      <div ref={sideBardownRef} className="">
        <SideBar handleSidebar={handleSidebar} sidebar={sidebar} />
      </div>

      <section className="flex w-[100%] flex-col gap-5 md:ml-[15%] md:w-[85%] min-h-screen bg-gray-200">
        <Card className="flex h-16 w-full flex-row items-center justify-between rounded-none bg-white p-3 pl-3">
          <div>
            <div ref={sideBarButtondownRef} className="flex md:hidden">
              <Tooltip content="Sidebar">
                <div onClick={handleSidebar}>
                  <IconButton variant="text" className="mx-2 bg-gray-500">
                    <Burger className="h-4 w-4 text-white" />
                  </IconButton>
                </div>
              </Tooltip>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              {/* <Tooltip content="View Notifications">
                <Link to="/notifications">
                  <IconButton variant="text" className="mx-2 bg-gray-500">
                    <BellIcon className="h-4 w-4 text-white" />
                  </IconButton>
                </Link>
              </Tooltip> */}
              <div className="relative" ref={dropdownRef}>
                <IconButton
                  variant="text"
                  className="mx-2 rounded-full bg-gray-500"
                  onClick={handleUserIconClick}
                >
                  <UserIcon className="h-4 w-4 text-white" />
                </IconButton>

                {signOutVisible && (
                  <div className="border-grey-800 absolute right-5 top-12 z-10 flex w-[150px] flex-col items-start border-[1px] bg-white p-3 shadow-md">
                    {user.Account === 1 && (
                      <Link
                        to="/account"
                        className="w-full"
                        onClick={() => setSignOutVisible(!signOutVisible)}
                      >
                        <div className="w-full cursor-pointer border-b-2 py-2 font-inter">
                          My Account
                        </div>
                      </Link>
                    )}

                    <div className="w-full" onClick={handleLogout}>
                      <div className="cursor-pointer py-2 font-inter">
                        Sign Out
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
        <div className="px-[3%]">
          <Outlet />
        </div>
      </section>
    </section>
  );
};
