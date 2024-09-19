import { db } from "../connect.js";

export const getSearchRecipesAndNews = (req, res, next) => {
  const { page = 1, pageSize = 10, stype, searchText } = req.query;

  let mainQuery = "";
  let mainValues = [];

  if (searchText) {
    if (stype === "name") {
      const searchQuery = `%${searchText}%`;
      mainQuery = `
        SELECT 'recipe' AS stype, r.id, r.title, r.intro, r.img, r.currentRating 
        FROM recipes r 
        WHERE r.status = 'Approved' AND r.title LIKE ?
        ORDER BY stype DESC, title
      `;
      mainValues = [searchQuery];
    } else if (stype === "ingredients") {
      const ingredientsArray = searchText.split(",");
      const ingredientsTrim = ingredientsArray.map(item => item.trim());
      mainQuery = `
        SELECT DISTINCT 'recipe' AS stype, r.id, r.title, r.intro, r.img, r.currentRating
        FROM recipes r
      `;
      ingredientsTrim.forEach((item, index) => {
        mainQuery += ` INNER JOIN ingredients i${index} ON r.id = i${index}.recipeId AND i${index}.text LIKE ?`;
        mainValues.push(`%${item}%`);
      });
      mainQuery += ` WHERE r.status = 'Approved'`;
    } else {
      return res.status(400).json({ message: "Invalid stype parameter" });
    }
  } else {
    mainQuery = `
      SELECT 'recipe' AS stype, r.id, r.title, r.intro, r.img, r.currentRating 
      FROM recipes r 
      WHERE r.status = 'Approved'
      ORDER BY stype DESC, title
    `;
  }

  const countQuery = `SELECT COUNT(*) AS total FROM (${mainQuery}) AS combined`;
  const countValues = [...mainValues];

  db.query(countQuery, countValues, (err, result) => {
    if (err) return res.status(500).json({ message: "Error counting total items", error: err });

    const totalItems = result[0].total;
    const totalPages = Math.ceil(totalItems / pageSize);

    const limit = parseInt(pageSize, 10);
    const offset = (parseInt(page, 10) - 1) * limit;

    const paginatedQuery = `${mainQuery} LIMIT ? OFFSET ?`;
    const paginatedValues = [...mainValues, limit, offset];

    db.query(paginatedQuery, paginatedValues, (err, data) => {
      if (err) return res.status(500).json({ message: "Error fetching paginated results", error: err });
      return res.status(200).json({ data, totalPages, totalItems });
    });
  });
};

