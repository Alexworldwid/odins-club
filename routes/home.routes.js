const homeRouter = require("express").Router();
const homeController = require("../controllers/home.controller");
const requireAuth = require("../middleware/requireAuth");

homeRouter.get("/", requireAuth, homeController.homepage)
homeRouter.get("/create-post", requireAuth, homeController.createPostGet)
homeRouter.post("/create-post", requireAuth, homeController.createPostPost)
homeRouter.post("/posts/:postId/delete", requireAuth, homeController.deletePostPost)
homeRouter.post("/posts/:postId/hide", requireAuth, homeController.hidePostPost)



module.exports = homeRouter;