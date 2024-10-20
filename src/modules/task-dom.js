import { getProjects } from "./project.js";
import { getDataId, increaseDataId, createTask } from "./task.js";
import { createSpanIcon, refreshDisplay, revertOption, hideDropDown } from "./common-dom.js"
import { format, addDays, subDays, isWithinInterval } from "date-fns";
import parseISO from "date-fns/parseISO";

function showAddTaskBtn() {
    const addTaskBtn = document.getElementById("addTask");
    addTaskBtn.classList.remove("hidden");
}

function hideAddTaskBtn() {
    const addTaskBtn = document.getElementById("addTask");
    addTaskBtn.classList.add("hidden");
}

function showTaskForm() {
    const taskForm = document.querySelector("#taskForm");
    const taskTitle = document.querySelector('#taskTitle');

    taskForm.classList.remove("hidden");
    taskTitle.focus();
}

function hideTaskForm() {
    const taskForm = document.querySelector("#taskForm");
    const taskTitle = document.querySelector('#taskTitle');
    const taskDetails = document.querySelector("#taskDetails");
    const taskDate = document.querySelector("#taskDate");

    taskTitle.value = "";
    taskDetails.value = "";
    taskDate.value = "";
    taskForm.classList.add("hidden");
}

function addTaskToDOM(dataId, title, details, date, important = false, completed = false) {
    const ul = document.querySelector("ul");
    const li = document.createElement("li");
    li.setAttribute("data-id", dataId);
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

function processDateData(date) {
    if (date) {
        return date;
    }
    return "No Due Date";
}

function getCurrentDataProject(){
    const tile = document.querySelector(".selected");
    return tile.getAttribute("data-project");
}

function processTaskInput(e) {
    const taskTitle = document.getElementById("taskTitle").value;
    const taskDetails = document.getElementById("taskDetails").value;
    // The browser's default behavior for displaying the date in the <input type="date"> field can vary based on your system's local settings.
    // However, when you retrieve the value of a date input, it will always be returned in "YYYY-MM-DD" which is the ISO date format.
    let taskDate = document.getElementById("taskDate").value; 
    taskDate = processDateData(taskDate);

    const dataProject = getCurrentDataProject();
    const dataId = getDataId();

    const newTask = createTask(dataProject, dataId, taskTitle, taskDetails, taskDate);
    const projects = getProjects();
    projects[dataProject].tasks.push(newTask);
    increaseDataId();

    addTaskToDOM(dataId, taskTitle, taskDetails, taskDate);
    hideTaskForm();
    e.preventDefault();
}

function checkNoTasks(){
    const ul = document.querySelector("ul");
    return !ul.innerHTML;
}

function showNoTasks() {
    if(checkNoTasks()){
        const ul = document.querySelector("ul");
        const div = document.createElement("div");
        div.classList.add("no-tasks");
        div.textContent = "No Pending Tasks!";
        ul.appendChild(div);
    }
}

function displayAllTasks() {
    const ul = document.querySelector("ul");
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
    const ul = document.querySelector("ul");
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

function checkThisWeek(date) {
    const thisWeekMinusOne = subDays(new Date(), 1); // subtracts 1 day from new Date() and returns a new date object
    const thisWeekPlusOne = addDays(new Date(), 8);  // adds 8 days to new Date() and returns a new date object
    // isWithinInterval(date, {start: thisWeekMinusOne, end: thisWeekPlusOne}) checks if the provided 'date' object falls between thisWeekMinusOne and thisWeekPlusOne
    return isWithinInterval(date, {
        start: thisWeekMinusOne,
        end: thisWeekPlusOne,
    });
}

function displayThisWeek() {
    const ul = document.querySelector("ul");
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
    const ul = document.querySelector("ul");
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

function checkHomeSectionTile(homeSectionTile) {
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

function displayTasksInProject(dataProject) {
    const ul = document.querySelector("ul");
    ul.innerHTML = "";

    const projects = getProjects();
    projects[dataProject].tasks.forEach((task) => {
        addTaskToDOM(task.dataId, task.title, task.details, task.date, task.important, task.completed);
    });
}

function findSelectedTask(dataId) {
    const projects = getProjects();

    for (let project of projects) {
        const currentTask = project.tasks.find((task) => task.dataId === dataId);
        if (currentTask !== undefined) {
            return currentTask;
        }
    }

    return {};
}

function styleCompletedTask(e) {
    const checker = e.target;
    const taskNode = e.target.closest("li");
    const taskText = taskNode.querySelector(".task-text");

    checker.classList.toggle("checked");
    taskText.classList.toggle("line-through");
    taskText.classList.toggle("fade");
}

function updateCompletedTask(e) {
    const dataId = +e.target.closest("li").getAttribute("data-id");
    const selectedTask = findSelectedTask(dataId);
    selectedTask.completed = !selectedTask.completed;
}

function styleImportantTask(e) {
    const starOutline = e.target;
    starOutline.classList.toggle("star-hidden");

    const starFilled = e.target.nextElementSibling;
    starFilled.classList.toggle("star-hidden");
}

function updateImportantTask(e) {
    const dataId = +e.target.closest("li").getAttribute("data-id");
    const selectedTask = findSelectedTask(dataId);
    selectedTask.important = !selectedTask.important;

    revertOption();
    refreshDisplay(selectedTask.dataProject);
}

function deleteTask(e) {
    const taskNode = e.target.closest("li");
    const dataId = +taskNode.getAttribute("data-id");
    const selectedTask = findSelectedTask(dataId);
    const dataProject = selectedTask.dataProject;

    const projects = getProjects();
    projects[dataProject].tasks = projects[dataProject].tasks.filter((task) => task !== selectedTask);

    revertOption();
    taskNode.remove();
}

function findHiddenTask() {
    const hiddenTask = document.querySelector("li.hidden");
    return hiddenTask;
}

function showHiddenTask() {
    const hiddenTask = document.querySelector("li.hidden");
    hiddenTask.classList.remove("hidden");
}

const relocateEditTaskForm = (e) => {
    const taskNode = e.target.closest("li");
    const ul = taskNode.parentNode;

    const editTaskForm = document.getElementById("editTaskForm");
    const title = taskNode.querySelector(".title").textContent;
    const details = taskNode.querySelector(".details").textContent;
    const date = taskNode.querySelector(".date").textContent;
    
    const editTaskTitle = editTaskForm.querySelector("#editTaskTitle");
    const editTaskDetails = editTaskForm.querySelector("#editTaskDetails");
    const editTaskDate = editTaskForm.querySelector("#editTaskDate");

    editTaskTitle.value = title;
    editTaskDetails.value = details;
    editTaskDate.value = date;

    taskNode.classList.add("hidden");
    editTaskForm.classList.remove("hidden");
    ul.insertBefore(editTaskForm, taskNode);
}

const revertEditTaskForm = () => {
    const todoList = document.querySelector("#todoList");
    const editTaskForm = document.querySelector("#editTaskForm");

    editTaskForm.classList.add("hidden");
    // automatically removes editTaskForm from its current position and re-adds it at the end which is its original position
    todoList.appendChild(editTaskForm);
}

const showEditTaskForm = (e) => {
    let editContainer = e.target.parentNode.parentNode;
    hideDropDown(editContainer);
    relocateEditTaskForm(e);

    document.getElementById("editTaskTitle").focus();
}

const processEditTaskInput = (e) => {
    const editTaskTitle = document.querySelector("#editTaskTitle").value;
    const editTaskDetails = document.querySelector("#editTaskDetails").value;
    const editTaskDate = document.querySelector("#editTaskDate").value;
    const dataId = +findHiddenTask().getAttribute("data-id");
    const selectedTask = findSelectedTask(dataId);

    selectedTask.title = editTaskTitle;
    selectedTask.details = editTaskDetails;
    selectedTask.date = processDateData(editTaskDate);
    
    revertEditTaskForm();
    revertOption();
    showHiddenTask();

    const dataProject = selectedTask.dataProject;
    refreshDisplay(dataProject);
    e.preventDefault();
}

const editTask = (e) => {
    const isStarIcon = e.target.matches(".not-important");
    const isCircleIcon = e.target.matches(".checker");

    const isEditTaskSubmitBtn = e.target.matches("#editTaskForm .task-submit-btn");
    const isEditTaskCancelBtn = e.target.matches("#editTaskForm .task-cancel-btn");

    const isTaskEditBtn = e.target.matches("#taskEdit");
    const isTaskDeleteBtn = e.target.matches("#taskDelete");

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
    const addTaskBtn = document.querySelector("#addTask");
    addTaskBtn.addEventListener("click", showTaskForm);

    const cancelTaskBtn = document.querySelector("#taskForm .task-cancel-btn");
    cancelTaskBtn.addEventListener("click", hideTaskForm);

    const taskForm = document.querySelector("#taskForm");
    taskForm.addEventListener("submit", processTaskInput);

    const todoList = document.querySelector("#todoList");
    todoList.addEventListener("click", editTask);
}

export { checkHomeSectionTile, displayTasksInProject, showAddTaskBtn, hideAddTaskBtn, revertEditTaskForm, displayAllTasks, taskEvents };