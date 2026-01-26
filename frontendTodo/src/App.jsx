import { useEffect, useState } from "react";
import todoService from "./services/todos";

const App = () => {
  const [todoItems, setTodoItems] = useState([]);
  const [query, setQuery] = useState("");

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

          {todoItems.map((item) => (
            <div
              key={item.id}
              className={`${item.status === true ? "text-red-400" : ""}`}
            >
              <input type="checkbox" id="todo" checked={item.status} />
              <label htmlFor="todo">{item.title}</label>
              <button type="button" onClick={() => removeFromList(item.id)}>
                X
              </button>
            </div>
          ))}
        </form>
      </div>
    </main>
  );
};

export default App;
