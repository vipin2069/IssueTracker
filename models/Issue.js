// models/Issue.js
const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  labels: [{ type: String }],
  author: { type: String, required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
});

const Issue = mongoose.model('Issue', issueSchema);

module.exports = Issue;
