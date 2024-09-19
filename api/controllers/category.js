import { db } from "../connect.js";

export const addCategory = (req, res) => {
  const q = "INSERT INTO categories (`name`) VALUE (?)";

  const values = [req.body.name];

  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Cuisine has been created");
  });
};

export const addCategoriesToRecipe = (req, res) => {
  const q = "INSERT INTO categories_recipes (categoryId, recipeId) VALUES ?";

  const categories = req.body.categories;

  const values = categories.map((category) => [
    category.id,
    req.query.recipeId,
  ]);

  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Categories have been added");
  });
};

export const updateCategoriesToRecipe = (req, res) => {
  const deleteQuery = "DELETE FROM categories_recipes WHERE recipeId = ?";
  const insertQuery = "INSERT INTO categories_recipes (categoryId, recipeId) VALUES ?";
  const recipeId = req.query.recipeId;
  const categories = req.body.categories;

  db.query(deleteQuery, [recipeId], (err, data) => {
    if (err) {
      return res.status(500).json({
        message: "Error deleting old categories",
        error: err,
      });
    }

    if (categories && categories.length > 0) {
      const values = categories.map((category) => [category.id, recipeId]);

      db.query(insertQuery, [values], (err, data) => {
        if (err) {
          return res.status(500).json({
            message: "Error inserting new categories",
            error: err,
          });
        }
        return res.status(200).json("Categories have been replaced");
      });
    } else {
      return res.status(200).json("No categories to insert, but old categories were deleted");
    }
  });
};


export const getCategories = (req, res) => {
  let q = "SELECT * FROM categories";

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};
