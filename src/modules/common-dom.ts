import { checkHomeSectionTile, displayTasksInProject, showAddTaskBtn, hideAddTaskBtn, revertEditTaskForm } from "./task-dom";
import { getProjects } from "./project";
import { getDataId } from "./task";

function saveToLocalStorage() {
    const projects = getProjects();
    const dataId = getDataId();
    
    localStorage.setItem("currentProjects", JSON.stringify(projects));
    localStorage.setItem("currentDataId", dataId.toString());
}

function createSpanIcon(name: string) {
    const icon = document.createElement("span");
    icon.classList.add("material-icons");
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = name;
    return icon;
}

function refreshDisplay(dataProject: number) {
    const selectedTile = document.querySelector(".selected") as HTMLElement;

    if (selectedTile.closest("#homeSection")) {
        checkHomeSectionTile(selectedTile);
    } else if (selectedTile.closest("#projectSection")) {
        displayTasksInProject(dataProject);
    }
}

function relocateOption(e: Event) {
    const editContainer = (e.target as HTMLElement).closest(".edit-container") as HTMLElement;

    if ((e.target as HTMLElement).closest(".tile")) {              
        const projectOption = document.getElementById("projectOption") as HTMLElement;
        projectOption.classList.remove("hidden");
        editContainer.appendChild(projectOption);
    } else if ((e.target as HTMLElement).closest("li")) {            
        const taskOption = document.getElementById("taskOption") as HTMLElement;
        taskOption.classList.remove("hidden");
        editContainer.appendChild(taskOption);        
    }
}

function revertOption() {
    const projectOption = document.querySelector("#projectOption") as HTMLElement;
    projectOption.classList.add("hidden");
    const projectSection = document.querySelector("#projectSection") as HTMLElement;
    // automatically removes projectOption from its current position and re-adds it at the end which is its original position
    projectSection.appendChild(projectOption); 
    
    const taskOption = document.querySelector("#taskOption") as HTMLElement;
    taskOption.classList.add("hidden");
    const todoList = document.querySelector("#todoList") as HTMLElement;
    // automatically removes taskOption from its current position and re-adds it at the end which is its original position
    todoList.appendChild(taskOption); 
}

function showDropDown(e: Event) {
    // Ensures that dropdown doesn't close when clicked inside of it
    if (!(e.target as HTMLElement).matches("[data-dropdown-button]")) {
        if ((e.target as HTMLElement).closest("[data-dropdown]")) {
            return;
        }
    }

    const currentDropDown = (e.target as HTMLElement).matches("[data-dropdown-button]") ? (e.target as HTMLElement).closest("[data-dropdown]") : null;
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

function hideDropDown(editContainer: HTMLElement) {
    editContainer.classList.remove("active");
}

function updateContentTitle(node: HTMLElement) {
    const contentTitle = document.querySelector("#contentTitle") as HTMLElement;
    contentTitle.textContent = node.textContent;
}

function selectNewTile(newTile: HTMLElement) {
    const selectedTile = document.querySelector(".selected") as HTMLElement;   
    
    selectedTile.classList.remove("selected");                  
    newTile.classList.add("selected");                             
}

function checkTile(e: Event) {
    const homeSectionTile = (e.target as HTMLElement).closest("#homeSection .tile") as HTMLElement | null;
    const projectSectionTile = (e.target as HTMLElement).closest("#projectSection .tile") as HTMLElement | null;
    
    if (homeSectionTile) {
        const homeName = homeSectionTile.querySelector(".home-name") as HTMLElement;
        
        selectNewTile(homeSectionTile);
        revertOption();
        checkHomeSectionTile(homeSectionTile); 
        updateContentTitle(homeName);
        hideAddTaskBtn();
    } else if (projectSectionTile) {
        const projectName = projectSectionTile.querySelector(".project-name") as HTMLElement;
        const dataProject = +projectSectionTile.getAttribute("data-project")!;
        
        revertEditTaskForm();              
        revertOption();
        displayTasksInProject(dataProject);
        selectNewTile(projectSectionTile);
        updateContentTitle(projectName);
        showAddTaskBtn();
    }
}

export {
    createSpanIcon, refreshDisplay, revertOption, saveToLocalStorage,
    showDropDown, hideDropDown, checkTile, updateContentTitle
};