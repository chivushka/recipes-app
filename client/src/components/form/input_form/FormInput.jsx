import React, { useState } from 'react';
import "./FormInput.scss";

const FormInput = (props) => {
  const [focused, setFocused] = useState(false);
  const { label, errorMessage, onChange, id, ...inputProps } = props;

  const handleFocus = (e) => {
    setFocused(true);
  };

  return (
    <div className="formInput">
      {label &&<label>{label}</label>}
      <input
        {...inputProps}
        placeholder={props.placeholder}
        name={props.name}
        onChange={onChange}
        focused={focused.toString()}
        onBlur={handleFocus}
      />
      <span className='show_error'>{errorMessage}</span>
    </div>
  );
};

export default FormInput;
