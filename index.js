const express = require("express");

const server = express();
const tarefas = [];
let numberOfRequisitions = 0;
server.use(express.json());

function numberRequisitions(req, res, next) {
  numberOfRequisitions++;
  console.log(`Requisições feitas ao servidor: ${numberOfRequisitions}`);
  return next();
}
server.use(numberRequisitions);

function checkProjectExist(req, res, next) {
  const { id } = req.params;

  const project = tarefas.find(tarefa => tarefa.id == id);

  if (!project) {
    return res.status(400).json({ error: "project not exist" });
  }
  return next();
}

server.get("/projects", (req, res) => {
  return res.json(tarefas);
});

server.get("/projects/:id", checkProjectExist, (req, res) => {
  const { id } = req.params;
  const project = tarefas.find(tarefa => tarefa.id == id);
  return res.json(project);
});

server.post("/projects", (req, res) => {
  const project = req.body;
  tarefas.push(project);
  return res.json(tarefas);
});

server.put("/projects/:id", checkProjectExist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = tarefas.find(tarefa => tarefa.id == id);
  project.title = title;
  return res.json(project);
});

server.delete("/projects/:id", checkProjectExist, (req, res) => {
  const { id } = req.params;
  const project = tarefas.findIndex(tarefa => tarefa.id == id);
  tarefas.splice(project, 1);
  return res.status(200).json({ success: "Project deleted" });
});

server.post("/projects/:id/tasks", checkProjectExist, (req, res) => {
  const { id } = req.params;
  const { tasks } = req.body;
  const project = tarefas.find(tarefa => tarefa.id == id);
  project.tasks.push(tasks);
  return res.json(project);
});
server.listen(3000);
