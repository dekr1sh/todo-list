const projects = []; 

const getProjects = () => {
    return projects;
};

const createProject = (name) => {
    const project = { name, tasks: [] };
    projects.push(project);
    return project;
};

const renameProject = (project, newName) => {
    project.name = newName;
};

const deleteProject = (projectToDelete) => {
    const index = projects.indexOf(projectToDelete);
    if (index !== -1) {
        projects.splice(index, 1);
    }
};

const addTaskToProject = (project, task) => {
    project.tasks.push(task);
};

export { createProject, renameProject, deleteProject, addTaskToProject, getProjects };