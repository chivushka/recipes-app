import { db } from "../connect.js";
import moment from "moment";

export const addReview = (req, res) => {
  const q =
    "INSERT INTO reviews (userId, recipeId, rating, text, createdAt, status, img) VALUE (?)";
  const values = [
    req.user.id,
    req.body.recipeId,
    req.body.rating,
    req.body.text,
    moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    "Submitted",
    req.body.img,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Ingredient has been created");
  });
};


export const getReviewsByRecipe = (req, res) => {
  const { status, recipeId } = req.query;

  let q = `
      SELECT r.*, u.profilePic, u.name
      FROM reviews r
      JOIN users u ON r.userId = u.id
      WHERE r.recipeId = ?
    `;
  let values = [+recipeId];

  if (status) {
    q += " AND r.status = ?";
    values.push(status);
  }
  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const getReviewsByUser = (req, res) => {
  const { status, userId } = req.query;

  let q = `
      SELECT r.*, u.profilePic, u.name
      FROM reviews r
      JOIN users u ON r.userId = u.id
      WHERE r.userId = ?
    `;
  let values = [+userId];

  if (status) {
    q += " AND r.status = ?";
    values.push(status);
  }

  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const getReviewsByUserAndRecipe = (req, res) => {
  const { userId, recipeId } = req.query;

  let q = "";
  let values = [];

  if (userId) {
    q = `
      SELECT r.*, u.profilePic, u.name
      FROM reviews r
      JOIN users u ON r.userId = u.id
      WHERE r.userId = ? AND r.recipeId = ? AND r.status = 'Submitted'
      UNION
      SELECT r.*, u.profilePic, u.name
      FROM reviews r
      JOIN users u ON r.userId = u.id
      WHERE r.recipeId = ? AND r.status = 'Approved'
      ORDER BY CASE WHEN status = 'Submitted' THEN 0 ELSE 1 END, createdAt ASC
    `;
    values = [+userId, +recipeId, +recipeId];
  } else {
    q = `
      SELECT r.*, u.profilePic, u.name
      FROM reviews r
      JOIN users u ON r.userId = u.id
      WHERE r.recipeId = ? AND r.status = 'Approved'
      ORDER BY createdAt ASC
    `;
    values = [+recipeId];
  }

  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};


export const deleteOwnReview = (req, res) => {
  const { reviewId } = req.query;

  const q = "DELETE FROM reviews WHERE id = ? AND userId = ?";
  const values = [+reviewId, req.user.id];

  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.affectedRows === 0)
      return res
        .status(404)
        .json(
          "Review not found or you do not have permission to delete this review."
        );
    return res.status(200).json("Review has been deleted");
  });
};

export const deleteReview = async (req, res) => {
  const reviewId = +req.params.reviewId;

  const q = "DELETE FROM reviews WHERE id = ?";

  db.query(q, [reviewId], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Error deleting review",
        error: err,
      });
    }

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "Review deleted successfully" });
    } else {
      return res.status(404).json({ message: "Review not found" });
    }
  });
};


export const getReviewsApprovedCountByRecipe = (req, res) => {
  const { recipeId } = req.query;

  if (!recipeId) {
    return res.status(400).json({ error: "Recipe ID is required" });
  }

  const q = `
    SELECT COUNT(*) as count
    FROM reviews
    WHERE recipeId = ? AND status = 'Approved'
  `;

  db.query(q, [recipeId], (err, data) => {
    if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).json(data[0]);
  });
};

export const getReviewsAdmin = (req, res) => {
  const { sort, page = 1, pageSize = 10 } = req.query;

  let countQuery = "SELECT COUNT(*) AS total FROM reviews";
  let dataQuery = "SELECT * FROM reviews";
  let sortQuery = "";
  let values = [];

  // Додаємо умову сортування, якщо вона присутня
  if (sort) {
    const [sortField, sortOrder] = sort.split(" ");
    if (
      sortField &&
      sortOrder &&
      (sortOrder.toLowerCase() === "asc" || sortOrder.toLowerCase() === "desc")
    ) {
      sortQuery = ` ORDER BY ${sortField} ${sortOrder.toUpperCase()}`;
    }
  }

  db.query(countQuery, (err, countResult) => {
    if (err) return res.status(500).json(err);

    const totalReviews = countResult[0].total;
    const totalPages = Math.ceil(totalReviews / pageSize);

    const limitValue = parseInt(pageSize);
    const offsetValue = (parseInt(page) - 1) * limitValue;

    dataQuery += `${sortQuery} LIMIT ? OFFSET ?`;
    values.push(limitValue, offsetValue);

    db.query(dataQuery, values, (err, dataResult) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json({
        total: totalReviews,
        totalPages: totalPages,
        reviews: dataResult,
      });
    });
  });
};


export const approveReview = async (req, res) => {
  const reviewId = +req.params.reviewId;

  const q = "UPDATE reviews SET status = ? WHERE id = ?";

  db.query(q, ["Approved", reviewId], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Error approving review",
        error: err,
      });
    }

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "Review approved successfully" });
    } else {
      return res.status(404).json({ message: "Review not found" });
    }
  });
};

