const projects = [];

function getProjects() {
    return projects;
}

function createProject(dataProject, name) {
    return { dataProject, name, tasks: [] };
};

function getCurrentDataProject() {
    const projects = getProjects();
    return projects.length - 1;
}

function getNextDataProject() {
    const projects = getProjects();
    return projects.length;
}

export { getProjects, createProject, getCurrentDataProject, getNextDataProject };