import { getProjects } from "./project";
import { getDataId, increaseDataId, createTask, Task } from "./task";
import { createSpanIcon, refreshDisplay, revertOption, hideDropDown, saveToLocalStorage } from "./common-dom"
import { format, addDays, subDays, isWithinInterval } from "date-fns";
import { parseISO } from "date-fns/parseISO";

function showAddTaskBtn() {
    const addTaskBtn = document.getElementById("addTask") as HTMLElement;
    addTaskBtn.classList.remove("hidden");
}

function hideAddTaskBtn() {
    const addTaskBtn = document.getElementById("addTask") as HTMLElement;
    addTaskBtn.classList.add("hidden");
}

function showTaskForm() {
    const taskForm = document.querySelector("#taskForm") as HTMLFormElement;
    const taskTitle = document.querySelector('#taskTitle') as HTMLInputElement;

    taskForm.classList.remove("hidden");
    taskTitle.focus();
}

function hideTaskForm() {
    const taskForm = document.querySelector("#taskForm") as HTMLFormElement;
    const taskTitle = document.querySelector('#taskTitle') as HTMLInputElement;
    const taskDetails = document.querySelector("#taskDetails") as HTMLTextAreaElement;
    const taskDate = document.querySelector("#taskDate") as HTMLInputElement;

    taskTitle.value = "";
    taskDetails.value = "";
    taskDate.value = "";
    taskForm.classList.add("hidden");
}

function addTaskToDOM(dataId: number, title: string, details: string, date: string, important: boolean = false, completed: boolean = false) {
    const ul = document.querySelector("ul") as HTMLElement;
    const li = document.createElement("li") as HTMLElement;
    li.setAttribute("data-id", dataId.toString());
    ul.appendChild(li);

    const checker = document.createElement("div");
    checker.classList.add("checker");
    li.appendChild(checker);

    const taskText = document.createElement("div");
    taskText.classList.add("task-text");
    li.appendChild(taskText);

    const titleDiv = document.createElement("div");
    titleDiv.classList.add("title");
    titleDiv.textContent = title;
    taskText.appendChild(titleDiv);

    const detailsDiv = document.createElement("div");
    detailsDiv.classList.add("details");
    detailsDiv.textContent = details;
    taskText.appendChild(detailsDiv);

    if (completed) {
        checker.classList.add("checked");
        taskText.classList.add("line-through");
        taskText.classList.add("fade");
    }

    const dateDiv = document.createElement("div");
    dateDiv.classList.add("date");
    dateDiv.textContent = date;
    li.appendChild(dateDiv);

    const taskRight = document.createElement("div");
    taskRight.classList.add("task-right");
    li.appendChild(taskRight);

    const starOutline = createSpanIcon("star_outline");
    starOutline.classList.add("not-important");
    taskRight.appendChild(starOutline);

    const starFilled = createSpanIcon("star");
    starFilled.classList.add("important");
    taskRight.appendChild(starFilled);

    if (important) {
        starOutline.classList.add("star-hidden");
    } else {
        starFilled.classList.add("star-hidden");
    }

    const editContainer = document.createElement("div");
    editContainer.classList.add("edit-container");
    editContainer.setAttribute("data-dropdown","");
    taskRight.appendChild(editContainer);

    const editIcon = createSpanIcon("more_vert");
    editIcon.setAttribute("data-dropdown-button","");
    editContainer.appendChild(editIcon);
}

function processDateData(date: string) {
    if (date) {
        return date;
    }
    return "No Due Date";
}

function getCurrentDataProject(){
    const tile = document.querySelector(".selected") as HTMLElement;
    return +tile.getAttribute("data-project")!;
}

