const mongoose = require("mongoose");

const viimeyon = mongoose.Schema({
  videos: Array,
});

module.exports = mongoose.model("viimeyon", viimeyon);
