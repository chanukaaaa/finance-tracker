/* eslint-disable no-unused-vars */
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useStateContext } from "../../contexts/NavigationContext";
import NavBar from "./NavBar";

export const GuestLayout = () => {
  const { token } = useStateContext();

  if (token) {
    return <Navigate to="/" />;
  }

  return (
    <section className="bg-white ">
      <NavBar/>
      <div className='flex min-h-screen w-full items-center justify-center'>
      <Outlet />
      </div>
     
    </section>
  );
};
