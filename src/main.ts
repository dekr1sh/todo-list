import './style.css';
import { projectEvents, editProject } from "./modules/project-dom";
import { displayAllTasks, taskEvents } from "./modules/task-dom";

const sidebarToggleBtn = document.querySelector("#sidebarToggle") as HTMLElement;
sidebarToggleBtn.addEventListener("click", () => {
    const sidebar = document.querySelector("#sidebar") as HTMLElement;
    sidebar.classList.toggle("hidden");
});

taskEvents();
projectEvents();
editProject();
displayAllTasks();