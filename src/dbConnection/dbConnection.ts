import mongoose from "mongoose";

export const dbConnection = async () => {
  const DB_URL = process.env.DB_URL;
  const DB_NAME = process.env.DB_NAME;
  try {
    await mongoose.connect(DB_URL, {
        dbName: DB_NAME,
    });
    console.log(`mongodb is connected to ${DB_NAME} database`.green);
  } catch (error) {
    console.log(error);
    throw new Error(`Error to connect to DB`.red);
  }
}