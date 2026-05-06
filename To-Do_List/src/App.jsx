import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [task, settask] = useState(""); 
  const [taskBoard, settaskBoard] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null); 

  const handleTask = (event) => {
    const item = event.target.value;
    settask(item);
  };

  const handleTaskBoard = () => {
    if (task.trim() !== "") {
      if (editingIndex !== null) {
        const updatedTasks = taskBoard.map((item, idx) =>
          idx === editingIndex ? task : item
        );
        settaskBoard(updatedTasks);
        setEditingIndex(null); 
      } else {
        settaskBoard([...taskBoard, task]);
      }
      settask(""); 
    }
  };

  const handleDeleteTask = (index) => {
    const updatedTaskBoard = taskBoard.filter((_, idx) => idx !== index);
    settaskBoard(updatedTaskBoard);
  };

  const handleEditTask = (index) => {
    settask(taskBoard[index]); 
    setEditingIndex(index); 
  };

  const GeneratedTask = ({ task, index }) => {
    return (
      <div className="EditAndDeleteContainer">
        <p>{task}</p>
        <div className="modification-btn">
          <button onClick={() => handleEditTask(index)} className="edit-btn">
            Edit
          </button>
          <button
            onClick={() => handleDeleteTask(index)} className="delete-btn">
            Delete
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="container">
        <div className="heading">
          To-Do List
        </div>
        <div className="inner_container">
          <div className="input_container">
            <textarea
              type="text"
              rows={1}
              placeholder="Add or edit task..."
              className="input"
              value={task}
              onChange={handleTask}
            />
            <button
              onClick={handleTaskBoard}
              className="button"
            >
              {editingIndex !== null ? "Save Changes" : "Save"}
            </button>
          </div>
          <div className="task">
            {taskBoard.map((task, index) => (
              <GeneratedTask key={index} index={index} task={task} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}