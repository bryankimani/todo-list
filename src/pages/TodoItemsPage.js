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
 * Fetch all to-do items for a specific list or all lists.
 */
const getAllToDoItems = async (listId) => {
  let url = "http://localhost:3001/items?isComplete=false";
  
  // Append listId to the URL only if it's provided
  if (listId) {
    url += `&listId=${listId}`;
  }

  return (await axios.get(url)).data;
};

/**
 * Create a new todo item.
 */
const createToDoItem = async (newItem) => {
  const now = new Date().toISOString();
  const itemWithDates = {
    ...newItem,
    createdAt: now,
    updatedAt: now,
    completedAt: null,
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
  const now = new Date().toISOString();
  const itemWithDates = {
    ...updatedItem,
    updatedAt: now,
    completedAt: updatedItem.isComplete ? now : null,
  };
  return (await axios.patch(`http://localhost:3001/items/${id}`, itemWithDates)).data;
};

/**
 * Single todo item component.
 */
const TodoItem = ({
  item,
  isLast,
  onDelete,
  onUpdate,
  onStar,
  fetchItems,
  selectedFilterListId,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedHeading, setUpdatedHeading] = useState(item.heading);
  const [updatedBody, setUpdatedBody] = useState(item.body);

  const handleUpdate = async () => {
    await onUpdate(item.id, { heading: updatedHeading, body: updatedBody });
    setIsEditing(false);
  };

  const handleMarkAsComplete = async () => {
    await onUpdate(item.id, { isComplete: true });
    await fetchItems(selectedFilterListId); // Refresh the list based on the current filter
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
              <p>Created: {new Date(item.createdAt).toLocaleString()}</p>
              <p>Updated: {new Date(item.updatedAt).toLocaleString()}</p>
              {item.isComplete && (
                <p>Completed: {new Date(item.completedAt).toLocaleString()}</p>
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
  const [selectedFilterListId, setSelectedFilterListId] = useState(""); // Track the selected list for filtering

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
      const items = await getAllToDoItems(listId || null); // Pass null for "All Lists"
      setTodoItems(items);
    } catch (error) {
      console.error("Failed to fetch to-do items.", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch todos on component mount
  useEffect(() => {
    fetchLists();
  }, []);

  useEffect(() => {
    if (selectedListId) {
      fetchItems(selectedListId);
    }
  }, [selectedListId]);

  useEffect(() => {
    if (selectedFilterListId !== "") {
      fetchItems(selectedFilterListId); // Fetch items for the selected filter list
    } else {
      fetchItems(null); // Fetch items for all lists
    }
  }, [selectedFilterListId]);

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
    await fetchItems(selectedFilterListId || null);
    setDeleteModalOpen(false);
  };

  const handleUpdate = async (id, updatedItem) => {
    await updateToDoItem(id, updatedItem); // Update the to-do
    await fetchItems(selectedFilterListId || null); // Refresh the list
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
    if (selectedFilterListId && todo.listId !== selectedFilterListId) return false;
    const todoDate = new Date(todo.createdAt).toDateString();
    return todoDate === selectedDate.toDateString();
  });

  return (
    <div className="container mx-auto flex flex-col md:flex-row min-h-screen mt-10">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-base-200 p-4">
        <h2 className="text-xl font-bold mb-4">Task Groups</h2>
        <input
          type="text"
          placeholder="New task group name"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          className="input input-bordered w-full mb-2"
        />
        <button onClick={handleCreateList} className="btn btn-primary w-full mb-4">
          Create task group
        </button>
        <ul class="list bg-base-100 rounded-box shadow-md">
        {lists.map((list, i) => (
          <div key={list.id} className="mb-4">
            <li class="list-row">
              <div class="text-4xl font-thin opacity-30 tabular-nums">{i+1}</div>
              <div class="list-col-grow">
              <div>{list.name}</div>
                <div class="text-xs uppercase font-semibold opacity-60">
                    <div className="hover:bg-base-300 cursor-pointer">
                  
              <div className="w-full bg-gray-300 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${calculateProgress(todoItems)}%` }}
                ></div>
              </div>
            </div>
                </div>
              </div>
              <button class="btn btn-square btn-ghost"  onClick={() => setShowTaskFormForList(list.id)}>
              Add Task
            </button>
            </li>
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
        </ul>
      </div>

      {/* Content */}
      <div className="w-full md:w-3/4 pl-4 pb-0">
        <div className="flex justify-between mb-4">
          <div className="flex gap-2">
            <button onClick={() => setShowStarred(!showStarred)} className="btn btn-warning">
              {showStarred ? "Show All" : "Show Starred"}
            </button>
            <select
              value={selectedFilterListId}
              onChange={(e) => setSelectedFilterListId(e.target.value)}
              className="select select-bordered"
            >
              <option value="">All Lists</option>
              {lists.map((list) => (
                <option key={list.id} value={list.id}>
                  {list.name}
                </option>
              ))}
            </select>
          </div>
          <ReactCalendar onChange={setSelectedDate} value={selectedDate} />
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : todoItems.length === 0 ? (
          <p>No to-do items found.</p>
        ) : (
          filteredTodos.map((item, i) => (
            <TodoItem
              key={item.id}
              item={item}
              isLast={i === filteredTodos.length - 1}
              onDelete={(id) => {
                setItemToDelete(id);
                setDeleteModalOpen(true);
              }}
              onUpdate={handleUpdate}
              onStar={handleStar}
              fetchItems={fetchItems} // Pass fetchItems as a prop
              selectedFilterListId={selectedFilterListId} // Pass selectedFilterListId instead of selectedListId
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