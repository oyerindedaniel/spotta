"use client";

import { useEffect, useState } from "react";

const AutoCounter = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
    }, 1000); // Increase count every second

    // Cleanup function to clear the interval when component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures the effect runs only once

  return (
    <div className="bg-red-800">
      <h2>Auto Counter</h2>
      <p>Count: {count}</p>
    </div>
  );
};

export default AutoCounter;
