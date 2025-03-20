import "../App.css";
import { Spacer } from "../Utils";
import "./Common.css";
import "./TodoItems.css";
import axios from "axios";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import the styles

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
            <div className="card-actions">
                {!item.isComplete && (
                  <button onClick={handleMarkAsComplete} className="btn btn-success btn-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
                <button onClick={() => setIsEditing(true)} className="btn btn-secondary btn-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <button onClick={() => onDelete(item.id)} className="btn btn-error btn-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
                <button onClick={() => onStar(item.id)} className="btn btn-warning btn-sm">
                  {item.starred ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  )}
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
  const [showTaskFormForList, setShowTaskFormForList] = useState(null); // Track which list's task form is visible
  const [selectedFilterListId, setSelectedFilterListId] = useState(""); // Track the selected list for filtering
  const [dateRange, setDateRange] = useState([null, null]); // Track the selected date range
  const [startDate, endDate] = dateRange;

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
    if (startDate && endDate) {
      const todoDate = new Date(todo.createdAt);
      return todoDate >= startDate && todoDate <= endDate;
    }
    return true;
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
  <div className="flex-grow"> {/* Ensure DatePicker takes remaining space */}
    <DatePicker
      selectsRange={true}
      startDate={startDate}
      endDate={endDate}
      onChange={(update) => {
        setDateRange(update);
      }}
      isClearable={true}
      placeholderText="Filter by date"
      className="input input-bordered w-full" // Ensure full width
    />
  </div>
</div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : todoItems.length === 0 ? (
          <>
            <div className="hero bg-base-200 min-h-screen">
              <div className="hero-content text-center">
                <div className="max-w-md">
                  <h1 className="text-5xl font-bold">Hello there</h1>
                  <p className="py-6">
                    You don't have any tasks yet. Create a new task group to get started.
                  </p>
                </div>
              </div>
            </div>
          </>
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