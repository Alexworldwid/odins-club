require("dotenv").config();
const express = require("express")
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("node:path");
const session = require("express-session")
const passport = require("./config/passport")
const homeRouter = require("./routes/home.routes")
const authRouter = require("./routes/auth.route")

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
}) 


app.use("/", homeRouter);
app.use("/", authRouter);

app.listen(PORT, (error)=> {
    if (error) {
        throw error
    }

    console.log(`app is running on port ${PORT}`)
})