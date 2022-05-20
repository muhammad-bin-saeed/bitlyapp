const mongoose = require("mongoose");

const TotalUrlsSchema = new mongoose.Schema({
  count: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("TotalUrls", TotalUrlsSchema);