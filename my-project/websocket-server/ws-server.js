import { WebSocketServer } from "ws";
import { v4 as uuid } from "uuid";
import url from "url";

/**
 * شكل البيانات في الذاكرة
 * projects = {
 *   projectId: {
 *     clients: Set<WebSocket>,
 *     tasks: Task[]
 *   }
 * }
 */
const projects = {};

const wss = new WebSocketServer({ port: 3001 });

wss.on("connection", (ws, req) => {
  const { pathname } = url.parse(req.url);
  const match = pathname.match(/^\/ws\/projects\/(.+)$/);

  if (!match) {
    ws.close();
    return;
  }

  const projectId = match[1];

  if (!projects[projectId]) {
    projects[projectId] = {
      clients: new Set(),
      tasks: [],
    };
  }

  const project = projects[projectId];
  project.clients.add(ws);

  console.log(`Client connected to project ${projectId}`);

  // ابعت كل التاسكات أول ما العميل يتصل
  ws.send(
    JSON.stringify({
      type: "INIT_TASKS",
      payload: project.tasks,
    })
  );

  ws.on("message", (message) => {
    const { type, payload } = JSON.parse(message.toString());

    switch (type) {
      case "CREATE_TASK": {
        const task = { id: uuid(), ...payload };
        project.tasks.push(task);
        broadcast(project, "TASK_CREATED", task);
        break;
      }

      case "UPDATE_TASK": {
        const index = project.tasks.findIndex(t => t.id === payload.id);
        if (index !== -1) {
          project.tasks[index] = {
            ...project.tasks[index],
            ...payload.patch,
          };
          broadcast(project, "TASK_UPDATED", project.tasks[index]);
        }
        break;
      }

      case "DELETE_TASK": {
        project.tasks = project.tasks.filter(t => t.id !== payload.id);
        broadcast(project, "TASK_DELETED", payload.id);
        break;
      }
    }
  });

  ws.on("close", () => {
    project.clients.delete(ws);
    console.log(`Client disconnected from project ${projectId}`);
  });
});

function broadcast(project, type, payload) {
  const message = JSON.stringify({ type, payload });

  project.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
} 

console.log("✅ WebSocket server running on ws://localhost:3001");
