const pool = require("./config/db");
const bcrypt = require("bcryptjs");

async function seed() {
  try {
    console.log("🌱 Starting database seed...");

    // USERS
    const adminPassword = await bcrypt.hash("admin123", 10);
    const member1Password = await bcrypt.hash("member123", 10);
    const member2Password = await bcrypt.hash("member123", 10);

    // admin
    await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO NOTHING;`,
      ["Admin", "admin@gmail.com", adminPassword, "ADMIN"]
    );

    // Members
    await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO NOTHING;`,
      ["Jane Doe", "jane@gmail.com", member1Password, "MEMBER"]
    );

    await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO NOTHING;`,
      ["John Doe", "john@gmail.com", member2Password, "MEMBER"]
    );

    console.log("✔ Users seeded");

    //  PROJECT 
    const projectResult = await pool.query(
      `INSERT INTO projects (name, description, status, created_by)
       VALUES ($1, $2, $3, (SELECT id FROM users WHERE email='admin@gmail.com'))
       RETURNING id;`,
      ["TeamFlow Project", "Main project for testing", "ACTIVE"]
    );

    const projectId = projectResult.rows[0].id;
    console.log("✔ Project seeded");

    // TASKS 
    await pool.query(
      `INSERT INTO tasks (project_id, title, description, status, priority, assignee_id, position)
       VALUES 
       ($1, 'Fix Login Bug', 'Resolve issue in login flow', 'TODO', 'HIGH',
        (SELECT id FROM users WHERE email='jane@gmail.com'), 1),
       ($1, 'UI Improvements', 'Enhance dashboard UI', 'IN_PROGRESS', 'MEDIUM',
        (SELECT id FROM users WHERE email='john@gmail.com'), 2),
       ($1, 'Write Documentation', 'Add README and API docs', 'DONE', 'LOW',
        (SELECT id FROM users WHERE email='john@gmail.com'), 3)
      `,
      [projectId]
    );

    console.log("✔ Tasks seeded");
    console.log("🎉 Database seeding completed successfully!");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error during seed:", err);
    process.exit(1);
  }
}

seed();
