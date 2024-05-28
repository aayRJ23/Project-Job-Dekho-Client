import axios from "axios";
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../../main";

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
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setName("");
      setEmail("");
      setCoverLetter("");
      setPhone("");
      setAddress("");
      setResume(null);
      toast.success(data.message);
      navigateTo("/job/getall");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setName("");
    setEmail("");
    setCoverLetter("");
    setPhone("");
    setAddress("");
    setResume(null);
  };

  if (!isAuthorized || (user && user.role === "Employer")) {
    navigateTo("/");
  }

  return (
    <section className="application-applicationform">
      {loading && (
        <div className="loader-applicationform">
          <div className="spinner-applicationform"></div>
        </div>
      )}
      <div className="container-applicationform">
        <h3 className="heading-applicationform">Application Form</h3>
        <form onSubmit={handleApplication} className="form-applicationform">
          <label className="label-applicationform">Your Name</label>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-applicationform"
          />
          <label className="label-applicationform">Your Email</label>
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-applicationform"
          />
          <label className="label-applicationform">Your Phone Number</label>
          <input
            type="number"
            placeholder="Your Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input-applicationform"
          />
          <label className="label-applicationform">Your Address</label>
          <input
            type="text"
            placeholder="Your Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="input-applicationform"
          />
          <label className="label-applicationform">Cover Letter</label>
          <textarea
            placeholder="CoverLetter..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            className="textarea-applicationform"
          />
          <div className="file-input-applicationform">
            <label className="file-label-applicationform">Select Resume</label>
            <input
              type="file"
              accept=".pdf, .jpg, .png"
              onChange={handleFileChange}
              className="file-applicationform"
            />
          </div>
          <div className="button-group-applicationform">
            <button type="button" onClick={handleClear} className="clear-button-applicationform">
              Clear
            </button>
            <button type="submit" className="submit-button-applicationform">
              Send Application
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Application;
