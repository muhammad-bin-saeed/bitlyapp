const mongoose = require("mongoose");
const shortId = require("shortid");

const UrlShortenSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
    default: shortId.generate,
  },
  clicks: {
    type: Number,
    required: true,
    default: 0
  },
  expireAt: {
    type: Date,
    default: Date.now,
    index: { expires: "30m" }
  }
});

  module.exports = mongoose.model("UrlShorten", UrlShortenSchema);