function processTaskInput(e: Event) {
    const taskTitle = (document.getElementById("taskTitle") as HTMLInputElement).value;
    const taskDetails = (document.getElementById("taskDetails") as HTMLTextAreaElement).value;
    // The browser's default behavior for displaying the date in the <input type="date"> field can vary based on your system's local settings.
    // However, when you retrieve the value of a date input, it will always be returned in "YYYY-MM-DD" which is the ISO date format.
    let taskDate = (document.getElementById("taskDate") as HTMLInputElement).value; 
    taskDate = processDateData(taskDate);

    const dataProject = getCurrentDataProject();
    const dataId = getDataId();

    const newTask = createTask(dataProject, dataId, taskTitle, taskDetails, taskDate);
    const projects = getProjects();
    projects[dataProject].tasks.push(newTask);
    increaseDataId();
    saveToLocalStorage();

    addTaskToDOM(dataId, taskTitle, taskDetails, taskDate);
    hideTaskForm();
    e.preventDefault();
}

function checkNoTasks(){
    const ul = document.querySelector("ul") as HTMLElement;
    return !ul.innerHTML;
}

function showNoTasks() {
    if(checkNoTasks()){
        const ul = document.querySelector("ul") as HTMLElement;
        const div = document.createElement("div");
        div.classList.add("no-tasks");
        div.textContent = "No Pending Tasks!";
        ul.appendChild(div);
    }
}

function displayAllTasks() {
    const ul = document.querySelector("ul") as HTMLElement;
    ul.innerHTML = "";

    const projects = getProjects();
    projects.forEach((project) => {
        project.tasks.forEach((task) => {
            addTaskToDOM(task.dataId, task.title, task.details, task.date, task.important, task.completed);
        });
    });
    hideAddTaskBtn();
    showNoTasks();
}

function displayToday() {
    const ul = document.querySelector("ul") as HTMLElement;
    ul.innerHTML = "";

    // new Date() returns a date object which contains current date and time.
    // However, if you console.log(new Date()), JS automatically converts it into a string for readability, but internally it remains an object.
    // format(new Date(), "yyyy-MM-dd") will format the current date into a string in the format: YYYY-MM-DD
    // Date.parse(format(new Date(), "yyyy-MM-dd")) converts this formatted date string ("2024-10-16") into a timestamp (the number of milliseconds since January 1, 1970, UTC).
    // This timestamp is of 'number' DT
    const today = Date.parse(format(new Date(), "yyyy-MM-dd"));
    const projects = getProjects();
    projects.forEach((project) => {
        project.tasks.forEach((task) => {
            const date = Date.parse(task.date);
            if (date === today) {
                addTaskToDOM(task.dataId, task.title, task.details, task.date, task.important, task.completed);
            }
        });
    });
    showNoTasks();
}

function checkThisWeek(date: Date) {
    const thisWeekMinusOne = subDays(new Date(), 1); // subtracts 1 day from new Date() and returns a new date object
    const thisWeekPlusOne = addDays(new Date(), 8);  // adds 8 days to new Date() and returns a new date object
    // isWithinInterval(date, {start: thisWeekMinusOne, end: thisWeekPlusOne}) checks if the provided 'date' object falls between thisWeekMinusOne and thisWeekPlusOne
    return isWithinInterval(date, {
        start: thisWeekMinusOne,
        end: thisWeekPlusOne,
    });
}

function displayThisWeek() {
    const ul = document.querySelector("ul") as HTMLElement;
    ul.innerHTML = "";

    const projects = getProjects();
    projects.forEach((project) => {
        project.tasks.forEach((task) => {
            const date = parseISO(task.date); // Converts the task's date string in ISO format into a date object
            if (checkThisWeek(date)) {
                addTaskToDOM(task.dataId, task.title, task.details, task.date, task.important, task.completed);
            }
        });
    });
    showNoTasks();
}

function displayImportant() {
    const ul = document.querySelector("ul") as HTMLElement;
    ul.innerHTML = "";

    const projects = getProjects();
    projects.forEach((project) => {
        project.tasks.forEach((task) => {
            if (task.important) {
                addTaskToDOM(task.dataId, task.title, task.details, task.date, task.important, task.completed);
            }
        });
    });
    showNoTasks();
}

