import React, { useState, useEffect } from 'react';

function Timer({ endDate }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timerID = setInterval(() => {
      setCurrentTime(new Date()); // Update current time every second
    }, 1000);

    return () => {
      clearInterval(timerID); // Cleanup interval on component unmount
    };
  }, []);

  const calculateRemainingTime = () => {
    const endTime = new Date(endDate);
    const timeDiff = endTime - currentTime;
    if (timeDiff <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    let remainingSeconds = Math.floor(timeDiff / 1000);
    const hours = Math.floor(remainingSeconds / 3600);
    remainingSeconds %= 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    return { hours, minutes, seconds };
  };

  const { hours, minutes, seconds } = calculateRemainingTime();

  return (
    <div>
      <p>
        {hours} hours, {minutes} minutes, {seconds} seconds
      </p>
    </div>
  );
}

export default Timer;



