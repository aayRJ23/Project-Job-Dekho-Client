import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ResumeModal from "./ResumeModal";
import "./MyApplications.css";

const MyApplications = () => {
  const { user, isAuthorized } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeImageUrl, setResumeImageUrl] = useState("");
  const [resumeName, setResumeName] = useState("");

  // Interview scheduling popup state
  const [schedulePopup, setSchedulePopup] = useState({ open: false, appId: null });
  const [scheduleForm, setScheduleForm] = useState({ date: "", time: "", meetLink: "" });

  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthorized) { navigateTo("/"); return; }
    const fetchApplications = async () => {
      try {
        const url =
          user && user.role === "Employer"
            ? "http://localhost:4000/api/v1/application/employer/getall"
            : "http://localhost:4000/api/v1/application/jobseeker/getall";
        const res = await axios.get(url, { withCredentials: true });
        setApplications(res.data.applications);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch applications");
      }
    };
    fetchApplications();
  }, [isAuthorized, user, navigateTo]);

  const deleteApplication = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:4000/api/v1/application/delete/${id}`,
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setApplications((prev) => prev.filter((a) => a._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  // Employer clicks "Accept" → open popup
  const openSchedulePopup = (appId) => {
    setScheduleForm({ date: "", time: "", meetLink: "" });
    setSchedulePopup({ open: true, appId });
  };

  // Employer clicks "Reject"
  const rejectApplication = async (id) => {
    try {
      const res = await axios.patch(
        `http://localhost:4000/api/v1/application/status/${id}`,
        { status: 0 },
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setApplications((prev) =>
        prev.map((a) => (a._id === id ? { ...a, accepted: 0 } : a))
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject");
    }
  };

  // Employer submits interview popup → accept + schedule
  const submitSchedule = async () => {
    const { appId } = schedulePopup;
    const { date, time, meetLink } = scheduleForm;
    if (!date || !time || !meetLink) {
      toast.error("Please fill all interview fields.");
      return;
    }
    try {
      const res = await axios.patch(
        `http://localhost:4000/api/v1/application/status/${appId}`,
        { status: 1, date, time, meetLink },
        { withCredentials: true }
      );
      toast.success("Application accepted & interview scheduled!");
      setApplications((prev) =>
        prev.map((a) =>
          a._id === appId
            ? { ...a, accepted: 1, interview: { date, time, meetLink } }
            : a
        )
      );
      setSchedulePopup({ open: false, appId: null });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to schedule");
    }
  };

  const openModal = (imageUrl, name) => {
    setResumeImageUrl(imageUrl);
    setResumeName(name);
    setModalOpen(true);
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

      {total > 0 && (
        <div className="myapp-summary-strip">
          <span className="myapp-summary-item">Total &nbsp;<strong>{total}</strong></span>
          <span className="myapp-summary-divider">|</span>
          <span className="myapp-summary-item myapp-summary-pending">
            {isEmployer ? "Pending Review" : "Pending"} &nbsp;<strong>{pending}</strong>
          </span>
          <span className="myapp-summary-divider">|</span>
          <span className="myapp-summary-item myapp-summary-accepted">Accepted &nbsp;<strong>{accepted}</strong></span>
          <span className="myapp-summary-divider">|</span>
          <span className="myapp-summary-item myapp-summary-rejected">Rejected &nbsp;<strong>{rejected}</strong></span>
        </div>
      )}

      <div className="container-myapplication">
        {applications.length <= 0 ? (
          <h4>No Applications Found</h4>
        ) : (
          applications.map((element, index) =>
            isEmployer ? (
              <EmployerCard
                element={element}
                key={element._id}
                index={index}
                deleteApplication={deleteApplication}
                openSchedulePopup={openSchedulePopup}
                rejectApplication={rejectApplication}
                openModal={openModal}
              />
            ) : (
              <JobSeekerCard
                element={element}
                key={element._id}
                index={index}
                deleteApplication={deleteApplication}
                openModal={openModal}
              />
            )
          )
        )}
      </div>

      {modalOpen && (
        <ResumeModal imageUrl={resumeImageUrl} name={resumeName} onClose={() => setModalOpen(false)} />
      )}

      {/* ── Interview Scheduling Popup ── */}
      {schedulePopup.open && (
        <div className="schedule-overlay">
          <div className="schedule-popup">
            <h3>📅 Schedule Interview</h3>
            <p className="schedule-subtitle">Fill in the details and send to the applicant</p>
            <label>Interview Date</label>
            <input
              type="date"
              value={scheduleForm.date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setScheduleForm((f) => ({ ...f, date: e.target.value }))}
            />
            <label>Interview Time</label>
            <input
              type="time"
              value={scheduleForm.time}
              onChange={(e) => setScheduleForm((f) => ({ ...f, time: e.target.value }))}
            />
            <label>Meet Link</label>
            <input
              type="url"
              placeholder="https://meet.google.com/..."
              value={scheduleForm.meetLink}
              onChange={(e) => setScheduleForm((f) => ({ ...f, meetLink: e.target.value }))}
            />
            <div className="schedule-popup-btns">
              <button className="schedule-send-btn" onClick={submitSchedule}>
                ✅ Accept & Send Interview
              </button>
              <button
                className="schedule-cancel-btn"
                onClick={() => setSchedulePopup({ open: false, appId: null })}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MyApplications;

// ── Employer Card ────────────────────────────────────────────────────────────
const EmployerCard = ({
  element, index, deleteApplication, openSchedulePopup, rejectApplication, openModal,
}) => {
  return (
    <div
      className={`job_seeker_card-myapplication ${element.accepted === 1 ? "accepted" : ""} ${element.accepted === 0 ? "rejected" : ""}`}
    >
      <div className="number-tag">{index + 1}</div>
      <div className="detail">
        <p><span>Name:</span> {element.name}</p>
        <p><span>Email:</span> {element.email}</p>
        <p><span>Phone:</span> {element.phone}</p>
        <p><span>Address:</span> {element.address}</p>
        <p><span>CoverLetter:</span> {element.coverLetter}</p>
        {element.accepted === 1 && element.interview && (
          <div className="interview-info-card">
            <p>📅 <strong>Interview:</strong> {element.interview.date} at {element.interview.time}</p>
            <p>🔗 <a href={element.interview.meetLink} target="_blank" rel="noreferrer">Join Meeting</a></p>
          </div>
        )}
      </div>
      <div className="resume-img">
        <img src={element.resume.url} alt="resume" onClick={() => openModal(element.resume.url, element.name)} />
        <p className="resume-name">{element.name.split(" ")[0]}&apos;s Resume</p>
      </div>
      <div className="btn_area">
        {element.accepted === 1 ? (
          <button className="accepted-btn" disabled>✅ Accepted &amp; Interview Scheduled</button>
        ) : element.accepted === 0 ? (
          <button className="rejected-btn" disabled>❌ Rejected</button>
        ) : (
          <>
            <button className="accept-btn" onClick={() => openSchedulePopup(element._id)}>
              Accept &amp; Schedule Interview
            </button>
            <button className="reject-btn" onClick={() => rejectApplication(element._id)}>
              Reject Application
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// ── Job Seeker Card ──────────────────────────────────────────────────────────
const JobSeekerCard = ({ element, deleteApplication, openModal, index }) => {
  // Build status timeline stages
  const stages = [
    { key: "applied", label: "Applied" },
    { key: "review", label: "Under Review" },
    { key: "decision", label: element.accepted === 1 ? "Accepted" : element.accepted === 0 ? "Rejected" : "Awaiting Decision" },
    { key: "interview", label: "Interview Scheduled" },
    { key: "final", label: "Final Decision" },
  ];

  // Determine active step index
  let activeStep = 1; // Under Review by default
  if (element.accepted === 0) activeStep = 2;
  else if (element.accepted === 1 && !element.interview?.date) activeStep = 2;
  else if (element.accepted === 1 && element.interview?.date && !element.finalVerdict) activeStep = 3;
  else if (element.finalVerdict) activeStep = 4;

  return (
    <div
      className={`job_seeker_card-myapplication ${element.accepted === 1 ? "accepted" : ""} ${element.accepted === 0 ? "rejected" : ""}`}
    >
      <div className="number-tag">{index + 1}</div>
      <div className="detail">
        <p><span>Name:</span> {element.name}</p>
        <p><span>Email:</span> {element.email}</p>
        <p><span>Phone:</span> {element.phone}</p>
        <p><span>Address:</span> {element.address}</p>
        <p><span>CoverLetter:</span> {element.coverLetter}</p>

        {/* ── Status Timeline ── */}
        <div className="status-timeline">
          {stages.map((stage, i) => {
            const done = i < activeStep;
            const current = i === activeStep;
            // Skip interview/final stages if rejected
            if (element.accepted === 0 && i >= 3) return null;
            return (
              <div key={stage.key} className={`timeline-step ${done ? "done" : ""} ${current ? "current" : ""}`}>
                <div className="timeline-dot">{done ? "✓" : i + 1}</div>
                <div className="timeline-label">{stage.label}</div>
                {i < stages.length - 1 && !(element.accepted === 0 && i === 2) && (
                  <div className={`timeline-line ${done ? "done" : ""}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* ── Interview Info ── */}
        {element.accepted === 1 && element.interview?.date && (
          <div className="interview-info-card seeker">
            <p>📅 <strong>Interview:</strong> {element.interview.date} at {element.interview.time}</p>
            <p>🔗 <a href={element.interview.meetLink} target="_blank" rel="noreferrer">Join Meeting</a></p>
          </div>
        )}

        {/* ── Final Verdict ── */}
        {element.finalVerdict === "selected" && (
          <p className="status-tag accepted-tag">🎊 You are SELECTED for this job!</p>
        )}
        {element.finalVerdict === "not_selected" && (
          <p className="status-tag rejected-tag">You were not selected after the interview.</p>
        )}
      </div>

      <div className="resume-img">
        <img src={element.resume.url} alt="resume" onClick={() => openModal(element.resume.url, element.name)} />
      </div>

      {element.accepted === -1 && (
        <div className="btn_area">
          <button className="reject-btn" onClick={() => deleteApplication(element._id)}>
            Delete Application
          </button>
        </div>
      )}
    </div>
  );
};