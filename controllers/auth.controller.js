const {addUser, chanceStatus} = require("../models/auth.model")
const bcrypt = require("bcrypt")
const {body, validationResult, matchedData} = require("express-validator")

const validateUsers = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("Firstname is required"),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Lastname is required"),

  body("email")
    .isEmail()
    .withMessage("Valid email is required"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("confirmPassword")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    })
];



const signUpForm = async (req, res, next) => {
    try {
        res.render("sign-up-form", {
          errors: {},
          oldInput: {}
        });
    } catch (error) {
        next(error)
    }
};

const signUp = [
  validateUsers,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).render("sign-up-form", {
          errors: errors.mapped(),
          oldInput: req.body
        })
      }

      const {firstName, lastName, password, email} = matchedData(req);
      const hashedPassword = await bcrypt.hash(password, 10);
      await addUser(email, hashedPassword, firstName, lastName)
      res.redirect("/");
    } catch (err) {
      if (err.code === "23505" && err.constraint === "users_email_key") {
        // 23505 = unique_violation
        return res.status(400).render("sign-up-form", {
          errors: { email: { msg: "Email is already registered" } },
          oldInput: req.body,
          failureMessage: null
        });
      }
      next(err);
    }
  }
]

const logout = async (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect("/");
  });
};

const loginForm = async (req, res, next) => {
    try {
      const messages = req.session.messages || [];
      req.session.messages = []; // clear after reading

      res.render("login", {
        errors: {},
        oldInput: {},
        failureMessage: messages[0] // single message
      });
    } catch (error) {
        next(error)
    }
}


const becomeMember = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.redirect("/login");
    }

    const { id } = req.user;
    const { secretMemberAnswer } = req.body;

    if (
      process.env.SECRET_MEMBER_ANSWER !== secretMemberAnswer?.trim()
    ) {
      return res.redirect("/");
    }

    await chanceStatus("member", id);
    return res.redirect("/");

  } catch (error) {
    next(error);
  }
};


const becomeAdmin = [
  async (req, res, next) => {
     try {
      if (!req.user) {
        return res.redirect("/login");
      }

      const { id } = req.user;
      const { secretAdminAnswer } = req.body;

      if (
        process.env.SECRET_ADMIN_ANSWER !== secretAdminAnswer?.trim()
      ) {
        return res.redirect("/");
      }

      await chanceStatus("admin", id);
      return res.redirect("/");

    } catch (error) {
      next(error);
    }
  }
]



module.exports = {signUpForm, signUp, logout, loginForm, becomeAdmin, becomeMember}