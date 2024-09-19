import React, { useEffect, useState } from "react";
import "./FormMultipleSelect.scss";
import RemoveIcon from "@mui/icons-material/Close";

export const FormMultipleSelect = ({
  selected,
  setSelected,
  options,
  name,
}) => {
  const [selectOpen, setSelectOpen] = useState(false);
  const [focused, setFocused] = useState(false);

  // document.onload.getElementById("recipe_form").addEventListener("mouseup", function (e) {
  //   let container = document.getElementById("multiple_select");
  //   if (!container.contains(e.target)) {
  //     setSelectOpen(false);
  //   }
  // });

  useEffect(() => {
    console.log(selected);
  }, [selected]);

  const handleClickOption = (option) => {
    if (!selected.includes(option)) {
      setSelected((prev) => [...prev, option]);
    } else {
      setSelected(selected.filter((item) => item !== option));
    }
  };

  const handleRemoveOption = (option) => {
    setSelected(selected.filter((item) => item !== option));
  };
  return (
    <div className="formMultipleSelect" id="multiple_select">
      <div
        className="multiple_select"
        onClick={(e) => {
          e.stopPropagation;
          setSelectOpen(!selectOpen);
          setFocused(!focused);
        }}
      >
        {selectOpen && (
          <div className="options_list">
            {options.map((opt) => (
              <div
                key={opt.id}
                
                className={
                  "option" + (selected.includes(opt.name) ? " active" : "")
                }
                onClick={(e) => {
                  e.stopPropagation();
                  handleClickOption(opt.name);
                }}
              >
                {opt.name}
              </div>
            ))}
          </div>
        )}
        <div className="options_selected">
          {selected.length !== 0 ? (
            selected.map((item, index) => (
              <div key={index} className="option_selected">
                <div className="item" id={index}>
                  {item}
                </div>
                <div
                  className="remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveOption(item);
                  }}
                >
                  <RemoveIcon className="icon" />
                </div>
              </div>
            ))
          ) : (
            <div className="none_selected">Категорії не обрані</div>
          )}
        </div>
        <input
          name={name}
          value={selected ? selected.toString() : ""}
          readOnly={true}
          required
        />
      </div>
    </div>
  );
};
