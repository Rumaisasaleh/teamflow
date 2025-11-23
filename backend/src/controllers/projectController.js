const db = require("../config/db");

// PROJECTLIST
exports.listProjects = async (req, res) => {
  try {
    const role = req.user.role;
    const userId = req.user.id;

    let result;

    if (role === "MEMBER") {

      result = await db.query(
        `SELECT DISTINCT p.*
         FROM projects p
         JOIN tasks t ON p.id = t.project_id
         WHERE t.assignee_id = $1
         ORDER BY p.id DESC`,
        [userId]
      );
    } else {

      result = await db.query("SELECT * FROM projects ORDER BY id DESC");
    }

    res.json(result.rows);
  } catch (err) {
    console.error("Error loading projects:", err);
    res.status(500).json({ message: "Failed to load projects" });
  }
};

// PROJECTCREATED
exports.createProject = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    const userId = req.user.id;

    const result = await db.query(
      `INSERT INTO projects (name, description, status, created_by)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, description, status, userId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Create project error:", err);
    res.status(500).json({ message: "Failed to create project" });
  }
};


// PROJECTBYID
exports.getProjectById = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM projects WHERE id=$1",
      [req.params.id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Project not found" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load project" });
  }
};

// PROJECTUPDATE
exports.updateProject = async (req, res) => {
  try {
    const { name, description, status } = req.body;

    const result = await db.query(
      `UPDATE projects
       SET name=$1, description=$2, status=$3
       WHERE id=$4
       RETURNING *`,
      [name, description, status, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update project" });
  }
};

// DELETEPROJECT
exports.deleteProject = async (req, res) => {
  try {
    await db.query("DELETE FROM projects WHERE id=$1", [req.params.id]);

    res.json({ message: "Project deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete project" });
  }
};
