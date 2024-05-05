import React, { useState } from "react";
import toast from "react-hot-toast";

export const Input = ({ inputHandler, name, value: propValue, className, letter, dir = 'rtl', placeholder }) => {

  // Check if value prop is provided 
  // if provided then it means Input used in Edit form and has initial value
  const hasValue = propValue !== undefined;

  const [inputValue, setInputValue] = useState(hasValue ? propValue : '');

  const handleChange = (event) => {
    const value2 = event.target.value;

    if (!letter) {
      setInputValue(value2);
      return inputHandler(event);
    }

    if (letter === 'en') {
      const regex = /^[a-zA-Z ]*$/;
      if (regex.test(value2) || value2 === '') {
        console.log(value2);
        setInputValue(value2);
        inputHandler(event);
      } else {
        setInputValue('');
        toast.error(placeholder + ' را به انگلیسی وارد کنید ', { position: 'bottom-center' })
      }
    }

    if (letter === 'fa') {
      const regex = /^[' آابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی']+$/;
      if (regex.test(value2) || value2 === '') {
        setInputValue(value2);
        inputHandler(event);
      } else {
        toast.error(placeholder + ' را به فارسی وارد کنید ', { position: 'bottom-center' })
      }
    }

    if (letter === 'num') {
      const regex = /^[0-9]*$/;
      if (regex.test(value2) || value2 === '') {
        setInputValue(value2);
        inputHandler(event);
      } else {
        setInputValue('');
        toast.error(placeholder + ' راه به عدد وارد کنید ', { position: 'bottom-center' })
      }
    }

    if (letter === 'en-num') {
      const regex = /^[a-zA-Z0-9]*$/;
      if (regex.test(value2) || value2 === '') {
        setInputValue(value2);
        inputHandler(event);
      } else {
        setInputValue('');
        toast.error(placeholder + ' فقط شامل حروف و اعداد انگلیسی باشد ', { position: 'bottom-center' })
      }
    }

  };

  return (
    <div className="input-valid">
      <input
        dir={dir}
        required
        onChange={handleChange}
        type="text"
        value={hasValue ? propValue : inputValue} // Use propValue if provided, otherwise use internal state
        name={name}
        className={`form-control ${className}`}
        placeholder={placeholder} />
    </div>
  );
};
