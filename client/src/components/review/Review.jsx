import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import moment from "moment";
import "./Review.scss";
import useAuthStore from "../../stores/authStore";
import StarIcon from "@mui/icons-material/Star";
import { makeRequest } from "../../axi";

const Review = ({ review, setRefetchR }) => {
  const starsArr = [1, 2, 3, 4, 5];

  const { currentUser } = useAuthStore();
  const [rateWidth, setRateWidth] = useState("");

  const handleDelete = async (e) => {
    e.preventDefault();
    const deleteReview = confirm("Впевнені що хочете видалити?");
    console.log(deleteReview);
    if (deleteReview) {
      try {
        await deleteOwnReview();
        setRefetchR((prevState) => !prevState);
      } catch (error) {
        console.error("Помилка при видаленні відгуку:", error);
      }
    }
  };

  const deleteOwnReview = async () => {
    try {
      const response = await makeRequest.delete(
        `/reviews/userdelete?userId=${currentUser.id}`,
        {
          params: { reviewId: review.id },
        }
      );
    } catch (error) {
      console.error("Failed to delete review:", error);
      throw error;
    }
  };

  useEffect(() => {
    const width = (100 * +review.rating) / 5;
    setRateWidth(width.toString() + "%");
  }, []);

  return (
    <div className="review_container">
      <div className="user">
        <div className="userInfo">
          <img
            src={
              review.profilePic !== "NULL"
                ? "/upload/" + review.profilePic
                : "/images/cookdefault.jpg"
            }
            alt=""
          />
          <div className="details">
            <Link
              to={`/cook/${review.userId}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <span className="name">{review.name}</span>
            </Link>
            <span className="date">
              {moment(review.createdAt).format("DD.MM.YYYY")}
            </span>
          </div>
        </div>
        {currentUser && currentUser.id == review.userId && (
          <DeleteIcon className="icon" onClick={handleDelete} />
        )}
      </div>
      <div className="content">
        {review.status == "Submitted" && (
          <div className="montserrat-alternates-medium status">
            Запропоновано вами
          </div>
        )}
        <div className="stars">
          <div className="stars__nofill">
            {starsArr.map((star, index) => (
              <StarIcon
                className="icon"
                key={index}
                style={{ color: "#FFCDCD", fontSize: "22px" }}
                onClick={(e) => {
                  e.stopPropagation;
                  setRate(index + 1);
                }}
              />
            ))}
            <div className="stars__filled" style={{ width: rateWidth }}>
              {starsArr.map((star, index) => (
                <StarIcon
                  className="icon"
                  key={index}
                  style={{ color: "#E70000", fontSize: "22px" }}
                  onClick={(e) => {
                    e.stopPropagation;
                    setRate(index + 1);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <p>{review.text}</p>
        <img src={"/upload/" + review.img} alt="" />
      </div>
    </div>
  );
};

export default Review;
