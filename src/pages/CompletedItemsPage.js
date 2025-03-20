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

const TodoItem = ({ item, isLast }) => {
  console.log(item);
  return (
    <>
      <div className="TodoItemContainer">
        <p className="TodoItemHeader">{item.heading}</p>
        <p className="TodoText">{item.body}</p>
      </div>
      {!isLast && <Spacer height="5vmin" />}
    </>
  );
};

/**
 * This defines the list of completed items.
 */
export const CompletedItemsPage = () => {
  // Leave undefined so we can tell when the page is "loading"
  const [todoItems, setTodoItems] = useState();

  useEffect(() => {
    getAllToDoItems()
      .then((result) => {
        setTodoItems(result);
      })
      .catch(() => {
        console.error("Failed to fetch completed items.");
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
