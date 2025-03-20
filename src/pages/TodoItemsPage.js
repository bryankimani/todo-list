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
  const now = new Date().toISOString(); // Get current timestamp
  const itemWithDates = {
    ...newItem,
    createdAt: now, // Set creation date
    updatedAt: now, // Set update date (same as creation date initially)
    completedAt: null, // Set completion date to null initially
  };
  return (await axios.post("http://localhost:3001/items", itemWithDates)).data;
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
  const now = new Date().toISOString(); // Get current timestamp
  const itemWithDates = {
    ...updatedItem,
    updatedAt: now, // Update the timestamp
    completedAt: updatedItem.isComplete ? now : null, // Set completion date if isComplete is true
  };
  return (await axios.patch(`http://localhost:3001/items/${id}`, itemWithDates)).data;
};

/**
 * Single todo item component.
 */
const TodoItem = ({ item, isLast, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedHeading, setUpdatedHeading] = useState(item.heading);
  const [updatedBody, setUpdatedBody] = useState(item.body);

  // Provide default values for missing fields
  const createdAt = item.createdAt || "Unknown";
  const updatedAt = item.updatedAt || "Unknown";
  const completedAt = item.completedAt || null;

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
    </div>
  );
};

/**
 * Confirmation modal for deleting a todo item.
 */
const DeleteConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-base-100 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
        <p>This action cannot be undone.</p>
        <div className="flex justify-end mt-4">
          <button onClick={onCancel} className="btn btn-ghost mr-2">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn btn-error">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Main todo list page with sidebar and content.
 */
export const ToDoItemsPage = () => {
  const [todoItems, setTodoItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newHeading, setNewHeading] = useState("");
  const [newBody, setNewBody] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const items = await getAllToDoItems();
        setTodoItems(items);
      } catch (error) {
        console.error("Failed to fetch to-do items.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleCreate = async () => {
    if (!newHeading || !newBody) return;

    const newItem = { heading: newHeading, body: newBody, isComplete: false };
    const createdItem = await createToDoItem(newItem);
    setTodoItems([...todoItems, createdItem]);
    setNewHeading("");
    setNewBody("");
  };

  const handleDelete = async (id) => {
    await deleteToDoItem(id);
    setTodoItems(todoItems.filter((item) => item.id !== id));
    setDeleteModalOpen(false);
  };

  const handleUpdate = async (id, updatedItem) => {
    const updated = await updateToDoItem(id, updatedItem);
    setTodoItems(todoItems.map((item) => (item.id === id ? updated : item)));
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-base-200 p-4">
        <h2 className="text-xl font-bold mb-4">Create New Todo</h2>
        <input
          type="text"
          placeholder="Heading"
          value={newHeading}
          onChange={(e) => setNewHeading(e.target.value)}
          className="input input-bordered w-full mb-2"
        />
        <textarea
          placeholder="Body"
          value={newBody}
          onChange={(e) => setNewBody(e.target.value)}
          className="textarea textarea-bordered w-full mb-2"
        />
        <button onClick={handleCreate} className="btn btn-primary w-full">
          Create
        </button>
      </div>

      {/* Content */}
      <div className="w-full md:w-3/4 p-4">
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : todoItems.length === 0 ? (
          <p>No to-do items found.</p>
        ) : (
          todoItems.map((item, i) => (
            <TodoItem
              key={item.id}
              item={item}
              isLast={i === todoItems.length - 1}
              onDelete={(id) => {
                setItemToDelete(id);
                setDeleteModalOpen(true);
              }}
              onUpdate={handleUpdate}
            />
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onConfirm={() => handleDelete(itemToDelete)}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};
