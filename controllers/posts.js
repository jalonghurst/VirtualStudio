const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const User = require("../models/User");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("profile.ejs", { posts: posts, user: req.user, loggedInUser: req.user, url: req.url });
    } catch (err) {
      console.log(err);
    }
  },
  getUserProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.params.id });
      const us = await User.findById(req.params.id);
      res.render("profile.ejs", { posts: posts, user: us, loggedInUser: req.user, url: req.url });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      res.render("feed.ejs", { posts: posts, url: req.url });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      // find post id
      const post = await Post.findById(req.params.id);
      res.render("post.ejs", { post: post, user: req.user, url: req.url});
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      console.log(req)
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        likes: 0,
        user: req.user.id,
        username: req.user.userName,
        createdAt: req.body.createdAt
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  editPost: async (req, res) => {
    try {
      console.log(req)
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          title: req.body.title,
          caption: req.body.caption,
        }
      );
      console.log("Post has been changed!");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  }, 
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },

  createBio: async (req, res) => {
    try {
      console.log(req)
      await User.findOneAndUpdate(
        { _id: req.user.id },
        {
          $set: {bio: req.body.bio},
        }
      );
      console.log("Bio has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  }, 
  editBio: async (req, res) => {
    try {
      console.log(req)
      await User.findOneAndUpdate(
        { _id: req.user.id },
        {
          bio: req.body.bio,
        }
      );
      console.log("Bio has been changed!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  }, 
  // SETS BIO TO UNDEFINED, BIO KEY NOT REMOVED FROM USER DOCUMENT.
  deleteBio: async (req, res) => {
    try {
      await User.findOneAndUpdate(
        { _id: req.user.id },
        {
          bio: undefined,
        }
      );
      console.log("Bio has been deleted!");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
  deleteAccount: async (req, res) => {
    try {
      console.log(req)
      let user = await User.findById({ _id: req.user.id });
      await User.findOneAndDelete(
        { _id: req.user.id },
        {
          bio: req.user.bio,
        }
      );
      console.log("Account has been deleted!");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
  createProfileImg: async (req, res) => {
    try {
      console.log(req)
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      await User.findOneAndUpdate(
        { _id: req.user.id },
        {
          $set: {  
            profileImg: result.secure_url,
            cloudinaryId: result.public_id,},
        }
      );
      console.log("Profile Image has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  deleteProfileImg: async (req, res) => {
    try {
      // Find post by id
      let user = await User.findById({ _id: req.user.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(user.cloudinaryId);
      // Delete post from db
      await User.findOneAndUpdate(
        { _id: req.user.id },
        {
          $set: {  
            profileImg: undefined,
            cloudinaryId: undefined,
           },
        }
      );
      console.log("Deleted Profile Image");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },

};
