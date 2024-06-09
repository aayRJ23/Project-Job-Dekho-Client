import React from "react";
import { FaMicrosoft, FaApple, FaGoogle, FaFacebook, FaAmazon, FaLinkedin } from "react-icons/fa";
import './Home.css';

const PopularCompanies = () => {
  const companies = [
    {
      id: 1,
      title: "Microsoft",
      location: "Bangalore, India",
      openPositions: 10,
      icon: <FaMicrosoft />,
    },
    {
      id: 2,
      title: "Google",
      location: "Hyderabad, India",
      openPositions: 15,
      icon: <FaGoogle />,
    },
    {
      id: 3,
      title: "Facebook",
      location: "Mumbai, India",
      openPositions: 8,
      icon: <FaFacebook />,
    },
    {
      id: 4,
      title: "Amazon",
      location: "Chennai, India",
      openPositions: 20,
      icon: <FaAmazon />,
    },
    {
      id: 5,
      title: "Apple",
      location: "Pune, India",
      openPositions: 5,
      icon: <FaApple />,
    },
    {
      id: 6,
      title: "LinkedIn",
      location: "Delhi, India",
      openPositions: 12,
      icon: <FaLinkedin />,
    },
  ];

  return (
    <div className="companies-popularCompanies">
      <div className="container-popularCompanies">
        <h3>TOP COMPANIES</h3>
        <div className="banner-popularCompanies">
          {companies.map((element) => {
            return (
              <div className="card-popularCompanies" key={element.id}>
                <div className="content-popularCompanies">
                  <div className="icon-popularCompanies">{element.icon}</div>
                  <div className="text-popularCompanies">
                    <p>{element.title}</p>
                    <p>{element.location}</p>
                  </div>
                </div>
                <button>Open Positions {element.openPositions}</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PopularCompanies;
