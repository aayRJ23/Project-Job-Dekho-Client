import React from "react";
import "./MyApplications.css";
import { AiOutlineClose, AiOutlineDownload } from "react-icons/ai";

const ResumeModal = ({ imageUrl, name, onClose }) => {
  const downloadResume = () => {
    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${name.split(' ')[0]}-resume.png`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      });
  };

  return (
    <div className="resume-modal">
      <div className="modal-content">
        <button className="close" onClick={onClose} aria-label="Close">
          <AiOutlineClose size={24} />
        </button>
        <div className="content-container">
          <img src={imageUrl} alt="resume" className="min-image" />
          <div className="modal-text-container">
            <p className="modal-resume-name">{name.split(' ')[0]}'s Resume</p>
            <button className="download-button" onClick={downloadResume}>
              <AiOutlineDownload size={20} className="download-icon" />
              Download Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeModal;
