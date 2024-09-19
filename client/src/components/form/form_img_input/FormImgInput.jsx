import React, { useEffect, useState } from "react";
import "./FormImgInput.scss";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

const FormImgInput = (props) => {
  const [focused, setFocused] = useState(false);
  const [recipeImg, setRecipeImg] = useState(null);

  //   useEffect(() => {
  //     console.log(props.img)
  //   }, []);

  return (
    <div className="formImgInput">
      <label htmlFor={props.name}>
        {((recipeImg !== null || recipeImg !== "") && props.img !== null) && (
          <img
            className="file"
            alt=""
            src={
              recipeImg
                ? URL.createObjectURL(recipeImg)
                : `/upload/${props.img}`
            }
          />
        )}
        <div className="item">
          <AddPhotoAlternateIcon className="icon" />
          <div>Додати фото</div>
        </div>
      </label>
      <input
        type="file"
        id={props.name}
        name={props.name}
        style={{ display: "none" }}
        onChange={(e) => setRecipeImg(e.target.files[0])}
      />
    </div>
  );
};

export default FormImgInput;
