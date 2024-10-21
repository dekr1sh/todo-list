const defaultProjects = [];
let projects = localStorage.getItem("currentProjects");
projects = JSON.parse(projects || JSON.stringify(defaultProjects));
// localStorage stores all values as strings. However, when the value is not set, it defaults the value to null

function getProjects() {
    return projects;
}

function createProject(dataProject, name) {
    return { dataProject, name, tasks: [] };
};

function getNextDataProject() {
    const projects = getProjects();
    return projects.length;
}

export { getProjects, createProject, getNextDataProject };