import { db } from "../connect.js";
import moment from "moment";

export const addRecipe = (req, res, next) => {
  const q =
    "INSERT INTO recipes(`title`,`userId`, `createdAt`,`updatedAt`,`cuisineId`,`cookTime`,`servings`, `difficulty`,`intro`,`img`,`status`,`userName`,`addInfo`, `tmeasure`) VALUES (?)";

  const values = [
    req.body.title,
    req.user.id,
    moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    req.body.cuisineId,
    req.body.cookTime,
    req.body.servings,
    req.body.difficulty,
    req.body.intro,
    req.body.img,
    req.body.status,
    req.body.username,
    req.body.addinfo,
    req.body.measure,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json({ insertId: data.insertId });
  });
};


export const updateRecipe = (req, res, next) => {
  console.log(req.body);

  const baseQuery = `
    UPDATE recipes
    SET title = ?, updatedAt = ?, cuisineId = ?, cookTime = ?, servings = ?, difficulty = ?, intro = ?, status = ?, userName = ?, addInfo = ?, tmeasure = ?
  `;

  const imgQuery = req.body.img ? `, img = ?` : ``;
  const query = `${baseQuery}${imgQuery} WHERE id = ?`;

  const baseValues = [
    req.body.title,
    moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    req.body.cuisineId,
    req.body.cookTime,
    req.body.servings,
    req.body.difficulty,
    req.body.intro,
    req.body.status,
    req.body.username,
    req.body.addinfo,
    req.body.measure,
  ];

  const values = req.body.img
    ? [...baseValues, req.body.img, req.query.recipeId]
    : [...baseValues, req.query.recipeId];

  db.query(query, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Recipe has been updated");
  });
};

export const getRecipesAll = (req, res, next) => {
  const q = "SELECT * FROM recipes";

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const getRecipe = (req, res, next) => {
  const { id, type, userId } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Recipe ID is required" });
  }

  let values = [id];
  let typeQuery = "";

  if (userId) {
    typeQuery += " AND userId = ?";
    values.push(userId);
  }

  switch (type) {
    case "approved":
      typeQuery += " AND status = 'Approved'";
      break;
    case "submitted":
      typeQuery += " AND status = 'Submitted'";
      break;
    case "profile":
      typeQuery +=
        " AND (status = 'Public' OR status = 'Submitted' OR status = 'Rejected')";
      break;
    case "private":
      typeQuery += " AND status = 'Private'";
      break;
    default:
      break;
  }

  const recipeQuery = "SELECT * FROM recipes WHERE id = ?" + typeQuery;
  const ingredientsQuery = "SELECT * FROM ingredients WHERE recipeId = ?";
  const directionsQuery = "SELECT * FROM directions WHERE recipeId = ?";
  const categoriesQuery = "SELECT * FROM categories_recipes WHERE recipeId = ?";

  db.query(recipeQuery, values, (err, recipeData) => {
    if (err)
      return res
        .status(500)
        .json({ error: "Failed to fetch recipe", details: err });
    if (recipeData.length === 0)
      return res.status(404).json({ error: "Recipe not found" });

    const recipe = recipeData[0];

    db.query(ingredientsQuery, [id], (err, ingredientsData) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Failed to fetch ingredients", details: err });

      db.query(directionsQuery, [id], (err, directionsData) => {
        if (err)
          return res
            .status(500)
            .json({ error: "Failed to fetch directions", details: err });

        db.query(categoriesQuery, [id], (err, categoriesData) => {
          if (err)
            return res
              .status(500)
              .json({ error: "Failed to fetch categories", details: err });

          const data = {
            ...recipe,
            ingredients: ingredientsData,
            directions: directionsData,
            categories: categoriesData,
          };

          return res.status(200).json(data);
        });
      });
    });
  });
};

