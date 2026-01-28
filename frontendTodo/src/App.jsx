import { useEffect, useState } from "react";
import todoService from "./services/todos";

const App = () => {
  const [todoItems, setTodoItems] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const addToList = (e) => {
    e.preventDefault();
    todoService.create({ title: query }).then((returnedValue) => {
      setTodoItems([...todoItems, returnedValue]);
      setQuery("");
    });
  };

  const removeFromList = (id) => {
    todoService.deleted(id).then(() => {
      setTodoItems(todoItems.filter((todo) => todo.id !== id));
    });
  };

  const handleCheck = (id) => {
    const existingTodo = todoItems.find((todo) => todo.id === id);

    todoService
      .update(id, { ...existingTodo, completed: !existingTodo.completed })
      .then((returnedValue) => {
        setTodoItems(
          todoItems.map((item) => (item.id !== id ? item : returnedValue)),
        );
      });
  };

  const list = todoItems.concat();
  const filteredList =
    status === "all"
      ? todoItems
      : status === "active"
        ? list.filter((item) => item.completed === false)
        : status === "completed"
          ? list.filter((item) => item.completed === true)
          : "";

  useEffect(() => {
    todoService.getAll().then((initialTodos) => setTodoItems(initialTodos));
  }, []);

  return (
    <main>
      <div className="p-4">
        <h1 className="text-4xl font-bold">TODO</h1>
        <form onSubmit={addToList}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Create a new todo..."
          />

          {filteredList.map((item) => (
            <div key={item.id}>
              <input
                type="checkbox"
                id={`todo-${item.id}`}
                checked={item.completed}
                onChange={() => handleCheck(item.id)}
              />
              <label
                className={`${item.completed === true ? "line-through" : ""} px-2`}
                htmlFor={`todo-${item.id}`}
              >
                {item.title}
              </label>
              <button type="button" onClick={() => removeFromList(item.id)}>
                X
              </button>
            </div>
          ))}
        </form>
        <div className="*:px-2">
          <button
            className={`${status === "all" && "text-Blue-500"}`}
            onClick={() => setStatus("all")}
          >
            All
          </button>
          <button
            className={`${status === "active" && "text-Blue-500"}`}
            onClick={() => setStatus("active")}
          >
            Active
          </button>
          <button
            className={`${status === "completed" && "text-Blue-500"}`}
            onClick={() => setStatus("completed")}
          >
            Completed
          </button>
        </div>
      </div>
    </main>
  );
};

export default App;
