import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState(() => {
    return JSON.parse(localStorage.getItem("todos")) || [];
  });
  const [editingId, setEditingId] = useState(null);
  const [showFinished, setShowFinished] = useState(true);
// Something some
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem("todos", JSON.stringify(todos));
    }, 300);
    return () => clearTimeout(timer);
  }, [todos]);

  const handleAdd = () => {
    const trimmedTodo = todo.trim();
    if (!trimmedTodo) return;

    if (editingId) {
      setTodos((prevTodos) =>
        prevTodos.map((item) =>
          item.id === editingId ? { ...item, todo: trimmedTodo } : item
        )
      );
      setEditingId(null);
    } else {
      setTodos([...todos, { id: uuidv4(), todo: trimmedTodo, isCompleted: false }]);
    }

    setTodo("");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this ToDo?")) {
      setTodos(todos.filter((item) => item.id !== id));
    }
  };

  const handleEdit = (id) => {
    const toEdit = todos.find((item) => item.id === id);
    if (toEdit) {
      setTodo(toEdit.todo);
      setEditingId(id);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  const handleCheckboxChange = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((item) =>
        item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
      )
    );
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto my-5 p-5 bg-violet-100 min-h-[80vh] rounded-xl max-w-2xl">
        <h1 className="font-bold text-center text-2xl md:text-3xl">
          iTask - Manage Your Todos
        </h1>

        {/* Add Todo Section */}
        <div className="addTodo my-5 mx-auto">
          <h2 className="text-lg font-bold text-center">
            {editingId ? "Edit ToDo" : "Add a ToDo"}
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <input
              onChange={(e) => setTodo(e.target.value)}
              onKeyDown={handleKeyPress}
              value={todo}
              type="text"
              placeholder="Enter your task..."
              className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 border-2 border-gray-400 p-3 rounded-lg"
            />
            <button
              onClick={handleAdd}
              className={`px-5 py-3 text-lg font-bold text-white rounded-lg transition-all duration-200 ${
                todo.trim() !== ""
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-800 hover:bg-blue-950"
              }`}
            >
              {editingId ? "Edit" : "Add"}
            </button>
          </div>
        </div>

        {/* Show Finished Toggle */}
        <div className="flex items-center justify-center my-3">
          <input
            id="showFinished"
            type="checkbox"
            checked={showFinished}
            onChange={() => setShowFinished(!showFinished)}
            className="mr-2"
          />
          <label htmlFor="showFinished" className="text-lg font-bold">
            Show Finished
          </label>
        </div>

        {/* Todo List */}
        <h2 className="text-lg font-bold text-center">Your Todos</h2>
        <div className="todos mx-auto max-w-xl">
          {todos.length === 0 && (
            <div className="m-5 text-center">No ToDo to display</div>
          )}
          {todos
            .filter((item) => showFinished || !item.isCompleted)
            .map((item) => (
              <div
                key={item.id}
                className="todo flex flex-wrap w-full sm:w-full md:w-3/4 lg:w-2/3 mx-auto my-3 items-center bg-white p-4 shadow-md rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105"
              >
                <input
                  type="checkbox"
                  checked={item.isCompleted}
                  onChange={() => handleCheckboxChange(item.id)}
                  className="mr-2"
                />
                <div
                  className={`flex-grow ${
                    item.isCompleted ? "line-through text-gray-500" : ""
                  }`}
                >
                  {item.todo}
                </div>
                <div className="buttons flex space-x-2">
                  <button
                    onClick={() => handleEdit(item.id)}
                    className="bg-blue-500 hover:bg-blue-700 px-4 py-2 text-sm font-bold text-white rounded-lg transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 hover:bg-red-700 px-4 py-2 text-sm font-bold text-white rounded-lg transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default App;
