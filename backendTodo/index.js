require("dotenv").config();
const express = require("express");
const app = express();
const Todo = require("./models/todos");

const errorHandler = (error, req, res, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

const unknowEndpoint = (req, res) => {
  res.status(404).send({
    error: "unknown endpoint",
  });
};

app.use(express.static("dist"));
app.use(express.json());

app.get("/api/todos", (req, res) => {
  Todo.find({}).then((todos) => res.json(todos));
});

app.get("/api/todos/:id", (req, res, next) => {
  Todo.findById(req.params.id)
    .then((todo) => {
      if (todo) {
        res.json(todo);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/todos/:id", (req, res, next) => {
  Todo.findByIdAndDelete(req.params.id)
    .then((result) => res.status(204).end())
    .catch((error) => next(error));
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

app.use(unknowEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on the port ${PORT}`);
});
