require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler.js");
const verifyJWT = require("./middleware/verifyJWT");
const corsOptions = require("./config/corsOptions");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const connectDB = require("./config/dbConn");
const PORT = process.env.PORT || 3500;

// Connect to DB
connectDB();

// custom middleware logger
app.use(logger);

app.use(credentials);

// cross origin resource sharing
app.use(cors(corsOptions));

// for form data (encoded data)
app.use(express.urlencoded({ extended: false }));

// for json data
app.use(express.json());

// cookies parser
app.use(cookieParser());

// serving static files (css, images, etc)
app.use(express.static(path.join(__dirname, "public")));
app.use("/subdir", express.static(path.join(__dirname, "public")));

// routing
app.use("/subdir", require("./routes/subdir"));
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

// will use verifyJWT middleware
app.use(verifyJWT);
app.use("/employees", require("./routes/api/employees"));

app.all("/*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to mongoDB");
  app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
});
