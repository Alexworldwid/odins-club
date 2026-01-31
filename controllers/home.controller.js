const { getPosts, addPost, deletePost, hidePost } = require("../models/post.model");
const {body, validationResult, matchedData} = require("express-validator")


const validatePosts = [
    body("postTitle")
    .trim()
    .notEmpty()
    .withMessage("post is required")
]

const homepage = async (req, res, next) => {
    try {
        const posts = await getPosts(null, req.user ? req.user.role : "guest");
        console.log(posts)
        res.render("homepage", {
            oldInput: {},
            errors: {},
            failureMessage: '',
            posts: posts
        });
    } catch (error) {
        next(error)
    }
}

const createPostGet = [
    async (req, res, next) => {
        try {
            res.status(200).render("createPostForm", {
                errors: {},
                oldInput: {}
            })
        } catch (error) {
            next(error)
        }
    }
]


const createPostPost = [
    validatePosts,
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            
            if (!req.user) {
                return res.redirect("/login");
            }

            if (!errors.isEmpty()) {
                return res.status(400).render("createPostForm", {
                    errors: errors.mapped(),
                    oldInput: req.body
                })
            }

            const { id } = req.user;
            const {postTitle} = matchedData(req)

            await addPost(id, postTitle);
            res.redirect("/")
        } catch (error) {
            next(error)
        }
    }
]

const deletePostPost = async (req, res, next) => {
    try {
        if (!req.user.role) {
            return res.redirect("/")
        }
        const {role} = req.user
        const {postId} = req.params;

        if (role === "admin") {
            await deletePost(postId)
            res.redirect("/")
        }
    } catch (error) {
        next(error)
    }
}

const hidePostPost = async (req, res, next) => {
    try {
        if (!req.user.role) {
            return res.redirect("/")
        }
        const {role} = req.user;
        const {postId} = req.params;

        if (role === "admin") {
            await hidePost(postId)
            res.redirect("/")
        }
    } catch (error) {
        
    }
}

module.exports = {createPostGet, createPostPost, homepage, deletePostPost, hidePostPost}