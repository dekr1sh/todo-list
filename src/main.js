import './style.css';
import { projectEvents, editProject } from "./modules/project-dom.js";
import { displayAllTasks, taskEvents } from "./modules/task-dom.js";

const sidebarToggleBtn = document.querySelector("#sidebarToggle");
sidebarToggleBtn.addEventListener("click", () => {
    const sidebar = document.querySelector("#sidebar");
    sidebar.classList.toggle("hidden");
});

taskEvents();
projectEvents();
editProject();
displayAllTasks();