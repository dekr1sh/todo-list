const projects = [];

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