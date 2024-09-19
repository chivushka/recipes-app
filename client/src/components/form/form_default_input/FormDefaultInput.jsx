import React, { useEffect, useState } from "react";
import "./FormDefaultInput.scss";
import ClearIcon from "@mui/icons-material/Clear";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

const FormDefaultInput = (props) => {
  const [focused, setFocused] = useState(false);
  const [stepImg, setStepImg] = useState(null);
  const {
    label,
    errorMessage,
    onChange,
    onDelete,
    id,
    images,
    img,
    ...inputProps
  } = props;

  const handleFocus = (e) => {
    setFocused(true);
  };
  useEffect(() => {}, []);

  return (
    <div className="formDefaultInput" id={id.toString()}>
      <div className="inside">
        <div className="top">
          <div className="input_container">
            <input
              {...inputProps}
              name={props.name}
              onChange={onChange}
              focused={focused.toString()}
              onBlur={handleFocus}
            />
            <div className="error">{errorMessage}</div>
          </div>
          <button type="button" onClick={() => onDelete(id)}>
            <ClearIcon style={{ fontSize: "20px" }} className="icon" />
          </button>
        </div>
        {images && (
          <>
            {
              (stepImg !==null || (props.img !== null && props.img !== "NULL" && props.img !== undefined)) && (
                <img
                  className="file"
                  alt=""
                  src={
                    stepImg
                      ? URL.createObjectURL(stepImg)
                      : `/upload/${props.img}`
                  }
                />
              )}
            <label htmlFor={"img" + props.name}>
              <div className="item">
                <AddPhotoAlternateIcon className="icon" />
                <div>Додати фото</div>
              </div>
            </label>
            <input
              type="file"
              id={"img" + props.name}
              name={"img" + props.name}
              style={{ display: "none" }}
              onChange={(e) => setStepImg(e.target.files[0])}
            />
            <input
              type="text"
              name={"id" + props.name}
              style={{ display: "none" }}
              value={props.stepId}
              readOnly={true}
            />
            <input
              type="text"
              name={"pimg" + props.name}
              style={{ display: "none" }}
              value={props.img}
              readOnly={true}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default FormDefaultInput;
