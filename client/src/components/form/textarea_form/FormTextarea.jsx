import React, { useState } from 'react';
import "./FormTextarea.scss";

const FormTextarea = (props) => {
  const [focused, setFocused] = useState(false);
  const { label, errorMessage, onChange, id, ...textareaProps } = props;

  const handleFocus = (e) => {
    setFocused(true);
  };

  return (
    <div className="formTextarea">
      {label &&<label>{label}</label>}
      <textarea
        {...textareaProps}
        name={props.name}
        onChange={onChange}
        focused={focused.toString()}
        onBlur={handleFocus}
      />
      <span>{errorMessage}</span>
    </div>
  );
};

export default FormTextarea;