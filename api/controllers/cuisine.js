import { db } from "../connect.js";

export const addCuisine = (req, res) => {
  const q = "INSERT INTO cuisines (`name`,`text`,`img`) VALUE (?)";
  if (req.body.img == null) {
    req.body.img = "";
  }
  const values = [req.body.name, req.body.text, req.body.img];

  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Cuisine has been created");
  });
};



export const getCuisine = (req, res) => {
  const q = "SELECT * FROM cuisines WHERE id = ?";

  db.query(q, [+req.query.cuisineId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const getCuisinesAll = (req, res) => {
  const { sort } = req.query;
  let q = "SELECT * FROM cuisines c";
  if (sort) {
    const [sortField, sortOrder] = sort.split(" ");
    if (
      sortField &&
      sortOrder &&
      (sortOrder.toLowerCase() === "asc" || sortOrder.toLowerCase() === "desc")
    ) {
      q += ` ORDER BY c.${sortField} ${sortOrder.toUpperCase()}`;
    }
  }

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const getCuisinesAdmin = (req, res) => {
  const { sort, page = 1, pageSize = 10 } = req.query;

  let countQuery = "SELECT COUNT(*) AS total FROM cuisines";
  let dataQuery = "SELECT * FROM cuisines";
  let sortQuery = "";
  let values = [];

  // Сортування
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

    const totalCuisines = countResult[0].total;
    const totalPages = Math.ceil(totalCuisines / pageSize);

    const limitValue = parseInt(pageSize);
    const offsetValue = (parseInt(page) - 1) * limitValue;

    dataQuery += `${sortQuery} LIMIT ? OFFSET ?`;
    values = [limitValue, offsetValue];

    db.query(dataQuery, values, (err, dataResult) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json({
        total: totalCuisines,
        totalPages: totalPages,
        cuisines: dataResult,
      });
    });
  });
};

export const updateCuisine = (req, res) => {
  const cuisineId = +req.params.cuisineId;

  const q = "UPDATE cuisines SET name=?, text=?, img=? WHERE id=?";

  // Перевірка, чи вказано зображення; якщо ні, використовується значення за замовчуванням
  let img = req.body.img;
  if (img == null) {
    img = "";
  }

  const values = [req.body.name, req.body.text, img, cuisineId];

  db.query(q, values, (err, data) => {
    if (err) {
      return res.status(500).json({
        message: "Error updating cuisine",
        error: err,
      });
    }
    if (data.affectedRows > 0) {
      return res.status(200).json({ message: "Cuisine updated successfully" });
    } else {
      return res.status(404).json({ message: "Cuisine not found" });
    }
  });
};

export const deleteCuisine = async (req, res) => {
  const cuisineId = +req.params.cuisineId;

  const q = "DELETE FROM cuisines WHERE id = ?";

  db.query(q, [cuisineId], (err, result) => {
    if (err) {
      // Перевірка коду помилки MySQL на обмеження зовнішнього ключа (ER_ROW_IS_REFERENCED_2)
      if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(400).json({
          message: "Cannot delete cuisine because it is referenced by existing recipes.",
          error: err,
        });
      } else {
        return res.status(500).json({
          message: "Error deleting cuisine",
          error: err,
        });
      }
    }

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "Cuisine deleted successfully" });
    } else {
      return res.status(404).json({ message: "Cuisine not found" });
    }
  });
};

