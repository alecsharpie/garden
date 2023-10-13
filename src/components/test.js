import React, { useState, useEffect } from "react";

const TestComponent = () => {
  const [testState, setTestState] = useState([]);

  useEffect(() => {
    const initialArray = [1, 2, 3];
    setTestState(initialArray);
  }, []);

  useEffect(() => {
    console.log(testState);
  }, [testState]);

  return <div>Test Component</div>;
};

export default TestComponent;
