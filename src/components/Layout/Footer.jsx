import React, { useContext } from "react";
import { Context } from "../../main";
import { Link } from "react-router-dom";
import { FaFacebookF, FaYoutube, FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import "./Footer.css"; // Import the CSS file

const Footer = () => {
  const { isAuthorized } = useContext(Context);
  return (
    <footer className={`footer ${isAuthorized ? "footerShow" : "footerHide"}`}>
      <div className="footerContent">
        <div>&copy; All Rights Reserved By - Team Job Dekho ❤️</div>
        <div className="connectText">Connect with us:</div>
        <div className="socialLinks">
          <Link to={"https://www.facebook.com/"} target="_blank" className="socialIcon facebook">
            <FaFacebookF />
          </Link>
          <Link to={"https://www.youtube.com"} target="_blank" className="socialIcon youtube">
            <FaYoutube />
          </Link>
          <Link to={"https://www.linkedin.com"} target="_blank" className="socialIcon linkedin">
            <FaLinkedin />
          </Link>
          <Link to={"https://www.instagram.com"} target="_blank" className="socialIcon instagram">
            <RiInstagramFill />
          </Link>
          <Link to={"https://www.github.com"} target="_blank" className="socialIcon github">
            <FaGithub />
          </Link>
          <Link to={"https://www.twitter.com"} target="_blank" className="socialIcon twitter">
            <FaTwitter />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
