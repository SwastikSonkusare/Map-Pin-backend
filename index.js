import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import pinRoutes from "./routes/pins.js";
import authRoutes from "./routes/users.js";

dotenv.config();
const app = express();

mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB is connected");
  })
  .catch((error) => {
    console.log(error);
  });

app.use(express.json());

app.use("/api/pins", pinRoutes);
app.use("/api/users", authRoutes);

app.listen(8080, () => {
  console.log("It is running");
});
