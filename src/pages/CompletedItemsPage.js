import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal";
import { NotificationContext } from "../context/NotificationContext";
import DatePicker from "react-datepicker";

// Service module for API calls
const todoService = {
  getAllToDoItems: async () => {
    try {
      const response = await axios.get("http://localhost:3001/items?isComplete=true");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch completed items.", error);
      throw error;
    }
  },

  toggleCompletion: async (id, isComplete) => {
    try {
      const now = new Date().toISOString();
      const response = await axios.patch(`http://localhost:3001/items/${id}`, {
        isComplete: !isComplete, // Toggle completion status
        updatedAt: now // Update the updatedAt field
      });
      return response.data;
    } catch (error) {
      console.error("Failed to toggle item completion status.", error);
      throw error;
    }
  },
};

const TodoItem = ({ item, isLast, onToggleCompletion, onDelete }) => {
  return (
    <div className="card bg-base-100 shadow-xl mb-8">
      <div className="card-body">
        <h2 className="card-title">{item.heading}</h2>
        <div className="card-item-body">
          <p>{item.body}</p>
        </div>
        <div className="text-sm text-gray-500">
          <p>Created: {new Date(item.createdAt).toLocaleString()}</p>
          <p>Updated: {new Date(item.updatedAt).toLocaleString()}</p>
        </div>
        <div className="card-actions justify-end">
          <button
            className="btn btn-secondary"
            onClick={() => onToggleCompletion(item.id, item.isComplete)}
          >
            Move Back to To-Do
          </button>
          <button
            className="btn btn-error"
            onClick={() => onDelete(item.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export const CompletedItemsPage = () => {
  const [todoItems, setTodoItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const { showNotification } = useContext(NotificationContext);

  // Fetch completed items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const items = await todoService.getAllToDoItems();
        setTodoItems(items);
      } catch (error) {
        console.error("Failed to fetch completed items.", error);
        setTodoItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Filter items by date range
  const filteredTodos = todoItems.filter((todo) => {
    if (startDate && endDate) {
      const todoDate = new Date(todo.createdAt);
      return todoDate >= startDate && todoDate <= endDate;
    }
    return true; // If no date range is selected, include all items
  });

  // Handle toggling an item back to incomplete
  const handleToggleCompletion = async (id, isComplete) => {
    try {
      await todoService.toggleCompletion(id, isComplete);
      const updatedItems = await todoService.getAllToDoItems();
      setTodoItems(updatedItems);
      showNotification("Task moved back to To-Do!", "success");
    } catch (error) {
      showNotification("Failed to move task.", "error");
    }
  };

  // Handle deleting a completed item
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/items/${id}`);
      const updatedItems = await todoService.getAllToDoItems();
      setTodoItems(updatedItems);
      showNotification("Task deleted successfully!", "success");
    } catch (error) {
      showNotification("Failed to delete task.", "error");
    } finally {
      setDeleteModalOpen(false);
    }
  };

  return (
    <div className="container mx-auto mt-10">
      {/* Date Filter Controls */}
      <div className="flex justify-between mb-4">
        <div className="flex gap-2">
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

      {/* Render todo items */}
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : filteredTodos.length === 0 ? (
        <div className="hero bg-base-200 min-h-screen">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">Hello there</h1>
              <p className="py-6">No completed tasks found.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="card-container">
          {filteredTodos.map((item, i) => (
            <TodoItem
              key={item.id}
              item={item}
              isLast={i === filteredTodos.length - 1}
              onToggleCompletion={handleToggleCompletion}
              onDelete={(id) => {
                setItemToDelete(id);
                setDeleteModalOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onConfirm={() => handleDelete(itemToDelete)}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};