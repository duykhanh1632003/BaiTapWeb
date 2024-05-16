const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./Routes/userRoute");
const photoRouter = require("./Routes/photoRoute");

require("dotenv").config();
const app = express();
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use("", userRouter);
app.use("", photoRouter);

const port = process.env.PORT || 8000;
const uri = process.env.URI;
console.log("check uri", uri);
app.listen(port, () => {
  console.log(`server running on port:${port}`);
});
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongodb connect establish"))
  .catch((error) => console.log("MongoDB connection failed"));
