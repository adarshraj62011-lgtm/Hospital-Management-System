import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { toast } from "react-toastify";
import { Context } from "../context.jsx";
import { api } from "../lib/api";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, setIsAuthenticated, user, setUser } =
    useContext(Context);

  const handleLogout = async () => {
    await api
      .get("/user/patient/logout")
      .then((res) => {
        toast.success(res.data.message);
        setIsAuthenticated(false);
        setUser({});
        setShow(false);
        navigateTo("/");
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Logout failed.");
      });
  };

  const navigateTo = useNavigate();

  const goToLogin = () => {
    setShow(false);
    navigateTo("/login");
  };

  return (
    <>
      <nav className={"container"}>
        <div className="logo">
          <img src="/logo.png" alt="logo" className="logo-img" />
        </div>
        <div className={show ? "navLinks showmenu" : "navLinks"}>
          <div className="links">
            <Link to={"/"} onClick={() => setShow(!show)}>
              Home
            </Link>
            <Link to={"/appointment"} onClick={() => setShow(!show)}>
              Appointment
            </Link>
            <Link to={"/about"} onClick={() => setShow(!show)}>
              About Us
            </Link>
            {isAuthenticated && (
              <Link to={"/profile"} onClick={() => setShow(!show)}>
                Profile
              </Link>
            )}
          </div>
          <div className="navActions">
            {isAuthenticated && (
              <div className="patientBadge">
                <span>Signed in as</span>
                <strong>{user?.firstName || "Patient"}</strong>
              </div>
            )}
            {isAuthenticated ? (
              <button className="logoutBtn btn" onClick={handleLogout}>
                LOGOUT
              </button>
            ) : (
              <button className="loginBtn btn" onClick={goToLogin}>
                LOGIN
              </button>
            )}
          </div>
        </div>
        <div className="hamburger" onClick={() => setShow(!show)}>
          <GiHamburgerMenu />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
