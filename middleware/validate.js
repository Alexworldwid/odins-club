const { validationResult } = require("express-validator");

module.exports = (view) => {
  return (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render(view, {
        errors: errors.mapped(),
        oldInput: req.body
      });
    }

    next();
  };
};
