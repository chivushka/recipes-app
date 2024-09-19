import express from "express";
import usersRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import cuisinesRoutes from "./routes/cuisines.js";
import recipesRoutes from "./routes/recipes.js";
import ingredientsRoutes from "./routes/ingredients.js";
import directionsRoutes from "./routes/directions.js";
import savesRoutes from "./routes/saves.js";
import searchRoutes from "./routes/search.js";
import categoriesRoutes from "./routes/categories.js";
import reviewsRoutes from "./routes/reviews.js";
import adminRoutes from "./routes/admin.js";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";

const app = express();


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:4173"],
  })
);
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.use("/api/users", usersRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/cuisines", cuisinesRoutes);
app.use("/api/recipes", recipesRoutes);
app.use("/api/ingredients", ingredientsRoutes);
app.use("/api/directions", directionsRoutes);
app.use("/api/saves", savesRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/admin", adminRoutes);

app.listen(9900, () => {
  console.log("api work");
});
