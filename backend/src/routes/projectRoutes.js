const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/auth");
const projectController = require("../controllers/projectController");
const taskController = require("../controllers/taskController");


// all projects
router.get("/", auth(), projectController.listProjects);

// CREATE
router.post("/", auth(["ADMIN"]), projectController.createProject);

// GET 
router.get("/:id/tasks", auth(), taskController.getTasksByProject);

// CREATE
router.post("/:id/tasks", auth(["ADMIN"]), taskController.createTask);

// Update
router.put("/:id", auth(["ADMIN"]), projectController.updateProject);

// Delete
router.delete("/:id", auth(["ADMIN"]), projectController.deleteProject);

// CREATE TASK under project
// router.post("/:id/tasks", auth(["ADMIN"]), taskController.createTask);

module.exports = router;
