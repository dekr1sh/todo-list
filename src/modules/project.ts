import { Task } from "./task";

interface Project {
    dataProject: number;
    name: string;
    tasks: Task[];
}

const defaultProjects: Project[] = [];
const projects: Project[] = JSON.parse(localStorage.getItem("currentProjects") || JSON.stringify(defaultProjects));

function getProjects() {
    return projects;
}

function createProject(dataProject: number, name: string): Project {
    return { dataProject, name, tasks: [] };
};

function getNextDataProject() {
    const projects = getProjects();
    return projects.length;
}

export { Project, getProjects, createProject, getNextDataProject };