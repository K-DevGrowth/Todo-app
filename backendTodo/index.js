const express = require("express");
const cors = require("cors");
const app = express();

let todos = [
  {
    id: "1",
    title: "Read for 1 hour",
  },
  {
    id: "2",
    title: "Complete Todo App on Frontend Mentor",
  },
];

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

app.get("/api/todos", (req, res) => {
  res.json(todos);
});

app.get("/api/todos/:id", (req, res) => {
  const id = req.params.id;
  const todo = todos.find((t) => t.id === id);

  if (todo) {
    res.json(todo);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/todos/:id", (req, res) => {
  const id = req.params.id;
  todos = todos.filter((todo) => todo.id !== id);

  res.status(204).end();
});

const generateId = () => {
  const maxId =
    todos.length > 0 ? Math.max(...todos.map((todo) => Number(todo.id))) : 0;
  return String(maxId + 1);
};

app.post("/api/todos", (req, res) => {
  const body = req.body;

  if (!body.title) {
    return res.status(400).json({
      error: "title missing",
    });
  }

  const todo = {
    id: generateId(),
    title: body.title,
  };

  todos = todos.concat(todo);

  res.json(todo);
});

const unknowEndpoint = (req, res) => {
  res.status(404).send({
    error: "unknown endpoint",
  });
};
app.use(unknowEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on the port ${PORT}`);
});
