import React from "react";
import { FaBuilding, FaSuitcase, FaUsers, FaUserPlus } from "react-icons/fa";
import './Home.css';

const HeroSection = () => {
  const details = [
    {
      id: 1,
      title: "1,23,441",
      subTitle: "Live Job",
      icon: <FaSuitcase />,
    },
    {
      id: 2,
      title: "91220",
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
    <>
      <div className="heroSection-hero">
        <div className="container-hero">
          <div className="title-hero">
            <h1>Find a job that suits</h1>
            <h1>your interests and skills</h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem
              voluptate repellat modi quidem aliquid eaque ducimus ipsa et,
              facere mollitia!
            </p>
          </div>
          <div className="image-hero">
            <img src="/heroS.jpg" alt="hero" />
          </div>
        </div>
        <div className="details-hero">
          {details.map((element) => {
            return (
              <div className="card-hero" key={element.id}>
                <div className="icon-hero">{element.icon}</div>
                <div className="content-hero">
                  <p>{element.title}</p>
                  <p>{element.subTitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default HeroSection;
