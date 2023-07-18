const express = require("express");
const app = express();
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
mongoose
  .connect(process.env.DB_CONNECT, { useNewUrlParser: true })
  .then(() => console.log("connected to DB"));

//Middleware

app.use(express.json());
//Route middleware
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/api/user", authRoute);
app.use("/api/posts", postRoute);

app.listen(3000, () => {
  console.log("Server is up and running...");
});
