import { getProjects, createProject, getNextDataProject } from "./project.js";
import { createSpanIcon, updateContentTitle, revertOption, checkTile, showDropDown, hideDropDown } from "./common-dom.js";

function showProjectForm() {
    const projectForm = document.getElementById("projectForm");
    const projectInput = document.getElementById("projectInput");

    projectForm.classList.remove("hidden");
    projectInput.focus();
}

function hideProjectForm() {
    const projectForm = document.getElementById("projectForm");
    const projectInput = document.getElementById("projectInput");

    projectForm.classList.add("hidden");
    projectInput.value = "";
}

function addProjectToDOM(dataProject, name) {
    const projectSection = document.getElementById("projectSection");
    const projectForm = document.getElementById("projectForm");

    const container = document.createElement("div");
    container.setAttribute("data-project", `${dataProject}`);
    container.classList.add("tile");
    projectSection.insertBefore(container, projectForm);

    const menuIcon = createSpanIcon("menu");
    container.appendChild(menuIcon);

    const projectName = document.createElement("div");
    projectName.classList.add("project-name");
    projectName.textContent = name;
    container.appendChild(projectName);

    const editContainer = document.createElement("div");
    editContainer.classList.add("edit-container");
    editContainer.setAttribute("data-dropdown","");
    container.appendChild(editContainer);

    const editIcon = createSpanIcon("more_vert");
    editIcon.setAttribute("data-dropdown-button","");
    editContainer.appendChild(editIcon);
}

function displayProjects(projects) {
    projects.forEach((project) => addProjectToDOM(project.dataProject, project.name));
}

function processProjectInput(e) {
    const dataProject = getNextDataProject();
    const projectName = document.getElementById("projectInput").value;
    const newProject = createProject(dataProject, projectName);

    const projects = getProjects();
    projects.push(newProject);
    addProjectToDOM(dataProject, projectName);

    hideProjectForm();
    e.preventDefault();
}

function sortProjects() {
    const projects = getProjects();
    let i = 0;
    const tiles = document.querySelectorAll(".project-section .tile");
    tiles.forEach((tile) => {
        const dataProject = tile.getAttribute("data-project");
        tile.setAttribute("data-project", i);
        projects[dataProject].dataProject = i;
        i++;
    });
    projects.sort((a, b) => a.dataProject - b.dataProject);
}

function deleteProject(e) {
    const tile = e.target.closest(".tile");
    const index = tile.getAttribute("data-project");
    const projects = getProjects();

    if (tile.classList.contains("selected")) {
        const allTasks = document.querySelector("#allTasks");
        const homeName = allTasks.querySelector(".home-name");
        allTasks.classList.add("selected");
        updateContentTitle(homeName);
    }

    revertOption();
    tile.remove();
    projects.splice(index, 1);
    sortProjects();
}

function relocateRenameProjectForm(tile) {
    const projectSection = document.getElementById("projectSection");
    const renameProjectForm = document.getElementById("renameProjectForm");

    const projectName = tile.querySelector(".project-name");

    const renameProjectInput = renameProjectForm.querySelector("input");
    renameProjectInput.value = projectName.textContent;

    projectSection.insertBefore(renameProjectForm, tile);
}

function revertRenameProjectForm() {
    const projectSection = document.getElementById("projectSection");
    const renameProjectForm = document.getElementById("renameProjectForm");

    renameProjectForm.classList.add("hidden");
    // automatically removes renameProjectForm from its current position and re-adds it at the end which is its original position
    projectSection.appendChild(renameProjectForm);
}

function animateRenameProjectForm() {
    const renameProjectForm = document.querySelector("#renameProjectForm");

    setTimeout(function() {
        renameProjectForm.classList.remove("hidden");
    }, 0);
}

function showHiddenProject() {
    const hiddenTile = document.querySelector("#projectSection .tile.hidden");
    hiddenTile.classList.remove("hidden");
}

function processRenameProjectInput() {
    const hiddenTile = document.querySelector("#projectSection .tile.hidden");
    const projectName = hiddenTile.querySelector(".project-name");
    const dataProject = hiddenTile.getAttribute("data-project");

    const renameProjectInput = document.getElementById("renameProjectInput").value;
    projectName.textContent = renameProjectInput;

    const projects = getProjects();
    projects[dataProject].name = renameProjectInput;

    showHiddenProject();
    updateContentTitle(projectName);
    revertRenameProjectForm();
}

function checkRenameProjectFormExists() {
    const renameForm = document.querySelector("#renameProjectForm");
    return !renameForm.classList.contains("hidden");
}

function showRenameProjectForm(e) {
    const editContainer = e.target.parentNode.parentNode;
    const tile = editContainer.parentNode;

    hideDropDown(editContainer);

    const haveRenameProjectForm = checkRenameProjectFormExists();
    if (haveRenameProjectForm) {
        revertRenameProjectForm();
        showHiddenProject();
    }

    relocateRenameProjectForm(tile);
    animateRenameProjectForm();

    document.getElementById("renameProjectInput").focus();
    tile.classList.add("hidden");
}

function editProject() {
    document.addEventListener("click", showDropDown);

    const projectOption = document.querySelector('#projectOption');
    projectOption.firstElementChild.addEventListener("click", showRenameProjectForm);
    projectOption.lastElementChild.addEventListener("click", deleteProject);

    const renameProjectSubmitBtn = document.querySelector("#renameProjectForm .project-submit-btn");
    renameProjectSubmitBtn.addEventListener("click", function(e) {
        processRenameProjectInput();
        e.preventDefault();
    });

    const renameProjectCancelBtn = document.querySelector("#renameProjectForm .project-cancel-btn");
    renameProjectCancelBtn.addEventListener("click", function() {
        revertRenameProjectForm();
        showHiddenProject();
    });
}

function projectEvents() {
    const addProjectBtn = document.querySelector("#addProject");
    addProjectBtn.addEventListener("click", showProjectForm);

    const cancelProjectBtn = document.querySelector("#projectForm .project-cancel-btn");
    cancelProjectBtn.addEventListener("click", hideProjectForm);

    const projectForm = document.querySelector("#projectForm");
    projectForm.addEventListener("submit", processProjectInput);

    const sidebar = document.querySelector("#sidebar");
    sidebar.addEventListener("click", checkTile);

    const projects = getProjects();
    displayProjects(projects);
}

export { projectEvents, editProject };