export const getMainRecipes = (req, res, next) => {
  const { type = "popular", limit = 10 } = req.query;

  let orderByClause = "";

  if (type === "latest") {
    orderByClause = "updatedAt DESC";
  } else if (type === "popular") {
    orderByClause = "currentRating DESC";
  }

  const q = `SELECT * FROM recipes r WHERE r.status = 'Approved' ORDER BY ${orderByClause} LIMIT ?`;

  db.query(q, [+limit], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const getMostPopularRecipes = (req, res, next) => {
  const { limit = 10 } = req.query;

  const q = `SELECT * FROM recipes WHERE r.status = 'Approved' ORDER BY popularity DESC LIMIT ?`;

  db.query(q, [limit], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const getRecipesFilter = (req, res, next) => {
  const {
    page = 1,
    pageSize = 10,
    sort,
    category,
    cuisine,
    difficulty,
    level,
    time,
  } = req.query;

  let q = "SELECT COUNT(DISTINCT r.id) AS total FROM recipes r";
  let conditions = ["r.status = 'Approved'"];
  let values = [];

  if (category) {
    q += " INNER JOIN categories_recipes cr ON r.id = cr.recipeId";
    conditions.push("cr.categoryId = ?");
    values.push(+category);
  }

  if (level) {
    q += " INNER JOIN users u ON r.userId = u.id";
    conditions.push("u.level = ?");
    values.push(level);
  }

  if (cuisine) {
    conditions.push("r.cuisineId = ?");
    values.push(cuisine);
  }

  if (difficulty) {
    conditions.push("r.difficulty = ?");
    values.push(difficulty);
  }

  if (time) {
    const [minTime, maxTime] = time.split(" ").map((t) => parseInt(t));
    if (!isNaN(minTime)) {
      conditions.push("r.cookTime >= ?");
      values.push(minTime);
    }
    if (!isNaN(maxTime)) {
      conditions.push("r.cookTime <= ?");
      values.push(maxTime);
    }
  }

  if (conditions.length > 0) {
    q += ` WHERE ${conditions.join(" AND ")}`;
  }

  db.query(q, values, (err, result) => {
    if (err) return res.status(500).json(err);

    const totalRecipes = result[0].total;
    const totalPages = Math.ceil(totalRecipes / pageSize);

    const limit = parseInt(pageSize);
    const offset = (parseInt(page) - 1) * limit;

    let mainQuery = "SELECT DISTINCT r.* FROM recipes r";
    let mainValues = [...values];

    if (category) {
      mainQuery += " INNER JOIN categories_recipes cr ON r.id = cr.recipeId";
    }

    if (level) {
      mainQuery += " INNER JOIN users u ON r.userId = u.id";
    }

    if (conditions.length > 0) {
      mainQuery += ` WHERE ${conditions.join(" AND ")}`;
    }

    if (sort) {
      const [sortField, sortOrder] = sort.split(" ");
      if (
        sortField &&
        sortOrder &&
        (sortOrder.toLowerCase() === "asc" ||
          sortOrder.toLowerCase() === "desc")
      ) {
        mainQuery += ` ORDER BY r.${sortField} ${sortOrder.toUpperCase()}`;
      }
    } else {
      mainQuery += ` ORDER BY r.title`;
    }

    mainQuery += ` LIMIT ? OFFSET ?`;
    mainValues.push(limit, offset);

    db.query(mainQuery, mainValues, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json({ data, totalPages, totalRecipes });
    });
  });
};

export const getRecipesByUserForProfile = (req, res, next) => {
  const {
    userId,
    notstatus,
    page = 1,
    pageSize = 8,
    order,
    by = "desc",
  } = req.query;

  let countQuery = "SELECT COUNT(*) AS total FROM recipes r WHERE userId = ? ";
  let values = [+userId];

  if (notstatus) {
    countQuery += "AND status != ?";
    values.push(notstatus);
  }

  db.query(countQuery, values, (err, countResult) => {
    if (err) return res.status(500).json(err);

    const totalRecipes = countResult[0].total;
    const totalPages = Math.ceil(totalRecipes / pageSize);

    const limitValue = parseInt(pageSize);
    const offsetValue = (parseInt(page) - 1) * limitValue;

    let dataQuery = "SELECT * FROM recipes r WHERE userId = ?";
    const dataValues = values;
    if (notstatus) {
      dataQuery += " AND status != ?";
    }
    if (order) {
      dataQuery += `  ORDER BY r.${order} ${by.toUpperCase()}`;
    }

    dataQuery += "  LIMIT ? OFFSET ?";
    dataValues.push(limitValue);
    dataValues.push(offsetValue);

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

export const getRecipesAdmin = (req, res) => {
  const { sort, status, page = 1, pageSize = 10 } = req.query;

  let countQuery = "SELECT COUNT(*) AS total FROM recipes";
  let dataQuery = "SELECT * FROM recipes";
  let sortQuery = "";
  let values = [];

  // Додаємо умову для статусу, якщо він присутній
  if (status) {
    countQuery += " WHERE status = ?";
    dataQuery += " WHERE status = ?";
    values.push(status);
  }

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

  db.query(countQuery, values, (err, countResult) => {
    if (err) return res.status(500).json(err);

    const totalRecipes = countResult[0].total;
    const totalPages = Math.ceil(totalRecipes / pageSize);

    const limitValue = parseInt(pageSize);
    const offsetValue = (parseInt(page) - 1) * limitValue;

    dataQuery += `${sortQuery} LIMIT ? OFFSET ?`;
    values.push(limitValue, offsetValue);

    db.query(dataQuery, values, (err, dataResult) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json({
        total: totalRecipes,
        totalPages: totalPages,
        recipes: dataResult,
      });
    });
  });
};

export const deleteRecipe = async (req, res) => {
  const recipeId = +req.params.recipeId;
  console.log(recipeId)

  const q = "DELETE FROM recipes WHERE id = ?";

  db.query(q, [recipeId], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Error deleting recipe",
        error: err,
      });
    }

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "Recipe deleted successfully" });
    } else {
      return res.status(404).json({ message: "Recipe not found" });
    }
  });
};

export const approveRecipe = async (req, res) => {
  const recipeId = +req.params.recipeId;

  // Поточний час для поля confirmedAt
  const confirmedAt = new Date();

  const q = "UPDATE recipes SET status = ?, confirmedAt = ? WHERE id = ?";

  db.query(q, ["Approved", confirmedAt, recipeId], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Error approving recipe",
        error: err,
      });
    }

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "Recipe approved successfully" });
    } else {
      return res.status(404).json({ message: "Recipe not found" });
    }
  });
};

export const rejectRecipe = async (req, res) => {
  const recipeId = +req.params.recipeId;

  const q = "UPDATE recipes SET status = ? WHERE id = ?";

  db.query(q, ["Rejected", recipeId], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Error rejecting recipe",
        error: err,
      });
    }

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "Recipe rejected successfully" });
    } else {
      return res.status(404).json({ message: "Recipe not found" });
    }
  });
};


// export const getRecipesByCuisine = (req, res, next) => {

//     const { page = 1, pageSize = 10, cuisineId } = req.query;
//     const q = "SELECT * FROM recipes WHERE cuisineId = ?";

//     db.query(q, [+cuisineId], (err, data) => {
//         if (err) return res.status(500).json(err);
//         return res.status(200).json(data)

//     })
// }
