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
        isComplete: !isComplete,
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
  console.log(item); // Debugging
  return (
    <>
      <div className="TodoItemContainer">
        <p className="TodoItemHeader">{item.heading}</p>
        <p className="TodoText">{item.body}</p>
        <button
          className="btn btn-secondary"
          onClick={() => onToggleCompletion(item.id, item.isComplete)}
        >
          Move Back to To-Do
        </button>
      </div>
      {!isLast && <Spacer height="5vmin" />}
    </>
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
        console.log("Fetched items:", items); // Debugging
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
