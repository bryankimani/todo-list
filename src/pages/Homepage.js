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
    <div className="container mx-auto">
      {/* Header */}
      <div className="hero bg-base-200 mt-10">
        <div className="hero-content flex-col lg:flex-row-reverse">
          {/* Pie Chart Card */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <ProgressChart data={todoData} />
          </div>
          {/* Content Section */}
          <div className="w-full lg:w-1/2">
            <h1 className="text-5xl font-bold">Organize your work and life, finally.</h1>
            <p className="py-6">
            Simplify life for both you and your team with the world’s #1 task manager and to-do list app.<br />

            374K+ ★★★★★ reviews from Google Play
            </p>
            <a className="btn btn-primary" href="/todos">Start for free</a>
          </div>
        </div>
      </div>
      <div className="text-center mt-10 p-10">
      <h2 className="text-6xl pb-10 text-blue-600 dark:text-sky-400">Why ToDOS?</h2>
      <p className="pb-10 text-dark-600 dark:text-sky-400">From simple checklists to complex projects, <br />
      our task management app can handle it all.</p>
      <h5 className="text-sm text-blue-600 dark:text-sky-400">No need to create projects or setups from scratch when <br />
      we have 50+ templates made for you.</h5>
      </div>
    </div>
  );
};
