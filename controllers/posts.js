const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const mongoose = require("mongoose");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      // console.log(posts);
      res.render("feed.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.render("post.ejs", { post: post, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getNumbers: async (req, res) => {
    console.log("OPUINPIUBNPOIUBP");
    try {
      const num = Number(req.params.num);
      const posts = await Post.aggregate([
        { $match: { user: mongoose.Types.ObjectId(req.user.id) } },
        { $sample: { size: num } },
      ]);
      console.log(posts);
      // const posts = await Post.find({ user: req.user.id });
      // [{_id: `635b8a399d456a002760da3f`,
      // traitName: "Need Rival's Help",
      // caption: 'Finds themselves in a predicament that requires the help of their old rival.',
      // category: 'Inciting Incidents',
      // deck: 'Basic',
      // user: `635b21ab11a68a0025a2afff`,
      // createdAt: `2022-10-28T07:52:25.660Z`,
      // __v: 0}]
      res.render("getNumbers.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    console.log(req.body);
    try {
      await Post.create({
        traitName: req.body.traitName,
        caption: req.body.caption,
        category: req.body.category,
        deck: req.body.deck,
        user: req.user.id,
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
};
