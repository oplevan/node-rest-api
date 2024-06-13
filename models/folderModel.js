const mongoose = require("mongoose");

const FolderSchema = new mongoose.Schema({
  name: { type: String },
  destinations: { type: Array, default: [] },
});

module.exports = mongoose.model.Folders || mongoose.model("folders", FolderSchema);
