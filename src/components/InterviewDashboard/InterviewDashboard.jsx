import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./InterviewDashboard.css";

const InterviewDashboard = () => {
  const { user, isAuthorized } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthorized) { navigateTo("/"); return; }
    const fetchApplications = async () => {
      try {
        const url =
          user?.role === "Employer"
            ? "http://localhost:4000/api/v1/application/employer/getall"
            : "http://localhost:4000/api/v1/application/jobseeker/getall";
        const res = await axios.get(url, { withCredentials: true });
        // For the dashboard, only show applications that have been accepted (interview scheduled)
        setApplications(res.data.applications.filter((a) => a.accepted === 1));
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [isAuthorized, user, navigateTo]);

  const setVerdict = async (id, verdict) => {
    try {
      const res = await axios.patch(
        `http://localhost:4000/api/v1/application/verdict/${id}`,
        { verdict },
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setApplications((prev) =>
        prev.map((a) => (a._id === id ? { ...a, finalVerdict: verdict } : a))
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to set verdict");
    }
  };

  const isEmployer = user?.role === "Employer";

  if (loading) {
    return (
      <div className="idash-page">
        <div className="idash-loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="idash-page page">
      <h1 className="idash-title">
        {isEmployer ? "🏢 Employer Interview Dashboard" : "👤 My Interview Dashboard"}
      </h1>
      <p className="idash-subtitle">
        {isEmployer
          ? "All accepted applicants with scheduled interviews"
          : "Track your interview schedule and final results"}
      </p>

      {applications.length === 0 ? (
        <div className="idash-empty">
          <p>No interviews scheduled yet.</p>
        </div>
      ) : (
        <div className="idash-table-wrapper">
          <table className="idash-table">
            <thead>
              <tr>
                <th>#</th>
                {isEmployer && <th>Applicant</th>}
                <th>Application ID</th>
                <th>Job Title</th>
                <th>Interview Date</th>
                <th>Interview Time</th>
                <th>Meet Link</th>
                <th>Final Verdict</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app, index) => (
                <TableRow
                  key={app._id}
                  app={app}
                  index={index}
                  isEmployer={isEmployer}
                  setVerdict={setVerdict}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InterviewDashboard;

// ── Table Row ────────────────────────────────────────────────────────────────
const TableRow = ({ app, index, isEmployer, setVerdict }) => {
  const interview = app.interview || {};

  const renderVerdictCell = () => {
    if (!isEmployer) {
      // Job seeker: just show the result
      if (app.finalVerdict === "selected") {
        return <span className="verdict-badge selected">🎊 Selected</span>;
      }
      if (app.finalVerdict === "not_selected") {
        return <span className="verdict-badge not-selected">❌ Not Selected</span>;
      }
      return <span className="verdict-badge pending">⏳ Awaiting</span>;
    }

    // Employer: show action buttons or result
    if (app.finalVerdict === "selected") {
      return <button className="verdict-btn selected-btn" disabled>✅ Selected for Job</button>;
    }
    if (app.finalVerdict === "not_selected") {
      return <button className="verdict-btn not-selected-btn" disabled>❌ Not Selected</button>;
    }
    // No verdict yet — show two buttons
    return (
      <div className="verdict-actions">
        <button
          className="verdict-btn select-btn"
          onClick={() => setVerdict(app._id, "selected")}
        >
          Select
        </button>
        <button
          className="verdict-btn reject-btn"
          onClick={() => setVerdict(app._id, "not_selected")}
        >
          Not Select
        </button>
      </div>
    );
  };

  return (
    <tr className={`idash-row ${app.finalVerdict === "selected" ? "row-selected" : ""} ${app.finalVerdict === "not_selected" ? "row-not-selected" : ""}`}>
      <td>{index + 1}</td>
      {isEmployer && <td className="applicant-name">{app.name}</td>}
      <td className="app-id-cell" title={app._id}>{app._id.slice(-8)}</td>
      <td>{app.jobTitle || "—"}</td>
      <td>{interview.date || "—"}</td>
      <td>{interview.time || "—"}</td>
      <td>
        {interview.meetLink ? (
          <a href={interview.meetLink} target="_blank" rel="noreferrer" className="meet-link">
            🔗 Join Meeting
          </a>
        ) : "—"}
      </td>
      <td>{renderVerdictCell()}</td>
    </tr>
  );
};