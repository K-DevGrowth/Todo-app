import { useEffect, useState } from "react";
import todoService from "./services/todos";

const App = () => {
  const [todoItems, setTodoItems] = useState([]);
  const [query, setQuery] = useState("");

  const addToList = (e) => {
    e.preventDefault();
    setTodoItems((prev) => [...prev, { title: query }]);
  };

  useEffect(() => {
    todoService.getAll().then((initialTodos) => setTodoItems(initialTodos));
  }, []);

  return (
    <main>
      <h1>TODO</h1>
      <form onSubmit={addToList}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Create a new todo..."
        />

        {todoItems.map((item) => (
          <div key={item.id}>
            <input type="checkbox" />
            <label htmlFor="">{item.title}</label>
          </div>
        ))}
      </form>
    </main>
  );
};

export default App;
