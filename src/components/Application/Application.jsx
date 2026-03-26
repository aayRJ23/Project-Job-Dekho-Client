import "./Application.css";
import axios from "axios";
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../../main";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaFileUpload } from "react-icons/fa";

const Application = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  const handleFileChange = (event) => {
    const resume = event.target.files[0];
    setResume(resume);
  };

  const { id } = useParams();

  const handleApplication = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("coverLetter", coverLetter);
    formData.append("resume", resume);
    formData.append("jobId", id);

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/application/post",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setName(""); setEmail(""); setCoverLetter("");
      setPhone(""); setAddress(""); setResume(null);
      toast.success(data.message);
      navigateTo("/job/getall");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setName(""); setEmail(""); setCoverLetter("");
    setPhone(""); setAddress(""); setResume(null);
  };

  if (!isAuthorized || (user && user.role === "Employer")) {
    navigateTo("/");
  }

  return (
    <section className="appform-page">
      {loading && (
        <div className="appform-loader">
          <div className="appform-spinner"></div>
        </div>
      )}

      <h1 className="appform-heading">APPLICATION FORM</h1>

      <div className="appform-card">
        <form onSubmit={handleApplication} className="appform-form">

          <div className="appform-field">
            <label className="appform-label"><FaUser className="appform-icon" /> Your Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="appform-input"
            />
          </div>

          <div className="appform-field">
            <label className="appform-label"><FaEnvelope className="appform-icon" /> Your Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appform-input"
            />
          </div>

          <div className="appform-field">
            <label className="appform-label"><FaPhone className="appform-icon" /> Phone Number</label>
            <input
              type="number"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="appform-input"
            />
          </div>

          <div className="appform-field">
            <label className="appform-label"><FaMapMarkerAlt className="appform-icon" /> Your Address</label>
            <input
              type="text"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="appform-input"
            />
          </div>

          <div className="appform-field">
            <label className="appform-label">Cover Letter</label>
            <textarea
              placeholder="Write your cover letter here..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="appform-textarea"
              rows={5}
            />
          </div>

          <div className="appform-field">
            <label className="appform-label"><FaFileUpload className="appform-icon" /> Upload Resume</label>
            <div className="appform-file-wrapper">
              <input
                type="file"
                accept=".pdf, .jpg, .png"
                onChange={handleFileChange}
                className="appform-file-input"
                id="resume-upload"
              />
              <label htmlFor="resume-upload" className="appform-file-label">
                {resume ? resume.name : "Choose file (.pdf / .jpg / .png)"}
              </label>
            </div>
          </div>

          <div className="appform-btn-group">
            <button type="button" onClick={handleClear} className="appform-btn-clear">
              Clear
            </button>
            <button type="submit" className="appform-btn-submit">
              Send Application
            </button>
          </div>

        </form>
      </div>
    </section>
  );
};

export default Application;