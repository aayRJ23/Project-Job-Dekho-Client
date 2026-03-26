import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaCheckDouble,
} from "react-icons/fa";
import "./Notifications.css";

// Colour-per-type (no icon needed in the card — kept minimal)
const TYPE_META = {
  NEW_JOB_POSTED: {
    colorClass: "notif-type-job",
    label: "New Job",
  },
  APPLICATION_SUBMITTED: {
    colorClass: "notif-type-submitted",
    label: "Application",
  },
  APPLICATION_ACCEPTED: {
    colorClass: "notif-type-accepted",
    label: "Accepted",
  },
  APPLICATION_REJECTED: {
    colorClass: "notif-type-rejected",
    label: "Rejected",
  },
};

const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const Notifications = ({ setUnreadCount, liveNotifications, setLiveNotifications }) => {
  const { isAuthorized } = useContext(Context);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthorized) {
      navigate("/login");
      return;
    }

    // If liveNotifications is already seeded from App.jsx socket logic, use it.
    // Otherwise fetch fresh from server (e.g. page hard-refresh).
    if (liveNotifications !== null) {
      setLoading(false);
    } else {
      fetchNotifications();
    }
  }, [isAuthorized]);

  // Also stop showing spinner once liveNotifications arrives (pushed from App)
  useEffect(() => {
    if (liveNotifications !== null) {
      setLoading(false);
    }
  }, [liveNotifications]);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/v1/notification/getall",
        { withCredentials: true }
      );
      setLiveNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch {
      toast.error("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkOne = async (id) => {
    try {
      await axios.patch(
        `http://localhost:4000/api/v1/notification/read/${id}`,
        {},
        { withCredentials: true }
      );
      setLiveNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      toast.error("Failed to mark notification.");
    }
  };

  const handleMarkAll = async () => {
    try {
      await axios.patch(
        "http://localhost:4000/api/v1/notification/readall",
        {},
        { withCredentials: true }
      );
      setLiveNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read.");
    } catch {
      toast.error("Failed to mark all notifications.");
    }
  };

  const notifications = liveNotifications || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const totalCount = notifications.length;
  const readCount = totalCount - unreadCount;

  return (
    <section className="notif-page">
      {/* Page heading — no bell icon, centred like all other nav pages */}
      <h1 className="notif-page-heading">
        NOTIFICATIONS
        {unreadCount > 0 && (
          <span className="notif-heading-badge">{unreadCount} new</span>
        )}
      </h1>

      {/* Count summary strip */}
      {!loading && totalCount > 0 && (
        <div className="notif-summary-strip">
          <span className="notif-summary-item notif-summary-total">
            Total &nbsp;<strong>{totalCount}</strong>
          </span>
          <span className="notif-summary-divider">|</span>
          <span className="notif-summary-item notif-summary-unread">
            Unread &nbsp;<strong>{unreadCount}</strong>
          </span>
          <span className="notif-summary-divider">|</span>
          <span className="notif-summary-item notif-summary-read">
            Read &nbsp;<strong>{readCount}</strong>
          </span>
        </div>
      )}

      {/* Mark All Button */}
      {unreadCount > 0 && (
        <div className="notif-topbar">
          <button className="notif-markall-btn" onClick={handleMarkAll}>
            <FaCheckDouble /> &nbsp;Mark All as Read
          </button>
        </div>
      )}

      <div className="notif-container">
        {loading ? (
          <div className="notif-loading">
            <div className="notif-spinner" />
            <p>Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="notif-empty">
            <p className="notif-empty-icon">🔔</p>
            <p>No notifications yet.</p>
          </div>
        ) : (
          notifications.map((notif) => {
            const meta = TYPE_META[notif.type] || TYPE_META.APPLICATION_SUBMITTED;
            return (
              <div
                key={notif._id}
                className={`notif-card ${notif.isRead ? "notif-read" : "notif-unread"}`}
              >
                {/* Middle: content */}
                <div className="notif-content">
                  <span className={`notif-type-label ${meta.colorClass}`}>
                    {meta.label}
                  </span>
                  <p className="notif-message">{notif.message}</p>
                  {notif.meta?.jobTitle && (
                    <p className="notif-meta-info">
                      Job: <strong>{notif.meta.jobTitle}</strong>
                    </p>
                  )}
                  {notif.meta?.applicantName && (
                    <p className="notif-meta-info">
                      Applicant: <strong>{notif.meta.applicantName}</strong>
                    </p>
                  )}
                  <span className="notif-time">{formatTime(notif.createdAt)}</span>
                </div>

                {/* Right: status + action */}
                <div className="notif-right">
                  {!notif.isRead ? (
                    <>
                      <span className="notif-new-dot" title="New" />
                      <button
                        className="notif-mark-btn"
                        onClick={() => handleMarkOne(notif._id)}
                        title="Mark as read"
                      >
                        <FaCheckCircle />
                      </button>
                    </>
                  ) : (
                    <span className="notif-read-label">Read</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default Notifications;