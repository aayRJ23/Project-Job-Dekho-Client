import React, { useContext, useEffect, useState } from "react";
import "./App.css";
import { Context } from "./main";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import Home from "./components/Home/Home";
import Jobs from "./components/Job/Jobs";
import JobDetails from "./components/Job/JobDetails";
import Application from "./components/Application/Application";
import MyApplications from "./components/Application/MyApplications";
import PostJob from "./components/Job/PostJob";
import NotFound from "./components/NotFound/NotFound";
import MyJobs from "./components/Job/MyJobs";
import Chatbot from "./components/Chatbot/Chatbot";
import Details from "./components/Details/Details";
import Notifications from "./components/Notifications/Notifications";
import InterviewDashboard from "./components/InterviewDashboard/InterviewDashboard"; // NEW
import socket from "./socket";

const App = () => {
  const { isAuthorized, setIsAuthorized, setUser, user } = useContext(Context);
  const [unreadCount, setUnreadCount] = useState(0);
  const [liveNotifications, setLiveNotifications] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/user/getuser",
          { withCredentials: true }
        );
        setUser(response.data.user);
        setIsAuthorized(true);
      } catch {
        setIsAuthorized(false);
      }
    };
    fetchUser();
  }, [isAuthorized, setUser, setIsAuthorized]);

  useEffect(() => {
    if (isAuthorized && user && user._id) {
      if (!socket.connected) socket.connect();
      socket.emit("register", user._id);

      const handleReconnect = () => socket.emit("register", user._id);
      const handleNewNotification = (notification) => {
        setUnreadCount((prev) => prev + 1);
        setLiveNotifications((prev) =>
          prev ? [notification, ...prev] : [notification]
        );
      };

      socket.on("new_notification", handleNewNotification);
      socket.on("reconnect", handleReconnect);
      return () => {
        socket.off("new_notification", handleNewNotification);
        socket.off("reconnect", handleReconnect);
      };
    } else {
      if (socket.connected) socket.disconnect();
      setUnreadCount(0);
      setLiveNotifications(null);
    }
  }, [isAuthorized, user]);

  useEffect(() => {
    if (isAuthorized) {
      axios
        .get("http://localhost:4000/api/v1/notification/getall", { withCredentials: true })
        .then((res) => {
          setUnreadCount(res.data.unreadCount);
          setLiveNotifications(res.data.notifications);
        })
        .catch(() => {});
    }
  }, [isAuthorized]);

  return (
    <>
      <BrowserRouter>
        <Navbar unreadCount={unreadCount} setUnreadCount={setUnreadCount} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/job/getall" element={<Jobs />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/application/:id" element={<Application />} />
          <Route path="/applications/me" element={<MyApplications />} />
          <Route path="/job/post" element={<PostJob />} />
          <Route path="/job/me" element={<MyJobs />} />
          <Route
            path="/notifications"
            element={
              <Notifications
                setUnreadCount={setUnreadCount}
                liveNotifications={liveNotifications}
                setLiveNotifications={setLiveNotifications}
              />
            }
          />
          {/* NEW: Interview Dashboard — accessible to both roles */}
          <Route path="/interview-dashboard" element={<InterviewDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <Toaster />
        {isAuthorized && <Chatbot />}
        <Details />
      </BrowserRouter>
    </>
  );
};

export default App;