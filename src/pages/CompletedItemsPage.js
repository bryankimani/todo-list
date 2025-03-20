import "../App.css";
import { Spacer } from "../Utils";
import "./Common.css";
import "./TodoItems.css";
import axios from "axios";
import { useEffect, useState } from "react";

// Service module for API calls
const todoService = {
  getAllToDoItems: async () => {
    try {
      const response = await axios.get("http://localhost:3001/items?isComplete=true");
      console.log("API Response:", response.data); // Debugging
      return response.data;
    } catch (error) {
      console.error("Failed to fetch completed items.", error);
      throw error;
    }
  },

  toggleCompletion: async (id, isComplete) => {
    try {
      const response = await axios.patch(`http://localhost:3001/items/${id}`, {
        isComplete: !isComplete, // Toggle completion status
        completedAt: !isComplete ? null : new Date().toISOString(), // Set completedAt to null if marking as incomplete
      });
      console.log("Toggled item:", response.data); // Debugging
      return response.data;
    } catch (error) {
      console.error("Failed to toggle item completion status.", error);
      throw error;
    }
  },
};

const TodoItem = ({ item, isLast, onToggleCompletion }) => {
  return (
    <div className="card bg-base-100 shadow-xl mb-8">
      <div className="card-body">
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
          <button
            className="btn btn-secondary"
            onClick={() => onToggleCompletion(item.id, item.isComplete)}
          >
            Move Back to To-Do
          </button>
        </div>
      </div>
    </div>
  );
};

const Loading = () => <p>Loading...</p>;

export const CompletedItemsPage = () => {
  const [todoItems, setTodoItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch completed items on component mount
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const items = await todoService.getAllToDoItems();
        setTodoItems(items);
      } catch (error) {
        console.error("Failed to fetch completed items.", error);
        setTodoItems([]); // Set to empty array to avoid rendering issues
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Handle toggling an item back to incomplete
  const handleToggleCompletion = async (id, isComplete) => {
    try {
      // Update the item's completion status on the server
      await todoService.toggleCompletion(id, isComplete);

      // Refresh the list of completed items
      const updatedItems = await todoService.getAllToDoItems();
      setTodoItems(updatedItems);
    } catch (error) {
      console.error("Failed to toggle item completion status.", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : todoItems.length === 0 ? (
        <div className="text-center">
          <p className="text-xl">No completed items found.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {todoItems.map((item, i) => (
            <TodoItem
            key={item.id} // Use item.id instead of index for better key management
              item={item}
              isLast={i === todoItems.length - 1}
              onToggleCompletion={handleToggleCompletion}
            />
          ))}
        </div>
      )}
    </div>
  );
};