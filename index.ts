import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import "colors";
import { dbConnection } from "./src/dbConnection/dbConnection";
import { globalErrorHandler, globalNotFoundRoute } from "./src/middlewares/globalError.middleWare";
import router from "./mount";
dotenv.config({path: "./config/.env"});
dbConnection();
const app = express();
const NODE_ENV = process.env.NODE_ENV || "dev";


// middleWares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/uploads", express.static("./uploads"));
if (NODE_ENV === "dev") {
  app.use(morgan("dev"));
}



// routes
app.use("/api/v1", router);

// Global MiddleWares 
app.use("*", globalNotFoundRoute);
app.use(globalErrorHandler);


// Listen On Port
const PORT = process.env.PORT;
app.listen(PORT, () => {
  const APP_URL = process.env.APP_URL;
  console.log(`app running => ${APP_URL}`.green);
});