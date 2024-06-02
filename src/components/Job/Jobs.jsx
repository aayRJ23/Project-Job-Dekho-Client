import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../main";
import "./Jobs.css";
import { FaSearch, FaCity, FaCalendarAlt, FaGlobe, FaTag } from "react-icons/fa";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    try {
      axios
        .get("http://localhost:4000/api/v1/job/getall", {
          withCredentials: true,
        })
        .then((res) => {
          setJobs(res.data);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  if (!isAuthorized) {
    navigateTo("/");
  }

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredJobs = jobs.jobs?.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="jobs-page-alljobs">
      <h1 className="jobs-header">All Available Jobs</h1>
      <div className="container-alljobs">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by job title..."
            value={search}
            onChange={handleSearch}
          />
          <FaSearch className="search-icon" />
        </div>
        <div className="jobs-banner-alljobs">
          {filteredJobs &&
            filteredJobs.map((element) => {
              return (
                <div className="job-card-alljobs" key={element._id}>
                  <h2>{element.title}</h2>
                  <p><FaTag className="icon" /> <span>Category:</span> {element.category}</p>
                  <p><FaGlobe className="icon" /> <span>Country:</span> {element.country}</p>
                  <p><FaCity className="icon" /> <span>City:</span> {element.city}</p>
                  <p><FaCalendarAlt className="icon" /> <span>Posted On:</span> {new Date(element.jobPostedOn).toLocaleDateString()}</p>
                  <Link to={`/job/${element._id}`} className="details-link-alljobs">
                    Job Details
                  </Link>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default Jobs;
