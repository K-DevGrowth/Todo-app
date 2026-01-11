require("dotenv").config();
const express = require("express");
const app = express();
const Todo = require("./models/todos");

app.use(express.static("dist"));
app.use(express.json());

app.get("/api/todos", (req, res) => {
  Todo.find({}).then((todos) => res.json(todos));
});

app.get("/api/todos/:id", (req, res) => {
  Todo.findById(req.params.id)
    .then((todo) => {
      if (todo) {
        res.json(todo);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send({ error: "malformatted id" });
    });
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

  const todo = new Todo({
    title: body.title,
  });

  todo.save().then((savedTodo) => res.json(savedTodo));
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
