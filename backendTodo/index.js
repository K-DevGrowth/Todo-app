const config = require("./utils/config");
const logger = require("./utils/logger");
const express = require("express");
const app = express();
const Todo = require("./models/todo");

const errorHandler = (error, req, res, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).send({ error: error.message });
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

app.put("/api/todos/:id", (req, res, next) => {
  const { title } = req.body;

  Todo.findById(req.params.id)
    .then((todo) => {
      if (!todo) {
        return res.status(404).end();
      }

      todo.title = title;

      return todo.save().then((updatedTodo) => {
        res.json(updatedTodo);
      });
    })
    .catch((error) => next(error));
});

app.post("/api/todos", (req, res, next) => {
  const body = req.body;

  if (!body.title) {
    return res.status(400).json({
      error: "title missing",
    });
  }

  const todo = new Todo({
    title: body.title,
  });

  todo
    .save()
    .then((savedTodo) => res.json(savedTodo))
    .catch((error) => next(error));
});

app.use(unknowEndpoint);
app.use(errorHandler);

app.listen(config.PORT, () => {
  logger.info(`Server running on the port ${config.PORT}`);
});
