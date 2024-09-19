import React, { useEffect, useState } from "react";
import "./FormRadioButtonGroup.scss";

const FormRadioButtonGroup = (props) => {
  const { label, onChange, id, opts, selectedOpt, ...SelectProps } = props;
  const [selected, setSelected] = useState(selectedOpt);

  const handleClick = (value) => {
    setSelected(value)
  };
  return (
    <div className="formRadioButtonGroup">
      {opts.map((opt) => (
        <div className="radio_item" key={opt.id}>
          <label className="radio_label">
            <input type="radio" name="status" value={opt.value} required checked={selected===opt.value} onClick={()=>handleClick(opt.value)}/>
            <span>{opt.name}</span>
          </label>
          <span className="info">{opt.info}</span>
        </div>
      ))}
    </div>
  );
};

export default FormRadioButtonGroup;
