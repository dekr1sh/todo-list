import { checkHomeSectionTile, displayTasksInProject, showAddTaskBtn, hideAddTaskBtn, revertEditTaskForm } from "./task-dom.js";

function createSpanIcon(name) {
    const icon = document.createElement("span");
    icon.classList.add("material-icons");
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = name;
    return icon;
}

function refreshDisplay(dataProject) {
    const selectedTile = document.querySelector(".selected");

    if (selectedTile.closest("#homeSection")) {
        checkHomeSectionTile(selectedTile);
    } else if (selectedTile.closest("#projectSection")) {
        displayTasksInProject(dataProject);
    }
}

function relocateOption(e) {
    const editContainer = e.target.closest(".edit-container");

    if (e.target.closest(".tile")) {              
        const projectOption = document.getElementById("projectOption");
        projectOption.classList.remove("hidden");
        editContainer.appendChild(projectOption);
    } else if (e.target.closest("li")) {            
        const taskOption = document.getElementById("taskOption");
        taskOption.classList.remove("hidden");
        editContainer.appendChild(taskOption);        
    }
}

function revertOption() {
    const projectOption = document.querySelector("#projectOption");
    projectOption.classList.add("hidden");
    const projectSection = document.querySelector("#projectSection");
    // automatically removes projectOption from its current position and re-adds it at the end which is its original position
    projectSection.appendChild(projectOption); 
    
    const taskOption = document.querySelector("#taskOption");
    taskOption.classList.add("hidden");
    const todoList = document.querySelector("#todoList");
    // automatically removes taskOption from its current position and re-adds it at the end which is its original position
    todoList.appendChild(taskOption); 
}

function showDropDown(e) {
    // Ensures that dropdown doesn't close when clicked inside of it
    if (!e.target.matches("[data-dropdown-button]")) {
        if (e.target.closest("[data-dropdown]")) {
            return;
        }
    }

    const currentDropDown = e.target.matches("[data-dropdown-button]") ? e.target.closest("[data-dropdown]") : null;
    if (currentDropDown) {
        relocateOption(e);
        setTimeout(() => currentDropDown.classList.add("active"), 0);
    }

    document.querySelectorAll("[data-dropdown].active").forEach(dropdown => {
        if (dropdown !== currentDropDown) {
            dropdown.classList.remove("active");
        }
    });
}

function hideDropDown(editContainer) {
    editContainer.classList.remove("active");
}

function updateContentTitle(node) {
    const contentTitle = document.querySelector("#contentTitle");
    contentTitle.textContent = node.textContent;
}

function selectNewTile(newTile) {
    const selectedTile = document.querySelector(".selected");   
    
    selectedTile.classList.remove("selected");                  
    newTile.classList.add("selected");                             
}

function checkTile(e) {
    const homeSectionTile = e.target.closest("#homeSection .tile");
    const projectSectionTile = e.target.closest("#projectSection .tile");
    
    if (homeSectionTile) {
        const homeName = homeSectionTile.querySelector(".home-name");
        
        selectNewTile(homeSectionTile);
        revertOption();
        checkHomeSectionTile(homeSectionTile);
        updateContentTitle(homeName);
        hideAddTaskBtn();
    } else if (projectSectionTile) {
        const projectName = projectSectionTile.querySelector(".project-name");
        const dataProject = projectSectionTile.getAttribute("data-project");
        
        revertEditTaskForm();              
        revertOption();
        displayTasksInProject(dataProject);
        selectNewTile(projectSectionTile);
        updateContentTitle(projectName);
        showAddTaskBtn();
    }
}

export {
    createSpanIcon, refreshDisplay, revertOption, 
    showDropDown, hideDropDown, checkTile, updateContentTitle
};