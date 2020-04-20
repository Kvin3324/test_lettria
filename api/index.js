require('dotenv').config();
const express = require('express')
const app = express()
const loginRouter = require("./routes/login");
const signupRouter = require("./routes/signup");
const homeRouter = require("./routes/home");
const cors = require("cors")

app.use(cors());
app.use("/login", loginRouter);
app.use("/signup", signupRouter);
app.use("/home", homeRouter);

app.listen(3000);
