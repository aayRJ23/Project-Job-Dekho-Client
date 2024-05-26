import React, { useContext, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { FaPencilAlt } from "react-icons/fa";
import { FaPhoneFlip } from "react-icons/fa6";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";
import "./Register.css";


const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const { isAuthorized, setIsAuthorized, user, setUser } = useContext(Context);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/user/register",
        { name, phone, email, role, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      setName("");
      setEmail("");
      setPassword("");
      setPhone("");
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
    <section className="registerPage">
      <div className="registerContainer">
        <div className="registerHeader">
          <img src="/JobZeelogo.png" alt="logo" className="registerLogo" />
          <h3>Create a new account</h3>
        </div>
        <form className="registerForm">
          <div className="registerInputTag">
            <label>Register As</label>
            <div className="registerInputDiv">
              <select value={role} onChange={(e) => setRole(e.target.value)} className="registerSelect">
                <option value="">Select Role</option>
                <option value="Employer">Employer</option>
                <option value="Job Seeker">Job Seeker</option>
              </select>
              <FaRegUser className="registerIcon" />
            </div>
          </div>
          <div className="registerInputTag">
            <label>Name</label>
            <div className="registerInputDiv">
              <input
                type="text"
                placeholder="Zeeshan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="registerInput"
              />
              <FaPencilAlt className="registerIcon" />
            </div>
          </div>
          <div className="registerInputTag">
            <label>Email Address</label>
            <div className="registerInputDiv">
              <input
                type="email"
                placeholder="zk@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="registerInput"
              />
              <MdOutlineMailOutline className="registerIcon" />
            </div>
          </div>
          <div className="registerInputTag">
            <label>Phone Number</label>
            <div className="registerInputDiv">
              <input
                type="number"
                placeholder="12345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="registerInput"
              />
              <FaPhoneFlip className="registerIcon" />
            </div>
          </div>
          <div className="registerInputTag">
            <label>Password</label>
            <div className="registerInputDiv">
              <input
                type="password"
                placeholder="Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="registerInput"
              />
              <RiLock2Fill className="registerIcon" />
            </div>
          </div>
          <button type="submit" onClick={handleRegister} className="registerButton">
            Register
          </button>
          <Link to={"/login"} className="registerLink">Login Now</Link>
        </form>
      </div>
    </section>
  );
};

export default Register;
