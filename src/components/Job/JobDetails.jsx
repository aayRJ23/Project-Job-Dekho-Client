import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";
import "./JobDetails.css";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState({});
  const navigateTo = useNavigate();

  const { isAuthorized, user } = useContext(Context);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/v1/job/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setJob(res.data.job);
      })
      .catch((error) => {
        navigateTo("/notfound");
      });
  }, [id, navigateTo]);

  if (!isAuthorized) {
    navigateTo("/login");
  }

  const formatDateTime = (dateTime) => {
    const dateObj = new Date(dateTime);
    const date = dateObj.toLocaleDateString("en-GB");
    const time = dateObj.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    return `${date} ${time}`;
  };

  return (
    <section className="jobDetail-job-details page-job-details">
      <div className="container-job-details">
        <h3 className="heading-job-details">Job Details</h3>
        <div className="banner-job-details">
          <p className="field-job-details">
            <span className="label-job-details">Title:</span> <span>{job.title}</span>
          </p>
          <p className="field-job-details">
            <span className="label-job-details">Category:</span> <span>{job.category}</span>
          </p>
          <p className="field-job-details">
            <span className="label-job-details">Country:</span> <span>{job.country}</span>
          </p>
          <p className="field-job-details">
            <span className="label-job-details">City:</span> <span>{job.city}</span>
          </p>
          <p className="field-job-details">
            <span className="label-job-details">Location:</span> <span className="location-data-job-details">{job.location}</span>
          </p>
          <p className="field-job-details description-job-details">
            <span className="label-job-details">Description:</span> <span className="desc-data-job-details">{job.description}</span>
          </p>
          <p className="field-job-details">
            <span className="label-job-details">Job Posted On:</span> <span>{formatDateTime(job.jobPostedOn)}</span>
          </p>
          <p className="field-job-details">
            <span className="label-job-details">Salary:</span>{" "}
            {job.fixedSalary ? (
              <span>{job.fixedSalary} &#8377;</span>
            ) : (
              <span>
                {job.salaryFrom} - {job.salaryTo} &#8377;
              </span>
            )}
          </p>
          {user && user.role === "Employer" ? (
            <></>
          ) : (
            <Link to={`/application/${job._id}`} className="apply-link-job-details">Apply Now</Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default JobDetails;
