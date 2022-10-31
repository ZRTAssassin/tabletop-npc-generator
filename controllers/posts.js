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
    try {
      const num = Number(req.params.num);
      const posts = await Post.aggregate([
        { $match: { user: mongoose.Types.ObjectId(req.user.id) } },
        { $sample: { size: num } },
      ]);
      const titles = [
        "Flaws",
        "Motivation",
        "Strengths",
        "Given Circumstances",
        "Ocupations",
        "Secrets",
        "Formative Events",
        "Inciting Incidents",
      ];
      const flaws = await Post.aggregate([
        {
          $match: {
            user: mongoose.Types.ObjectId(req.user.id),
            category: "Flaws",
          },
        },
        { $sample: { size: num } },
      ]);
      console.log(flaws);
      // Flaws
      // MotivationF
      // Strengths
      // Given Circumstances
      // Occupations
      // Secrets
      // Formative Events
      // Inciting Incidents
      res.render("getNumbers.ejs", { titles: titles, posts: flaws });
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
