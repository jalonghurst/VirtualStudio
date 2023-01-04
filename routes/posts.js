const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const postsController = require("../controllers/posts");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Routes - simplified for now
router.get("/:id", ensureAuth, postsController.getPost);

router.post("/createPost", upload.single("file"), postsController.createPost);

router.post("/createBio", postsController.createBio);

router.post("/createProfileImg", upload.single("file"), postsController.createProfileImg);

router.put("/editPost/:id", postsController.editPost);

router.put("/editBio", postsController.editBio);

router.put("/likePost/:id", postsController.likePost);

router.delete("/deletePost/:id", postsController.deletePost);

router.delete("/deleteBio", postsController.deleteBio);

router.delete("/deleteAccount", postsController.deleteAccount);

router.delete("/deleteProfileImg", postsController.deleteProfileImg);

module.exports = router;
