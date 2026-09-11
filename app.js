require("dotenv").config();
const express = require("express");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const mongoose = require("mongoose");
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const auth = require("./middlewares/auth");
const { login, createUser } = require("./controllers/users");
const errorHandler = require("./middlewares/errorhandler");
const { PORT = 3000 } = process.env;
const { errors } = require("celebrate");
const {
  validateCreateUser,
  validateLogin,
} = require("./middlewares/validators");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.use(requestLogger);
app.post("/signin", validateLogin, login);
app.post("/signup", validateCreateUser, createUser);
app.use(auth);
app.use("/users", usersRouter);
app.use("/cards", cardsRouter);

mongoose.connect("mongodb://localhost:27017/aroundb");

app.use((req, res) => {
  res.status(404).json({ message: "Recurso solicitado no encontrado" });
});
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
