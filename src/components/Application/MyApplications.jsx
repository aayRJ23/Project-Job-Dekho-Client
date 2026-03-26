import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ResumeModal from "./ResumeModal";
import "./MyApplications.css";

const MyApplications = () => {
  const { user } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeImageUrl, setResumeImageUrl] = useState("");
  const [resumeName, setResumeName] = useState("");

  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const url =
          user && user.role === "Employer"
            ? "http://localhost:4000/api/v1/application/employer/getall"
            : "http://localhost:4000/api/v1/application/jobseeker/getall";

        const res = await axios.get(url, { withCredentials: true });
        setApplications(res.data.applications);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    if (isAuthorized) {
      fetchApplications();
    } else {
      navigateTo("/");
    }
  }, [isAuthorized, user, navigateTo]);

  const deleteApplication = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:4000/api/v1/application/delete/${id}`,
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setApplications((prevApplications) =>
        prevApplications.filter((application) => application._id !== id)
      );
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const updateApplicationStatus = async (id, status) => {
    try {
      const res = await axios.patch(
        `http://localhost:4000/api/v1/application/status/${id}`,
        { status },
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setApplications((prevApplications) =>
        prevApplications.map((application) =>
          application._id === id
            ? { ...application, accepted: status }
            : application
        )
      );
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const openModal = (imageUrl, name) => {
    setResumeImageUrl(imageUrl);
    setResumeName(name);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const isEmployer = user && user.role === "Employer";
  const total = applications.length;
  const accepted = applications.filter((a) => a.accepted === 1).length;
  const rejected = applications.filter((a) => a.accepted === 0).length;
  const pending = total - accepted - rejected;

  return (
    <section className="my_applications page">
      <h1 className="heading-myapplication">
        {isEmployer ? "Applications From Job Seekers" : "My Applications"}
      </h1>

      {/* Count summary strip */}
      {total > 0 && (
        <div className="myapp-summary-strip">
          <span className="myapp-summary-item">
            Total &nbsp;<strong>{total}</strong>
          </span>
          <span className="myapp-summary-divider">|</span>
          <span className="myapp-summary-item myapp-summary-pending">
            {isEmployer ? "Pending Review" : "Pending"} &nbsp;<strong>{pending}</strong>
          </span>
          <span className="myapp-summary-divider">|</span>
          <span className="myapp-summary-item myapp-summary-accepted">
            Accepted &nbsp;<strong>{accepted}</strong>
          </span>
          <span className="myapp-summary-divider">|</span>
          <span className="myapp-summary-item myapp-summary-rejected">
            Rejected &nbsp;<strong>{rejected}</strong>
          </span>
        </div>
      )}

      <div className="container-myapplication">
        {applications.length <= 0 ? (
          <h4>No Applications Found</h4>
        ) : (
          applications.map((element, index) => {
            return isEmployer ? (
              <EmployerCard
                element={element}
                key={element._id}
                deleteApplication={deleteApplication}
                updateApplicationStatus={updateApplicationStatus}
                openModal={openModal}
                index={index}
              />
            ) : (
              <JobSeekerCard
                element={element}
                key={element._id}
                deleteApplication={deleteApplication}
                openModal={openModal}
                index={index}
              />
            );
          })
        )}
      </div>
      {modalOpen && (
        <ResumeModal imageUrl={resumeImageUrl} name={resumeName} onClose={closeModal} />
      )}
    </section>
  );
};

export default MyApplications;

const JobSeekerCard = ({ element, deleteApplication, openModal, index }) => {
  return (
    <div className={`job_seeker_card-myapplication ${element.accepted === 1 ? "accepted" : ""} ${element.accepted === 0 ? "rejected" : ""}`}>
      <div className="number-tag">{index + 1}</div>
      <div className="detail">
        <p>
          <span>Name:</span> {element.name}
        </p>
        <p>
          <span>Email:</span> {element.email}
        </p>
        <p>
          <span>Phone:</span> {element.phone}
        </p>
        <p>
          <span>Address:</span> {element.address}
        </p>
        <p>
          <span>CoverLetter:</span> {element.coverLetter}
        </p>
        {element.accepted === 1 && (
          <p className="status-tag accepted-tag">✅ Your application was Accepted</p>
        )}
        {element.accepted === 0 && (
          <p className="status-tag rejected-tag">❌ Your application was Rejected</p>
        )}
        {element.accepted !== 0 && element.accepted !== 1 && (
          <p className="status-tag pending-tag">⏳ Awaiting Employer Review</p>
        )}
      </div>
      <div className="resume-img">
        <img
          src={element.resume.url}
          alt="resume"
          onClick={() => openModal(element.resume.url, element.name)}
        />
      </div>
    </div>
  );
};

const EmployerCard = ({ element, deleteApplication, updateApplicationStatus, openModal, index }) => {
  const handleGmailClick = (email) => {
    const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${email}`;
    window.open(mailtoLink, "_blank");
  };

  return (
    <div
      className={`job_seeker_card-myapplication ${element.accepted === 1 ? "accepted" : ""} ${
        element.accepted === 0 ? "rejected" : ""
      }`}
    >
      <div className="number-tag">{index + 1}</div>
      <div className="detail">
        <p>
          <span>Name:</span> {element.name}
        </p>
        <p>
          <span>Email:</span> {element.email}
        </p>
        <p>
          <span>Phone:</span> {element.phone}
        </p>
        <p>
          <span>Address:</span> {element.address}
        </p>
        <p>
          <span>CoverLetter:</span> {element.coverLetter}
        </p>
      </div>
      <div className="resume-img">
        <img
          src={element.resume.url}
          alt="resume"
          onClick={() => openModal(element.resume.url, element.name)}
        />
        <p className="resume-name">{element.name.split(" ")[0]}&apos;s Resume</p>
      </div>
      <div className="btn_area">
        {element.accepted === 1 ? (
          <>
            <button className="accepted-btn">Accepted</button>
            <button className="gmail-btn" onClick={() => handleGmailClick(element.email)}>
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Gmail_Icon.png"
                alt="Gmail"
              />
              Redirect To Gmail
            </button>
          </>
        ) : element.accepted === 0 ? (
          <button className="rejected-btn">Rejected</button>
        ) : (
          <>
            <button className="accept-btn" onClick={() => updateApplicationStatus(element._id, 1)}>
              Accept Application
            </button>
            <button className="reject-btn" onClick={() => updateApplicationStatus(element._id, 0)}>
              Reject Application
            </button>
          </>
        )}
      </div>
    </div>
  );
};