const todosRouter = require("express").Router();
const Todo = require("../models/todo");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const getTokenForm = (req) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

todosRouter.get("/", async (req, res) => {
  const todos = await Todo.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  res.json(todos);
});

todosRouter.get("/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  if (todo) {
    res.json(todo);
  } else {
    res.status(404).end();
  }
});

todosRouter.post("/", async (req, res) => {
  const body = req.body;
  const decodedToken = jwt.verify(getTokenForm(req), process.env.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({
      error: "token invalid",
    });
  }
  const user = await User.findById(decodedToken.id);

  if (!user) {
    return res.status(400).json({
      error: "userId missing or not valid",
    });
  }

  const todo = new Todo({
    title: body.title,
    completed: body.completed || false,
    user: user._id,
  });

  const savedTodo = await todo.save();
  user.todos = user.todos.concat(savedTodo._id);
  await user.save();

  res.status(201).json(savedTodo);
});

todosRouter.delete("/completed", async (req, res) => {
  await Todo.deleteMany({ completed: true });
  res.status(204).end();
});

todosRouter.delete("/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

todosRouter.put("/:id", async (req, res) => {
  const { title, completed } = req.body;

  const todo = await Todo.findById(req.params.id);
  if (!todo) {
    return res.status(404).end();
  }

  todo.title = title;
  todo.completed = completed;

  const updatedTodo = await todo.save();
  res.json(updatedTodo);
});

module.exports = todosRouter;
