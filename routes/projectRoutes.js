const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const Issue = require("../models/Issue");

// Route to display a list of projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find({}).exec();
    res.render("home", { projects });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/create-project", async (req, res) => {
  try {
    res.render("create-project", {});
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Route to create a new project
router.post("/project/create", async (req, res) => {
  const { name, description, author } = req.body;
  const newProject = new Project({ name, description, author });

  try {
    // Save the new project using promises
    await newProject.save();
    // Render the create-project page
    res.redirect("back");
  } catch (err) {
    console.error(err);
    res.status(500).send(`Internal Server Error: ${err.message}`);
  }
});

router.get("/:projectId/create-issue", async (req, res) => {
  const projectId = req.params.projectId;
  try {
    res.render("create-issue", { projectId });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Route to create a new issue for a project
router.post("/:projectId/created", async (req, res) => {
  const projectId = req.params.projectId;
  const { title, description, labels, author } = req.body;

  const newIssue = new Issue({ title, description, labels, author, projectId });

  try {
    await newIssue.save();
    res.redirect('back');
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/api/projects/:projectId/labels", async (req, res) => {
  const projectId = req.params.projectId;

  try {
    // Fetch existing labels for the project from the database
    const project = await Project.findById(projectId).exec();

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Extract unique labels from the project
    const existingLabels = Array.from(new Set(project.labels || []));

    res.json(existingLabels);
  } catch (error) {
    console.error("Error fetching existing labels:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Route to display project details and related issues
// Route to handle filtering by multiple labels, author, and search
router.get("/:projectId", async (req, res) => {
  const projectId = req.params.projectId;
  const { labels, author, search } = req.query;
  const query = { projectId: projectId };
  if (labels) {
    if (Array.isArray(labels)) {
      // If labels is an array, filter by multiple labels
      query.labels = { $all: labels };
    } else {
      // If labels is a single value, filter by that label
      query.labels = labels;
    }
  }
  if (author) query.author = author;
  if (search)
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];

  try {
    const project = await Project.findById(projectId).exec();
    const issues = await Issue.find(query).exec();
    res.render("project", { project, issues });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
