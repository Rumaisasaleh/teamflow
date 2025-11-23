const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/auth");
const taskController = require("../controllers/taskController");

// GET ALL TASKS
router.get("/", auth(), taskController.getAllTasks);

// GET TASK BY ID
router.get("/:id", auth(), taskController.getTaskById);

router.get("/project/:projectId", auth(), taskController.getTasksByProject);


// CREATE TASK 
router.post("/", auth(["ADMIN"]), taskController.createTask);

// UPDATE TASK
router.put("/:id", auth(["ADMIN"]), taskController.updateTask);

// DELETE TASK
router.delete("/:id", auth(["ADMIN"]), taskController.deleteTask);

module.exports = router;
