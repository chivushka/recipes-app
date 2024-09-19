import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const addIngredient = (req, res) => {
  const q = "INSERT INTO ingredients (recipeId, text, orderNum) VALUE (?)";
  const values = [req.query.recipeId, req.body.text, req.body.orderNum];

  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Ingredient has been created");
  });
};

export const addIngredients = (req, res) => {
  const q = "INSERT INTO ingredients (recipeId, text) VALUES ?";
  const ingredients = req.body.ingredients;

  const values = ingredients.map((ingredient, index) => [
    req.query.recipeId,
    ingredient.text,
  ]);

  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Ingredients have been created");
  });
};

export const updateIngredients = (req, res) => {
  const deleteQuery = "DELETE FROM ingredients WHERE recipeId = ?";
  const insertQuery = "INSERT INTO ingredients (recipeId, text) VALUES ?";
  const recipeId = req.query.recipeId;
  const ingredients = req.body.ingredients;

  db.query(deleteQuery, [recipeId], (err, data) => {
    if (err) return res.status(500).json(err);

    const values = ingredients.map((ingredient) => [recipeId, ingredient.text]);

    db.query(insertQuery, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Ingredients have been replaced");
    });
  });
};


export const updateIngredient = (req, res) => {
  const q = "UPDATE ingredients SET text = ?, orderNum = ? WHERE id = ?";

  db.query(q, [req.body.text, req.body.orderNum, req.query.id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Ingredient has been updated by admin");
  });
};

export const deleteIngredient = (req, res) => {
  const id = req.query.id;
  const q = "DELETE FROM ingredients WHERE id = ?";
  db.query(q, [id], (err, data) => {
    if (err) return res.status(500).json(err);
    else res.status(403).json("Ingredient has been deleted by admin");
  });
};

export const getIngredientsByRecipe = (req, res) => {
  const recipeId = req.query.id;
  const q = "SELECT * FROM ingredients WHERE recipeId = ?";

  db.query(q, [recipeId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};
