import { writeFileSync } from "fs";
import { faker } from "@faker-js/faker";

faker.seed(123); // لتكرار نفس البيانات دائمًا

// Users
const users = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@test.com",
    password: "123456",
    role: "Admin",
  },
  {
    id: "2",
    name: "Project Manager",
    email: "manager@test.com",
    password: "123456",
    role: "ProjectManager",
  },
  {
    id: "3",
    name: "Developer User",
    email: "dev@test.com",
    password: "123456",
    role: "Developer",
  },
];

// Projects
const projects = Array.from({ length: 10 }).map((_, i) => ({
  id: (i + 1).toString(),
  name: faker.company.name(),
  status: faker.helpers.arrayElement(["Active", "Completed", "Pending"]),
  startDate: faker.date.past(1).toISOString().split("T")[0],
  endDate: faker.date.future(1).toISOString().split("T")[0],
  progress: faker.number.int({ min: 0, max: 100 }),
  budget: faker.number.int({ min: 1000, max: 50000 }),
}));

// Tasks
let taskId = 1;
const tasks = [];

projects.forEach((project) => {
  for (let i = 0; i < 4; i++) {
    tasks.push({
      id: (taskId++).toString(),
      title: faker.lorem.sentence(3),
      description: faker.lorem.sentence(),
      status: faker.helpers.arrayElement(["todo", "doing", "done"]),
      priority: faker.helpers.arrayElement(["low", "medium", "high"]),
      assignedTo: faker.helpers.arrayElement(users.map((u) => u.id)),
      projectId: project.id,
    });
  }
});

// توليد db.json
const db = { users, projects, tasks };
writeFileSync("db.json", JSON.stringify(db, null, 2));

console.log("db.json generated successfully!");
