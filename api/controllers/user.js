import { db } from "../connect.js";

export const getUser = async (req, res) => {
  const userId = +req.params.userId;
  const q = "SELECT * FROM users WHERE id = ?";

  db.query(q, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    if (!(data && data.length > 0)) return res.status(500).json(err);
    const { password, ...info } = data[0];
    return res.json(info);
  });
};

export const getUsers = async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;

  let countQuery = "SELECT COUNT(*) AS total FROM users";
  let values = [];

  db.query(countQuery, values, (err, countResult) => {
    if (err) return res.status(500).json(err);

    const totalUsers = countResult[0].total;
    const totalPages = Math.ceil(totalUsers / pageSize);

    const limitValue = parseInt(pageSize);
    const offsetValue = (parseInt(page) - 1) * limitValue;

    let dataQuery = "SELECT * FROM users LIMIT ? OFFSET ?";
    const dataValues = [limitValue, offsetValue];

    db.query(dataQuery, dataValues, (err, dataResult) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json({
        total: totalUsers,
        totalPages: totalPages,
        users: dataResult,
      });
    });
  });
};

// export const updateUser = async (req, res) => {
//     const q =
//         "UPDATE users SET username=?, firstname=?, lastname=?,profilePic=?, level=? WHERE id=? ";

//     db.query(
//         q,
//         [
//             req.body.email,
//             req.body.firstname,
//             req.body.lastname,
//             req.body.profilePic,
//             req.body.level,
//             req.user.id,
//         ],
//         (err, data) => {
//             if (err) res.status(500).json(err);
//             if (data.affectedRows > 0) return res.json("Updated!");
//             return res.status(403).json("You can update only your post!");
//         }
//     );
// }

export const updateUser = async (req, res) => {
  const { username, type, userId } = req.body;

  // Перевіряємо, чи не зайнятий новий username іншим користувачем
  db.query(
    "SELECT * FROM users WHERE username = ? AND id != ?",
    [username, userId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          message: "Error checking if username is unique",
          error: err,
        });
      }

      if (rows.length > 0) {
        return res.status(400).json({
          message: "Username is already taken",
        });
      }

      let values = [];
      let q = "";
      console.log(req.body);
      // Формуємо запит на оновлення в залежності від типу
      if (type == "admin") {
        q =
          "UPDATE users SET username=?, email=?, name=?, isAdmin=?, level=?, about=? WHERE id=?";
        values = [
          req.body.username,
          req.body.email,
          req.body.name,
          req.body.isAdmin,
          req.body.level,
          req.body.about,
          userId, // Використовуємо userId для оновлення конкретного користувача
        ];
      } else {
        q =
          "UPDATE users SET username=?, email=?, name=?, profilePic=?, level=?, about=? WHERE id=?";
        values = [
          req.body.username,
          req.body.email,
          req.body.name,
          req.body.profilePic,
          req.body.level,
          req.body.about,
          userId, // Використовуємо userId для оновлення конкретного користувача
        ];
      }

      // Виконуємо запит на оновлення
      db.query(q, values, (err, data) => {
        if (err) {
          return res.status(500).json({
            message: "Error updating user",
            error: err,
          });
        }
        if (data.affectedRows > 0) {
          // Якщо оновлення пройшло успішно, отримуємо всі дані користувача
          db.query(
            "SELECT * FROM users WHERE id = ?",
            [userId],
            (err, rows) => {
              if (err) {
                return res.status(500).json({
                  message: "Error fetching updated user data",
                  error: err,
                });
              }

              const updatedUserData = rows[0];

              if (updatedUserData) {
                const { password, ...userWithoutPassword } = updatedUserData;
                res.status(200).json(userWithoutPassword); // Повертаємо всі дані користувача, окрім паролю
              } else {
                res.status(500).json({
                  message: "Error fetching updated user data",
                });
              }
            }
          );
        } else {
          return res.status(403).json({
            message: "You can update only your personal info!",
          });
        }
      });
    }
  );
};

export const deleteUser = async (req, res) => {
  const userId = +req.params.userId;

  const q = "DELETE FROM users WHERE id = ?";

  db.query(q, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Error deleting user",
        error: err,
      });
    }

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "User deleted successfully" });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  });
};
