import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const addDirections = (req, res) => {
  const q = "INSERT INTO directions (recipeId, text, img, orderNum) VALUES ?";

  const directions = req.body.directions;

  const values = directions.map((direction,index) => [
    req.query.recipeId,
    direction.text,
    direction.img,
    index
  ]);

  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Directions have been added");
  });
};

export const updateDirections = (req, res) => {
  // Запити для виконання операцій з базою даних
  const selectQuery = "SELECT * FROM directions WHERE recipeId = ?";
  const deleteQuery = "DELETE FROM directions WHERE id IN (?)";
  const updateQuery = "UPDATE directions SET text = ?, img = ?, orderNum = ? WHERE id = ?";
  const insertQuery = "INSERT INTO directions (recipeId, text, img, orderNum) VALUES (?, ?, ?, ?)";
  const recipeId = req.query.recipeId;
  const newDirections = req.body.directions;

  console.log(newDirections);

  // Крок 1: Отримати існуючі напрями з бази даних
  db.query(selectQuery, [recipeId], (err, existingDirections) => {
    if (err) return res.status(500).json(err);

    // Створюємо мапи для існуючих та нових напрямів
    const existingDirectionsMap = new Map(existingDirections.map(direction => [direction.id, direction]));
    const newDirectionsMap = new Map(newDirections.map((direction, index) => [(direction.id || `new_${index}`), {...direction, orderNum: index + 1}]));

    // Крок 2: Збираємо ID напрямів, які потрібно видалити
    const idsToDelete = [];
    for (const [id, direction] of existingDirectionsMap) {
      if (!newDirectionsMap.has(id)) {
        idsToDelete.push(id);
      }
    }

    // Видаляємо напрями, які більше не потрібні
    if (idsToDelete.length > 0) {
      db.query(deleteQuery, [idsToDelete], (err) => {
        if (err) return res.status(500).json(err);
      });
    }

    // Крок 3: Розділяємо напрями на ті, що потрібно оновити та вставити
    const directionsToUpdate = [];
    const directionsToInsert = [];

    newDirections.forEach((direction, index) => {
      const id = direction.id;
      const img = direction.img || null;
      const orderNum = index + 1;

      if (id && existingDirectionsMap.has(id)) {
        directionsToUpdate.push({ id, text: direction.text, img, orderNum });
      } else {
        directionsToInsert.push({ recipeId, text: direction.text, img, orderNum });
      }
    });

    // Крок 4: Оновлюємо існуючі напрями
    directionsToUpdate.forEach(direction => {
      db.query(updateQuery, [direction.text, direction.img, direction.orderNum, direction.id], (err) => {
        if (err) return res.status(500).json(err);
      });
    });

    // Крок 5: Вставляємо нові напрями
    directionsToInsert.forEach(direction => {
      db.query(insertQuery, [direction.recipeId, direction.text, direction.img, direction.orderNum], (err) => {
        if (err) return res.status(500).json(err);
      });
    });

    // Повертаємо успішну відповідь
    res.status(200).json("Directions have been updated");
  });
};


export const getDirectionsByRecipe = (req, res) => {
  const recipeId = req.query.recipeId;
  const q = "SELECT * FROM directions where recipeId = ? ORDER BY orderNum";

  db.query(q, [recipeId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};
