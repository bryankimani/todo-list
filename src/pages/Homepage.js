import "./Common.css";
import "../App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { ProgressChart } from "../components/ProgressChart";

/**
 * Fetch all todo items.
 */
const getAllToDoItems = async () => {
  return (await axios.get("http://localhost:3001/items")).data;
};

/**
 * Homepage component with a pie chart.
 */
export const Homepage = () => {
  const [todoData, setTodoData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const items = await getAllToDoItems();
        const totalTodos = items.length;
        const completedTodos = items.filter((item) => item.isComplete).length;
        const incompleteTodos = totalTodos - completedTodos;

        setTodoData([
          { name: "Completed", value: completedTodos },
          { name: "Incomplete", value: incompleteTodos },
        ]);
      } catch (error) {
        console.error("Failed to fetch todo items.", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary">Welcome to the Home Page!</h1>
        <p className="text-lg text-gray-600">Click a button above to get started.</p>
      </div>

      {/* Pie Chart Card */}
      <ProgressChart data={todoData} />
    </div>
  );
};
