const express = require("express");
const mongoose = require("mongoose");
const expressJWT = require('express-jwt');
const bodyParser = require("body-parser");
const cors = require("cors");
const loginRouter = require("./routes/login");
const userRouter = require("./routes/user");
const path = require("path");
const compression = require("compression");
const morgan = require("morgan");
// var sslRedirect = require("heroku-ssl-redirect");

require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
// app.use(sslRedirect());

// Establish the MongoDB Connection
mongoose.connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  
  const connection = mongoose.connection;
  
  connection.once("open", () => {
    console.log("MongoDB connection established.");
  });

  
const normalizePort = (port) => parseInt(port, 10);
const PORT = normalizePort(process.env.PORT || 5000);

app.use("/login", loginRouter);
app.use("/user", userRouter);

if (process.env.NODE_ENV === "production") {
  app.disable("x-powered-by");
  app.use(compression());
  app.use(morgan("common"));
  app.use(express.static(path.resolve(__dirname, "client", "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
