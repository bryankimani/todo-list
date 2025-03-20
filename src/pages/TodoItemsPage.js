import "../App.css";
import { Spacer } from "../Utils";
import "./Common.css";
import "./TodoItems.css";
import axios from "axios";
import { useEffect, useState } from "react";

/**
 * This makes a request to the server / DB to get all to-do's that aren't currently completed.
 */
const getAllToDoItems = async () => {
  return (await axios.get("http://localhost:3001/items?isComplete=false")).data;
};

/**
 * Create a new todo item.
 */
const createToDoItem = async (newItem) => {
  return (await axios.post("http://localhost:3001/items", newItem)).data;
};

/**
 * Delete a todo item.
 */
const deleteToDoItem = async (id) => {
  await axios.delete(`http://localhost:3001/items/${id}`);
};

/**
 * Update a todo item.
 */
const updateToDoItem = async (id, updatedItem) => {
  return (await axios.patch(`http://localhost:3001/items/${id}`, updatedItem)).data;
};

/**
 * Single todo item component.
 */
const TodoItem = ({ item, isLast, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedHeading, setUpdatedHeading] = useState(item.heading);
  const [updatedBody, setUpdatedBody] = useState(item.body);

  const handleUpdate = async () => {
    await onUpdate(item.id, { heading: updatedHeading, body: updatedBody });
    setIsEditing(false);
  };

  return (
    <div className="card bg-base-100 shadow-xl mb-4">
      <div className="card-body">
        {isEditing ? (
          <>
            <input
              type="text"
              value={updatedHeading}
              onChange={(e) => setUpdatedHeading(e.target.value)}
              className="input input-bordered w-full mb-2"
            />
            <textarea
              value={updatedBody}
              onChange={(e) => setUpdatedBody(e.target.value)}
              className="textarea textarea-bordered w-full mb-2"
            />
            <button onClick={handleUpdate} className="btn btn-primary">
              Save
            </button>
            <button onClick={() => setIsEditing(false)} className="btn btn-ghost">
              Cancel
            </button>
          </>
        ) : (
          <>
            <h2 className="card-title">{item.heading}</h2>
            <p>{item.body}</p>
            <div className="card-actions justify-end">
              <button onClick={() => setIsEditing(true)} className="btn btn-secondary">
                Edit
              </button>
              <button onClick={() => onDelete(item.id)} className="btn btn-error">
                Delete
              </button>
            </div>
          </>
        )}
      </div>
      {!isLast && <Spacer height="5vmin" />}
    </>
  );
};

/**
 * This defines the to-do list, which contains items that haven't been completed yet.
 */
export const ToDoItemsPage = () => {
  // Leave undefined so we can tell when the page is "loading"
  const [todoItems, setTodoItems] = useState();

  useEffect(() => {
    getAllToDoItems()
      .then((result) => {
        setTodoItems(result);
      })
      .catch(() => {
        console.error("Failed to fetch to-do items.");
      });
  }, []);

  return (
    <div className="CenterDiv">
      {todoItems === undefined && <p>Loading...</p>}
      {todoItems !== undefined &&
        todoItems.map((item, i) => (
          <TodoItem key={i} item={item} isLast={i === todoItems.length - 1} />
        ))}
    </div>
  );
};
