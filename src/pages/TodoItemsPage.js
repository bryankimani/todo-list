import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal"; 
import { NotificationContext } from "../context/NotificationContext";
import { Pagination } from "../components/Pagination";

// Service module for API calls
const todoService = {
  getAllLists: async () => {
    return (await axios.get("http://localhost:3001/lists")).data;
  },

  createList: async (name) => {
    return (await axios.post("http://localhost:3001/lists", { name })).data;
  },

  getAllToDoItems: async (listId) => {
    let url = "http://localhost:3001/items?isComplete=false"; // Fetch only incomplete todos
    if (listId) {
      url += `&listId=${listId}`;
    }
    return (await axios.get(url)).data;
  },

  getAllTodos: async (listId) => {
    let url = "http://localhost:3001/items"; // Fetch all todos
    if (listId) {
      url += `?listId=${listId}`;
    }
    return (await axios.get(url)).data;
  },

  createToDoItem: async (newItem) => {
    const now = new Date().toISOString();
    const itemWithDates = {
      ...newItem,
      createdAt: now,
      updatedAt: now,
    };
    return (await axios.post("http://localhost:3001/items", itemWithDates)).data;
  },

  deleteToDoItem: async (id) => {
    await axios.delete(`http://localhost:3001/items/${id}`);
  },

  updateToDoItem: async (id, updatedItem) => {
    const now = new Date().toISOString();
    const itemWithDates = {
      ...updatedItem,
      updatedAt: now,
    };
    return (await axios.patch(`http://localhost:3001/items/${id}`, itemWithDates)).data;
  },
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
    await new Promise((resolve) => setTimeout(resolve, 500)); // Add a small delay
    await fetchItems(selectedFilterListId); // Refresh the list
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
    </div>
  );
};

/**
 * Main todo list page with sidebar and content.
 */
export const ToDoItemsPage = () => {
  const [lists, setLists] = useState([]);
  const [todoItems, setTodoItems] = useState([]);
  const [allTodos, setAllTodos] = useState([]); // State for all todos (completed + incomplete)
  const [loading, setLoading] = useState(true);
  const [newListName, setNewListName] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showStarred, setShowStarred] = useState(false);
  const [showTaskFormForList, setShowTaskFormForList] = useState(null);
  const [selectedFilterListId, setSelectedFilterListId] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [progress, setProgress] = useState({}); // Progress for each list
  const { showNotification } = useContext(NotificationContext);

  // Fetch lists and todos on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const lists = await todoService.getAllLists();
        setLists(lists);

        const todos = await todoService.getAllToDoItems(); // Fetch incomplete todos
        setTodoItems(todos);

        const allItems = await todoService.getAllTodos(); // Fetch all todos
        setAllTodos(allItems);

        // Calculate progress for each list
        const progressData = {};
        for (const list of lists) {
          const todosForList = allItems.filter((todo) => todo.listId === list.id);
          const completedTodos = todosForList.filter((todo) => todo.isComplete).length;
          progressData[list.id] = (completedTodos / todosForList.length) * 100 || 0;
        }
        setProgress(progressData);
      } catch (error) {
        console.error("Failed to fetch data.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle creating a new list
  const handleCreateList = async () => {
    if (!newListName) return;
    try {
      const newList = await todoService.createList(newListName);
      setLists([...lists, newList]);
      setNewListName("");
      showNotification("Task group created successfully!", "success");
    } catch (error) {
      showNotification("Failed to create task group.", "error");
    }
  };

  // Handle creating a new todo item
  const handleCreateTask = async (listId, heading, body) => {
    if (!heading || !body || !listId) return;
    try {
      const newItem = { heading, body, isComplete: false, listId };
      const createdItem = await todoService.createToDoItem(newItem);
      setTodoItems([...todoItems, createdItem]);
      setAllTodos([...allTodos, createdItem]); // Update allTodos
      setShowTaskFormForList(null);
      showNotification("Todo item created successfully!", "success");
    } catch (error) {
      showNotification("Failed to create todo item.", "error");
    }
  };

  // Handle deleting a todo item
  const handleDelete = async (id) => {
    try {
      await todoService.deleteToDoItem(id);
      const updatedItems = await todoService.getAllToDoItems(selectedFilterListId || null);
      setTodoItems(updatedItems);
      showNotification("Task deleted successfully!", "success");
    } catch (error) {
      showNotification("Failed to delete task.", "error");
    } finally {
      setDeleteModalOpen(false);
    }
  };

  // Handle updating a todo item
  const handleUpdate = async (id, updatedItem) => {
    // Update the task in the backend
    await todoService.updateToDoItem(id, updatedItem);
  
    // Fetch the updated list of todos
    const updatedAllItems = await todoService.getAllTodos(selectedFilterListId || null);
    setAllTodos(updatedAllItems); // Update allTodos
  
    // Find the listId of the updated task
    const updatedTask = updatedAllItems.find((item) => item.id === id);
    if (updatedTask) {
      showNotification("Task updated successfully!", "success");
      const listId = updatedTask.listId;
  
      // Recalculate progress for the specific list
      const todosForList = updatedAllItems.filter((todo) => todo.listId === listId);
      const completedTodos = todosForList.filter((todo) => todo.isComplete).length;
      const newProgress = (completedTodos / todosForList.length) * 100 || 0;
  
      // Update the progress state
      setProgress((prevProgress) => ({
        ...prevProgress,
        [listId]: newProgress,
      }));
    }
  
    // Fetch the updated list of incomplete todos
    const updatedItems = await todoService.getAllToDoItems(selectedFilterListId || null);
    setTodoItems(updatedItems);
  };

  // Handle toggling a todo's starred status
  const handleStar = (id) => {
    setTodoItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, starred: !item.starred } : item
      )
    );
    setAllTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, starred: !todo.starred } : todo
      )
    );
  };

  // Filter todos based on selected list and date range
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
        <ul className="list bg-base-100 rounded-box shadow-md">
          {lists.map((list, i) => (
            <div key={list.id} className="mb-4">
              <li className="list-row">
                <div className="text-4xl font-thin opacity-30 tabular-nums">{i + 1}</div>
                <div className="list-col-grow">
                  <div>{list.name}</div>
                  <div className="text-xs uppercase font-semibold opacity-60">
                  <div className="hover:bg-base-300 cursor-pointer">
                    <div className="w-full bg-gray-300 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${progress[list.id] || 0}%` }} // Progress bar width
                      ></div>
                    </div>
                    <div className="mt-1 text-center text-gray-600">
                      {`${allTodos.filter((todo) => todo.listId === list.id && todo.isComplete).length} / ${allTodos.filter((todo) => todo.listId === list.id).length} completed`}
                    </div>
                  </div>
                  </div>
                </div>
                <button
                  className="btn btn-square btn-ghost"
                  onClick={() => setShowTaskFormForList(list.id)}
                >
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
            <div className="flex-grow">
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => setDateRange(update)}
                isClearable={true}
                placeholderText="Filter by date"
                className="input input-bordered w-full"
              />
            </div>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : todoItems.length === 0 ? (
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
              fetchItems={todoService.getAllToDoItems}
              selectedFilterListId={selectedFilterListId}
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