import React, { useEffect, useState } from "react";
import "./Reviews.scss";
import Review from "../review/Review";
import { makeRequest } from "../../axi";
import useAuthStore from "../../stores/authStore";
import { useParams } from "react-router-dom";

const Reviews = ({refetchR, setRefetchR}) => {
  const { currentUser } = useAuthStore();

  const [reviews, setReviews] = useState([]);

  const params = useParams();

  useEffect(() => {
    fetchReviewsByRecipe();
  }, []);

  
  useEffect(() => {
    fetchReviewsByRecipe();
  }, [refetchR]);

  const handleClick = async (e) => {
    e.preventDefault();
  };

  const fetchReviewsByRecipe = async () => {
    try {
      const response = await makeRequest.get("/reviews/byusernrecipe", {
        params: { recipeId: params.recipeId, userId: currentUser && currentUser.id },
      });
      setReviews(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Failed to fetch reviews by recipe:", error);
      throw error;
    }
  };

  return (
    <div className="reviews">
      {reviews.map((review) => (
        <Review key={review.id} review={review} setRefetchR={setRefetchR}/>
      ))}
    </div>
  );
};

export default Reviews;
