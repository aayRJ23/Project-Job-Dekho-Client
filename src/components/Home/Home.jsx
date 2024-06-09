import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../main";
import { Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import HeroSection from "./HeroSection";
import HowItWorks from "./HowItWorks";
import PopularCategories from "./PopularCategories";
import PopularCompanies from "./PopularCompanies";
import './Home.css';
import greetingImg1 from './greetingImg1.png';
import greetingImg2 from './greetingImg2.png';
import greetingImg3 from './greetingImg3.png';
import { FaArrowRight } from 'react-icons/fa';

const Home = () => {
  const { isAuthorized } = useContext(Context);
  const [showGreeting, setShowGreeting] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (isAuthorized && !sessionStorage.getItem("greetingShown")) {
      setShowGreeting(true);
    }
  }, [isAuthorized]);

  const handleNextSlide = () => {
    if (currentSlide < 2) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setShowGreeting(false);
      sessionStorage.setItem("greetingShown", "true");
    }
  };

  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };

  const slides = [
    {
      header: (
        <>
          Introducing communities on <br /><strong>Job-Dekho</strong>
        </>
      ),
      paragraph: 'Join various communities to connect with professionals in your field and enhance your career prospects.',
      img: greetingImg1
    },
    {
      header: 'Get answers from verified professionals',
      paragraph: 'Consult with experts and get advice to navigate your career path effectively.',
      img: greetingImg2
    },
    {
      header: 'Get Job opportunities from Top Companies',
      paragraph: 'Explore numerous job opportunities tailored to your skills and preferences.',
      img: greetingImg3
    }
  ];
  

  if (!isAuthorized) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <AnimatePresence>
        {showGreeting && (
          <>
            <motion.div
              className="greeting-card-greetingCard"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.img
                src={slides[currentSlide].img}
                alt="Slide Image"
                className="greeting-image-greetingCard"
                key={currentSlide}
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
              <div className="dots-greetingCard">
                {slides.map((_, index) => (
                  <span
                    key={index}
                    className={`dot-greetingCard ${index === currentSlide ? 'active' : ''}`}
                    onClick={() => handleDotClick(index)}
                  ></span>
                ))}
              </div>
              <div className="greeting-text-box-greetingCard">
                <h2 className="greeting-title-greetingCard">{slides[currentSlide].header}</h2>
                <p className="greeting-message-greetingCard">{slides[currentSlide].paragraph}</p>
              </div>
              <button className="greeting-button-greetingCard" onClick={handleNextSlide}>
                {currentSlide < 2 ? 'Next' : 'Get Started'} <FaArrowRight className="arrow-icon" />
              </button>
            </motion.div>
            <div className="overlay"></div>
          </>
        )}
      </AnimatePresence>
      <section className={`homePage-home page-home ${showGreeting ? 'blurred' : ''}`}>
        <HeroSection />
        <HowItWorks />
        <PopularCategories />
        <PopularCompanies />
      </section>
    </>
  );
};

export default Home;
