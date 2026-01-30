import { useEffect, useState } from "react";
import todoService from "./services/todos";

const buttons = ["All", "Active", "Completed"];

const App = () => {
  const [todoItems, setTodoItems] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");

  const addToList = (e) => {
    e.preventDefault();
    todoService.create({ title: query }).then((returnedValue) => {
      setTodoItems((prev) => [...prev, returnedValue]);
      setQuery("");
    });
  };

  const removeFromList = (id) => {
    todoService.deleted(id).then(() => {
      setTodoItems((prev) => prev.filter((todo) => todo.id !== id));
    });
  };

  const deleteAllCompletedTodo = () => {
    todoService.deleteAllCompleted().then(() => {
      setTodoItems((prev) => prev.filter((item) => !item.completed));
    });
  };

  const handleCheck = (id) => {
    const existingTodo = todoItems.find((todo) => todo.id === id);

    todoService
      .update(id, { ...existingTodo, completed: !existingTodo.completed })
      .then((returnedValue) => {
        setTodoItems((prev) =>
          prev.map((item) => (item.id !== id ? item : returnedValue)),
        );
      });
  };

  const list = todoItems.concat();
  const filteredList =
    status === "All"
      ? todoItems
      : status === "Active"
        ? list.filter((item) => item.completed === false)
        : status === "Completed"
          ? list.filter((item) => item.completed === true)
          : "";

  useEffect(() => {
    todoService.getAll().then((initialTodos) => setTodoItems(initialTodos));
  }, []);

  return (
    <main>
      <div className="bg-Gray-50 absolute inset-0 z-10"></div>

      <div className="absolute z-10">
        <img src="bg-desktop-light.jpg" alt="" />
      </div>

      <div className="flex justify-center items-center h-screen">
        <div className="p-4 relative z-20 w-md">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold text-Gray-50">TODO</h1>
            <img
              className="cursor-pointer"
              src="icon-moon.svg"
              alt="toggle dark mode"
            />
          </div>

          <form onSubmit={addToList}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Create a new todo..."
              className="px-3 py-2 rounded-md shadow-lg bg-Gray-50 mx-auto block w-full m-6"
            />

            <div className="shadow-lg">
              {filteredList.map((item) => (
                <div
                  key={item.id}
                  className="bg-Gray-50 border-b flex justify-between border-b-Gray-300 px-4 py-2 cursor-pointer"
                >
                  <div>
                    <input
                      type="checkbox"
                      id={`todo-${item.id}`}
                      checked={item.completed}
                      onChange={() => handleCheck(item.id)}
                      className="checked:bg-Blue-500 relative appearance-none border rounded-full border-Blue-500 cursor-pointer w-4 h-4"
                    />
                    <label
                      className={`${item.completed === true ? "line-through text-Gray-300" : "text-Navy-850"} pl-4`}
                      htmlFor={`todo-${item.id}`}
                    >
                      {item.title}
                    </label>
                  </div>
                  <button
                    type="button"
                    className="cursor-pointer"
                    onClick={() => removeFromList(item.id)}
                  >
                    <img src="icon-cross.svg" alt="" />
                  </button>
                </div>
              ))}

              <div className="flex justify-between items-center text-base p-2 text-Gray-600">
                <p>
                  {todoItems.filter((item) => item.completed === false).length}{" "}
                  items left
                </p>
                <div className="*:px-2 flex">
                  {buttons.map((button) => (
                    <button
                      className={`${status === button ? "text-Blue-500 hover:text-Blue-500 font-semibold" : "hover:text-Navy-850"} cursor-pointer`}
                      onClick={() => setStatus(button)}
                      key={button}
                    >
                      {button}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={deleteAllCompletedTodo}
                  className="hover:text-Navy-850 cursor-pointer"
                >
                  Clear completed
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default App;
