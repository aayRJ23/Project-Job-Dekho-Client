import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../main";
import { Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaSmile } from "react-icons/fa";
import HeroSection from "./HeroSection";
import HowItWorks from "./HowItWorks";
import PopularCategories from "./PopularCategories";
import PopularCompanies from "./PopularCompanies";
import './Home.css';

const Home = () => {
  const { isAuthorized } = useContext(Context);
  const [showGreeting, setShowGreeting] = useState(false);

  useEffect(() => {
    if (isAuthorized && !sessionStorage.getItem("greetingShown")) {
      setShowGreeting(true);
    }
  }, [isAuthorized]);

  const handleGetStarted = () => {
    setShowGreeting(false);
    sessionStorage.setItem("greetingShown", "true");
  };

  if (!isAuthorized) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <AnimatePresence>
        {showGreeting && (
          <motion.div
            className="greeting-card-greetingCard"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FaSmile className="greeting-icon-greetingCard" />
            <h2 className="greeting-title-greetingCard">Hello, Welcome to Job-Dekho</h2>
            <p className="greeting-message-greetingCard">We're excited to have you here!</p>
            <button className="greeting-button-greetingCard" onClick={handleGetStarted}>Get Started</button>
          </motion.div>
        )}
      </AnimatePresence>
      <section className="homePage-home page-home">
        <HeroSection />
        <HowItWorks />
        <PopularCategories />
        <PopularCompanies />
      </section>
    </>
  );
};

export default Home;
