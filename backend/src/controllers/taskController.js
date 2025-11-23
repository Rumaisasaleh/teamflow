const db = require("../config/db");

// GETALLTASK
exports.getAllTasks = async (req, res) => {
  try {
    const role = req.user.role;
    const userId = req.user.id;

    let result;

    if (role === "MEMBER") {
      result = await db.query(
        "SELECT * FROM tasks WHERE assignee_id=$1 ORDER BY id DESC",
        [userId]
      );
    } else {
      result = await db.query("SELECT * FROM tasks ORDER BY id DESC");
    }

    res.json(result.rows);
  } catch (err) {
    console.error("Get tasks error:", err);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};


// GETTASKBYID
exports.getTaskById = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM tasks WHERE id=$1",
      [req.params.id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Task not found" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Get task error:", err);
    res.status(500).json({ message: "Failed to fetch task" });
  }
};

// CREATE TASK
exports.createTask = async (req, res) => {
  try {
    const project_id = req.params.id || req.body.project_id;

    const { title, description, status, priority, assignee_id } = req.body;

    if (!project_id)
      return res.status(400).json({ message: "project_id is required" });

    const result = await db.query(
      `INSERT INTO tasks (title, description, status, priority, assignee_id, project_id)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [title, description, status, priority, assignee_id, project_id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Create task error:", err);
    res.status(500).json({ message: "Failed to create task" });
  }
};

// UPDATE TASK
exports.updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, assignee_id } = req.body;

    const result = await db.query(
      `UPDATE tasks 
       SET title=$1, description=$2, status=$3, priority=$4, assignee_id=$5
       WHERE id=$6
       RETURNING *`,
      [title, description, status, priority, assignee_id, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Update task error:", err);
    res.status(500).json({ message: "Failed to update task" });
  }
};

// DELETE TASK
exports.deleteTask = async (req, res) => {
  try {
    await db.query("DELETE FROM tasks WHERE id=$1", [req.params.id]);
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("Delete task error:", err);
    res.status(500).json({ message: "Failed to delete task" });
  }
};

// TASKBY PROJECTID
exports.getTasksByProject = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM tasks WHERE project_id=$1 ORDER BY id DESC",
      [req.params.id]        // ✅ FIXED
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load project tasks" });
  }
};

