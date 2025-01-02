import { Project, getProjects, createProject, getNextDataProject } from "./project";
import { createSpanIcon, updateContentTitle, revertOption, checkTile, showDropDown, hideDropDown, saveToLocalStorage } from "./common-dom";

function showProjectForm() {
    const projectForm = document.getElementById("projectForm") as HTMLFormElement;
    const projectInput = document.getElementById("projectInput") as HTMLInputElement;

    projectForm.classList.remove("hidden");
    projectInput.focus();
}

function hideProjectForm() {
    const projectForm = document.getElementById("projectForm") as HTMLFormElement;
    const projectInput = document.getElementById("projectInput") as HTMLInputElement;

    projectForm.classList.add("hidden");
    projectInput.value = "";
}

function addProjectToDOM(dataProject: number, name: string) {
    const projectSection = document.getElementById("projectSection") as HTMLElement;
    const projectForm = document.getElementById("projectForm") as HTMLFormElement;

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

function displayProjects(projects: Project[]) {
    projects.forEach((project) => addProjectToDOM(project.dataProject, project.name));
}

function processProjectInput(e: Event) {
    const dataProject = getNextDataProject();
    const projectName = (document.getElementById("projectInput") as HTMLInputElement).value;
    const newProject = createProject(dataProject, projectName);

    const projects = getProjects();
    projects.push(newProject);
    saveToLocalStorage();

    addProjectToDOM(dataProject, projectName);

    hideProjectForm();
    e.preventDefault();
}

function sortProjects() {
    const projects = getProjects();
    let i = 0;
    const tiles = document.querySelectorAll("#projectSection .tile");
    tiles.forEach((tile) => {
        const dataProject = +tile.getAttribute("data-project")!;
        tile.setAttribute("data-project", i.toString());
        projects[dataProject].dataProject = i;
        i++;
    });
}

function deleteProject(e: Event) {
    const tile = (e.target as HTMLElement).closest(".tile") as HTMLElement;
    const index = +tile.getAttribute("data-project")!;
    const projects = getProjects();

    if (tile.classList.contains("selected")) {
        const allTasks = document.querySelector("#allTasks") as HTMLElement;
        const homeName = allTasks.querySelector(".home-name") as HTMLElement;
        allTasks.classList.add("selected");
        updateContentTitle(homeName);
    }

    revertOption();
    tile.remove();
    sortProjects();
    projects.splice(index, 1);
    saveToLocalStorage();
}

function relocateRenameProjectForm(tile: HTMLElement) {
    const projectSection = document.getElementById("projectSection") as HTMLElement;
    const renameProjectForm = document.getElementById("renameProjectForm") as HTMLFormElement;

    const projectName = tile.querySelector(".project-name") as HTMLElement;

    const renameProjectInput = renameProjectForm.querySelector("input") as HTMLInputElement;
    renameProjectInput.value = projectName.textContent!;

    projectSection.insertBefore(renameProjectForm, tile);
}

function revertRenameProjectForm() {
    const projectSection = document.getElementById("projectSection") as HTMLElement;
    const renameProjectForm = document.getElementById("renameProjectForm") as HTMLFormElement;

    renameProjectForm.classList.add("hidden");
    // automatically removes renameProjectForm from its current position and re-adds it at the end which is its original position
    projectSection.appendChild(renameProjectForm);
}

function animateRenameProjectForm() {
    const renameProjectForm = document.querySelector("#renameProjectForm") as HTMLFormElement;

    setTimeout(function() {
        renameProjectForm.classList.remove("hidden");
    }, 0);
}

function showHiddenProject() {
    const hiddenTile = document.querySelector("#projectSection .tile.hidden") as HTMLElement;
    hiddenTile.classList.remove("hidden");
}

function processRenameProjectInput() {
    const hiddenTile = document.querySelector("#projectSection .tile.hidden") as HTMLElement;
    const projectName = hiddenTile.querySelector(".project-name") as HTMLElement;
    const dataProject = +hiddenTile.getAttribute("data-project")!;

    const renameProjectInput = (document.getElementById("renameProjectInput") as HTMLInputElement).value;
    projectName.textContent = renameProjectInput;

    const projects = getProjects();
    projects[dataProject].name = renameProjectInput;
    saveToLocalStorage();

    showHiddenProject();
    updateContentTitle(projectName);
    revertRenameProjectForm();
}

function checkRenameProjectFormExists() {
    const renameForm = document.querySelector("#renameProjectForm") as HTMLFormElement;
    return !renameForm.classList.contains("hidden");
}

function showRenameProjectForm(e: Event) {
    const editContainer = ((e.target as HTMLElement).parentNode as HTMLElement).parentNode as HTMLElement;
    const tile = editContainer.parentNode as HTMLElement;

    hideDropDown(editContainer);

    const haveRenameProjectForm = checkRenameProjectFormExists();
    if (haveRenameProjectForm) {
        revertRenameProjectForm();
        showHiddenProject();
    }

    relocateRenameProjectForm(tile);
    animateRenameProjectForm();

    (document.getElementById("renameProjectInput") as HTMLInputElement).focus();
    tile.classList.add("hidden");
}

function editProject() {
    document.addEventListener("click", showDropDown);

    const projectOption = document.querySelector('#projectOption') as HTMLElement;
    (projectOption.firstElementChild as HTMLElement).addEventListener("click", showRenameProjectForm);
    (projectOption.lastElementChild as HTMLElement).addEventListener("click", deleteProject);

    const renameProjectSubmitBtn = document.querySelector("#renameProjectForm .project-submit-btn") as HTMLElement;
    renameProjectSubmitBtn.addEventListener("click", function(e) {
        processRenameProjectInput();
        e.preventDefault();
    });

    const renameProjectCancelBtn = document.querySelector("#renameProjectForm .project-cancel-btn") as HTMLElement;
    renameProjectCancelBtn.addEventListener("click", function() {
        revertRenameProjectForm();
        showHiddenProject();
    });
}

function projectEvents() {
    const addProjectBtn = document.querySelector("#addProject") as HTMLElement;
    addProjectBtn.addEventListener("click", showProjectForm);

    const cancelProjectBtn = document.querySelector("#projectForm .project-cancel-btn") as HTMLElement;
    cancelProjectBtn.addEventListener("click", hideProjectForm);

    const projectForm = document.querySelector("#projectForm") as HTMLFormElement;
    projectForm.addEventListener("submit", processProjectInput);

    const sidebar = document.querySelector("#sidebar") as HTMLElement;
    sidebar.addEventListener("click", checkTile);

    const projects = getProjects();
    displayProjects(projects);
}

export { projectEvents, editProject };