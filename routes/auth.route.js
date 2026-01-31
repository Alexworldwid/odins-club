const authRouter = require("express").Router();
const authController = require("../controllers/auth.controller");
const passport = require("../config/passport");
const {loginValidator} = require("../validator/login.validator")


authRouter.get("/sign-up", authController.signUpForm)
authRouter.post("/sign-up", authController.signUp)
authRouter.get("/login", authController.loginForm)
authRouter.post(
  "/login",
  loginValidator,
  (req, res, next) => {
    const { validationResult } = require("express-validator");
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("login", {
        errors: errors.mapped(),
        oldInput: req.body
      });
    }

    next();
  },
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureMessage: true
  })
);

authRouter.get("/log-out", authController.logout);
authRouter.post("/become-member", authController.becomeMember);
authRouter.post("/become-admin", authController.becomeAdmin);


module.exports =  authRouter;