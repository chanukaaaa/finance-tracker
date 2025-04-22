import React from "react";
import logo from '../../assets/images/logo.jpg';
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <div className="flex justify-between w-full h-[80px] bg-black text-white px-10">
      <div className="flex gap-5 items-center justify-center ">
        <img  src={logo} className='w-[130px]'/>
      </div>
      <div className="flex gap-10 items-center justify-center ">
        <div><Link to='/login'>Login</Link></div>
        <div><Link to='/signup'>Register</Link></div>
      </div>
    </div>
  );
};

export default NavBar;
