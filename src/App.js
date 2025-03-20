import logo from "./logo.svg";
import "./App.css";
import { Spacer } from "./Utils";
import { Route, Routes } from "react-router";
import { Homepage } from "./pages/Homepage";
import { ToDoItemsPage } from "./pages/TodoItemsPage";
import { CompletedItemsPage } from "./pages/CompletedItemsPage";

/**
 * This defines a generic app header that is used as a navigation bar for both pages in
 * this application.
 *
 * Feel free to edit this code if you'd like, but it is NOT required.
 */
const AppHeader = () => {
  const todoSelected = window.location.pathname === "/todos";
  const completedItemsSelected = window.location.pathname === "/completed";
  return (
    <header className="AppHeader">
      <img
        src={logo}
        className="App-logo"
        alt="logo"
        onClick={() => (window.location.pathname = "/")}
      />
      <p className="AppHeaderText"><a href="/">To-do List</a></p>
      <div id="AppHeaderNavButtons">
        <a
          className="NavButton"
          href="/todos"
          style={{ textDecoration: todoSelected ? "underline" : "none" }}
        >
          To-do's
        </a>
        <Spacer width={"5vmin"} />
        <a
          className="NavButton"
          href="/completed"
          style={{
            textDecoration: completedItemsSelected ? "underline" : "none",
          }}
        >
          Completed
        </a>
      </div>
    </header>
  );
};

function App() {
  return (
    <div className="App">
      <AppHeader />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/todos" element={<ToDoItemsPage />} />
        <Route path="/completed" element={<CompletedItemsPage />} />
      </Routes>
    </div>
  );
}

export default App;
