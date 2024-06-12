import React, { useState, useEffect, useContext } from 'react';
import { FaUser, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { Context } from "../../main";
import './Details.css';

const Details = () => {
  const [activeDetail, setActiveDetail] = useState(null);
  const [location, setLocation] = useState({ state: '', country: '' });
  const [dateTime, setDateTime] = useState({ date: '', time: '' });
  const { user } = useContext(Context);

  useEffect(() => {
    const fetchLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          const address = data.address;
          setLocation({ state: address.state, country: address.country });
          console.log(`${address.state} , ${address.country}`);
        });
      }
    };

    const fetchDateTime = () => {
      const now = new Date();
      const date = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      const time = now.toTimeString().split(' ')[0];
      setDateTime({ date, time });
    };

    fetchLocation();
    fetchDateTime();
  }, []);

  const handleIconClick = (detailType) => {
    setActiveDetail((prevDetail) => (prevDetail === detailType ? null : detailType));
  };

  return (
    <div className="details-container">
      <div className={`icon-wrapper ${activeDetail ? 'active' : ''}`}>
        <div
          className={`icon-container ${activeDetail === 'user' ? 'active' : ''}`}
          onClick={() => handleIconClick('user')}
        >
          <FaUser className="icon" />
          {activeDetail === 'user' && (
            <div className="details-panel">
              <p>{user.name}</p>
              <p>{user.phone}</p>
            </div>
          )}
        </div>

        <div
          className={`icon-container ${activeDetail === 'location' ? 'active' : ''}`}
          onClick={() => handleIconClick('location')}
        >
          <FaMapMarkerAlt className="icon" />
          {activeDetail === 'location' && (
            <div className="details-panel">
              <p>{location.state}, {location.country}</p>
            </div>
          )}
        </div>

        <div
          className={`icon-container ${activeDetail === 'time' ? 'active' : ''}`}
          onClick={() => handleIconClick('time')}
        >
          <FaClock className="icon" />
          {activeDetail === 'time' && (
            <div className="details-panel">
              <p>{dateTime.date}</p>
              <p>{dateTime.time}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Details;
