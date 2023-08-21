import React, { useState, useEffect } from 'react';

const Clock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
  };

  return (
    <div>
      <h2>Current Time: {formatTime(currentTime)}</h2>
    </div>
  );
};

export default Clock;
