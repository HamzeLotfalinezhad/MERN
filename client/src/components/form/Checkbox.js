import React, { useState } from "react";

export const Checkbox = ({ handleCheckboxChange, text, defaultChecked }) => {
  const [isChecked, setIsChecked] = useState(defaultChecked || false);

  const checkHandler = () => {
    setIsChecked(!isChecked);
    handleCheckboxChange(!isChecked); // Call the callback function to handle state changes in the parent component
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <input
        type="checkbox"
        id="checkbox"
        checked={isChecked}
        onChange={checkHandler}
      />
      <label htmlFor="checkbox" style={{ paddingRight: '5px' }}>{text}</label>
      {/* <p>The checkbox is {isChecked ? "checked" : "unchecked"}</p> */}
    </div>
  );
};
