import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";
import "./PostJob.css";

const PostJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [salaryFrom, setSalaryFrom] = useState("");
  const [salaryTo, setSalaryTo] = useState("");
  const [fixedSalary, setFixedSalary] = useState("");
  const [salaryType, setSalaryType] = useState("default");

  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthorized || (user && user.role !== "Employer")) {
      navigateTo("/");
    }
  }, [isAuthorized, user, navigateTo]);

  const handleJobPost = async (e) => {
    e.preventDefault();

    const jobData = {
      title,
      description,
      category,
      country,
      city,
      location,
      salaryType,
      salaryFrom: salaryType === "Ranged Salary" ? salaryFrom : undefined,
      salaryTo: salaryType === "Ranged Salary" ? salaryTo : undefined,
      fixedSalary: salaryType === "Fixed Salary" ? fixedSalary : undefined,
    };

    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/job/post",
        jobData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setCountry("");
    setCity("");
    setLocation("");
    setSalaryFrom("");
    setSalaryTo("");
    setFixedSalary("");
    setSalaryType("default");
  };

  return (
    <div className="job-post-page">
      <div className="container">
        <h3>Post New Job</h3>
        <form onSubmit={handleJobPost}>
          <div className="form-wrapper">
            <label>Job Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Job Title"
              className="animated-input"
            />
          </div>
          <div className="form-wrapper">
            <label>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="animated-select"
            >
              <option value="">Select Category</option>
              <option value="Graphics & Design">Graphics & Design</option>
              <option value="Mobile App Development">Mobile App Development</option>
              <option value="Frontend Web Development">Frontend Web Development</option>
              <option value="MERN Stack Development">MERN STACK Development</option>
              <option value="Account & Finance">Account & Finance</option>
              <option value="Artificial Intelligence">Artificial Intelligence</option>
              <option value="Video Animation">Video Animation</option>
              <option value="MEAN Stack Development">MEAN STACK Development</option>
              <option value="MEVN Stack Development">MEVN STACK Development</option>
              <option value="Data Entry Operator">Data Entry Operator</option>
            </select>
          </div>
          <div className="wrapper">
            <div className="form-wrapper">
              <label>Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Country"
                className="animated-input"
              />
            </div>
            <div className="form-wrapper">
              <label>City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="animated-input"
              />
            </div>
          </div>
          <div className="form-wrapper">
            <label>Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className="animated-input"
            />
          </div>
          <div className="salary-wrapper">
            <label>Salary Type</label>
            <select
              value={salaryType}
              onChange={(e) => setSalaryType(e.target.value)}
              className="animated-select"
            >
              <option value="default">Select Salary Type</option>
              <option value="Fixed Salary">Fixed Salary</option>
              <option value="Ranged Salary">Ranged Salary</option>
            </select>
            <div>
              {salaryType === "default" ? (
                <p className="salary-message">Please provide Salary Type *</p>
              ) : salaryType === "Fixed Salary" ? (
                <div className="form-wrapper">
                  <label>Fixed Salary</label>
                  <input
                    type="number"
                    placeholder="Enter Fixed Salary"
                    value={fixedSalary}
                    onChange={(e) => setFixedSalary(e.target.value)}
                    className="animated-input"
                  />
                </div>
              ) : (
                <div className="ranged-salary">
                  <div className="form-wrapper">
                    <label>Salary From</label>
                    <input
                      type="number"
                      placeholder="Salary From"
                      value={salaryFrom}
                      onChange={(e) => setSalaryFrom(e.target.value)}
                      className="animated-input"
                    />
                  </div>
                  <div className="form-wrapper">
                    <label>Salary To</label>
                    <input
                      type="number"
                      placeholder="Salary To"
                      value={salaryTo}
                      onChange={(e) => setSalaryTo(e.target.value)}
                      className="animated-input"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="form-wrapper">
            <label>Job Description</label>
            <textarea
              rows="10"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Job Description"
              className="animated-textarea"
            />
          </div>
          <div className="button-wrapper">
            <button type="button" className="clear-button" onClick={clearForm}>
              Clear
            </button>
            <button type="submit" className="submit-button">
              Create Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
