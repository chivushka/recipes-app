import { db } from "../connect.js";

export const getSaves = (req, res) => {
  const { recipeId } = req.query;
  const q = `SELECT userId FROM saved_recipes WHERE recipeId = ?`;

  db.query(q, [+recipeId], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) {
      return res.status(200).json([]);
    }
    return res.status(200).json(data.map((save) => save.userId));
  });
};

export const addSave = (req, res) => {
  const { userId, recipeId } = req.body;
  const q = "INSERT INTO saved_recipes (userId, recipeId) VALUES (?)";
  const values = [+userId, +recipeId];

  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Recipe was saved!");
  });
};

export const deleteSave = (req, res) => {
  const { userId, recipeId } = req.query;
  const q = "DELETE FROM saved_recipes WHERE userId = ? AND recipeId = ?";

  db.query(q, [userId, recipeId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Recipe was deleted from saved!");
  });
};

export const getSavedRecipes = (req, res) => {
  const { userId, page = 1, pageSize = 10 } = req.query;

  let countQuery = `
    SELECT COUNT(*) AS total
    FROM saved_recipes sr
    JOIN recipes r ON sr.recipeId = r.id
    WHERE sr.userId = ?
  `;
  let values = [+userId];

  db.query(countQuery, values, (err, countResult) => {
    if (err) return res.status(500).json(err);

    const totalRecipes = countResult[0].total;
    const totalPages = Math.ceil(totalRecipes / pageSize);

    const limitValue = parseInt(pageSize);
    const offsetValue = (parseInt(page) - 1) * limitValue;

    let dataQuery = `
      SELECT r.*
      FROM saved_recipes sr
      JOIN recipes r ON sr.recipeId = r.id
      WHERE sr.userId = ?
      LIMIT ? OFFSET ?
    `;
    const dataValues = [+userId, limitValue, offsetValue];

    db.query(dataQuery, dataValues, (err, dataResult) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json({
        total: totalRecipes,
        totalPages: totalPages,
        recipes: dataResult,
      });
    });
  });
};

