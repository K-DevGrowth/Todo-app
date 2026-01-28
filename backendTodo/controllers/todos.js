const todosRouter = require("express").Router();
const Todo = require("../models/todo");

todosRouter.get("/", (req, res) => {
  Todo.find({}).then((todos) => res.json(todos));
});

todosRouter.get("/:id", (req, res, next) => {
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

todosRouter.post("/", (req, res, next) => {
  const body = req.body;

  const todo = new Todo({
    title: body.title,
    completed: body.completed || false,
  });

  todo
    .save()
    .then((savedtodo) => res.json(savedtodo))
    .catch((error) => next(error));
});

todosRouter.delete("/:id", (req, res, next) => {
  Todo.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch((error) => next(error));
});

todosRouter.put("/:id", (req, res, next) => {
  const { title, completed } = req.body;

  Todo.findById(req.params.id).then((todo) => {
    if (!todo) {
      return res.status(404).end();
    }

    todo.title = title;
    todo.completed = completed;

    return todo
      .save()
      .then((updatedTodo) => res.json(updatedTodo))
      .catch((error) => next(error));
  });
});

module.exports = todosRouter;
