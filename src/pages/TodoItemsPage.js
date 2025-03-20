import "../App.css";
import { Spacer } from "../Utils";
import "./Common.css";
import "./TodoItems.css";
import axios from "axios";
import { useEffect, useState } from "react";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

/**
 * Fetch all lists.
 */
const getAllLists = async () => {
  return (await axios.get("http://localhost:3001/lists")).data;
};

/**
 * Create a new list.
 */
const createList = async (name) => {
  return (await axios.post("http://localhost:3001/lists", { name })).data;
};

/**
 * Fetch all to-do items for a specific list.
 */
const getAllToDoItems = async (listId) => {
  return (await axios.get(`http://localhost:3001/items?listId=${listId}`)).data;
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

  const handleMarkAsComplete = async () => {
    await onUpdate(item.id, { isComplete: true });
  };

  return (
    <div className={`card shadow-xl mb-4 ${item.isComplete ? "bg-base-200" : "bg-base-100"}`}>
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
            <div className="text-sm text-gray-500">
              <p>Created: {new Date(createdAt).toLocaleString()}</p>
              <p>Updated: {new Date(updatedAt).toLocaleString()}</p>
              {item.isComplete && (
                <p>Completed: {new Date(completedAt).toLocaleString()}</p>
              )}
            </div>
            <div className="card-actions justify-end">
              {!item.isComplete && (
                <button onClick={handleMarkAsComplete} className="btn btn-success">
                  Mark as Complete
                </button>
              )}
              <button onClick={() => setIsEditing(true)} className="btn btn-secondary">
                Edit
              </button>
              <button onClick={() => onDelete(item.id)} className="btn btn-error">
                Delete
              </button>
              <button onClick={() => onStar(item.id)} className="btn btn-warning">
                {item.starred ? "Unstar" : "Star"}
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
  const [lists, setLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);
  const [todoItems, setTodoItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newListName, setNewListName] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showStarred, setShowStarred] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showTaskFormForList, setShowTaskFormForList] = useState(null); // Track which list's task form is visible

  // Fetch lists from the server
  const fetchLists = async () => {
    try {
      const lists = await getAllLists();
      setLists(lists);
      if (lists.length > 0) {
        setSelectedListId(lists[0].id); // Select the first list by default
      }
    } catch (error) {
      console.error("Failed to fetch lists.", error);
    }
  };

  // Fetch todos for the selected list
  const fetchItems = async (listId) => {
    try {
      const items = await getAllToDoItems();
      setTodoItems(items);
    } catch (error) {
      console.error("Failed to fetch to-do items.", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch todos on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (selectedListId) {
      fetchItems(selectedListId);
    }
  }, [selectedListId]);

  const handleCreateList = async () => {
    if (!newListName) return;
    const newList = await createList(newListName);
    setLists([...lists, newList]);
    setNewListName("");
  };

  const handleCreateTask = async (listId, heading, body) => {
    if (!heading || !body || !listId) return;

    const newItem = { heading, body, isComplete: false, listId };
    const createdItem = await createToDoItem(newItem);
    setTodoItems([...todoItems, createdItem]);
    setShowTaskFormForList(null); // Hide the task form after creation
  };

  const handleDelete = async (id) => {
    await deleteToDoItem(id);
    await fetchItems(selectedListId);
    setDeleteModalOpen(false);
  };

  const handleUpdate = async (id, updatedItem) => {
    await updateToDoItem(id, updatedItem);
    await fetchItems(selectedListId);
  };

  const handleStar = (id) => {
    setTodoItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, starred: !item.starred } : item
      )
    );
  };

  const calculateProgress = (todos) => {
    const completedTodos = todos.filter((todo) => todo.isComplete).length;
    return (completedTodos / todos.length) * 100 || 0;
  };

  const filteredTodos = todoItems.filter((todo) => {
    if (showStarred && !todo.starred) return false;
    const todoDate = new Date(todo.createdAt).toDateString();
    return todoDate === selectedDate.toDateString();
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-base-200 p-4">
        <h2 className="text-xl font-bold mb-4">Lists</h2>
        <input
          type="text"
          placeholder="New List Name"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          className="input input-bordered w-full mb-2"
        />
        <button onClick={handleCreateList} className="btn btn-primary w-full mb-4">
          Create List
        </button>
        {lists.map((list) => (
          <div key={list.id} className="mb-4">
            <div
              className="p-2 hover:bg-base-300 cursor-pointer"
              onClick={() => setSelectedListId(list.id)}
            >
              <div>{list.name}</div>
              <div className="w-full bg-gray-300 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${calculateProgress(todoItems)}%` }}
                ></div>
              </div>
            </div>
            <button
              onClick={() => setShowTaskFormForList(list.id)}
              className="btn btn-secondary w-full mt-2"
            >
              Add Task
            </button>
            {showTaskFormForList === list.id && (
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Task Heading"
                  className="input input-bordered w-full mb-2"
                  id={`task-heading-${list.id}`}
        />
        <textarea
                  placeholder="Task Body"
          className="textarea textarea-bordered w-full mb-2"
                  id={`task-body-${list.id}`}
        />
                <button
                  onClick={() => {
                    const heading = document.getElementById(`task-heading-${list.id}`).value;
                    const body = document.getElementById(`task-body-${list.id}`).value;
                    handleCreateTask(list.id, heading, body);
                  }}
                  className="btn btn-primary w-full"
                >
                  Save Task
        </button>
              </div>
            )}
          </div>
        ))}
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