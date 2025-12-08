import React, { useState } from "react";

const App = () => {
  const [task, setTask] = useState("");
  const [time, setTime] = useState("");
  const [todos, setTodos] = useState([]);

  const addTodo = (e) => {
    e.preventDefault();
    if (!task.trim()) return;

    const newTodo = {
      text: task,
      time: time || "No time set",
    };

    setTodos([...todos, newTodo]);
    setTask("");
    setTime("");
  };

  const deleteTodo = (index) => {
    const updated = todos.filter((_, i) => i !== index);
    setTodos(updated);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-4xl">
        
        {/* Tasks List */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h1 className="text-2xl font-semibold mb-4">Your Tasks</h1>

          {todos.length === 0 ? (
            <p className="text-gray-500">No tasks yet.</p>
          ) : (
            <ol className="space-y-2 list-decimal list-inside">
              {todos.map((item, index) => (
                <li
                  key={index}
                  className="bg-gray-100 p-3 rounded-lg shadow-sm flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{item.text}</p>
                    <p className="text-sm text-gray-600">{item.time}</p>
                  </div>

                  <button
                    onClick={() => deleteTodo(index)}
                    className="text-red-500 hover:text-red-700 font-medium"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* Add Task Form */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h1 className="text-2xl font-semibold mb-4">Add Task</h1>

          <form className="flex flex-col" onSubmit={addTodo}>
            <label className="font-medium mb-1">Task</label>
            <input
              value={task}
              onChange={(e) => setTask(e.target.value)}
              type="text"
              placeholder="Enter task"
              className="border border-gray-300 p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <label className="font-medium mb-1">Time</label>
            <input
              value={time}
              onChange={(e) => setTime(e.target.value)}
              type="time"
              className="border border-gray-300 p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
              Submit
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default App;
