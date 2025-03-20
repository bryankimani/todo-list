import logo from "./logo.svg";
import "./App.css";
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
  return (
    <header className="container mx-auto">
      <div className="navbar bg-base-100 shadow-sm">
          <div className="navbar-start">
            <div className="dropdown">
              <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> 
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
              </div>
              <ul
                tabindex="0"
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                <li><a href="/todos">Todos</a></li>
                <li><a href="/completed">Completed</a></li>
              </ul>
            </div>
            <a className="btn btn-ghost text-xl" href="/">ToDOS</a>
          </div>
          <div className="navbar-end hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
            <li><a href="/todos">Todos</a></li>
            <li><a href="/completed">Completed</a></li>
            </ul>
          </div>
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
