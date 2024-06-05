import React, { useContext, useState } from "react";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { Link, Navigate } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const { isAuthorized, setIsAuthorized } = useContext(Context);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("h");
    try {

      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/login",
        { email, password, role },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setEmail("");
      setPassword("");
      setRole("");
      setIsAuthorized(true);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (isAuthorized) {
    return <Navigate to={'/'} />
  }

  return (
    <section className="loginPage">
      <div className="loginContainer">
        <div className="loginHeader">
          {/* <img src="/JobZeelogo.png" alt="logo" className="loginLogo" /> */}
          <h3>Login to your account</h3>
        </div>
        <form className="loginForm">
          <div className="loginInputTag">
            <label>Login As</label>
            <div className="loginInputDiv">
              <select value={role} onChange={(e) => setRole(e.target.value)} className="loginSelect">
                <option value="">Select Role</option>
                <option value="Employer">Employer</option>
                <option value="Job Seeker">Job Seeker</option>
              </select>
              <FaRegUser className="loginIcon" />
            </div>
          </div>
          <div className="loginInputTag">
            <label>Email Address</label>
            <div className="loginInputDiv">
              <input
                type="email"
                placeholder="Your Email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="loginInput"
              />
              <MdOutlineMailOutline className="loginIcon" />
            </div>
          </div>
          <div className="loginInputTag">
            <label>Password</label>
            <div className="loginInputDiv">
              <input
                type="password"
                placeholder="Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="loginInput"
              />
              <RiLock2Fill className="loginIcon" />
            </div>
          </div>
          <button type="submit" onClick={handleLogin} className="loginButton">
            Login
          </button>
          <Link to={"/register"} className="loginLink">Register Now</Link>
        </form>
      </div>
    </section>
  );
};

export default Login;
