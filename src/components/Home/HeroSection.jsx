import React from "react";
import { FaBuilding, FaSuitcase, FaUsers, FaUserPlus } from "react-icons/fa";
import './Home.css';

const HeroSection = () => {
  const details = [
    {
      id: 1,
      title: "1,23,441",
      subTitle: "Live Jobs",
      icon: <FaSuitcase />,
    },
    {
      id: 2,
      title: "91,220",
      subTitle: "Companies",
      icon: <FaBuilding />,
    },
    {
      id: 3,
      title: "2,34,200",
      subTitle: "Job Seekers",
      icon: <FaUsers />,
    },
    {
      id: 4,
      title: "1,03,761",
      subTitle: "Employers",
      icon: <FaUserPlus />,
    },
  ];
  return (
    <div className="heroSection-hero">
      <div className="container-hero">
        <div className="title-hero">
          <h1>Unlock Your <br/>Dream Career <br/> with <span className="herosection-title">Job Dekho</span></h1>
          <p>
            Discover Oppurtunities, Connect with People, And Take the next step towards fullfiling work life.
          </p>
        </div>
        <div className="image-hero">
          <img src="/herosection2.png" alt="hero" />
        </div>
      </div>
      <div className="details-hero">
        {details.map((element) => {
          return (
            <div className="card-hero" key={element.id}>
              <div className="content-hero">
                <div className="icon-hero">{element.icon}</div>
                <div className="text-hero">
                  <p>{element.title}</p>
                  <p>{element.subTitle}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HeroSection;