function checkHomeSectionTile(homeSectionTile: HTMLElement) {
    if (homeSectionTile.matches("#allTasks")) {
        displayAllTasks();
    } else if (homeSectionTile.matches("#today")) {
        displayToday();
    } else if (homeSectionTile.matches("#thisWeek")) {
        displayThisWeek();
    } else if (homeSectionTile.matches("#important")) {
        displayImportant();
    }
}

function displayTasksInProject(dataProject: number) {
    const ul = document.querySelector("ul") as HTMLElement;
    ul.innerHTML = "";

    const projects = getProjects();
    projects[dataProject].tasks.forEach((task) => {
        addTaskToDOM(task.dataId, task.title, task.details, task.date, task.important, task.completed);
    });
}

function findSelectedTask(dataId: number) {
    const projects = getProjects();

    for (let project of projects) {
        const currentTask = project.tasks.find((task) => task.dataId === dataId);
        if (currentTask !== undefined) {
            return currentTask;
        }
    }

    return null;
}

function styleCompletedTask(e: Event) {
    const checker = e.target as HTMLElement;
    const taskNode = (e.target as HTMLElement).closest("li") as HTMLElement;
    const taskText = taskNode.querySelector(".task-text") as HTMLElement;

    checker.classList.toggle("checked");
    taskText.classList.toggle("line-through");
    taskText.classList.toggle("fade");
}

function updateCompletedTask(e: Event) {
    const dataId = +((e.target as HTMLElement).closest("li") as HTMLElement).getAttribute("data-id")!;
    const selectedTask = findSelectedTask(dataId);
    if(selectedTask){
        selectedTask.completed = !selectedTask.completed;
        saveToLocalStorage();
    }
}

function styleImportantTask(e: Event) {
    const starOutline = e.target as HTMLElement;
    starOutline.classList.toggle("star-hidden");

    const starFilled = (e.target as HTMLElement).nextElementSibling as HTMLElement;
    starFilled.classList.toggle("star-hidden");
}

function updateImportantTask(e: Event) {
    const dataId = +((e.target as HTMLElement).closest("li") as HTMLElement).getAttribute("data-id")!;
    const selectedTask = findSelectedTask(dataId);

    if(selectedTask){
        selectedTask.important = !selectedTask.important;
        saveToLocalStorage();
        revertOption();
        refreshDisplay(selectedTask.dataProject);
    }
}

function deleteTask(e: Event) {
    const taskNode = (e.target as HTMLElement).closest("li") as HTMLElement;
    const dataId = +taskNode.getAttribute("data-id")!;
    const selectedTask = findSelectedTask(dataId);

    if(selectedTask){
        const dataProject = selectedTask.dataProject;
        const projects = getProjects();
        projects[dataProject].tasks = projects[dataProject].tasks.filter((task) => task !== selectedTask);
        saveToLocalStorage();
        revertOption();
        taskNode.remove();
    }
}

function findHiddenTask() {
    const hiddenTask = document.querySelector("li.hidden") as HTMLElement;
    return hiddenTask;
}

function showHiddenTask() {
    const hiddenTask = document.querySelector("li.hidden") as HTMLElement;
    hiddenTask.classList.remove("hidden");
}

const relocateEditTaskForm = (e: Event) => {
    const taskNode = (e.target as HTMLElement).closest("li") as HTMLElement;
    const ul = taskNode.parentNode as HTMLElement;

    const editTaskForm = document.getElementById("editTaskForm") as HTMLFormElement;
    const title = (taskNode.querySelector(".title") as HTMLElement).textContent!;
    const details = (taskNode.querySelector(".details") as HTMLElement).textContent!;
    const date = (taskNode.querySelector(".date") as HTMLElement).textContent!;
    
    const editTaskTitle = editTaskForm.querySelector("#editTaskTitle") as HTMLInputElement;
    const editTaskDetails = editTaskForm.querySelector("#editTaskDetails") as HTMLTextAreaElement;
    const editTaskDate = editTaskForm.querySelector("#editTaskDate") as HTMLInputElement;

    editTaskTitle.value = title;
    editTaskDetails.value = details;
    editTaskDate.value = date;

    taskNode.classList.add("hidden");
    editTaskForm.classList.remove("hidden");
    ul.insertBefore(editTaskForm, taskNode);
}

