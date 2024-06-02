import React from "react";
import "./MyApplications.css";

const ResumeModal = ({ imageUrl, name, onClose }) => {
  return (
    <div className="resume-modal">
      <div className="modal-content">
        <button className="close" onClick={onClose} aria-label="Close">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path d="M12 10.585l4.95-4.95 1.415 1.415-4.95 4.95 4.95 4.95-1.415 1.415-4.95-4.95-4.95 4.95-1.415-1.415 4.95-4.95-4.95-4.95L7.05 5.635z" />
          </svg>
        </button>
        <img src={imageUrl} alt="resume" className="min-image" />
        <p className="modal-resume-name">{name.split(' ')[0]}'s Resume</p>
      </div>
    </div>
  );
};

export default ResumeModal;
