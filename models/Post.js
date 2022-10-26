const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  traitName: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  category:{
    type: String,
    required: true,
  },
  deck: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", PostSchema);