const revertEditTaskForm = () => {
    const todoList = document.querySelector("#todoList") as HTMLElement;
    const editTaskForm = document.querySelector("#editTaskForm") as HTMLFormElement;

    editTaskForm.classList.add("hidden");
    // automatically removes editTaskForm from its current position and re-adds it at the end which is its original position
    todoList.appendChild(editTaskForm);
}

const showEditTaskForm = (e: Event) => {
    let editContainer = ((e.target as HTMLElement).parentNode as HTMLElement).parentNode as HTMLElement;
    hideDropDown(editContainer);
    relocateEditTaskForm(e);

    (document.getElementById("editTaskTitle") as HTMLInputElement).focus();
}

const processEditTaskInput = (e: Event) => {
    const editTaskTitle = (document.querySelector("#editTaskTitle") as HTMLInputElement).value;
    const editTaskDetails = (document.querySelector("#editTaskDetails") as HTMLTextAreaElement).value;
    const editTaskDate = (document.querySelector("#editTaskDate") as HTMLInputElement).value;
    const dataId = +findHiddenTask().getAttribute("data-id")!;
    const selectedTask = findSelectedTask(dataId);

    if(selectedTask){
        selectedTask.title = editTaskTitle;
        selectedTask.details = editTaskDetails;
        selectedTask.date = processDateData(editTaskDate);
        saveToLocalStorage();
        revertEditTaskForm();
        revertOption();
        showHiddenTask();
        const dataProject = selectedTask.dataProject;
        refreshDisplay(dataProject);
        e.preventDefault();
    }
}

const editTask = (e: Event) => {
    const isStarIcon = (e.target as HTMLElement).matches(".not-important");
    const isCircleIcon = (e.target as HTMLElement).matches(".checker");

    const isEditTaskSubmitBtn = (e.target as HTMLElement).matches("#editTaskForm .task-submit-btn");
    const isEditTaskCancelBtn = (e.target as HTMLElement).matches("#editTaskForm .task-cancel-btn");

    const isTaskEditBtn = (e.target as HTMLElement).matches("#taskEdit");
    const isTaskDeleteBtn = (e.target as HTMLElement).matches("#taskDelete");

    if(isStarIcon){
        styleImportantTask(e);
        updateImportantTask(e);
    }
    else if(isCircleIcon){
        styleCompletedTask(e);
        updateCompletedTask(e);
    }
    else if(isTaskEditBtn){
        showEditTaskForm(e);
    }
    else if(isTaskDeleteBtn){
        deleteTask(e);
    }
    else if(isEditTaskSubmitBtn){
        processEditTaskInput(e);
    }
    else if(isEditTaskCancelBtn){
        revertEditTaskForm();
        showHiddenTask();
    }
}

const taskEvents = () => {
    const addTaskBtn = document.querySelector("#addTask") as HTMLElement;
    addTaskBtn.addEventListener("click", showTaskForm);

    const cancelTaskBtn = document.querySelector("#taskForm .task-cancel-btn") as HTMLElement;
    cancelTaskBtn.addEventListener("click", hideTaskForm);

    const taskForm = document.querySelector("#taskForm") as HTMLFormElement;
    taskForm.addEventListener("submit", processTaskInput);

    const todoList = document.querySelector("#todoList") as HTMLElement;
    todoList.addEventListener("click", editTask);
}

export { checkHomeSectionTile, displayTasksInProject, showAddTaskBtn, hideAddTaskBtn, revertEditTaskForm, displayAllTasks, taskEvents };