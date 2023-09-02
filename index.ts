import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import "colors";
import { dbConnection } from "./src/dbConnection/dbConnection";
dotenv.config({});
dbConnection();

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use(morgan("dev"));

// routes
app.use("/api", async (req, res) => {
    res.json({
        message: "Welcome to my API",
        });
    }
);


const PORT = process.env.PORT;
app.listen(PORT, () => {
  const APP_URL = process.env.APP_URL;
  console.log(`app running => ${APP_URL}`.green);
});