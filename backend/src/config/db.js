import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose
    .connect("mongodb+srv://balbirs2204:mypassword@cluster0.v3u9con.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
      console.log("Connected to database!");
    })
    .catch((err) => {
      console.log(`Some error occured while connecing to database: ${err}`);
    });
};